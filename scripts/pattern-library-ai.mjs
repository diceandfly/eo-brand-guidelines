/**
 * 패턴 라이브러리 30종 한 장 — Illustrator 생성: node scripts/pattern-library-ai.mjs [--run] [1440x1080 | 2560x1440] [출력 폴더]
 *   기본 출력: ~/Downloads/temp/pattern-library-ai/  (pattern-library.jsx · pattern-library.ai · pattern-library.png · @2x · jsx-log.txt)
 *   --run 이면 osascript 로 Illustrator 에 .jsx 를 실행 (Illustrator 가 켜져 있어야 함).
 *
 * 양식 (기본 1440x1080 = 4:3, 장표 규칙과 같은 28px 격자. 2560x1440 은 PRESETS 참조): 1440×1080, 마진 50 → 콘텐츠 x 50–1390 · y 50–1030.
 *   6컬럼 200 · 거터 28 (6×200 + 5×28 = 1340) × 5행, 행 피치 196 (= 7행 × 28): 카드 16:9 200×112.5 가 행 윗선에, 캡션은 카드 윗선 +140 (5행) 에, 박스 폭 228(거터 포함) × 2줄 — 긴 이름은 둘째 줄로.
 *   캡션 Founders Grotesk Mono 20 · 행간 24 · 자간 -70, "05/ " 는 Medium Gray, 이름은 Air White. 배경 Space Black. 카드는 SVG 원본(자체 배경 Solid Gray) 그대로 임베드.
 *   레이어: bg(배경) · content(카드 · 캡션) · guide(격자, 내보낼 때 숨김).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const run = args.includes('--run');
const OUT = (args.find((a, i) => !a.startsWith('--') && !/^\d+x\d+$/.test(a) && args[i - 1] !== '--size') ?? path.join(os.homedir(), 'Downloads', 'temp', 'pattern-library-ai')).replace(/^~(?=\/|$)/, os.homedir());
fs.mkdirSync(OUT, { recursive: true });

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SVG_DIR = path.join(ROOT, 'public/assets/05-graphic-system/02-graphic-pattern');
const MD = fs.readFileSync(path.join(ROOT, 'content/guide.ko.md'), 'utf8');

// 이름은 md 캡션에서: "![pattern-05] 05/ Rivals"
const items = [...MD.matchAll(/^!\[pattern-(\d\d)\]\s+\d\d\/\s+(.+?)\s*$/gm)].map(m => ({
  n: m[1], name: m[2],
  file: fs.readdirSync(SVG_DIR).map(f => path.join(SVG_DIR, f)).find(f => new RegExp(`-pattern-${m[1]}\\.svg$`).test(f)),
}));
const missing = items.filter(i => !i.file).map(i => i.n);
if (items.length !== 30 || missing.length) throw new Error(`patterns: ${items.length} found, svg missing: ${missing.join(',') || 'none'}`);

// ── 양식 (아트보드 크기별 프리셋: --size 1440x1080 | 2560x1440) ───────────────
const PRESETS = {
  '1440x1080': { W: 1440, H: 1080, UNIT: 28, M: 50, COLS: 6, ROWS: 5, GUT: 28, PITCH: 7 * 28, CAP_DY: 5 * 28, CAP_LINES: 2, CAP: { size: 20, leading: 24, tracking: -70 } },   // 카드 폭 = (1440 − 100 − 5×28) / 6 = 200, 16:9
  // 2560×1440 (16:9 라 세로가 부족): 마진 80 사방. 가로 거터 64 → 카드 폭 (2560 − 160 − 320) / 6 = 346.67. 세로는 행 간격(캡션 아래 ↔ 다음 카드) 45 · 캡션 위 간격 20 · 캡션 28 을 정하고 카드 높이를 역산 → 172 (2.02:1, 16:9 보다 13% 넓힘)
  '2560x1440': { W: 2560, H: 1440, UNIT: 32, M: 80, COLS: 6, ROWS: 5, GUT: 64, CAP_GAP: 20, ROW_GAP: 45, CAP_BOX_H: 28, CAP_LINES: 1, CAP: { size: 24, leading: 28, tracking: -70 } },
};
const SIZE = args.find(a => /^\d+x\d+$/.test(a)) ?? (args.includes('--size') ? args[args.indexOf('--size') + 1] : '1440x1080');
const P = PRESETS[SIZE]; if (!P) throw new Error(`unknown size ${SIZE}: ${Object.keys(PRESETS).join(' | ')}`);
const { W, H, UNIT, M, COLS, ROWS, GUT, CAP_LINES } = P;
const CARD_W = P.CARD_W ?? (W - 2 * M - (COLS - 1) * GUT) / COLS;   // 격자에서 역산 — 가로를 꽉 채움
const MY = P.MY ?? M;                                                 // 세로 마진 (행 피치 끝의 여분 때문에 가로와 다를 수 있음)
const CAP_BOX_H = P.CAP_BOX_H ?? CAP_LINES * UNIT;                      // 캡션 박스 높이
// 세로: 프리셋이 CAP_GAP(카드 ↔ 캡션) · ROW_GAP(캡션 ↔ 다음 카드) 을 주면 카드 높이를 역산해 세로를 꽉 채움 (비균등 resize), 아니면 16:9 에 PITCH · CAP_DY 명시
const CARD_H = P.ROW_GAP != null ? (H - 2 * MY - ROWS * (P.CAP_GAP + CAP_BOX_H) - (ROWS - 1) * P.ROW_GAP) / ROWS : (P.CARD_H ?? CARD_W * 9 / 16);
const CAP_DY = P.CAP_DY ?? CARD_H + P.CAP_GAP;
const PITCH = P.PITCH ?? CAP_DY + CAP_BOX_H + P.ROW_GAP;
const NAME = SIZE === '1440x1080' ? 'pattern-library' : `pattern-library-${SIZE}`;   // 출력 파일 이름
const X = c => M + c * (CARD_W + GUT), Y = r => MY + r * PITCH;
const BG = '#000000', GRAY = '#8e8e8e', WHITE = '#fcfbf5';
const CAPTION = { font: 'FoundersGroteskMono-Regular', ...P.CAP };
const js = s => JSON.stringify(s).replace(/[\u0080-￿]/g, ch => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));

const cards = items.map((it, i) => ({
  file: it.file, name: `pattern-${it.n}`, label: `${it.n}/ ${it.name}`, numLen: it.n.length + 1,   // "05/" 까지 회색
  x: X(i % COLS), y: Y(Math.floor(i / COLS)), w: CARD_W, h: CARD_H,
}));

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
    for (var d2 = app.documents.length - 1; d2 >= 0; d2--) if (app.documents[d2].name == ${js(NAME + '.ai')}) app.documents[d2].close(SaveOptions.DONOTSAVECHANGES);
    var doc = app.documents.add(DocumentColorSpace.RGB, ${W}, ${H});
    var ab = doc.artboards[0].artboardRect, L0 = ab[0], T0 = ab[1];
    var content = doc.layers[0]; content.name = 'content';
    var bgLayer = doc.layers.add(); bgLayer.name = 'bg'; bgLayer.zOrder(ZOrderMethod.SENDTOBACK);
    var guide = doc.layers.add(); guide.name = 'guide';
    var bg = bgLayer.pathItems.rectangle(T0, L0, ${W}, ${H}); bg.filled = true; bg.stroked = false; bg.fillColor = rgb(${js(BG)}); bg.name = 'bg';
    // 격자 가이드: 컬럼 경계 세로선 + 28px 행 가로선 (내보낼 때 숨김)
    for (var c = 0; c < ${COLS}; c++) { var xs = [${M} + c * ${CARD_W + GUT}, ${M} + c * ${CARD_W + GUT} + ${CARD_W}]; for (var k = 0; k < 2; k++) { var v = guide.pathItems.add(); v.setEntirePath([[L0 + xs[k], T0], [L0 + xs[k], T0 - ${H}]]); v.stroked = true; v.filled = false; v.strokeWidth = 0.5; v.strokeColor = rgb('#6ec6d2'); v.guides = true; } }
    for (var r = 0; r * ${UNIT} <= ${H}; r++) { var hln = guide.pathItems.add(); hln.setEntirePath([[L0, T0 - r * ${UNIT}], [L0 + ${W}, T0 - r * ${UNIT}]]); hln.stroked = true; hln.filled = false; hln.strokeWidth = 0.25; hln.strokeColor = rgb('#6ec6d2'); hln.guides = true; }
    var cards = ${js(cards)};
    var capFont = font(${js(CAPTION.font)});
    for (var i = 0; i < cards.length; i++) {
      var e = cards[i];
      // SVG 를 Illustrator 로 열어 전체 복사 → 문서에 붙여넣고 그룹 → 1920×1080 을 카드 크기로 축소 → 자리 (placedItems 는 SVG 를 받지 않고, 문서 간 duplicate 는 MRAP 오류)
      var svgDoc = app.open(new File(e.file));
      app.activeDocument = svgDoc; app.executeMenuCommand('selectall'); var n = svgDoc.selection.length; app.copy();
      svgDoc.close(SaveOptions.DONOTSAVECHANGES);
      app.activeDocument = doc; doc.activeLayer = content; doc.selection = null;
      app.paste();
      var sel = doc.selection, grp = content.groupItems.add(); grp.name = e.name;
      for (var s = sel.length - 1; s >= 0; s--) sel[s].move(grp, ElementPlacement.PLACEATBEGINNING);
      doc.selection = null;
      var gb = grp.geometricBounds, gw = gb[2] - gb[0], gh = gb[1] - gb[3];
      grp.resize(e.w / gw * 100, e.h / gh * 100, true, true, true, true, 100, Transformation.TOPLEFT);
      grp.position = [L0 + e.x, T0 - e.y];
      gb = grp.geometricBounds;
      if (Math.abs((gb[2] - gb[0]) - e.w) > 0.5 || Math.abs((gb[1] - gb[3]) - e.h) > 0.5 || n == 0) say(e.name + ' items=' + n + ' size ' + (gb[2] - gb[0]).toFixed(1) + 'x' + (gb[1] - gb[3]).toFixed(1));
      // 캡션: 영역 텍스트, 첫 베이스라인 엠박스, "05/" 회색 · 이름 흰색
      var tf = content.textFrames.areaText(content.pathItems.rectangle(T0 - (e.y + ${CAP_DY}), L0 + e.x, e.w + ${GUT}, ${CAP_BOX_H}));   // 거터까지 폭, 프리셋 줄 수 (긴 이름은 둘째 줄로)
      tf.contents = e.label; tf.name = e.name + ' caption';
      var ca = tf.textRange.characterAttributes;
      ca.textFont = capFont; ca.size = ${CAPTION.size}; ca.autoLeading = false; ca.leading = ${CAPTION.leading}; ca.tracking = ${CAPTION.tracking}; ca.fillColor = rgb(${js(WHITE)});
      try { tf.firstBaseline = FirstBaselineType.BASELINEEMBOXHEIGHT; tf.firstBaselineMin = 0; } catch (x) { say('firstBaseline: ' + x); }
      for (var ch = 0; ch < e.numLen; ch++) tf.characters[ch].characterAttributes.fillColor = rgb(${js(GRAY)});
    }
    var opts = new ExportOptionsPNG24();
    opts.artBoardClipping = true; opts.transparency = false; opts.antiAliasing = true;
    guide.visible = false;
    opts.horizontalScale = 100; opts.verticalScale = 100; doc.exportFile(new File(OUT + '/' + ${js(NAME)} + '.png'), ExportType.PNG24, opts);
    opts.horizontalScale = 200; opts.verticalScale = 200; doc.exportFile(new File(OUT + '/' + ${js(NAME)} + '@2x.png'), ExportType.PNG24, opts);
    guide.visible = true;
    say('exported png');
    try { doc.saveAs(new File(OUT + '/' + ${js(NAME)} + '.ai')); say('saved ' + ${js(NAME)} + '.ai'); } catch (x) { say('save failed: ' + x); }
    say('DONE');
  } catch (err) { say('ERROR ' + err + ' line ' + err.line); }
  flush();
})();
`;
const jsxPath = path.join(OUT, `${NAME}.jsx`);
fs.writeFileSync(jsxPath, jsx);
console.log('wrote', jsxPath, `(${cards.length} cards, ${SIZE}: card ${CARD_W.toFixed(2)}×${CARD_H.toFixed(2)} = ${(CARD_W / CARD_H).toFixed(3)}:1, pitch ${PITCH}, cap top +${CAP_DY})`);

if (run) {
  try { fs.unlinkSync(path.join(OUT, 'jsx-log.txt')); } catch {}
  const script = `with timeout of 600 seconds\n tell application id "com.adobe.illustrator" to do javascript "#include \\"${jsxPath}\\""\nend timeout`;
  execFileSync('osascript', ['-e', script], { stdio: 'inherit' });
  const logFile = path.join(OUT, 'jsx-log.txt');
  console.log(fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '(no jsx-log.txt — script did not reach flush)');
}
