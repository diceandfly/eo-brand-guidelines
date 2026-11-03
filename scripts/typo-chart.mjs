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

import { W, H, UNIT, ROWS, X, Y, SAMPLE_X, SAMPLE_R, SAMPLE_W, BG, GRAY, WHITE, NEON, SANS, MONO, CAP, CHAR_W, CAPTION, LEVELS, VARIANTS, VERDICT } from './lib/typo-chart-spec.mjs';

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
  const spans = parts.map(p => typeof p === 'string' ? esc(p) : p.br ? `<tspan x="${x}" dy="${UNIT}">` : `<tspan fill="${p.fill}">${esc(p.t)}</tspan>`).join('') + (parts.some(p => p.br) ? '</tspan>' : '');
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
    const spec = kind === 'linespacing'
      ? [`${weightName(L)} `, { t: fmtLs(ls), fill: NEON }, ` ${pct(lt)}`]
      : [`${weightName(L)} ${fmtLs(ls)} `, { t: pct(lt), fill: NEON }];
    out.push(caption(X(1), capBase(row), [`${L.level} ${L.multiple}x`, { br: true }, ...spec]));
    // 3–5컬럼 샘플
    const lines = wrap(L.text, fs, L.family === MONO ? CHAR_W.mono : CHAR_W[L.weight], lsPx, SAMPLE_W / 1.04, L.lines);
    // 샘플은 텍스트 오브젝트 하나: 줄은 tspan, 행간은 dy(= 레벨 행간)로 — Illustrator 에서 열면 한 텍스트 박스에 행간 파라미터로 들어감
    const base = (top + (LH + CAP * fs) / 2).toFixed(2);
    const tspans = lines.map((t, i) => `<tspan x="${SAMPLE_X}" dy="${i ? LH : 0}">${esc(t)}</tspan>`).join('');
    out.push(`<text clip-path="url(#s)" x="${SAMPLE_X}" y="${base}" font-family="${L.family}" font-weight="${L.weight}" font-size="${fs.toFixed(2)}" letter-spacing="${lsPx.toFixed(2)}" fill="${WHITE}">${tspans}</text>`);
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
