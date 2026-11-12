/**
 * 로고 생성기(public/tools/logo-generator/) 회귀 검사 — npm test 의 [5]
 *   a. geom.js 의 GEOM 블록(/*GEOM-START*\/ … /*GEOM-END*\/)을 함께 둔 polygon-clipping 과 node vm 에서 돌려 확정 수치를 고정:
 *      다크 심볼 총높이 1.0867H (H + 2/30H + 2/100H) · 다크 간격 3/30H · 라이트 폭(regular) · 오른쪽 클리어스페이스 식(가이드 Symbol › Clearspace)
 *   b. app.js 의 HEX · CMYK 가 국문 가이드 Color 스와치와 같은지 (팔레트 7색)
 * 생성기는 빌드 없는 단일 HTML 이라 여기서만 검사합니다. 실패 메시지는 fail(), 통과는 ok() 로 test.mjs 에 보고.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export function checkLogoGenerator(ROOT, { ok, fail }) {
  const dir = path.join(ROOT, 'public/tools/logo-generator');
  const geomSrc = fs.readFileSync(path.join(dir, 'geom.js'), 'utf8'), appSrc = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

  // a. GEOM
  const geo = geomSrc.match(/\/\*GEOM-START\*\/([\s\S]*?)\/\*GEOM-END\*\//);
  if (!geo) { fail('생성기 GEOM 블록 표시를 찾을 수 없음'); return; }
  const ctx = vm.createContext({ console });
  vm.runInContext(fs.readFileSync(path.join(dir, 'vendor/polygon-clipping/polygon-clipping.umd.min.js'), 'utf8'), ctx);
  vm.runInContext(geo[1] + '\n;globalThis.__g = { buildSymbol, frameOf };', ctx);
  const { buildSymbol, frameOf } = ctx.__g;
  const near = (a, b, tol = 2e-4) => Math.abs(a - b) <= tol;
  const checks = [];
  const reg = buildSymbol(20, 'light'), dark = buildSymbol(20, 'dark');
  checks.push(['다크 총높이 = 1 + 2/30 + 2/100 H', dark.box.h, 1 + 2 / 30 + 2 / 100]);
  checks.push(['라이트 높이 = 1H', reg.box.h, 1]);
  for (const S of [4, 20, 50]) checks.push([`오른쪽 클리어스페이스 S=${S} = 0.42 + 0.0012S`, frameOf(buildSymbol(S, 'light'), S, true, true).right, 0.42 + 0.0012 * S]);
  checks.push(['오른쪽 클리어스페이스 S=70 = H/2', frameOf(buildSymbol(70, 'light'), 70, true, true).right, 0.5]);
  const bad = checks.filter(([, got, want]) => !near(got, want));
  if (bad.length) for (const [name, got, want] of bad) fail(`생성기 ${name} — ${got.toFixed(4)} (기대 ${want.toFixed(4)})`);
  else ok(`생성기 지오메트리 ${checks.length}항목 (다크 총높이 · 라이트 높이 · 오른쪽 클리어스페이스 식)`);

  // b. HEX · CMYK ↔ 가이드 스와치
  const md = fs.readFileSync(path.join(ROOT, 'content/guide.ko.md'), 'utf8');
  const sw = {};
  for (const m of md.matchAll(/^\[swatch\]\s*([^|]+?)\s*\|\s*(#[0-9A-Fa-f]{6})\s*\|[^|]*\|\s*C(\d+)\s*M(\d+)\s*Y(\d+)\s*K(\d+)/gm)) sw[m[1]] = { hex: m[2].toUpperCase(), cmyk: [m[3], m[4], m[5], m[6]].map(Number) };
  const hexSrc = appSrc.match(/const HEX = (\{[^}]*\})/), cmykSrc = appSrc.match(/const CMYK = (\{[^}]*\})/);
  if (!hexSrc || !cmykSrc) { fail('생성기 HEX · CMYK 표를 찾을 수 없음'); return; }
  const HEX = vm.runInNewContext(`(${hexSrc[1]})`), CMYK = vm.runInNewContext(`(${cmykSrc[1]})`);
  const diffs = [];
  for (const [name, v] of Object.entries(sw)) {
    if (HEX[name]?.toUpperCase() !== v.hex) diffs.push(`${name} HEX ${HEX[name]} ≠ 가이드 ${v.hex}`);
    if (JSON.stringify(CMYK[name]) !== JSON.stringify(v.cmyk)) diffs.push(`${name} CMYK ${CMYK[name]} ≠ 가이드 ${v.cmyk}`);
  }
  if (Object.keys(sw).length < 7) diffs.push(`가이드 스와치를 ${Object.keys(sw).length}개만 읽음 (7색 기대)`);
  if (diffs.length) for (const d of diffs) fail(`생성기 ${d}`);
  else ok(`생성기 HEX · CMYK = 가이드 스와치 (${Object.keys(sw).length}색)`);
}
