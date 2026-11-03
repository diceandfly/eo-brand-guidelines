/** Linespacing · Letterspacing 차트 공통 스펙 — scripts/typo-chart.mjs(SVG+PNG) · scripts/typo-chart-ai.mjs(Illustrator .jsx) 가 함께 씀 */
// ── 격자 ───────────────────────────────────────────────────────────────
export const W = 1920, H = 1080, UNIT = 28, ROWS = 35;
export const X = c => 290 + c * 228;           // 컬럼 c(0–5) 왼쪽
export const Y = r => 50 + r * UNIT;           // 행 r(0–34) 위
export const SAMPLE_X = X(2), SAMPLE_R = X(4) + 200, SAMPLE_W = SAMPLE_R - SAMPLE_X;   // 746 … 1402

// ── 색 · 서체 ───────────────────────────────────────────────────────────
export const BG = '#2a2b2b', GRAY = '#8e8e8e', WHITE = '#fcfbf5', NEON = '#f9ee3a';
export const SANS = 'Founders Grotesk', MONO = 'Founders Grotesk Mono';
export const CAP = 0.70;                       // 캡 하이트(em) — 행 박스 안에서 대문자를 세로 중앙에
export const CHAR_W = { 300: 0.384, 400: 0.395, 500: 0.413, mono: 0.570 };   // 평균 글자 폭(em), 실측(scripts 메모)
export const CAPTION = { size: 20, ls: -0.07 };

// ── 레벨 · 변형 값 ────────────────────────────────────────────────────────
// multiple = 배수(x), ls = Linespacing 프리셋, lt = Letterspacing 프리셋(%), lines = 샘플 줄 수
export const LEVELS = {
  medium:  { name: 'Founders Grotesk Medium', weight: 500, family: SANS, level: 'H1', multiple: 2.5, ls: 100, lt: -1.5, lines: 2,
             range: 'D1 6x 80% -2.5% · H1 2.5x 100% -1.5%',
             text: "Layers, approvals, and titles that decide who's right." },
  regular: { name: 'Founders Grotesk Regular', weight: 400, family: SANS, level: 'H2', multiple: 2, ls: 115, lt: -1, lines: 2,
             range: 'D2 2.5x 100% -2% · H2 2x 115% -1% · H3 1.25x 125% -0.5%',
             text: 'Chase the vision, not the money, the money will end up following you.' },
  light:   { name: 'Founders Grotesk Light', weight: 300, family: SANS, level: 'T1', multiple: 1, ls: 140, lt: 0.5, lines: 3,
             range: 'T1 1x 140% +0.5% · reading-first 150% +1.5%',
             text: "Big companies in a crowded market keep quiet. Startups don't. They share their story and what they learn. A startup is a path no one walked before, so there is no proven answer to protect. You see it in hacker houses. Young hackers, late teens to mid-twenties, live together in cheap, rough places before they raise their seed round. They rent a small room somewhere tough, pack it with bunk beds, and live on cheap junk food." },
  mono:    { name: 'Founders Grotesk Mono Regular', weight: 400, family: MONO, level: 'C1', multiple: 0.5, ls: 111, lt: -7, lines: 4,
             range: 'C1 0.5x 111% -7%',
             text: "In late September, AMD agreed to buy World Labs, the AI model and research lab led by Fei-Fei Li, for about $8.2 billion. The deal is expected to close by the end of the year. EO's earlier piece looked at why a chipmaker would pay that much for a 2-year-old lab: AMD wants researchers close enough to its chip designers to shape chips three years before they ship. This piece looks at the deal from the lab's side. A research lab does its best work when it is free to pursue questions on its own terms. Can it keep working at that level inside a chipmaker?" },
};
export const VARIANTS = {
  linespacing:   { medium: [80, 100, 130], regular: [95, 115, 140], light: [110, 140, 180], mono: [90, 111, 140] },
  letterspacing: { medium: [-6, -1.5, 3], regular: [-5, -1, 3], light: [-3, 0.5, 5], mono: [-14, -7, 2] },
};
export const VERDICT = ['Too tight', 'Preset', 'Too loose'];

