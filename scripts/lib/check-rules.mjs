/**
 * 프로젝트 규칙 검사 — npm test 의 [1] HTML 건전성과 [7] 규칙 (ESLint 대신, 이 프로젝트에서 실제로 깨지는 것만)
 *   htmlProblems(html)  파서 출력(섹션 본문 · 캡션) 한 조각의 태그 짝 · 속성 따옴표 짝
 *   checkRules(ROOT)     base.css raw HEX · !important · 정의 안 된 var() 참조, src 의 window.__ 전역, 안 쓰는 토큰(리포트)
 * 빌드 없이 소스만 읽습니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use']);

/** 태그 안 따옴표가 홀수(속성 값이 안 닫힘) · 닫는 태그가 여는 태그와 안 맞음 · 안 닫힌 태그 → 문제 문구 목록 */
export function htmlProblems(html) {
  const out = [], stack = [];
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const [tag, close, name0, rest] = m, name = name0.toLowerCase();
    const quotes = (rest.match(/"/g) || []).length;
    if (quotes % 2) { out.push(`속성 따옴표 짝 안 맞음: ${tag.slice(0, 80)}`); continue; }
    if (close) {
      const top = stack.pop();
      if (top !== name) { out.push(`닫는 태그 </${name}> 가 <${top ?? '없음'}> 와 안 맞음`); if (top) stack.push(top); }
    } else if (!VOID.has(name) && !rest.trimEnd().endsWith('/')) stack.push(name);
  }
  if (stack.length) out.push(`안 닫힌 태그: ${stack.map(t => `<${t}>`).join(' ')}`);
  return out;
}

const noCssComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

export function checkRules(ROOT, { ok, fail, note }) {
  const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
  const tokensCss = noCssComments(read('src/styles/tokens.css')), baseCss = noCssComments(read('src/styles/base.css'));
  const code = walk(path.join(ROOT, 'src')).filter(f => /\.(ts|astro|js)$/.test(f)).map(f => [path.relative(ROOT, f), fs.readFileSync(f, 'utf8')]);
  const codeAll = code.map(([, s]) => s).join('\n');
  const codeNoCmt = codeAll.replace(/\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$|<!--[\s\S]*?-->/gm, '$1');   // 주석에만 남은 이름은 '쓰는 것' 으로 안 셈 (https:// 의 // 는 살림)
  let bad = 0;

  // base.css: 색은 토큰으로만 (raw HEX 0), 우선순위 싸움 금지 (!important 0)
  const hex = [...baseCss.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0]);
  if (hex.length) { bad++; fail(`base.css raw HEX ${hex.length}개 (${[...new Set(hex)].slice(0, 5).join(' · ')}) — tokens.css 토큰으로`); }
  const imp = (baseCss.match(/!important/g) || []).length;
  if (imp) { bad++; fail(`base.css !important ${imp}개`); }

  // 정의 안 된 var(--…) — tokens.css · base.css 정의 + 컴포넌트/스크립트가 인라인 style · setProperty · 객체 키로 넣는 이름
  const defined = new Set([...(tokensCss + baseCss).matchAll(/(--[\w-]+)\s*:/g), ...codeAll.matchAll(/(--[\w-]+)\s*:/g), ...codeAll.matchAll(/['"`](--[\w-]+)['"`]/g)].map(m => m[1]));
  const refs = [...new Set([...(tokensCss + baseCss + codeNoCmt).matchAll(/var\((--[\w-]+)/g)].map(m => m[1]))];   // 컴포넌트가 문자열로 쓰는 'var(--ratio-card)' 같은 참조도
  const missing = refs.filter(n => !n.endsWith('-') && !defined.has(n));   // 'var(--c-${slug})' 처럼 조립하는 이름(접두만 잡힘)은 제외
  if (missing.length) { bad++; fail(`정의 안 된 토큰 참조: ${missing.join(' · ')}`); }

  // 전역 결합 금지 (TD-1): window.__ 로 모듈끼리 주고받지 말고 문서 이벤트로
  const globals = code.filter(([, s]) => /window\.__|\(window as any\)\.__/.test(s.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, ''))).map(([f]) => f);
  if (globals.length) { bad++; fail(`window.__ 전역 사용: ${globals.join(' · ')} — 문서 이벤트(eo:…)로`); }

  if (!bad) ok(`base.css raw HEX 0 · !important 0 · 참조 토큰 ${refs.length}개 모두 정의됨 · window.__ 0`);

  // 리포트: tokens.css 에 정의됐지만 아무 데서도 안 읽는 토큰 (모바일 -m 은 base.css 가 PC 이름에 끼우므로 짝 이름이 쓰이면 쓰는 것으로 봄)
  const used = new Set([...(tokensCss + baseCss).matchAll(/var\((--[\w-]+)/g), ...codeNoCmt.matchAll(/(--[\w-]+)/g)].map(m => m[1]));
  // 이름을 조립해 쓰는 묶음: `--c-${slug}`(컬러 칩 · 스와치) → 팔레트 전체, `--dodont-zoom-${n}` 같은 번호 토큰 → 그 접두 전체
  const dynamic = [...codeNoCmt.matchAll(/(--[\w-]*?-)\$\{/g)].map(m => m[1]);
  const unused = [...tokensCss.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(m => m[1]).filter((n, i, a) => a.indexOf(n) === i && !used.has(n) && !dynamic.some(p => n.startsWith(p)) && !(n.endsWith('-m') && used.has(n.slice(0, -2))));
  note(unused.length ? `안 쓰는 토큰 ${unused.length}개 (실패 아님): ${unused.join(' · ')}` : '안 쓰는 토큰 0');
}
