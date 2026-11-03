/**
 * Linespacing · Letterspacing 차트를 Illustrator 에서 직접 만들기
 *   node scripts/typo-chart-ai.mjs [--run] [--apply] [출력 폴더]
 *   같은 스펙(scripts/lib/typo-chart-spec.mjs)으로 ExtendScript(.jsx)를 써 두고, --run 이면 osascript 로 Illustrator 에 실행시킵니다.
 *   기본: 새 문서(아트보드 8개)를 만들어 PNG 8장 + typo-charts.ai 저장.
 *   --apply: 열려 있는(또는 폴더의) typo-charts.ai 안에서 1번 아트보드(사용자 수정본)는 그대로 두고 2–8번만 같은 양식으로 다시 만든 뒤 PNG 8장 내보내고 저장.
 *            1번의 가이드 격자 · 구분선(텍스트가 아닌 오브젝트)을 복제해 각 아트보드에 깔아 줍니다.
 *   기본 출력 폴더: ~/Downloads/temp/typography-ai  (→ npm run import -- typography ~/Downloads/temp/typography-ai)
 *
 * 장표 양식(2026-11-03, 사용자가 1번 아트보드에 잡아 둔 수정안에서 읽음):
 *   1920×1080 · 콘텐츠 x 290–1630, y 50–1030 · 8컬럼 143px + 거터 28 · 행 28px
 *   3블록 × 12행(336px). 블록 경계(386 · 722)에 Medium Gray 1pt 점선(1,2) 구분선. 글은 블록 윗선에서 한 행(28) 아래부터.
 *   1컬럼 판정(Too tight · Just right · Too loose, Just right 만 Bay Green) · 3컬럼 스펙 두 줄(폭 242, 변하는 값만 네온)
 *   · 5컬럼(974)부터 샘플. 상단 정보 캡션 없음.
 *   Linespacing 장표는 줄 사이 여백을 네온 15% 박스로 표시(줄 k+1 캡 윗선 위로 행간 − 0.8em, 샘플 컬럼 전체 폭, 레이어 'bg 2').
 *   캡션: Founders Grotesk Mono 20px · 행간 24 · 자간 -7% · Medium Gray, 첫 베이스라인 엠박스.
 *   샘플: 행간 = 레벨 배수 × 28 고정, 글자 크기 = 행간 ÷ Linespacing, 첫 베이스라인 캡 하이트,
 *         박스 폭은 글자 크기에 비례(같은 글이 세 변형에서 같은 자리에서 줄바꿈되도록), 줄 수 고정.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { W, H, UNIT, BG, GRAY, WHITE, NEON, MONO, LEVELS, VARIANTS } from './lib/typo-chart-spec.mjs';
const GREEN = '#66b88a';   // Bay Green — Just right (Do 색)

const args = process.argv.slice(2);
const run = args.includes('--run'), apply = args.includes('--apply');
const OUT = (args.find(a => !a.startsWith('--')) ?? path.join(os.homedir(), 'Downloads', 'temp', 'typography-ai')).replace(/^~(?=\/|$)/, os.homedir());
fs.mkdirSync(OUT, { recursive: true });

// ── 양식 ────────────────────────────────────────────────────────────────
const PS = { 300: 'FoundersGrotesk-Light', 400: 'FoundersGrotesk-Regular', 500: 'FoundersGrotesk-Medium', mono: 'FoundersGroteskMono-Regular' };
const X0 = 290, COL = 143, GUT = 28, X = c => X0 + c * (COL + GUT);          // 8컬럼: 290 461 632 803 974 1145 1316 1487
const TOP = 50, BLOCK = 12 * UNIT;                                            // 블록 윗선 50 · 386 · 722
const RIGHT = X0 + 8 * COL + 7 * GUT;                                         // 1630
const VERDICT = ['Too tight', 'Just right', 'Too loose'];
const CAPTION = { font: PS.mono, size: 20, leading: 24, tracking: -70 };
const LINES = { medium: 4, regular: 4, light: 6, mono: 8 };                  // 샘플 줄 수(블록 3 의 10행 안에 들어가는 범위)
const EM_HEAD = 627 / 87.5;                                                   // 헤드라인 샘플 폭(em) — 사용자 1번 아트보드 기준
const js = s => JSON.stringify(s);

function elements(kind, key) {
  const L = LEVELS[key];
  const values = VARIANTS[kind][key];
  const LH = L.multiple * UNIT;
  const useCaptions = kind === 'letterspacing' && L.captions;        // 캡션 서체는 자간 장표에서 문단 대신 캡션 여러 줄
  const n = useCaptions ? L.captions.length : LINES[key];
  const text = useCaptions ? L.captions.join('\r') : L.text;
  const sizes = values.map(v => LH / ((kind === 'linespacing' ? v : L.ls) / 100));
  const widthFor = L.multiple >= 2 ? fs_ => fs_ * EM_HEAD : fs_ => fs_ * (RIGHT - X(4)) / Math.max(...sizes);   // 본문·캡션은 가장 큰 변형이 꽉 차게
  const els = [];
  values.forEach((v, k) => {
    const top = TOP + k * BLOCK, y = top + UNIT;
    const ls = kind === 'linespacing' ? v : L.ls;
    const lt = kind === 'letterspacing' ? v : L.lt;
    const fsz = sizes[k];
    const sign = m => (m > 0 ? '+' : '') + m;
    if (k > 0) els.push({ rule: true, y: top });
    els.push({ top: y, left: X(0), w: 140, h: UNIT, text: VERDICT[k], ...CAPTION, fill: k === 1 ? GREEN : GRAY, ranges: [], first: 'em' });
    const l1 = `${L.level} ${L.multiple}x`;
    const vLs = `${ls}%`, vLt = `${sign(lt)}%`;
    const weightName = L.name.replace('Founders Grotesk ', '').replace('Mono Regular', 'Mn Regular');
    const l2 = `${weightName} ${vLs} ${vLt}`;
    const hot = kind === 'linespacing' ? vLs : vLt;
    const at = l1.length + 1 + l2.lastIndexOf(hot);
    els.push({ top: y, left: X(2), w: 242, h: 3 * UNIT, text: `${l1}\r${l2}`, ...CAPTION, fill: GRAY, ranges: [[at, at + hot.length, NEON]], first: 'em' });
    if (kind === 'linespacing') { const gh = LH - 0.8 * fsz; if (gh > 0.5) for (let q = 1; q < n; q++) els.push({ gap: true, top: y + q * LH - gh, left: X(4), w: RIGHT - X(4), h: gh }); }
    const w = Math.min(RIGHT - X(4), Math.round(widthFor(fsz)));
    const h = Math.ceil((0.7 * fsz + (n - 1) * LH) / UNIT) * UNIT;             // 마지막 베이스라인까지 담는 행 수
    els.push({ top: y, left: X(4), w: useCaptions ? RIGHT - X(4) : w, h, text, font: L.family === MONO ? PS.mono : PS[L.weight], size: fsz, leading: LH, tracking: lt * 10, fill: WHITE, ranges: [], first: 'cap', sample: true });
  });
  return els;
}

const charts = [];
for (const kind of ['linespacing', 'letterspacing']) for (const key of Object.keys(LEVELS)) charts.push({ name: `${kind}-${key}`, els: elements(kind, key) });

// ── ExtendScript ─────────────────────────────────────────────────────────
const jsx = `#target illustrator
(function () {
  var OUT = ${js(OUT)}, APPLY = ${apply};
  var log = [];
  function say(s) { log.push(s); }
  function flush() { var f = new File(OUT + '/jsx-log.txt'); f.encoding = 'UTF-8'; f.open('w'); f.write(log.join(String.fromCharCode(10))); f.close(); }
  function rgb(hex) { var c = new RGBColor(); c.red = parseInt(hex.substr(1, 2), 16); c.green = parseInt(hex.substr(3, 2), 16); c.blue = parseInt(hex.substr(5, 2), 16); return c; }
  function font(ps) { try { return app.textFonts.getByName(ps); } catch (e) { say('FONT MISSING ' + ps); return app.textFonts[0]; } }
  function inside(b, ab) { return !(b[2] < ab[0] - 1 || b[0] > ab[2] + 1 || b[1] < ab[3] - 1 || b[3] > ab[1] + 1); }
  try {
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    app.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
    var doc = null;
    if (APPLY) {
      for (var d = 0; d < app.documents.length; d++) if (app.documents[d].name == 'typo-charts.ai') doc = app.documents[d];
      if (!doc) doc = app.open(new File(OUT + '/typo-charts.ai'));
    } else {
      for (var d2 = app.documents.length - 1; d2 >= 0; d2--) if (app.documents[d2].name == 'typo-charts.ai') app.documents[d2].close(SaveOptions.DONOTSAVECHANGES);
      doc = app.documents.add(DocumentColorSpace.RGB, ${W}, ${H});
    }
    var ab0 = doc.artboards[0].artboardRect, L0 = ab0[0], T0 = ab0[1];
    var content, bgLayer;
    try { content = doc.layers.getByName('content'); } catch (e) { content = doc.layers.add(); content.name = 'content'; }
    try { bgLayer = doc.layers.getByName('bg'); } catch (e) { bgLayer = doc.layers.add(); bgLayer.name = 'bg'; bgLayer.zOrder(ZOrderMethod.SENDTOBACK); }
    content.locked = false; bgLayer.locked = false;
    var gapLayer; try { gapLayer = doc.layers.getByName('bg 2'); } catch (e) { gapLayer = doc.layers.add(); gapLayer.name = 'bg 2'; gapLayer.zOrder(ZOrderMethod.SENDTOBACK); bgLayer.zOrder(ZOrderMethod.SENDTOBACK); }
    gapLayer.locked = false;
    var guideLayer = null; try { guideLayer = doc.layers.getByName('guide'); } catch (e) {}
    var charts = ${js(charts)};
    var names = [];
    // 1번 아트보드의 비텍스트 오브젝트(가이드 격자 · 구분선) — --apply 때 복제해 깔 것
    var furniture = [];
    if (APPLY) for (var f0 = 0; f0 < doc.pageItems.length; f0++) { var it0 = doc.pageItems[f0]; if (it0.layer.name == 'content' && it0.typename != 'TextFrame' && it0.parent.typename == 'Layer' && inside(it0.geometricBounds, ab0)) furniture.push(it0); }
    say('furniture on artboard 1: ' + furniture.length);
    for (var i = 0; i < charts.length; i++) {
      var col = i % 4, row = Math.floor(i / 4);
      var OX = L0 + col * (${W} + 200), OT = T0 - row * (${H} + 200);
      var rect = [OX, OT, OX + ${W}, OT - ${H}];
      if (i >= doc.artboards.length) doc.artboards.add(rect);
      names.push(charts[i].name);
      if (APPLY && i === 0) { say('artboard 1 kept'); continue; }
      if (APPLY) {
        for (var p = doc.pageItems.length - 1; p >= 0; p--) { var pi = doc.pageItems[p]; try { if (pi.layer.name != 'bg' && pi.parent.typename == 'Layer' && inside(pi.geometricBounds, rect)) pi.remove(); } catch (e) {} }
        for (var fu = 0; fu < furniture.length; fu++) { var dup = furniture[fu].duplicate(); dup.translate(OX - L0, OT - T0); }
      }
      var hasBg = false;
      for (var q = 0; q < bgLayer.pageItems.length; q++) if (inside(bgLayer.pageItems[q].geometricBounds, rect)) hasBg = true;
      if (!hasBg) { doc.activeLayer = bgLayer; var bg = doc.pathItems.rectangle(OT, OX, ${W}, ${H}); bg.filled = true; bg.fillColor = rgb(${js(BG)}); bg.stroked = false; }
      doc.activeLayer = content;
      if (!APPLY) for (var gc = 0; gc < 8; gc++) for (var gb = 0; gb < 6; gb++) for (var gr = 0; gr < 5; gr++) { var g = doc.pathItems.rectangle(OT - (${TOP} + gb * 6 * ${UNIT} + gr * ${UNIT}), OX + ${X0} + gc * (${COL} + ${GUT}), ${COL}, ${UNIT}); g.filled = false; g.stroked = false; g.guides = true; }
      var els = charts[i].els;
      for (var j = 0; j < els.length; j++) {
        var e = els[j];
        if (e.gap) { doc.activeLayer = gapLayer; var gb = doc.pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h); gb.filled = true; gb.fillColor = rgb(${js(NEON)}); gb.stroked = false; gb.opacity = 15; doc.activeLayer = content; continue; }
        if (e.rule) { if (!APPLY) { var ln = doc.pathItems.add(); ln.setEntirePath([[OX + ${X0}, OT - e.y], [OX + ${RIGHT}, OT - e.y]]); ln.filled = false; ln.stroked = true; ln.strokeWidth = 1; ln.strokeColor = rgb(${js(GRAY)}); ln.strokeDashes = [1, 2]; ln.strokeCap = StrokeCap.BUTTENDCAP; } continue; }
        var r = doc.pathItems.rectangle(OT - e.top, OX + e.left, e.w, e.h);
        var tf = doc.textFrames.areaText(r);
        tf.contents = e.text;
        var ca = tf.textRange.characterAttributes;
        ca.textFont = font(e.font); ca.size = e.size; ca.autoLeading = false; ca.leading = e.leading; ca.tracking = e.tracking; ca.fillColor = rgb(e.fill);
        try { tf.textRange.paragraphAttributes.hyphenation = false; } catch (x) {}
        try { tf.firstBaseline = e.first == 'cap' ? FirstBaselineType.BASELINECAPHEIGHT : FirstBaselineType.BASELINEEMBOXHEIGHT; tf.firstBaselineMin = 0; } catch (x) { say('firstBaseline: ' + x); }
        for (var k = 0; k < e.ranges.length; k++) { var rg = e.ranges[k]; for (var c = rg[0]; c < rg[1]; c++) tf.characters[c].characterAttributes.fillColor = rgb(rg[2]); }
        if (e.sample) say(charts[i].name + ' lines=' + tf.lines.length + ' size=' + e.size.toFixed(1) + ' leading=' + e.leading + ' box=' + e.w + 'x' + e.h);
      }
    }
    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true; opts.transparency = false; opts.antiAliasing = true; opts.horizontalScale = 100; opts.verticalScale = 100;
    var guideWasVisible = guideLayer ? guideLayer.visible : false; if (guideLayer) guideLayer.visible = false;
    for (var a = 0; a < names.length; a++) { doc.artboards.setActiveArtboardIndex(a); doc.exportFile(new File(OUT + '/' + names[a] + '.png'), ExportType.PNG24, opts); }
    say('exported ' + names.length + ' png'); if (guideLayer) guideLayer.visible = guideWasVisible;
    try { if (APPLY) doc.save(); else doc.saveAs(new File(OUT + '/typo-charts.ai')); say('saved typo-charts.ai'); } catch (x) { say('save failed: ' + x); }
    say('DONE');
  } catch (err) { say('ERROR ' + err + ' line ' + err.line); }
  flush();
})();
`;
const jsxPath = path.join(OUT, 'typo-charts.jsx');
fs.writeFileSync(jsxPath, jsx);
console.log('wrote', jsxPath, apply ? '(apply to existing document)' : '(new document)');

if (run) {
  try { fs.unlinkSync(path.join(OUT, 'jsx-log.txt')); } catch {}
  const script = `with timeout of 600 seconds\n tell application id "com.adobe.illustrator" to do javascript "#include \\"${jsxPath}\\""\nend timeout`;
  execFileSync('osascript', ['-e', script], { stdio: 'inherit' });
  const logFile = path.join(OUT, 'jsx-log.txt');
  console.log(fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '(no jsx-log.txt — script did not reach flush)');
}
