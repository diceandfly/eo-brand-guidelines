// Pretendard(한글 본문 서체)를 로컬로 준비합니다. 실행: npm run fonts:ko
//   1. CDN 의 다이내믹 서브셋 woff2(92개)를 public/fonts/pretendard/ 에 내려받음 (이미 있으면 건너뜀. git 에는 넣지 않음 — .gitignore)
//   2. src/styles/pretendard.css 생성 — 서브셋마다 @font-face 두 개:
//        'Pretendard Variable'  본문 속 한글 구간(<span class="ko">, tokens.css --font-ko)
//        'Pretendard KO'        같은 파일 + size-adjust(--t-body-ko-scale) — .ko 로 감쌀 수 없는 곳(검색창 · 검색 결과 · 목차)의 한글도 본문과 같은 배율
//      둘 다 font-display: block — 폴백(Apple SD Gothic Neo)으로 먼저 그렸다가 바꾸면서 줄바꿈·문단 높이가 튀는 것(FOUT)을 막음
//   3. src/lib/pretendard-preload.json 생성 — 국문 가이드·UI 문자열에 실제로 쓰인 글자가 든 서브셋 목록.
//      Layout.astro 가 국문 페이지에서 이 파일들을 preload 해 첫 그리기 전에 서체가 준비되게 함
// 다시 돌릴 때: 배율 토큰을 바꿨을 때, Pretendard 버전을 올릴 때, 가이드에 새 글자(서브셋)가 늘었을 때(빌드가 알려 주진 않음)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'v1.3.9';
const CSS_URL = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@${VERSION}/dist/web/variable/pretendardvariable-dynamic-subset.min.css`;
const FONT_DIR = path.join(root, 'public/fonts/pretendard');
const WEB_DIR = '/fonts/pretendard';
const OUT_CSS = path.join(root, 'src/styles/pretendard.css');
const OUT_PRELOAD = path.join(root, 'src/lib/pretendard-preload.json');

const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const m = tokens.match(/--t-body-ko-scale:\s*([\d.]+)/);
if (!m) throw new Error('tokens.css 에 --t-body-ko-scale 이 없습니다');
const pct = (parseFloat(m[1]) * 100).toFixed(2).replace(/\.?0+$/, '');

// 1. CDN CSS → 서브셋 목록 (파일 URL + unicode-range)
const css = await (await fetch(CSS_URL)).text();
const faces = [...css.matchAll(/@font-face\{([^}]*)\}/g)].map(([, body]) => {
  const url = new URL(body.match(/url\(([^)]+)\)/)[1], CSS_URL).href;
  const range = body.match(/unicode-range:([^;]+)/)[1];
  const weight = body.match(/font-weight:([^;]+)/)[1];
  return { url, file: path.basename(url), range, weight };
});
if (!faces.length) throw new Error('CDN CSS 에서 @font-face 를 찾지 못했습니다');

fs.mkdirSync(FONT_DIR, { recursive: true });
let downloaded = 0;
for (let i = 0; i < faces.length; i += 8) {
  await Promise.all(faces.slice(i, i + 8).map(async f => {
    const dest = path.join(FONT_DIR, f.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
    const res = await fetch(f.url);
    if (!res.ok) throw new Error(`${f.url}: ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    downloaded++;
  }));
}

// 2. CSS
const face = (family, f, extra = '') =>
  `@font-face{font-family:'${family}';font-style:normal;font-display:block;font-weight:${f.weight};src:url(${WEB_DIR}/${f.file}) format('woff2-variations');unicode-range:${f.range}${extra}}`;
const out = faces.flatMap(f => [face('Pretendard Variable', f), face('Pretendard KO', f, `;size-adjust:${pct}%`)]).join('\n');
fs.writeFileSync(OUT_CSS, `/* 자동 생성 — 직접 고치지 말고 npm run fonts:ko 로 다시 만드세요 (scripts/pretendard-ko.mjs).
   Pretendard Variable ${VERSION} 다이내믹 서브셋 ${faces.length}개, public/fonts/pretendard/ (git 제외, 같은 명령이 내려받음).
   'Pretendard KO' = 같은 파일 + size-adjust ${pct}% (tokens.css --t-body-ko-scale). font-display: block (FOUT 방지). */
${out}
`);

// 3. preload 목록 — 국문 가이드 + UI 문자열(src/)에 쓰인 글자가 든 서브셋
const text = [
  fs.readFileSync(path.join(root, 'content/guide.ko.md'), 'utf8'),
  ...fs.readdirSync(path.join(root, 'src'), { recursive: true })
    .filter(p => /\.(astro|ts)$/.test(p))
    .map(p => fs.readFileSync(path.join(root, 'src', p), 'utf8')),
].join('');
const cps = new Set([...text].map(ch => ch.codePointAt(0)));
const inRange = (range, cp) => range.split(',').some(r => {
  const [a, b] = r.trim().replace(/^U\+/i, '').split('-').map(h => parseInt(h, 16));
  return cp >= a && cp <= (b ?? a);
});
const needed = faces.filter(f => [...cps].some(cp => inRange(f.range, cp))).map(f => `${WEB_DIR}/${f.file}`);
fs.writeFileSync(OUT_PRELOAD, JSON.stringify(needed, null, 2) + '\n');
const bytes = needed.reduce((s, p) => s + fs.statSync(path.join(root, 'public', p)).size, 0);
console.log(`서브셋 ${faces.length}개 (새로 받음 ${downloaded}), size-adjust ${pct}%, preload ${needed.length}개 ${(bytes / 1024).toFixed(0)}KB → ${path.relative(root, OUT_CSS)}, ${path.relative(root, OUT_PRELOAD)}`);
