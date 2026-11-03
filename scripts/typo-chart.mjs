/**
 * Linespacing · Letterspacing 차트 생성: node scripts/typo-chart.mjs [출력 폴더]
 *   기본 출력: ~/Downloads/temp/typography/<이름>.svg + .png  (→ npm run import -- typography)
 *
 * 장표 규칙(2026-11-03, 타이포 장표 11장에서 추출):
 *   1920×1080 · 4:3 세이프 영역 1440 중앙 · 마진 50 → 콘텐츠 x 290–1630, y 50–1030
 *   6컬럼 200px · 거터 28px · 행 28px × 35행 (grid.svg)
 *   1컬럼 판정 라벨 · 2컬럼 스펙 라벨 · 3–5컬럼 샘플(폭 656, 5컬럼 오른쪽 끝에서 클립)
 *   캡션은 전부 Founders Grotesk Mono 20px -7%, Medium Gray. 하이라이트만 Air White · Builder Neon.
 *   예시 장표라 배경은 Solid Gray. 샘플은 Air White, 행간은 레벨 배수 × 28px 로 고정하고 글자 크기 = 행간 ÷ Linespacing.
 * SVG 는 텍스트가 살아 있어 Illustrator 에서 열어 손볼 수 있고, PNG 는 설치된 Founders Grotesk 로 sharp 가 래스터합니다.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const OUT = (process.argv[2] ?? path.join(os.homedir(), 'Downloads', 'temp', 'typography')).replace(/^~(?=\/|$)/, os.homedir());

// ── 격자 ───────────────────────────────────────────────────────────────
const W = 1920, H = 1080, UNIT = 28, ROWS = 35;
const X = c => 290 + c * 228;           // 컬럼 c(0–5) 왼쪽
const Y = r => 50 + r * UNIT;           // 행 r(0–34) 위
const SAMPLE_X = X(2), SAMPLE_R = X(4) + 200, SAMPLE_W = SAMPLE_R - SAMPLE_X;   // 746 … 1402

// ── 색 · 서체 ───────────────────────────────────────────────────────────
const BG = '#2a2b2b', GRAY = '#8e8e8e', WHITE = '#fcfbf5', NEON = '#f9ee3a';
const SANS = 'Founders Grotesk', MONO = 'Founders Grotesk Mono';
const CAP = 0.70;                       // 캡 하이트(em) — 행 박스 안에서 대문자를 세로 중앙에
const CHAR_W = { 300: 0.384, 400: 0.395, 500: 0.413, mono: 0.570 };   // 평균 글자 폭(em), 실측(scripts 메모)
const CAPTION = { size: 20, ls: -0.07 };

// ── 레벨 · 변형 값 ────────────────────────────────────────────────────────
// multiple = 배수(x), ls = Linespacing 프리셋, lt = Letterspacing 프리셋(%), lines = 샘플 줄 수
const LEVELS = {
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
const VARIANTS = {
  linespacing:   { medium: [85, 100, 125], regular: [95, 115, 140], light: [110, 140, 180], mono: [90, 111, 140] },
  letterspacing: { medium: [-4, -1.5, 1], regular: [-3, -1, 1], light: [-1.5, 0.5, 3], mono: [-12, -7, 0] },
};
const VERDICT = ['Too tight', 'Preset', 'Too loose'];

// ── 도우미 ──────────────────────────────────────────────────────────────
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pct = v => `${v > 0 && String(v)[0] !== '+' ? '+' : ''}${v}%`;        // 자간은 부호 표기(+0.5%), 행간은 그대로
const fmtLs = v => `${v}%`;
const weightName = L => L.name.replace('Founders Grotesk ', '').replace('Mono Regular', 'Mn Regular');

function wrap(text, fs, charW, lsPx, maxW, maxLines) {
  const per = fs * charW + lsPx;
  const lines = []; let cur = '';
  for (const w of text.split(' ')) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length * per > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  return lines.slice(0, maxLines);
}
const caption = (x, y, parts, fill = GRAY) => {
  const spans = parts.map(p => typeof p === 'string' ? esc(p) : `<tspan fill="${p.fill}">${esc(p.t)}</tspan>`).join('');
  return `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${CAPTION.size}" letter-spacing="${CAPTION.ls * CAPTION.size}" fill="${fill}">${spans}</text>`;
};
const capBase = r => Y(r) + (UNIT + CAP * CAPTION.size) / 2;   // 행 r 안 캡션 베이스라인

// ── 장표 한 장 ────────────────────────────────────────────────────────────
function chart(kind, key) {
  const L = LEVELS[key];
  const values = VARIANTS[kind][key];
  const LH = L.multiple * UNIT;
  const blockH = L.lines * LH, gap = 2 * UNIT;
  const total = 3 * blockH + 2 * gap;
  const startRow = Math.round((ROWS - total / UNIT) / 2);
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
  out.push(`<rect width="${W}" height="${H}" fill="${BG}"/>`);
  out.push(`<defs><clipPath id="s"><rect x="${SAMPLE_X}" y="0" width="${SAMPLE_W}" height="${H}"/></clipPath></defs>`);
  // 머리: 0행 서체(화이트) · 1행 파트 + 레벨 범위(그레이)
  out.push(caption(X(0), capBase(0), [L.name], WHITE));
  out.push(caption(X(0), capBase(1), [`${kind === 'linespacing' ? 'Linespacing' : 'Letterspacing'} · ${L.range}`]));
  values.forEach((v, k) => {
    const top = Y(startRow) + k * (blockH + gap);
    const row = startRow + k * (blockH + gap) / UNIT;
    const preset = k === 1;
    const ls = kind === 'linespacing' ? v : L.ls;
    const lt = kind === 'letterspacing' ? v : L.lt;
    const fs = LH / (ls / 100);
    const lsPx = fs * lt / 100;
    // 1컬럼 판정
    out.push(caption(X(0), capBase(row), [VERDICT[k]], preset ? NEON : GRAY));
    // 2컬럼 스펙 두 줄, 변하는 값만 네온
    out.push(caption(X(1), capBase(row), [`${L.level} ${L.multiple}x`]));
    const spec = kind === 'linespacing'
      ? [`${weightName(L)} `, { t: fmtLs(ls), fill: NEON }, ` ${pct(lt)}`]
      : [`${weightName(L)} ${fmtLs(ls)} `, { t: pct(lt), fill: NEON }];
    out.push(caption(X(1), capBase(row + 1), spec));
    // 3–5컬럼 샘플
    const lines = wrap(L.text, fs, L.family === MONO ? CHAR_W.mono : CHAR_W[L.weight], lsPx, SAMPLE_W / 1.04, L.lines);
    out.push(`<g clip-path="url(#s)" font-family="${L.family}" font-weight="${L.weight}" font-size="${fs.toFixed(2)}" letter-spacing="${lsPx.toFixed(2)}" fill="${WHITE}">`);
    lines.forEach((t, i) => out.push(`<text x="${SAMPLE_X}" y="${(top + i * LH + (LH + CAP * fs) / 2).toFixed(2)}">${esc(t)}</text>`));
    out.push('</g>');
  });
  out.push('</svg>');
  return out.join('\n');
}

fs.mkdirSync(OUT, { recursive: true });
for (const kind of ['linespacing', 'letterspacing']) for (const key of Object.keys(LEVELS)) {
  const name = `${kind}-${key}`;
  const svg = chart(kind, key);
  fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, `${name}.png`));
  console.log('made', name);
}
console.log(`→ ${OUT}`);
