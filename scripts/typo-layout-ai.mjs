/**
 * 타이포그래피 남은 장표 26장을 Illustrator 에서 만들기 (Setting Up 5 · Tonal Value 1 · Alignment & Ragging 2 · Grid Setting 6 · Don'ts 12)
 *   node scripts/typo-layout-ai.mjs [--run] [--pattern 01] [--only dont,grid] [--into 기존.ai] [출력 폴더]
 *   --into 파일.ai 이면 새 문서 대신 그 파일을 열어 이어 그림: 같은 이름의 아트보드는 내용을 비우고 다시 그리고, 없는 이름은 뒤에 새 아트보드로 추가.
 *     손으로 고친 다른 아트보드는 건드리지 않음. 이때 PNG 는 이번에 그린 장표만 내보내고 .ai 는 제자리에 저장.
 *     파일이 일러에 이미 열려 있으면 그 문서에 그리고 저장(저장 안 한 편집도 함께 저장됨) · 열려 있지 않으면 열어서 그리고 저장 뒤 닫음.
 *   --into 없이 돌리면 새 문서를 만들어 [출력 폴더]/typo-layout.ai 로 saveAs 하고 열어 둠(기본 출력 폴더 ~/Downloads/temp/typography-layout-ai).
 *   원칙: 스크립트는 자기가 만든 문서와 --into 로 받은 문서만 열고 · 저장하고 · 닫는다. 그 밖에 일러에 열린 문서는 어떤 경우에도 닫거나 저장하지 않는다.
 *   --run 이면 osascript 로 Illustrator 에 .jsx 를 실행 → PNG + typo-layout.ai 저장, 이어서 sharp 로 tonal-value 의 샘플 영역만 블러.
 *   기본 출력 폴더: ~/Downloads/temp/typography-layout-ai  (→ npm run import -- typography ~/Downloads/temp/typography-layout-ai)
 *
 * 격자(사용자 grid.svg, 1920×1080 중앙): 8컬럼 143 + 거터 28 = 1340 · 35행 × 28 = 980 → x 290–1630 · y 50–1030.
 * 두 가지 양식 — 장표의 성격에 따라:
 *   개념(concept) = Typographic Framework Overview 식: 배경 #080404, 샘플 200% 를 세로 가운데에, 전폭 점선, 모노 라벨(회색, 변수만 네온), "200% scale".
 *       → setting-up-1..5 · tonal-value
 *   지면(placement) = Logo › Symbol › Placement 식: 검정 배경, 지면 실루엣(회색 면 + 1px 선), 패턴 영역은 실제 패턴 55%, 모노 라벨.
 *   tonal-value · alignment · ragging 도 같은 양식(--only tonal,alignment,ragging). --into 로 태일 .ai 에 이어 그림.
 *       → zoning-ratio · zoning-4-division · margin-24 · margin-compensation · grid-row · grid-column  (--only zoning,margin,grid)
 *   예시(chart) = Linespacing · Letterspacing 차트 식: 배경 Solid Gray, 블록 윗선에 1px 50% 룰(빨강 = 나쁨 · Bay Green = 좋음),
 *       1컬럼 스펙 라벨 2줄 · 3컬럼(632) 부터 샘플 폭 656 · 8컬럼(1487) 판정 라벨.
 *       → alignment · ragging · dont-1..12 (Don't 카드는 grid-3 로 작게 보이므로 샘플 200%)
 *   레벨 값은 Reference Scale 프리셋 그대로(scripts/lib/typo-chart-spec.mjs 와 같은 표).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const run = args.includes('--run');
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const PATTERN = opt('--pattern', '01');
const ONLY = opt('--only', '').split(',').filter(Boolean);
const INTO = opt('--into', '').replace(/^~(?=\/|$)/, os.homedir());   // 이어 그릴 기존 .ai (없으면 새 문서)
const positional = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] === '--pattern' || args[i - 1] === '--only' || args[i - 1] === '--into'));
const OUT = (positional[0] ?? path.join(os.homedir(), 'Downloads', 'temp', 'typography-layout-ai')).replace(/^~(?=\/|$)/, os.homedir());
fs.mkdirSync(OUT, { recursive: true });
const PATTERN_SVG = path.join(ROOT, 'public/assets/05-graphic-system/02-graphic-pattern', `03-pattern-${PATTERN}.svg`);
if (!fs.existsSync(PATTERN_SVG)) throw new Error(`pattern svg missing: ${PATTERN_SVG}`);

// ── 격자 · 색 · 서체 ───────────────────────────────────────────────────────
const W = 1920, H = 1080, U = 28;
const X0 = 290, Y0 = 50, COLS = 8, COL = 143, GUT = U;
const X = c => X0 + c * (COL + GUT);                          // 290 461 632 803 974 1145 1316 1487
const R = r => Y0 + r * U;                                    // 행 r 위 (0–34)
const GRID_R = X(COLS - 1) + COL, GRID_B = R(35);             // 1630 · 1030
const BLACK = '#080404', GRAYBG = '#2a2b2b', GRAY = '#8e8e8e', WHITE = '#fcfbf5', NEON = '#f9ee3a', GREEN = '#66b88a';
const RED = '#d96f4f';                                        // 차트의 "Too tight / Too loose" 룰 색(장표 픽셀에서 역산, 팔레트 아님)
const PS = { 300: 'FoundersGrotesk-Light', 400: 'FoundersGrotesk-Regular', 500: 'FoundersGrotesk-Medium', mono: 'FoundersGroteskMono-Regular' };
const KO_FONTS = ['PretendardVariable-Regular', 'Pretendard-Regular', 'AppleSDGothicNeo-Regular'];
const OTHER_FONT = ['Helvetica-Bold', 'Arial-BoldMT', 'ArialMT'];
const LABEL = { font: PS.mono, size: 20, leading: 24, tracking: -70 };

// 레벨(Reference Scale, 1x = 28px): 배수 · 웨이트 · Linespacing % · 자간 %
const LV = {
  D2: { m: 2.5, w: 400, ls: 100, lt: -2, name: 'Regular' },
  H1: { m: 2.5, w: 500, ls: 100, lt: -1.5, name: 'Medium' },
  H2: { m: 2, w: 400, ls: 115, lt: -1, name: 'Regular' },
  H3: { m: 1.25, w: 400, ls: 125, lt: -0.5, name: 'Regular' },
  T1: { m: 1, w: 300, ls: 140, lt: 1.5, name: 'Light' },
  C1: { m: 0.5, w: 'mono', ls: 111, lt: -7, name: 'Mn Regular' },
};
const lead = L => L.m * U, size = L => lead(L) / (L.ls / 100);
const sign = v => (v > 0 ? '+' : '') + v;
const spec = (k, hot) => ({ l1: `${k} ${LV[k].m}x`, l2: `${LV[k].name} ${LV[k].ls}% ${sign(LV[k].lt)}%`, hot });   // 스펙 라벨 2줄, hot = 네온으로 칠할 토큰

const TXT = {
  head: 'Chase the\rvision.',
  body: "Big companies in a crowded market keep quiet. Startups don't. They share their story and what they learn.",
  bodyLong: "Big companies in a crowded market keep quiet. Startups don't. They share their story and what they learn. A startup is a path no one walked before, so there is no proven answer to protect.",
  cap: 'EO Studio · Nov 3, 2026 · 4 min read\rFig. 02/ Thread gutter 10-20px',
  ko: '붐비는 시장의 큰 회사는 조용합니다. 스타트업은 다릅니다. 자기 이야기와 배운 것을 나눕니다.',
};

// ── 요소 헬퍼 (좌표는 1920×1080 위, top-left 기준) ────────────────────────────
const E = {
  rect: (top, left, w, h, fill, opacity) => ({ kind: 'rect', top, left, w, h, fill, opacity }),
  line: (x1, y1, x2, y2, stroke, width = 1, extra = {}) => ({ kind: 'line', x1, y1, x2, y2, stroke, width, ...extra }),
  dots: y => ({ kind: 'line', x1: 0, y1: y, x2: W, y2: y, stroke: GRAY, width: 1, dash: [1, 2], opacity: 50 }),   // 전폭 점선(개념 양식)
  rule: (y, color) => ({ kind: 'line', x1: X0, y1: y, x2: GRID_R, y2: y, stroke: color, width: 1, opacity: 50 }),   // 블록 룰(차트 양식)
  label: (text, top, left, fill = GRAY, w = 242, lines = 1, ranges = []) => ({ kind: 'text', top, left, w, h: lines * LABEL.leading + 4, text, ...LABEL, fill, first: 'em', ranges }),
  spec: (s, top, left) => { const text = `${s.l1}\r${s.l2}`; const at = s.hot ? s.l1.length + 1 + s.l2.lastIndexOf(s.hot) : -1; return E.label(text, top, left, GRAY, 242, 2, at >= 0 ? [[at, at + s.hot.length, NEON]] : []); },
  /** 레벨 텍스트. S = 배율(200% 는 2). o: font · leading · tracking · fill · just · ranges · stroke · hscale · size */
  text: (k, top, left, w, lines, text, S = 1, o = {}) => {
    const L = LV[k], fsz = (o.size ?? size(L)) * S, ld = (o.leading ?? lead(L)) * S;
    return { kind: 'text', top, left, w, h: Math.ceil(lines * ld), text, font: o.font ?? (L.w === 'mono' ? PS.mono : PS[L.w]), size: fsz, leading: ld, tracking: o.tracking ?? L.lt * 10, fill: o.fill ?? WHITE, first: 'cap', just: o.just, ranges: o.ranges ?? [], stroke: o.stroke, hscale: o.hscale, lvl: k };
  },
  pattern: (top, left, w, h, opacity, fit = 'height') => ({ kind: 'pattern', top, left, w, h, opacity, fit }),
};
const page = (bg, els) => [E.rect(0, 0, W, H, bg), ...els];

// ── 개념 양식: 레벨 스택(H1 · T1 · C1) 200% ──────────────────────────────────
const S = 2;
const SX = X(3), SW = X(6) + COL - X(3);                       // 샘플 803 … 1459 (Overview 장표와 같은 자리)
const LX = X(1) + 72;                                          // 왼쪽 라벨 533 (Overview 장표의 "1 Line Unit = 1x" 자리)
const STACK = [
  { k: 'H1', lines: 2, text: TXT.head },
  { k: 'T1', lines: 3, text: TXT.body },
  { k: 'C1', lines: 2, text: TXT.cap },
];
const GAP = 2 * U;                                             // 레벨 사이 2행(200% 에서 1x)
function stackBoxes(top = R(6)) {
  let y = top; const boxes = [];
  for (const s of STACK) { const h = s.lines * lead(LV[s.k]) * S; boxes.push({ ...s, top: y, h, ld: lead(LV[s.k]) * S, fs: size(LV[s.k]) * S }); y += h + GAP; }
  return boxes;   // 218–498 · 554–722 · 778–834
}
function concept(fn) {
  const els = [];
  const boxes = stackBoxes();
  fn(boxes, els);
  els.push(E.label('200% scale', boxes[boxes.length - 1].top + boxes[boxes.length - 1].h + 2 * U, SX, GRAY));
  return page(BLACK, els);
}
const stackText = (b, els, o = {}) => els.push(E.text(b.k, b.top, SX, SW, b.lines, b.text, S, o));

const charts = [];
const add = (name, els) => { if (!ONLY.length || ONLY.some(k => name.startsWith(k))) charts.push({ name, els }); };

// Setting Up 1 — 레벨 수: 글 대신 블록 3개
add('setting-up-1', concept((boxes, els) => {
  const names = { H1: 'Level 1 · Headline', T1: 'Level 2 · Text', C1: 'Level 3 · Caption' };
  for (const b of boxes) { els.push(E.dots(b.top), E.dots(b.top + b.h), E.rect(b.top, SX, SW, b.h, WHITE, 18), E.label(names[b.k], b.top, LX, NEON)); }
}));
// Setting Up 2 — Line Unit: 본문 행간 1x 를 기준으로
add('setting-up-2', concept((boxes, els) => {
  for (const b of boxes) {
    const isT = b.k === 'T1';
    if (isT) { for (let q = 0; q <= b.lines; q++) els.push(E.dots(b.top + q * b.ld)); els.push(E.rect(b.top, SX, SW, b.ld, NEON, 12), E.label('1 Line Unit = 1x', b.top, LX, NEON), E.spec(spec('T1'), b.top - 2.5 * U, SX)); }
    stackText(b, els, { fill: isT ? WHITE : GRAY });
  }
}));
// Setting Up 3 — 레벨의 배수
add('setting-up-3', concept((boxes, els) => {
  for (const b of boxes) { els.push(E.dots(b.top), E.dots(b.top + b.h), E.rect(b.top, SX, SW, b.ld, NEON, 12), E.label(`${LV[b.k].m}x`, b.top, LX, NEON)); stackText(b, els); }
}));
// Setting Up 4 — Linespacing: 줄 사이 여백을 띠로
add('setting-up-4', concept((boxes, els) => {
  for (const b of boxes) {
    els.push(E.dots(b.top), E.dots(b.top + b.h), E.label(`${LV[b.k].ls}%`, b.top, LX, NEON));
    const gh = b.ld - 0.8 * b.fs; if (gh > 0.5) for (let q = 1; q < b.lines; q++) els.push(E.rect(b.top + q * b.ld - gh, SX, SW, gh, NEON, 12));
    stackText(b, els);
  }
}));
// Setting Up 5 — 웨이트 · 자간으로 Tonal Value
add('setting-up-5', concept((boxes, els) => {
  for (const b of boxes) { els.push(E.dots(b.top), E.dots(b.top + b.h), E.label(`${LV[b.k].name} ${sign(LV[b.k].lt)}%`, b.top, LX, NEON), E.spec(spec(b.k), b.top - 2.5 * U, SX)); stackText(b, els); }
}));
// ── Grid Setting — Zoning 2 · Margin 2 · Compound Grid 2 (Logo › Symbol › Placement 장표 양식: 검정 배경, 지면 실루엣 회색 면 + 1px 회색 선, 모노 라벨) ──
const PANEL = '#2b2c2c', LINE = '#6a6a6a';
const silhouette = (top, left, w, h) => [E.rect(top, left, w, h, PANEL), ...frame(top, left, w, h, LINE, 1, 100)];
const frame = (top, left, w, h, color, width = 1, opacity = 100) => [
  E.line(left, top, left + w, top, color, width, { opacity }), E.line(left + w, top, left + w, top + h, color, width, { opacity }),
  E.line(left + w, top + h, left, top + h, color, width, { opacity }), E.line(left, top + h, left, top, color, width, { opacity }),
];
const patZone = (top, left, w, h) => [E.rect(top, left, w, h, NEON, 16)];                                           // 패턴 영역 = 네온 16% (Placement 장표처럼 추상)
const dotted = (x1, y1, x2, y2) => E.line(x1, y1, x2, y2, NEON, 1, { dash: [2, 3] });                                 // 영역 경계
const tag = (text, top, left, fill = GRAY, w = 320) => E.label(text, top, left, fill, w);
const caption = (text, top, left) => E.label(text, top, left, GRAY, 1100, 2);
const title = (text, top, left, fill = GRAY) => E.label(text, top - 1.5 * U, left, fill, 400);                      // 실루엣 위 이름(Placement 장표의 "A3 poster")
// 가짜 글 · 로고 (콘텐츠 자리 표시)
const fakeText = (top, left, w, lines, lh, fill = WHITE, op = 55) => Array.from({ length: lines }, (_, i) => E.rect(top + i * lh, left, w * (i === lines - 1 ? 0.6 : 1), lh * 0.55, fill, op));
const fakeLogo = (top, left, h) => E.rect(top, left, h * 2.1, h, WHITE, 80);
/** 지면 하나: 패턴 영역과 콘텐츠 영역. pat = 'top'|'right'|'bottom'|'left', share = 패턴이 차지하는 길이 비율 */
function zonedPage(top, left, w, h, pat, share, labels = {}) {
  const els = silhouette(top, left, w, h);
  let P, C;   // 패턴 · 콘텐츠 사각형
  if (pat === 'top') { P = [top, left, w, h * share]; C = [top + h * share, left, w, h * (1 - share)]; }
  if (pat === 'bottom') { P = [top + h * (1 - share), left, w, h * share]; C = [top, left, w, h * (1 - share)]; }
  if (pat === 'right') { P = [top, left + w * (1 - share), w * share, h]; C = [top, left, w * (1 - share), h]; }
  if (pat === 'left') { P = [top, left, w * share, h]; C = [top, left + w * share, w * (1 - share), h]; }
  els.push(...patZone(...P));
  if (pat === 'top' || pat === 'bottom') els.push(dotted(left, C[0] + (pat === 'top' ? 0 : C[3]), left + w, C[0] + (pat === 'top' ? 0 : C[3])));
  else els.push(dotted(C[1] + (pat === 'left' ? 0 : C[2]), top, C[1] + (pat === 'left' ? 0 : C[2]), top + h));
  if (labels.pat) els.push(tag(labels.pat, P[0] + P[3] / 2 - 12, P[1] + 14, WHITE, P[2] - 28));
  if (labels.content) els.push(tag(labels.content, C[0] + 14, C[1] + 14, NEON, C[2] - 28));
  return { els, P, C };
}
const GRID_NOTE = 'Pattern area full bleed · content area = the rest · boundary on a grid line';

// ── Tonal Value · Alignment & Ragging (Grid Setting 과 같은 양식: 검정 배경, 지면 실루엣, 모노 라벨, 키워드 네온) ──
const BAND = '#333f40', CYAN = '#6ec6d2', PANEL2 = '#1d1e1e';                                                   // 마진 띠(태일 장표 픽셀) · 라벨 시안 · 이미지 자리
const capH = k => 0.7 * size(LV[k]);                                                                             // first:'cap' 이므로 첫 베이스라인 = top + 캡 높이
const imageBox = (top, left, w, h) => [E.rect(top, left, w, h, PANEL2), ...frame(top, left, w, h, LINE, 1, 100), E.line(left, top, left + w, top + h, LINE, 1, { dash: [1, 2], opacity: 60 }), E.line(left + w, top, left, top + h, LINE, 1, { dash: [1, 2], opacity: 60 })];

// Tonal Value — 위: 본문 세팅(Light · 140% · +1.5%)을 키우기만 한 것(왼쪽) · 프리셋(오른쪽), 100%, D2 · H1 · T1 · C1 네 레벨. 아래: 같은 두 스택을 눈을 가늘게 뜬 밝기로.
// 블러와 레벨별 평균 휘도는 --run 뒤 sharp 가 PNG 에서 처리: 1패스에서 휘도를 재어 OUT/tonal-luma.json 에 쓰고, 값이 바뀌었으면 같은 명령을 한 번 더 돌려 라벨에 넣음(.ai 안은 선명 · 수치 포함)
const TONAL = { left: X(0), right: X(4), w: X(3) + COL - X(0), top: R(5), boxes: [] };
const TSTACK = [
  { k: 'D2', lines: 1, text: 'Chase the vision.' },
  { k: 'H1', lines: 1, text: 'Chase the vision.' },
  { k: 'T1', lines: 3, text: TXT.bodyLong },
  { k: 'C1', lines: 2, text: TXT.cap },
];
const LUMA_FILE = path.join(OUT, 'tonal-luma.json');
const LUMA = fs.existsSync(LUMA_FILE) ? JSON.parse(fs.readFileSync(LUMA_FILE, 'utf8')) : null;   // { scaled: [..], preset: [..] } (%)
const lumaLine = arr => arr ? 'Mean luminance ' + arr.map(v => Math.round(v)).join(' · ') + ' %' : '';
function tonalStack(left, top, naive, record) {
  const els = []; let y = top;
  for (const s of TSTACK) {
    const L = LV[s.k]; const ld = lead(L);
    const o = naive && s.k !== 'T1' ? { font: PS[300], size: ld / 1.4, tracking: 15 } : {};
    els.push(E.text(s.k, y, left, TONAL.w, s.lines, s.text, 1, o));
    if (record) TONAL.boxes.push({ col: naive ? 'scaled' : 'preset', k: s.k, top: y, left, w: TONAL.w, h: s.lines * ld });
    y += s.lines * ld + U;
  }
  return { els, bottom: y - U };
}
{
  const a = tonalStack(TONAL.left, TONAL.top, true, true), b = tonalStack(TONAL.right, TONAL.top, false, true);
  const t2 = a.bottom + 3.5 * U;
  const a2 = tonalStack(TONAL.left, t2, true), b2 = tonalStack(TONAL.right, t2, false);
  TONAL.blur = { top: t2, bottom: a2.bottom };
  const lumaY = TONAL.top - 1.25 * U;
  add('tonal-value', page(BLACK, [
    E.label('Scaled only', TONAL.top - 2.5 * U, TONAL.left, GRAY, 400), E.label('Preset', TONAL.top - 2.5 * U, TONAL.right, NEON, 400),
    ...(LUMA ? [E.label(lumaLine(LUMA.scaled), lumaY, TONAL.left, GRAY, 500), E.label(lumaLine(LUMA.preset), lumaY, TONAL.right, NEON, 500)] : []),
    ...a.els, ...b.els,
    E.label('Squint test', t2 - 1.5 * U, TONAL.left, GRAY, 400), E.label('Squint test', t2 - 1.5 * U, TONAL.right, NEON, 400),
    ...a2.els, ...b2.els,
    caption('Same Line Unit on both sides · left scales one setting, right re-sets weight · linespacing · tracking per level (D2 · H1 · T1 · C1) · every level should read as one gray when you squint', R(33), X(0)),
  ]));
}

// Alignment — A판형: 왼쪽 정렬선 · 두 단의 첫 베이스라인 · 이미지 아래 심볼 왼쪽 · 캡션 오른쪽. 16:9: 세 단. 작은 정사각형: 한 행일 때만 가운데
{
  const els = [];
  // A판형 포스터 495×700, 마진 1/24
  const PW = 495, PH = 700, PT = R(4), PL = X(0), m = PW / 24, cx = PL + m, cw = PW - 2 * m;
  els.push(title('A-series poster', PT, PL), ...silhouette(PT, PL, PW, PH));
  let y = PT + m;
  els.push(E.text('H2', y, cx, cw, 2, 'Build first.\rExplain later.'));
  y += 2 * lead(LV.H2) + U;
  const colW = (cw - U) / 2;
  els.push(E.text('T1', y, cx, colW, 7, TXT.bodyLong), E.text('T1', y, cx + colW + U, colW, 7, TXT.body + ' ' + TXT.bodyLong.slice(0, 110)));
  const yb = y + capH('T1');
  els.push(E.line(PL - 1.5 * U, yb, PL + PW + 1.5 * U, yb, NEON, 1), tag('first baseline', yb - 30, PL + PW + U, NEON, 200));
  els.push(E.line(cx, PT - 0.5 * U, cx, PT + PH + 1.5 * U, NEON, 1), tag('alignment line', PT + PH + 1.5 * U + 4, cx + 8, NEON, 240));
  y += 7 * lead(LV.T1) + U;
  const ih = PT + PH - m - y - 3 * U - 20;                                                                   // 이미지: 남은 높이 − 심볼 행 − 태그 행
  els.push(...imageBox(y, cx, cw, ih));
  const sy = y + ih + 0.5 * U;
  els.push(fakeLogo(sy, cx, U), E.text('C1', sy + 2, cx + cw / 2, cw / 2, 1, 'Fig. 01/ Hacker house, Seoul', 1, { just: 'right' }));
  els.push(tag('symbol · left edge', sy + U + 8, cx, GRAY, 200), tag('caption · right edge', sy + U + 8, cx + cw - 200, GRAY, 200));
  // 16:9 화면 580×326, 세 단
  const SW2 = 580, SH2 = 326, ST = R(4), SL = X(4), m2 = SW2 / 24, sx = SL + m2, sw = SW2 - 2 * m2;
  els.push(title('16:9 screen', ST, SL), ...silhouette(ST, SL, SW2, SH2));
  let y2 = ST + m2;
  els.push(E.text('H2', y2, sx, sw, 1, 'Even the Odd.'));
  y2 += lead(LV.H2) + U;
  const c3 = (sw - 2 * U) / 3;
  for (let i = 0; i < 3; i++) els.push(E.text('T1', y2, sx + i * (c3 + U), c3, 6, [TXT.bodyLong, TXT.body + ' ' + TXT.bodyLong.slice(0, 80), TXT.body + ' ' + TXT.body][i]));
  const yb2 = y2 + capH('T1');
  els.push(E.line(SL - 1.5 * U, yb2, SL + SW2 + 1.5 * U, yb2, NEON, 1), tag('first baseline', yb2 - 30, SL + SW2 + U, NEON, 200));
  els.push(E.line(sx, ST - 0.5 * U, sx, ST + SH2 + 1.5 * U, NEON, 1));
  // 한 행일 때만 가운데: 굿즈 백프린트 240×240
  const QW = 240, QT = ST + SH2 + 3 * U, QL = X(4);
  els.push(title('One line only · centered', QT, QL), ...silhouette(QT, QL, QW, QW));
  els.push(fakeLogo(QT + QW / 2 - 2.5 * U, QL + QW / 2 - 1.05 * U, U), E.text('T1', QT + QW / 2 + 0.5 * U, QL, QW, 1, 'Built in Seoul', 1, { just: 'center' }));
  els.push(E.line(QL + QW / 2, QT - 0.5 * U, QL + QW / 2, QT + QW + 0.5 * U, NEON, 1, { dash: [2, 3] }));
  els.push(caption('Left aligned · first baselines level across columns · symbol on the left edge, caption on the right edge of an image', R(33), X(0)));
  add('alignment', page(BLACK, els));
}

// Ragging — H2 세 줄 × 3: 의미 단위(Do) · 계단(Don't) · 외톨이(Don't)
{
  const els = [];
  const RW = (GRID_R - X0 - 2 * GUT) / 3, RT = R(6);
  const samples = [
    ['Do · meaning breaks', NEON, 'Chase the vision,\rnot the money.\rIt will follow.'],
    ["Don't · stair shape", RED, 'Chase the vision,\rnot the\rmoney, it follows.'],
    ["Don't · orphan", RED, 'Chase the vision,\rnot the money, it\rfollows.'],
  ];
  samples.forEach(([t, c, txt], i) => {
    const left = X0 + i * (RW + GUT);
    els.push(title(t, RT, left, c), E.text('H2', RT, left, RW, 3, txt));
    els.push(E.line(left, RT - 0.5 * U, left, RT + 3 * lead(LV.H2) + 0.5 * U, c, 1, { dash: [2, 3], opacity: 70 }));
  });
  els.push(caption('Break a headline where the meaning breaks · avoid a stair of long and short lines, and a single word left on the last line', R(33), X(0)));
  add('ragging', page(BLACK, els));
}

// Zoning 1 — A판형 · 가로 와이드 · 세로 롤업
{
  const els = [];
  const a = zonedPage(R(6), X(0), 396, 560, 'top', 396 / 560, { pat: 'Pattern 1:1', content: 'Content' });
  const wd = zonedPage(R(14), 740, 580, 171, 'right', 0.7, { pat: 'Pattern 70 %', content: 'Content' });
  const rb = zonedPage(R(4), 1370, 260, 676, 'bottom', 0.5, { pat: 'Pattern 1/2', content: 'Content' });
  els.push(title('A-series poster', R(6), X(0)), ...a.els, title('Wide banner 3.4:1', R(14), 740), ...wd.els, title('Roll-up banner', R(4), 1370), ...rb.els);
  els.push(caption(GRID_NOTE, R(32), X(0)));
  add('zoning-ratio', page(BLACK, els));
}
// Zoning 2 — 4분할 체커보드 2종(세로 · 가로) · 좌우 절반
{
  const els = [];
  const H2 = 480, T = R(10);
  const checker = (top, left, w, h, firstPat) => {   // 4분할: firstPat = 왼쪽 위 칸이 패턴인가
    const o = silhouette(top, left, w, h), cw = w / 2, ch = h / 2;
    const cells = [[top, left], [top, left + cw], [top + ch, left], [top + ch, left + cw]];
    cells.forEach(([t, l], i) => { const isPat = (i === 0 || i === 3) === firstPat; if (isPat) o.push(...patZone(t, l, cw, ch)); else o.push(tag('Content', t + 14, l + 14, NEON, cw - 28)); });
    o.push(dotted(left + cw, top, left + cw, top + h), dotted(left, top + ch, left + w, top + ch));
    return o;
  };
  els.push(title('Checkerboard · portrait', T, X(0)), ...checker(T, X(0), 340, H2, true));
  els.push(title('Checkerboard · landscape', T, 720), ...checker(T, 720, 480, H2, false));
  const hs = zonedPage(T, 1290, 340, H2, 'left', 0.5, { pat: 'Pattern', content: 'Content' });
  els.push(title('Half split', T, 1290), ...hs.els, dotted(1290 + 170, T + H2 / 2, 1630, T + H2 / 2), tag('two cells', T + H2 / 2 + 8, 1290 + 170 + 14, GRAY, 160));
  els.push(caption('Content and pattern alternate in cells · a tall content strip counts as two cells', R(32), X(0)));
  add('zoning-4-division', page(BLACK, els));
}
// Margin 1 — 콘텐츠 영역 긴 변의 1/24 (포스터 · 좌우 절반 분할)
function marginBands(C, m, color = NEON, op = 30) {
  const [t, l, w, h] = C;
  return [E.rect(t, l, w, m, color, op), E.rect(t + h - m, l, w, m, color, op), E.rect(t + m, l, m, h - 2 * m, color, op), E.rect(t + m, l + w - m, m, h - 2 * m, color, op)];
}
function ticks24(C, along) {   // 긴 변을 24 등분한 눈금
  const [t, l, w, h] = C, out = [];
  for (let i = 1; i < 24; i++) {
    if (along === 'w') { const x = l + (w * i) / 24; out.push(E.line(x, t, x, t + 6, NEON, 1)); }
    else { const y = t + (h * i) / 24; out.push(E.line(l, y, l + 6, y, NEON, 1)); }
  }
  return out;
}
{
  const els = [];
  const PH = 700, PW = 495, T = R(5);
  const a = zonedPage(T, X(0), PW, PH, 'top', PW / PH, { pat: 'Pattern' });
  const mA = PW / 24;   // 콘텐츠 영역 긴 변 = 폭
  els.push(title('A-series poster · content area 24 × margin wide', T, X(0)), ...a.els, ...marginBands(a.C, mA), ...ticks24(a.C, 'w'));
  els.push(tag('margin = long side / 24', a.C[0] + a.C[3] + 10, X(0), NEON, 480));
  const hs = zonedPage(T, 1000, PW, PH, 'left', 0.5, { pat: 'Pattern' });
  const cell = [hs.C[0], hs.C[1], hs.C[2], hs.C[3] / 2], mH = cell[3] / 24;   // 세로 띠 → 위아래 두 칸, 칸 긴 변 = 높이
  els.push(title('Half split · each cell 24 × margin tall', T, 1000), ...hs.els, dotted(hs.C[1], hs.C[0] + hs.C[3] / 2, hs.C[1] + hs.C[2], hs.C[0] + hs.C[3] / 2));
  els.push(...marginBands(cell, mH), ...marginBands([cell[0] + cell[3], cell[1], cell[2], cell[3]], mH), ...ticks24(cell, 'h'));
  els.push(tag('margin = cell long side / 24', hs.C[0] + hs.C[3] + 10, 1000, NEON, 480));
  els.push(caption('Equal on four sides · lands at 1/22 – 1/25 after the compound grid is set', R(33), X(0)));
  add('margin-24', page(BLACK, els));
}
// Margin 2 — 패턴 인접 간격: 1.5× · 회색 경계인 글자 상단은 또렷한 왼쪽 정렬선 · 베이스라인보다 여유 (태일 .ai 가 원본, 스크립트는 참고용)
{
  const els = [];
  const CW = 760, CH = 540, L = 700, T = R(8), m = CH / 24 * 1.6;   // 칸을 크게 보이려 마진 배율을 키움(설명용)
  // 주변 패턴 칸(위 · 왼쪽)을 잘라 보여줌
  els.push(...silhouette(T - 150, L - 150, CW + 150, CH + 150));
  els.push(...patZone(T - 150, L - 150, CW + 150, 150), ...patZone(T, L - 150, 150, CH));
  els.push(E.rect(T, L, CW, CH, PANEL), dotted(L, T, L + CW, T), dotted(L, T, L, T + CH));
  // 간격 띠
  els.push(E.rect(T, L, CW, 1.5 * m, NEON, 40), E.rect(T, L, 1.5 * m, CH, NEON, 40), E.rect(T + CH - m, L, CW, m, NEON, 18), E.rect(T, L + CW - m, m, CH, NEON, 18));
  // 글 · 로고
  const tx = L + 1.5 * m, ty = T + 1.5 * m;
  els.push(...fakeText(ty, tx, 300, 2, 46, WHITE, 85), ...fakeText(ty + 2 * 46 + 30, tx, 420, 5, 22, WHITE, 45));
  els.push(fakeLogo(T + CH - m - 34, tx, 34));
  // 라벨
  els.push(tag('1.5 × margin · content meets the pattern above', T + 1.5 * m / 2 - 12, L + 1.5 * m + 10, NEON, 520));
  els.push(tag('1.5 ×', T + CH / 2, L + 10, NEON, 100));
  els.push(tag('1 ×', T + CH - m / 2 - 12, L + CW - 60, NEON, 50), tag('1 ×', T + CH / 2, L + CW - m - 50, NEON, 50));
  els.push(tag('soft top edge of type: more than the hard left line · baseline · symbol edges', T + CH + 12, L, GRAY, 500));
  els.push(tag('page edge: 1 ×', T + CH + 36, L, GRAY, 500));
  els.push(title('Content cell next to the pattern', T - 150, L - 150));
  els.push(caption('Text is left aligned, so the right side never meets the pattern', R(33), X(0)));
  add('margin-compensation', page(BLACK, els));
}
// Compound Grid 1 — 35칸(6로우 × 5 + 거터 5) · 47칸(6로우 × 7 + 거터 5)
function rowGridPage(top, left, w, h, N, rows, label) {
  const els = silhouette(top, left, w, h);
  const m = h / 24, u = (h - 2 * m) / N, per = (N + 1) / rows - 1;   // per = 로우당 칸 수
  els.push(...marginBands([top, left, w, h], m, NEON, 18));
  for (let i = 0; i <= N; i++) els.push(E.line(left + m, top + m + i * u, left + w - m, top + m + i * u, GRAY, 1, { dash: [1, 2], opacity: 60 }));
  for (let r = 0; r < rows; r++) els.push(E.rect(top + m + r * (per + 1) * u, left + m, w - 2 * m, per * u, NEON, 14));
  els.push(title(label, top, left, GRAY));
  return { els, m, u, per };
}
{
  const els = [];
  const T = R(5), PH = 700, PW = 495;
  els.push(...rowGridPage(T, X(0), PW, PH, 35, 6, '35 cells · 6 rows × 5 + 5 gutters').els);
  els.push(...rowGridPage(T, 1000, PW, PH, 47, 6, '47 cells · 6 rows × 7 + 5 gutters').els);
  els.push(tag('N = R × (n + 1) − 1', T + PH + 12, X(0), NEON, 400), tag('margin = height / 24 → settles at 1/22 – 1/25', T + PH + 36, X(0), GRAY, 500));
  add('grid-row', page(BLACK, els));
}
// Compound Grid 2 — 같은 35칸 위에 컬럼: 16:9 12컬럼 · A판형 6컬럼
function columns(top, left, w, h, m, u, n) {
  const g = u, cw = (w - 2 * m - (n - 1) * g) / n, out = [];
  for (let c = 0; c < n; c++) out.push(E.rect(top + m, left + m + c * (cw + g), cw, h - 2 * m, WHITE, 10));
  return out;
}
{
  const els = [];
  const wide = rowGridPage(R(7), X(0), 700, 394, 35, 6, '16:9 · 12 columns');
  els.push(...wide.els, ...columns(R(7), X(0), 700, 394, wide.m, wide.u, 12));
  const a = rowGridPage(R(5), 1234, 396, 560, 35, 6, 'A-series · 6 columns');
  els.push(...a.els, ...columns(R(5), 1234, 396, 560, a.m, a.u, 6));
  els.push(tag('column gutter = 1 Line Unit', R(29), X(0), NEON, 400));
  add('grid-column', page(BLACK, els));
}

// ── 차트 양식 ───────────────────────────────────────────────────────────────
const BLOCK = [R(0), R(12), R(24)];                            // 블록 윗선 50 · 386 · 722
const CX = X(2), CW = 656;                                     // 샘플 632 … 1288
const VX = X(7);                                               // 판정 1487
function block(els, i, verdict, good, specObj) {
  const top = BLOCK[i];
  els.push(E.rule(top, good ? GREEN : RED), E.label(verdict, top + U, VX, good ? GREEN : RED, COL, 2));
  if (specObj) els.push(E.spec(specObj, top + U, X(0)));
  return top + U;
}
// Don'ts — 카드(grid-3) 라 샘플 200%: H1 두 줄 + T1 세 줄, 세로 가운데. 룰 빨강 · 판정 = 어긴 것
const DT = R(8);                                               // 274: H1 280 + 56 + T1 168 = 504 → 274–778
const DB = DT + 2 * lead(LV.H1) * S + 2 * U;                   // 본문 윗선 610
function dont(n, verdict, fn, o = {}) {
  const els = [E.rule(DT - U, RED), E.label(verdict, DT, VX, RED, COL, 2)];
  const head = E.text('H1', DT, o.headLeft ?? CX, o.headW ?? CW, 2, o.headText ?? 'Build\rAnyway.', S, { ...o.head });
  const body = E.text('T1', DB, CX, CW, 3, o.bodyText ?? TXT.body, S, { ...o.body });
  if (fn) fn(els, head, body); else els.push(head, body);
  els.push(E.label(o.note ?? '200% scale', DB + 3 * lead(LV.T1) * S + U, CX, GRAY, 400));
  add(`dont-${n}`, page(GRAYBG, els));
}
dont(1, 'All caps', null, { headText: 'BUILD\rANYWAY.' });
dont(2, 'Light headline', null, { head: { font: PS[300] }, body: { font: PS[500] } });
dont(3, 'Tight leading', null, { head: { leading: 0.7 * size(LV.H1) } });
dont(4, 'Loose tracking', null, { head: { tracking: 120 }, body: { tracking: 120 } });
dont(5, 'Centered', null, { head: { just: 'center' }, body: { just: 'center' } });
dont(6, 'Too many levels', (els) => {
  let y = DT; for (const k of ['D2', 'H2', 'H3', 'T1', 'C1']) { els.push(E.text(k, y, CX, CW, 1, { D2: 'Build Anyway.', H2: 'Seed round', H3: 'Hacker houses', T1: TXT.body.slice(0, 52), C1: 'EO Studio · Nov 3, 2026' }[k], S)); y += lead(LV[k]) * S; }
});
dont(7, 'Two colors', null, { head: { ranges: [[6, 13, NEON]] } });
dont(8, 'Outline · stretch', null, { head: { stroke: WHITE, hscale: 135 } });
dont(9, 'Over the pattern', (els, head, body) => { const t = DT - U, h = GRID_B - t - U; els.push(E.rect(t, X(4), GRID_R - X(4), h, '#000000'), E.pattern(t, X(4), GRID_R - X(4), h, undefined, 'width'), head, body); }, { headText: 'Build Anyway.', headW: GRID_R - CX });
dont(10, 'Mono body', null, { head: { font: PS.mono }, body: { font: PS.mono } });
dont(11, 'KO at EN size', null, { bodyText: TXT.ko, body: { font: '__ko__' }, note: '200% scale · Pretendard should be 85%' });
dont(12, 'Other typeface', null, { head: { font: '__other__' }, body: { font: '__other__' } });

// ── ExtendScript ─────────────────────────────────────────────────────────
const js = v => JSON.stringify(v);
const jsx = `#target illustrator
(function () {
  var OUT = ${js(OUT)};
  var log = [];
  function say(s) { log.push(s); }
  function flush() { var f = new File(OUT + '/jsx-log.txt'); f.encoding = 'UTF-8'; f.open('w'); f.write(log.join(String.fromCharCode(10)) + String.fromCharCode(10)); f.close(); }
  function rgb(hex) { var c = new RGBColor(); c.red = parseInt(hex.substr(1, 2), 16); c.green = parseInt(hex.substr(3, 2), 16); c.blue = parseInt(hex.substr(5, 2), 16); return c; }
  var KO = ${js(KO_FONTS)}, OTHER = ${js(OTHER_FONT)};
  function fontList(list) { for (var i = 0; i < list.length; i++) { try { return app.textFonts.getByName(list[i]); } catch (e) {} } say('FONT MISSING ' + list.join('|')); return app.textFonts[0]; }
  function font(ps) { if (ps == '__ko__') return fontList(KO); if (ps == '__other__') return fontList(OTHER); return fontList([ps]); }
  function pasteSvg(file, doc, layer) {
    var svgDoc = app.open(new File(file));
    app.activeDocument = svgDoc; app.executeMenuCommand('selectall'); var n = svgDoc.selection.length; app.copy();
    svgDoc.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = doc; doc.activeLayer = layer; doc.selection = null;
    app.paste();
    var sel = doc.selection, grp = layer.groupItems.add();
    for (var s = sel.length - 1; s >= 0; s--) sel[s].move(grp, ElementPlacement.PLACEATBEGINNING);
    doc.selection = null;
    if (n == 0) say('svg empty: ' + file);
    return grp;
  }
  try {
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    var INTO = ${js(INTO)}, doc = null, openedHere = false;   // openedHere: 스크립트가 연 문서는 저장 뒤 닫음(이미 열려 있던 문서는 그대로 둠)
    if (INTO) {
      for (var d1 = 0; d1 < app.documents.length; d1++) if (app.documents[d1].fullName.fsName == INTO) doc = app.documents[d1];
      if (!doc) { doc = app.open(new File(INTO)); openedHere = true; }
      app.activeDocument = doc; say('into ' + INTO + ' (' + doc.artboards.length + ' artboards)');
    } else {
      // 다른 열린 문서는 절대 건드리지 않음. 저장 대상과 같은 경로의 문서가 열려 있고 저장돼 있을 때만 닫고(saveAs 충돌 방지), 저장 안 됐으면 중단.
      var TARGET = OUT + '/typo-layout.ai';
      for (var d2 = app.documents.length - 1; d2 >= 0; d2--) { var od = app.documents[d2]; var same = false; try { same = od.fullName.fsName == TARGET; } catch (x) {}
        if (same) { if (od.saved) od.close(SaveOptions.DONOTSAVECHANGES); else { say('ABORT: ' + TARGET + ' is open with unsaved changes'); flush(); return; } } }
      doc = app.documents.add(DocumentColorSpace.RGB, ${W}, ${H});
    }
    var ab0 = doc.artboards[0].artboardRect, L0 = ab0[0], T0 = ab0[1];
    // 레이어 참조는 인덱스 기반이라 레이어를 추가 · 재정렬하면 어긋남 → 쓸 때마다 이름으로 다시 찾음
    var has = function (n) { try { doc.layers.getByName(n); return true; } catch (x) { return false; } };
    var mk = function (n) { if (has(n)) return doc.layers.getByName(n); var L = doc.layers.add(); L.name = n; return L; };
    mk('content'); if (!has('bg')) mk('bg').zOrder(ZOrderMethod.SENDTOBACK); mk('guide');
    var lyr = function (n) { var L = doc.layers.getByName(n); L.visible = true; L.locked = false; return L; };
    // 기존 아트보드 이름 → 인덱스. 같은 이름이면 그 안의 content · bg · guide 항목을 지우고 다시 그림
    var abIndex = function (n) { for (var q = 0; q < doc.artboards.length; q++) if (doc.artboards[q].name == n) return q; return -1; };
    var clearArtboard = function (rect) {
      var L = ['content', 'bg', 'guide'];
      for (var li = 0; li < L.length; li++) { if (!has(L[li])) continue; var items = lyr(L[li]).pageItems;
        for (var p = items.length - 1; p >= 0; p--) { var gb; try { gb = items[p].geometricBounds; } catch (x) { continue; }
          var cx = (gb[0] + gb[2]) / 2, cy = (gb[1] + gb[3]) / 2; if (cx >= rect[0] && cx <= rect[2] && cy <= rect[1] && cy >= rect[3]) items[p].remove(); } }
    };
    var charts = ${js(charts)};
    var names = [], abIdx = [];
    var nextSlot = INTO ? doc.artboards.length : 0;           // 새 아트보드는 4열 격자의 다음 칸에
    for (var i = 0; i < charts.length; i++) {
      var ai = INTO ? abIndex(charts[i].name) : (i > 0 ? -1 : 0), rect, OX, OT;
      if (ai >= 0) { rect = doc.artboards[ai].artboardRect; OX = rect[0]; OT = rect[1]; if (INTO) clearArtboard(rect); }
      else {
        var slot = INTO ? nextSlot++ : i, col = slot % 4, row = Math.floor(slot / 4);
        OX = L0 + col * (${W} + 100); OT = T0 - row * (${H} + 100);
        rect = [OX, OT, OX + ${W}, OT - ${H}];
        doc.artboards.add(rect); ai = doc.artboards.length - 1;
      }
      doc.artboards[ai].name = charts[i].name;                // 아트보드 이름 = 장표(이미지 토큰) 이름
      names.push(charts[i].name); abIdx.push(ai);
      var gl = lyr('guide');
      for (var gc = 0; gc < ${COLS}; gc++) for (var gr = 0; gr < 35; gr++) { if (gr % 6 == 5) continue; var g = gl.pathItems.rectangle(OT - (${Y0} + gr * ${U}), OX + ${X0} + gc * ${COL + GUT}, ${COL}, ${U}); g.filled = false; g.stroked = true; g.strokeWidth = 0.25; g.strokeColor = rgb('#6ec6d2'); g.guides = true; }
      var els = charts[i].els;
      try {
        for (var j = 0; j < els.length; j++) {
          var e = els[j];
          if (e.kind == 'rect') {
            var r = lyr(j == 0 ? 'bg' : 'content').pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h); r.filled = true; r.fillColor = rgb(e.fill); r.stroked = false; if (e.opacity != null) r.opacity = e.opacity;
            continue;
          }
          if (e.kind == 'line') {
            var ln = lyr('content').pathItems.add(); ln.setEntirePath([[OX + e.x1, OT - e.y1], [OX + e.x2, OT - e.y2]]); ln.filled = false; ln.stroked = true; ln.strokeWidth = e.width; ln.strokeColor = rgb(e.stroke); ln.strokeCap = StrokeCap.BUTTENDCAP;
            if (e.dash) ln.strokeDashes = e.dash; if (e.opacity != null) ln.opacity = e.opacity;
            continue;
          }
          if (e.kind == 'pattern') {
            var content = lyr('content');
            var pg = pasteSvg(${js(PATTERN_SVG)}, doc, content); pg.name = 'pattern';
            var pb = pg.geometricBounds, ph = pb[1] - pb[3];
            var pw0 = pb[2] - pb[0];
            var sc = (e.fit == 'width' ? e.w / pw0 : e.h / ph) * 100; pg.resize(sc, sc, true, true, true, true, 100, Transformation.TOPLEFT);
            pb = pg.geometricBounds; var pw = pb[2] - pb[0], ph2 = pb[1] - pb[3];
            pg.position = [OX + e.left - (pw - e.w) / 2, OT - e.top - (e.h - ph2) / 2];
            var clip = content.pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h); clip.filled = false; clip.stroked = false;
            var cg = content.groupItems.add(); cg.name = 'pattern clip';
            pg.move(cg, ElementPlacement.PLACEATBEGINNING); clip.move(cg, ElementPlacement.PLACEATBEGINNING); clip.clipping = true; cg.clipped = true;
            if (e.opacity != null) cg.opacity = e.opacity;
            continue;
          }
          var cl = lyr('content');
          var rr = cl.pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h);
          var tf = cl.textFrames.areaText(rr);
          tf.contents = e.text;
          var ca = tf.textRange.characterAttributes;
          ca.textFont = font(e.font); ca.size = e.size; ca.autoLeading = false; ca.leading = e.leading; ca.tracking = e.tracking; ca.fillColor = rgb(e.fill);
          if (e.hscale) ca.horizontalScale = e.hscale;
          if (e.stroke) { ca.strokeColor = rgb(e.stroke); ca.strokeWeight = Math.max(1, e.size / 40); ca.fillColor = rgb(${js(GRAYBG)}); }
          try { tf.textRange.paragraphAttributes.hyphenation = false; } catch (x) {}
          if (e.just == 'center') try { tf.textRange.paragraphAttributes.justification = Justification.CENTER; } catch (x) {}
          if (e.just == 'right') try { tf.textRange.paragraphAttributes.justification = Justification.RIGHT; } catch (x) {}
          try { tf.firstBaseline = e.first == 'cap' ? FirstBaselineType.BASELINECAPHEIGHT : FirstBaselineType.BASELINEEMBOXHEIGHT; tf.firstBaselineMin = 0; } catch (x) { say('firstBaseline: ' + x); }
          for (var k = 0; k < (e.ranges || []).length; k++) { var rg = e.ranges[k]; for (var c = rg[0]; c < rg[1] && c < tf.characters.length; c++) tf.characters[c].characterAttributes.fillColor = rgb(rg[2]); }
          if (e.lvl) say(charts[i].name + ' ' + e.lvl + ' lines=' + tf.lines.length + ' size=' + e.size.toFixed(1) + ' box=' + e.w + 'x' + e.h);
        }
      } catch (ex) { say('ERROR in ' + charts[i].name + ': ' + ex + ' line ' + ex.line); }
    }
    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true; opts.transparency = false; opts.antiAliasing = true; opts.horizontalScale = 100; opts.verticalScale = 100;
    lyr('guide').visible = false;
    doc.activeLayer = lyr('content');                          // 활성 레이어가 숨긴 guide 로 남으면 Type 툴이 금지 커서가 됨
    for (var a = 0; a < names.length; a++) { doc.artboards.setActiveArtboardIndex(abIdx[a]); doc.exportFile(new File(OUT + '/' + names[a] + '.png'), ExportType.PNG24, opts); }
    say('exported ' + names.length + ' png');
    if (INTO) { try { doc.save(); say('saved ' + INTO); if (openedHere) { doc.close(SaveOptions.DONOTSAVECHANGES); say('closed (opened by script)'); } } catch (x) { say('save failed: ' + x); } }
    else { try { doc.saveAs(new File(OUT + '/typo-layout.ai')); say('saved typo-layout.ai'); } catch (x) { say('save failed: ' + x); } }
    say('DONE');
  } catch (err) { say('ERROR ' + err + ' line ' + err.line); }
  try { app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS; } catch (x) {}   // 스크립트가 끈 경고 표시를 원래대로
  flush();
})();
`;
const jsxPath = path.join(OUT, 'typo-layout.jsx');
fs.writeFileSync(jsxPath, '\ufeff' + jsx);   // BOM: #include 가 UTF-8 로 읽게(없으면 ' · ' 가 깨진 글자로 나올 수 있음)
console.log('wrote', jsxPath, `(${charts.length} artboards, pattern ${PATTERN})`);

if (run) {
  try { fs.unlinkSync(path.join(OUT, 'jsx-log.txt')); } catch {}
  const script = `with timeout of 900 seconds\n tell application id "com.adobe.illustrator" to do javascript "#include \\"${jsxPath}\\""\nend timeout`;
  execFileSync('osascript', ['-e', script], { stdio: 'inherit' });
  const logFile = path.join(OUT, 'jsx-log.txt');
  console.log(fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '(no jsx-log.txt — script did not reach flush)');
  // tonal-value: 윗줄 스택에서 레벨별 평균 휘도를 재고(json), 아랫줄 스택만 블러 (라벨은 그대로)
  const f = path.join(OUT, 'tonal-value.png');
  if (fs.existsSync(f)) {
    const sharp = (await import('sharp')).default;
    const buf = await sharp(f).png().toBuffer();
    const luma = { scaled: [], preset: [] };
    for (const bx of TONAL.boxes) {
      const st = await sharp(buf).extract({ left: Math.round(bx.left), top: Math.round(bx.top), width: Math.round(bx.w), height: Math.round(bx.h) }).stats();
      const [r, g, b] = st.channels.map(c => c.mean);
      luma[bx.col].push(100 * (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255);
    }
    const prev = fs.existsSync(LUMA_FILE) ? fs.readFileSync(LUMA_FILE, 'utf8') : '';
    const next = JSON.stringify(luma);
    fs.writeFileSync(LUMA_FILE, next);
    console.log('tonal luma', lumaLine(luma.scaled), '|', lumaLine(luma.preset));
    const changed = !prev || JSON.parse(prev).scaled.map(Math.round).join() !== luma.scaled.map(Math.round).join() || JSON.parse(prev).preset.map(Math.round).join() !== luma.preset.map(Math.round).join();
    if ((changed || !LUMA) && !process.env.TONAL_PASS2) {
      console.log('luma changed → second pass to put the numbers on the slide');
      execFileSync(process.execPath, [process.argv[1], ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, TONAL_PASS2: '1' } });
      process.exit(0);
    }
    const region = { left: TONAL.left - 14, top: TONAL.blur.top - 14, width: X(7) + COL - TONAL.left + 28, height: TONAL.blur.bottom - TONAL.blur.top + 28 };
    const blurred = await sharp(buf).extract(region).blur(6).png().toBuffer();
    await sharp(buf).composite([{ input: blurred, left: region.left, top: region.top }]).png().toFile(f + '.tmp.png');
    fs.renameSync(f + '.tmp.png', f);
    console.log('blurred tonal-value stacks');
  }
}
