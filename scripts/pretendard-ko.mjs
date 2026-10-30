// Pretendard 의 CDN 서브셋 CSS 를 받아 'Pretendard KO' 서체로 복제합니다.
// 차이는 size-adjust 하나: tokens.css 의 --t-body-ko-scale(영문 대비 한글 배율)을 글리프에 미리 적용해
// <span class="ko"> 로 감쌀 수 없는 곳(검색 입력창 · 검색 결과 · 목차 등)에서도 한글이 같은 배율로 보이게 합니다.
// 폰트 파일은 CDN 의 같은 서브셋 woff2 를 그대로 가리키므로 추가 다운로드는 없습니다.
// 실행: npm run fonts:ko  (배율 토큰을 바꿨거나 Pretendard 버전을 올릴 때)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'v1.3.9';
const CSS_URL = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@${VERSION}/dist/web/variable/pretendardvariable-dynamic-subset.min.css`;
const OUT = path.join(root, 'src/styles/pretendard-ko.css');

const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const m = tokens.match(/--t-body-ko-scale:\s*([\d.]+)/);
if (!m) throw new Error('tokens.css 에 --t-body-ko-scale 이 없습니다');
const pct = (parseFloat(m[1]) * 100).toFixed(2).replace(/\.?0+$/, '');

const css = await (await fetch(CSS_URL)).text();
const faces = css.match(/@font-face\{[^}]*\}/g);
if (!faces?.length) throw new Error('CDN CSS 에서 @font-face 를 찾지 못했습니다');
const out = faces.map(f => f
  .replace(/font-family:'Pretendard Variable'/, "font-family:'Pretendard KO'")
  .replace(/url\(([^)]+)\)/, (_, u) => `url(${new URL(u, CSS_URL).href})`)
  .replace(/\}$/, `;size-adjust:${pct}%}`)
).join('\n');

fs.writeFileSync(OUT, `/* 자동 생성 — 직접 고치지 말고 npm run fonts:ko 로 다시 만드세요 (scripts/pretendard-ko.mjs).
   'Pretendard KO' = Pretendard Variable ${VERSION} 서브셋 + size-adjust ${pct}% (tokens.css --t-body-ko-scale).
   서체 스택에서 Founders Grotesk 바로 뒤에 두면, .ko 래핑이 없는 곳(검색창 · 목차 · UI 문자열)의 한글도 본문과 같은 배율로 보입니다. */
${out}
`);
console.log(`${OUT}: @font-face ${faces.length}개, size-adjust ${pct}%`);
