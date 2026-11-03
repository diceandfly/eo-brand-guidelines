/**
 * Linespacing · Letterspacing 차트를 Illustrator 에서 직접 만들기: node scripts/typo-chart-ai.mjs [--run] [출력 폴더]
 *   같은 스펙(scripts/lib/typo-chart-spec.mjs)으로 ExtendScript(.jsx)를 써 두고, --run 이면 osascript 로 Illustrator 에 실행시킵니다.
 *   결과: <출력 폴더>/typo-charts.jsx · typo-charts.ai(아트보드 8개) · <이름>.png 8장 · jsx-log.txt
 *   기본 출력 폴더: ~/Downloads/temp/typography  (→ npm run import -- typography)
 *
 * SVG 생성기(typo-chart.mjs)와 다른 점: 모든 글이 격자 셀에 맞춘 영역 텍스트 박스 하나씩이라
 * Illustrator 에서 줄바꿈이 자동으로 흐르고, 행간 · 자간 · 색이 문자 서식(파라미터)으로 들어갑니다.
 * 박스 규칙: 네 변이 격자선(컬럼 200 · 행 28)에 물리고, 첫 베이스라인은 캡 하이트(대문자 윗선이 박스 윗변에 닿음).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { W, H, UNIT, X, Y, SAMPLE_X, SAMPLE_W, BG, GRAY, WHITE, NEON, MONO, CAPTION, LEVELS, VARIANTS, VERDICT } from './lib/typo-chart-spec.mjs';

const args = process.argv.slice(2);
const run = args.includes('--run');
const OUT = (args.find(a => !a.startsWith('--')) ?? path.join(os.homedir(), 'Downloads', 'temp', 'typography')).replace(/^~(?=\/|$)/, os.homedir());
fs.mkdirSync(OUT, { recursive: true });

const PS = { 300: 'FoundersGrotesk-Light', 400: 'FoundersGrotesk-Regular', 500: 'FoundersGrotesk-Medium', mono: 'FoundersGroteskMono-Regular' };
const ROWS_TOTAL = 35;
const rowsFor = (fs_, lh, n) => Math.ceil((0.9 * fs_ + (n - 1) * lh) / UNIT);   // 캡 하이트 시작 + 마지막 줄 디센더까지 담는 행 수
const js = s => JSON.stringify(s);

// ── 장표 하나의 요소 목록 (좌표는 장표 기준 px) ─────────────────────────
function elements(kind, key) {
  const L = LEVELS[key];
  const values = VARIANTS[kind][key];
  const LH = L.multiple * UNIT;
  const blockRows = Math.max(L.lines * LH / UNIT, rowsFor(LH / (Math.min(...(kind === 'linespacing' ? values : [L.ls])) / 100), LH, L.lines));
  const blockH = blockRows * UNIT, gap = 2 * UNIT;
  const total = 3 * blockH + 2 * gap;
  const startRow = Math.round((ROWS_TOTAL - total / UNIT) / 2);
  const cap = { font: PS.mono, size: CAPTION.size, leading: UNIT, tracking: CAPTION.ls * 1000 };
  const kindName = kind === 'linespacing' ? 'Linespacing' : 'Letterspacing';
  const weightName = L.name.replace('Founders Grotesk ', '').replace('Mono Regular', 'Mn Regular');
  const els = [];
  // 머리: 서체 이름(화이트) + 파트 · 레벨 범위(그레이) — 박스 하나, 1컬럼부터 4컬럼 폭
  const head1 = L.name, head2 = `${kindName} · ${L.range}`;
  els.push({ top: Y(0), left: X(0), w: 4 * 228 - 28, h: 2 * UNIT, text: `${head1}\r${head2}`, ...cap, fill: GRAY, ranges: [[0, head1.length, WHITE]] });
  values.forEach((v, k) => {
    const row = startRow + k * (blockRows + 2);
    const preset = k === 1;
    const ls = kind === 'linespacing' ? v : L.ls;
    const lt = kind === 'letterspacing' ? v : L.lt;
    const fsz = LH / (ls / 100);
    const sign = n => (n > 0 ? '+' : '') + n;
    // 1컬럼 판정
    els.push({ top: Y(row), left: X(0), w: 200, h: UNIT, text: VERDICT[k], ...cap, fill: preset ? NEON : GRAY, ranges: [] });
    // 2컬럼 스펙 두 줄 — 변하는 값만 네온
    const l1 = `${L.level} ${L.multiple}x`;
    const vLs = `${ls}%`, vLt = `${sign(lt)}%`;
    const l2 = `${weightName} ${vLs} ${vLt}`;
    const hot = kind === 'linespacing' ? vLs : vLt;
    const at = l1.length + 1 + l2.lastIndexOf(hot);
    els.push({ top: Y(row), left: X(1), w: SAMPLE_X - X(1), h: 2 * UNIT, text: `${l1}\r${l2}`, ...cap, fill: GRAY, ranges: [[at, at + hot.length, NEON]] });
    // 3–5컬럼 샘플 — 영역 텍스트 하나, 자동 줄바꿈, 행간 = 레벨 행간
    els.push({ top: Y(row), left: SAMPLE_X, w: SAMPLE_W, h: blockH, text: L.text, font: L.family === MONO ? PS.mono : PS[L.weight], size: fsz, leading: LH, tracking: lt * 10, fill: WHITE, ranges: [], sample: true });
  });
  return els;
}

// ── ExtendScript 생성 ─────────────────────────────────────────────────
const charts = [];
for (const kind of ['linespacing', 'letterspacing']) for (const key of Object.keys(LEVELS)) charts.push({ name: `${kind}-${key}`, els: elements(kind, key) });

const jsx = `#target illustrator
(function () {
  var OUT = ${js(OUT)};
  var log = [];
  function say(s) { log.push(s); }
  function flush() { var f = new File(OUT + '/jsx-log.txt'); f.encoding = 'UTF-8'; f.open('w'); f.write(log.join(String.fromCharCode(10))); f.close(); }
  function rgb(hex) { var c = new RGBColor(); c.red = parseInt(hex.substr(1, 2), 16); c.green = parseInt(hex.substr(3, 2), 16); c.blue = parseInt(hex.substr(5, 2), 16); return c; }
  function font(ps) { try { return app.textFonts.getByName(ps); } catch (e) { say('FONT MISSING ' + ps); return app.textFonts[0]; } }
  try {
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    for (var d = app.documents.length - 1; d >= 0; d--) if (app.documents[d].name == 'typo-charts.ai') app.documents[d].close(SaveOptions.DONOTSAVECHANGES);   // 이전 실행 결과는 닫고 새로
    var doc = app.documents.add(DocumentColorSpace.RGB, ${W}, ${H});
    var ab0 = doc.artboards[0].artboardRect;   // [left, top, right, bottom]
    var L0 = ab0[0], T0 = ab0[1];
    var charts = ${js(charts.map(c => ({ name: c.name, els: c.els })))};
    var names = [];
    for (var i = 0; i < charts.length; i++) {
      var col = i % 4, row = Math.floor(i / 4);
      var OX = L0 + col * (${W} + 200), OT = T0 - row * (${H} + 200);
      if (i > 0) doc.artboards.add([OX, OT, OX + ${W}, OT - ${H}]);
      names.push(charts[i].name);
      var bg = doc.pathItems.rectangle(OT, OX, ${W}, ${H});
      bg.filled = true; bg.fillColor = rgb(${js(BG)}); bg.stroked = false; bg.name = 'bg';
      var els = charts[i].els;
      for (var j = 0; j < els.length; j++) {
        var e = els[j];
        var r = doc.pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h);
        var tf = doc.textFrames.areaText(r);
        tf.contents = e.text;
        var ca = tf.textRange.characterAttributes;
        ca.textFont = font(e.font); ca.size = e.size; ca.autoLeading = false; ca.leading = e.leading; ca.tracking = e.tracking; ca.fillColor = rgb(e.fill);
        try { tf.textRange.paragraphAttributes.hyphenation = false; } catch (x) { say('no hyphenation prop: ' + x); }
        try { tf.firstBaseline = FirstBaselineType.BASELINECAPHEIGHT; tf.firstBaselineMin = 0; } catch (x) { say('no firstBaseline prop: ' + x); }
        for (var k = 0; k < e.ranges.length; k++) { var rg = e.ranges[k]; for (var c = rg[0]; c < rg[1]; c++) tf.characters[c].characterAttributes.fillColor = rgb(rg[2]); }
        if (e.sample) say(charts[i].name + ' sample lines=' + tf.lines.length + ' size=' + e.size.toFixed(1) + ' leading=' + e.leading + ' box=' + e.w + 'x' + e.h);
      }
    }
    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true; opts.transparency = false; opts.antiAliasing = true; opts.horizontalScale = 100; opts.verticalScale = 100;
    for (var a = 0; a < names.length; a++) {
      doc.artboards.setActiveArtboardIndex(a);
      doc.exportFile(new File(OUT + '/' + names[a] + '.png'), ExportType.PNG24, opts);
      say('exported ' + names[a] + '.png');
    }
    try { doc.saveAs(new File(OUT + '/typo-charts.ai')); say('saved typo-charts.ai'); } catch (x) { say('save failed: ' + x); }
    say('DONE');
  } catch (err) { say('ERROR ' + err + ' line ' + err.line); }
  flush();
})();
`;
const jsxPath = path.join(OUT, 'typo-charts.jsx');
fs.writeFileSync(jsxPath, jsx);
console.log('wrote', jsxPath);

if (run) {
  try { fs.unlinkSync(path.join(OUT, 'jsx-log.txt')); } catch {}
  const script = `with timeout of 600 seconds\n tell application id "com.adobe.illustrator" to do javascript "#include \\"${jsxPath}\\""\nend timeout`;
  execFileSync('osascript', ['-e', script], { stdio: 'inherit' });
  const logFile = path.join(OUT, 'jsx-log.txt');
  console.log(fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '(no jsx-log.txt — script did not reach flush)');
}
