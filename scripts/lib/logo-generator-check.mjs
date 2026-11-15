/**
 * 로고 생성기(public/tools/logo-generator/) 회귀 검사 — npm test 의 [5]
 *   a. geom.js 의 GEOM 블록(/*GEOM-START*\/ … /*GEOM-END*\/)을 함께 둔 polygon-clipping 과 node vm 에서 돌려 확정 수치를 고정:
 *      다크 심볼 총높이 1.1H (H + 2/30H + 2/60H) · 다크 간격 3/30H · 라이트 폭(regular) · 오른쪽 클리어스페이스 식(가이드 Symbol › Clearspace)
 *   b. app.js 의 HEX · CMYK 가 국문 가이드 Color 스와치와 같은지 (팔레트 7색)
 *   c. tokens.css 팔레트(--c-*) = 가이드 tokens.css · 참조하는 토큰이 모두 정의됨
 *   d. app.js RULES 블록(크기 구간 · 경계 · 시그니처 규격 · 면적 상한)의 가이드 수치
 *   e. 생성기가 쓰는 서체 파일 ⊂ 가이드 src/styles/fonts.css
 *   f. app.js SIG_INIT(시그니처 처음 값) — 크기는 그 형의 최적 구간 안 · 키와 자리는 목업 표(ART)에 있는 것 (값 자체는 프리셋이라 고정하지 않음)
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
  checks.push(['다크 총높이 = 1 + 2/30 + 2/60 H', dark.box.h, 1 + 2 / 30 + 2 / 60]);
  checks.push(['라이트 높이 = 1H', reg.box.h, 1]);
  for (const S of [4, 20, 50]) checks.push([`오른쪽 클리어스페이스 S=${S} = 0.42 + 0.0012S`, frameOf(buildSymbol(S, 'light'), S, true, true).right, 0.42 + 0.0012 * S]);
  checks.push(['오른쪽 클리어스페이스 S=70 = H/2', frameOf(buildSymbol(70, 'light'), 70, true, true).right, 0.5]);
  const holeH = sym => { const r = sym.mp.find(p => p.length > 1)[1], ys = r.map(p => p[1]); return Math.max(...ys) - Math.min(...ys); };   // 팔각형 속 십자 구멍 높이
  for (const S of [4, 20]) checks.push([`다크 십자 = 라이트 − 2/60H (구멍은 키우지 않고 안으로 H/60) S=${S}`, holeH(buildSymbol(S, 'dark')), holeH(buildSymbol(S, 'light')) - 2 / 60]);
  const bad = checks.filter(([, got, want]) => !near(got, want));
  if (bad.length) for (const [name, got, want] of bad) fail(`생성기 ${name} — ${got.toFixed(4)} (기대 ${want.toFixed(4)})`);
  else ok(`생성기 지오메트리 ${checks.length}항목 (다크 총높이 · 라이트 높이 · 오른쪽 클리어스페이스 식 · 다크 십자)`);

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

  // c. 토큰 — tokens.css 팔레트(--c-*) = 가이드 tokens.css, tool.css · tokens.css · app.js 가 참조하는 var(--…) 는 모두 정의됨
  const noCmt = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const tok = noCmt(fs.readFileSync(path.join(dir, 'tokens.css'), 'utf8')), rules = noCmt(fs.readFileSync(path.join(dir, 'tool.css'), 'utf8'));
  const pal = s => Object.fromEntries([...s.matchAll(/(--c-[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)].map(m => [m[1], m[2].toLowerCase()]));
  const gPal = pal(noCmt(fs.readFileSync(path.join(ROOT, 'src/styles/tokens.css'), 'utf8'))), tPal = pal(tok);
  const palDiff = [...new Set([...Object.keys(gPal), ...Object.keys(tPal)])].filter(k => gPal[k] !== tPal[k]).map(k => `${k} ${tPal[k] ?? '없음'} ≠ 가이드 ${gPal[k] ?? '없음'}`);
  const defined = new Set([...(tok + rules).matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
  const RUNTIME = ['--art-fg', '--art-bg', '--zones', '--vis-mark'];   // JS 가 그때그때 넣는 값 (tool.css 머리 주석)
  const refs = [...(tok + rules + appSrc).matchAll(/var\((--[\w-]+)[,)]/g)].map(m => m[1]);
  const missing = [...new Set(refs)].filter(n => !defined.has(n) && !RUNTIME.includes(n));
  for (const d of palDiff) fail(`생성기 팔레트 ${d}`);
  if (missing.length) fail(`생성기 정의 안 된 토큰: ${missing.join(' · ')}`);
  if (!palDiff.length && !missing.length) ok(`생성기 토큰 — 팔레트 ${Object.keys(tPal).length}색 = 가이드 · 참조 ${new Set(refs).size}개 모두 정의됨`);

  // d. 브랜드 규칙 — app.js 의 RULES 블록(/*RULES-START*/ … /*RULES-END*/)을 따로 돌려 가이드 수치를 고정
  const rb = appSrc.match(/\/\*RULES-START\*\/([\s\S]*?)\/\*RULES-END\*\//);
  if (!rb) { fail('생성기 RULES 블록 표시를 찾을 수 없음'); return; }
  const rc = vm.createContext({});
  vm.runInContext(rb[1] + '\n;globalThis.__r = { RULES, SIG, ART_AREA_MAX, MM_MIN, MM_MAX, zoneOf };', rc);
  const R = rc.__r, pins = [
    ['구간 심볼', JSON.stringify(R.RULES.zones.symbol), JSON.stringify([[0, 'out'], [4, 'optimal'], [15, 'over'], [25, 'out'], [null]])],
    ['구간 가로형 시그니처', JSON.stringify(R.RULES.zones.sigH), JSON.stringify([[0, 'out'], [4, 'optimal'], [10, 'out'], [null]])],
    ['구간 세로형 시그니처', JSON.stringify(R.RULES.zones.sigV), JSON.stringify([[0, 'out'], [10, 'optimal'], [15, 'over'], [25, 'out'], [null]])],
    ['최소 보이는 높이', R.RULES.minVis, 4], ['슬라이더 범위', `${R.MM_MIN}-${R.MM_MAX}`, '4-30'], ['로고 면적 상한', R.ART_AREA_MAX, 0.1],
    ['세로형 em', R.SIG.v.em.toFixed(4), '0.4704'], ['세로형 다크 em', R.SIG.v.emDark, 0.48], ['세로형 다크 자간', R.SIG.v.trackDark, -10], ['세로형 drop', R.SIG.v.drop, 0.2], ['세로형 nudge', R.SIG.v.nudge, -0.01],
    ['가로형 em', R.SIG.h.em, 1.3], ['가로형 다크 em', R.SIG.h.emDark, 1.35], ['가로형 다크 자간', R.SIG.h.trackDark, -20], ['가로형 gapW', R.SIG.h.gapW, 0.5], ['가로형 lift', R.SIG.h.lift, 0.1],
    ['가로형 공백 자간', `${R.SIG.h.space}/${R.SIG.h.spaceDark}`, '-60/-70'], ['다크 글자 오프셋', R.SIG.darkOffset, 0.005],
    // 경계값 = 더 나은 구간 (상태 메시지와 슬라이더 색이 같게)
    ['경계 심볼 4 · 15 · 25 · 25.1', ['symbol', 4, 15, 25, 25.1].slice(1).map(S => R.zoneOf(R.RULES.zones.symbol, S)).join(), 'optimal,optimal,over,out'],
    ['경계 시그니처 10 · 10.01 (가로 · 가로 · 세로 10)', [R.zoneOf(R.RULES.zones.sigH, 10), R.zoneOf(R.RULES.zones.sigH, 10.01), R.zoneOf(R.RULES.zones.sigV, 10)].join(), 'optimal,out,optimal'],
  ];
  const off = pins.filter(([, got, want]) => got !== want);
  for (const [name, got, want] of off) fail(`생성기 규칙 ${name} — ${got} (기대 ${want})`);
  if (!off.length) ok(`생성기 브랜드 규칙 ${pins.length}항목 (크기 구간 · 경계 · 시그니처 규격 · 면적 상한)`);

  // f. 시그니처 처음 값 — SIG_INIT 블록과 목업 표(ART 블록)를 따로 돌려 대조. 크기가 최적 구간을 벗어나면 고르자마자 경고가 뜨고, 키 · 자리가 목업에 없으면 조용히 심볼 값으로 떨어지므로 여기서 잡음
  const ib = appSrc.match(/\/\*SIGINIT-START\*\/([\s\S]*?)\/\*SIGINIT-END\*\//), ab = appSrc.match(/\/\*ART-START\*\/([\s\S]*?)\/\*ART-END\*\//);
  if (!ib || !ab) fail('생성기 SIG_INIT · ART 블록 표시를 찾을 수 없음');
  else {
    const ic = vm.createContext({});
    vm.runInContext(ib[1] + '\n' + ab[1] + '\n;globalThis.__i = { SIG_INIT, ART };', ic);
    const { SIG_INIT, ART } = ic.__i, bad = [];
    const slotsOf = key => { const [m, c] = key.split(':'), a = ART[m]; return a && (a.d ? !c && a : a[c]) ? (a.d ? a : a[c]).slots : null; };   // 매체:콘텐츠 → 그 목업의 slots (인쇄 매체는 콘텐츠 없음)
    let n = 0;
    for (const [form, zones] of [['v', R.RULES.zones.sigV], ['h', R.RULES.zones.sigH]])
      for (const [key, [mm, where]] of Object.entries(SIG_INIT[form] || {})) {
        n++;
        const slots = slotsOf(key);
        if (!slots) { bad.push(`${form} '${key}' — 목업 표에 없는 매체:콘텐츠`); continue; }
        if (!slots[0][3].includes(where)) bad.push(`${form} '${key}' 자리 ${where} — 그 목업의 후보(${slots[0][3].join(' ')})에 없음`);
        if (R.zoneOf(zones, mm) !== 'optimal') bad.push(`${form} '${key}' ${mm}mm — ${form === 'v' ? '세로형' : '가로형'} 최적 구간 밖`);
      }
    for (const b of bad) fail(`생성기 시그니처 처음 값 ${b}`);
    if (!bad.length) ok(`생성기 시그니처 처음 값 ${n}칸 — 크기는 최적 구간 안 · 키와 자리는 목업 표에 있음`);
  }

  // e. 서체 — 생성기가 쓰는 woff2 가 가이드 fonts.css 에 선언된 파일인지 (public/fonts 공유, 이름이 어긋나면 생성기만 시스템 서체로 떨어짐)
  const files = s => new Set([...s.matchAll(/\/fonts\/([\w-]+\.woff2)/g)].map(m => m[1]));
  const gFonts = files(fs.readFileSync(path.join(ROOT, 'src/styles/fonts.css'), 'utf8'));
  const tFonts = files(['fonts.css', 'index.html', 'app.js'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n'));
  const strays = [...tFonts].filter(f => !gFonts.has(f));
  if (strays.length) fail(`생성기 서체 파일이 가이드 fonts.css 에 없음: ${strays.join(' · ')}`);
  else ok(`생성기 서체 ${tFonts.size}개 ⊂ 가이드 fonts.css`);
}
