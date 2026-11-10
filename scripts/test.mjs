/**
 * 스모크 테스트: npm test   (빌드 없이 순수 Node. 마지막에 astro check 만 따로 돌림)
 *
 * 실패(종료 코드 1)로 보는 것
 *   1. 파서 경고 — 두 md(content/guide.ko.md · guide.en.md)를 파싱해 경고(없는 레이아웃 · 모르는 플래그 · 깨진 참조 …)가 0 이어야 함.
 *      astro build 는 같은 경고를 오류로 멈추므로(src/lib/content.ts) 여기서 먼저 잡힙니다.
 *   2. 플레이스홀더 수 — 파일이 없어 플레이스홀더로 나오는 이미지가 아래 MAX_PLACEHOLDERS 보다 많으면 (이미지가 끊긴 것).
 *      이미지를 채워 수가 줄면 통과하고, 줄었다고 알려 줍니다 → 그때 MAX_PLACEHOLDERS 를 낮춰 두세요.
 *   3. 모션 대체값 — src/lib/motion.ts 의 ms() · num() · easeOf() 대체값이 tokens.css 값과 같아야 함 (토큰을 못 읽어도 같은 모션).
 *   4. astro check — 타입 오류 0.
 * 리포트만 하는 것 (실패 아님)
 *   - EN/KO 구조 패리티: 페이지 목록, 페이지별 섹션 헤드 수 · 순서, 이미지 토큰 순서. 영문은 국문과 구조가 다를 수 있음.
 *   - 폰트 파일: public/fonts 에 빠진 woff2 (scripts/lib/check-fonts.mjs, 빌드도 경고).
 *
 * 옵션: --no-check  astro check 를 건너뜀 (빠르게 돌릴 때)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadGuide, LANGS } from '../src/lib/guide.ts';
import { parseTokens } from '../src/lib/tokens.ts';
import { checkFonts } from './lib/check-fonts.mjs';

const ROOT = process.cwd();
const MAX_PLACEHOLDERS = { ko: 11, en: 11 };   // 2026-11-10 기준. 이미지를 채우면 낮출 것

let failed = 0;
const fail = msg => { failed++; console.log(`  ✗ ${msg}`); };
const ok = msg => console.log(`  ✓ ${msg}`);
const note = msg => console.log(`  · ${msg}`);

const tokensCss = fs.readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8');
const tokens = parseTokens(tokensCss);

// ── 1 · 2. 파싱 · 경고 · 플레이스홀더 ─────────────────────────────────────────
console.log('\n[1] 파서 경고 · [2] 플레이스홀더');
const guides = {};
for (const lang of LANGS) {
  const warnings = [];
  const origWarn = console.warn;
  console.warn = () => {};                                     // 경고는 아래에서 모아 보여 줌
  try { guides[lang] = loadGuide(lang, fs.readFileSync(path.join(ROOT, 'content', `guide.${lang}.md`), 'utf8'), tokens, { warnings }); }
  finally { console.warn = origWarn; }
  if (warnings.length) { fail(`guide.${lang}.md 경고 ${warnings.length}개`); for (const w of warnings) console.log(`      ${w}`); }
  else ok(`guide.${lang}.md 경고 0`);

  const images = guides[lang].chapters.flatMap(c => c.subs.flatMap(s => s.sections.flatMap(sec => sec.items.filter(it => it.kind === 'image'))));
  const holes = images.filter(it => !it.src);
  const max = MAX_PLACEHOLDERS[lang];
  if (holes.length > max) {
    fail(`guide.${lang}.md 플레이스홀더 ${holes.length} / ${images.length} — 기준 ${max} 보다 많음 (이미지가 끊겼거나 새 자리가 늘었음)`);
    for (const it of holes) console.log(`      assets/${it.path}`);
  } else ok(`guide.${lang}.md 플레이스홀더 ${holes.length} / ${images.length} (기준 ≤ ${max}${holes.length < max ? ` — 줄었습니다. scripts/test.mjs 의 MAX_PLACEHOLDERS.${lang} 를 ${holes.length} 로 낮추세요` : ''})`);
}

// ── 3. 모션 대체값 = 토큰 ──────────────────────────────────────────────────
console.log('\n[3] motion.ts 대체값 ↔ tokens.css');
{
  const resolve = (name, depth = 0) => {                        // var(--x) 를 따라감
    const v = tokens.get(name);
    if (v === undefined || depth > 8) return undefined;
    const m = v.match(/^var\((--[a-z0-9-]+)\)$/i);
    return m ? resolve(m[1], depth + 1) : v;
  };
  const seconds = raw => { const v = parseFloat(raw); return raw.trim().endsWith('ms') ? v / 1000 : v; };
  const src = fs.readFileSync(path.join(ROOT, 'src/lib/motion.ts'), 'utf8');
  let n = 0, bad = 0;
  for (const m of src.matchAll(/\b(ms|num|easeOf)\('(--[a-z0-9-]+)',\s*('([^']*)'|[\d.]+)\)/g)) {
    const [, fn, name, lit, str] = m;
    const tok = resolve(name);
    n++;
    if (tok === undefined) { bad++; fail(`${fn}('${name}') — tokens.css 에 없는 토큰`); continue; }
    const same = fn === 'easeOf' ? tok.replace(/\s+/g, '') === str.replace(/\s+/g, '')
      : fn === 'ms' ? Math.abs(seconds(tok) - parseFloat(lit)) < 1e-9
      : Math.abs(parseFloat(tok) - parseFloat(lit)) < 1e-9;
    if (!same) { bad++; fail(`${fn}('${name}', ${lit}) — 토큰은 ${tok}`); }
  }
  if (!bad) ok(`대체값 ${n}개 모두 토큰과 같음`);
}

// ── 리포트: EN/KO 구조 패리티 ─────────────────────────────────────────────
console.log('\n[리포트] EN/KO 구조 패리티 (국문 기준, 실패 아님)');
{
  const pages = g => new Map(g.chapters.flatMap(c => c.subs.map(s => [`${c.slug}/${s.slug}`, s])));
  const ko = pages(guides.ko), en = pages(guides.en);
  const onlyKo = [...ko.keys()].filter(k => !en.has(k)), onlyEn = [...en.keys()].filter(k => !ko.has(k));
  if (onlyKo.length) note(`국문에만 있는 페이지: ${onlyKo.join(', ')}`);
  if (onlyEn.length) note(`영문에만 있는 페이지: ${onlyEn.join(', ')}`);
  if ([...ko.keys()].join() !== [...en.keys()].filter(k => ko.has(k)).join() && !onlyKo.length && !onlyEn.length) note('페이지 순서가 다름');
  let same = 0;
  for (const [key, k] of ko) {
    const e = en.get(key);
    if (!e) continue;
    const diffs = [];
    const kh = k.sections.map(s => s.head + (s.subhead ? ` / ${s.subhead}` : '')), eh = e.sections.map(s => s.head + (s.subhead ? ` / ${s.subhead}` : ''));
    if (kh.length !== eh.length) diffs.push(`섹션 수 ${kh.length} ≠ ${eh.length}`);
    else { const i = kh.findIndex((h, j) => h !== eh[j]); if (i >= 0) diffs.push(`섹션 ${i + 1}번째 헤드 "${kh[i]}" ≠ "${eh[i]}"`); }
    const kt = k.sections.flatMap(s => s.items.filter(it => it.kind === 'image').map(it => it.token));
    const et = e.sections.flatMap(s => s.items.filter(it => it.kind === 'image').map(it => it.token));
    if (kt.join() !== et.join()) {
      const i = kt.findIndex((t, j) => t !== et[j]);
      diffs.push(`이미지 ${kt.length} vs ${et.length}${i >= 0 ? `, ${i + 1}번째부터 다름 (${kt[i]} ≠ ${et[i] ?? '없음'})` : ''}`);
    }
    if (diffs.length) note(`${key}: ${diffs.join(' · ')}`); else same++;
  }
  note(`구조가 같은 페이지 ${same} / ${ko.size}`);
}

// ── 리포트: 폰트 파일 ─────────────────────────────────────────────────────
console.log('\n[리포트] 폰트 파일 (실패 아님)');
for (const r of checkFonts(ROOT)) note(`${r.css}: ${r.total - r.missing.length} / ${r.total}${r.missing.length ? ` — 빠짐 ${r.missing.length}. ${r.fix}` : ''}`);

// ── 4. astro check ──────────────────────────────────────────────────────
if (!process.argv.includes('--no-check')) {
  console.log('\n[4] astro check');
  const r = spawnSync('npx', ['astro', 'check'], { cwd: ROOT, encoding: 'utf8' });
  const summary = (r.stdout + r.stderr).match(/- (\d+) errors?[\s\S]*?- (\d+) warnings?/);
  if (r.status !== 0) { fail(`astro check 실패 (종료 코드 ${r.status})`); console.log((r.stdout + r.stderr).split('\n').filter(l => /error/i.test(l)).slice(0, 20).map(l => `      ${l}`).join('\n')); }
  else ok(`astro check 통과${summary ? ` (오류 ${summary[1]} · 경고 ${summary[2]})` : ''}`);
}

console.log(failed ? `\n실패 ${failed}건` : '\n모두 통과');
process.exit(failed ? 1 : 0);
