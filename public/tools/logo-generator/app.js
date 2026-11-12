// EO Logo Generator — 화면 · 상태 · 시그니처 조판 · 목업 · 내보내기 · 툴팁 (geom.js 다음에 읽음, 같은 전역 공간)
// ===== 11. 상태 · 컬러 =====
const HEX = { 'Builder Neon': '#F9EE3A', 'Day Blue': '#6EC6D2', 'Bay Green': '#66B88A', 'Medium Gray': '#8E8E8E', 'Solid Gray': '#2A2B2B', 'Space Black': '#000000', 'Air White': '#FCFBF5' };
/*RULES-START*/
// ===== 브랜드 규칙 수치 — 가이드에서 온 값만 모음. 화면 · UI 코드는 읽기만 함 (npm test [5] 가 이 블록을 따로 돌려 값을 고정) =====
// 보이는 높이 S(mm, 500mm 환산) 구간 — 가이드 Symbol · Signature › Scalability. [시작 mm, 구간] … 마지막 [Infinity].
// 경계값은 더 나은 구간에 속함 (optimal > over > out): 4 · 15mm = 최적, 25mm = 권장 최대 초과, 시그니처 10mm = 두 형 모두 최적
const RULES = {
  minVis: 4,   // 어느 형도 4mm 미만은 없음
  zones: {
    symbol: [[0, 'out'], [4, 'optimal'], [15, 'over'], [25, 'out'], [Infinity]],   // 최적 4-15 · 권장 최대 초과 15-25
    sigH: [[0, 'out'], [4, 'optimal'], [10, 'out'], [Infinity]],                    // 가로형 시그니처 4-10
    sigV: [[0, 'out'], [10, 'optimal'], [15, 'over'], [25, 'out'], [Infinity]],     // 세로형 시그니처 10mm 부터
  },
};
const ZONE_EPS = 1e-6, ZONE_RANK = { optimal: 2, over: 1, out: 0 };
function zoneOf(zones, S) {   // S 가 든 구간 (닫힌 구간, 경계에서는 더 나은 쪽)
  let best = null;
  for (let i = 0; i < zones.length - 1; i++) {
    const [a, k] = zones[i], b = zones[i + 1][0];
    if (S >= a - ZONE_EPS && S <= b + ZONE_EPS && (best === null || ZONE_RANK[k] > ZONE_RANK[best])) best = k;
  }
  return best;
}
// 시그니처 규격 (가이드 Signature › Descriptor · Clearspace · Inversion) — H = 심볼 높이(E 블록 높이), W = E 블록 폭, 자간 = 1/1000 em
const SIG = {
  v: { em: 58.8 / 125, emDark: .48, trackDark: -10, drop: 1 / 5, nudge: -1 / 100 },       // 세로형: 조판 = 일러 장표 58.8pt / 심볼 125 (가이드 문장 0.46H 는 반올림 표기) · 캡 박스 윗변 = 심볼 아래 H/5 · 심볼 가운데에서 왼쪽으로 H/100 · 클리어스페이스 H/2
  h: { em: 1.3, emDark: 1.35, trackDark: -20, gapW: 1 / 2, lift: 1 / 10, space: -60, spaceDark: -70 },   // 가로형: 캡 박스 왼변 = 심볼 오른쪽 + W/2 · 베이스라인 = 심볼 바닥 − H/10 · 공백만 자간 −6% · 클리어스페이스 = 캡 하이트
  darkOffset: 1 / 200,                                                       // 다크: 자간 세로형 −1% · 가로형 −2%(2026-11-12 확정, 공백 −7%) · 글자 바깥 오프셋 H/200
};
const ART_AREA_MAX = 0.10;   // 로고(심볼 박스) 면적 ÷ 로고가 놓인 공간 면적 — 가이드 Symbol › Usage "실질 점유 면적은 빈 공간 전체의 5-10%" 의 상한. 공간 = 조닝 매체는 콘텐츠 영역(spec.space), 나머지는 화면 · 지면 전체
const MM_MIN = RULES.minVis, MM_MAX = 30;   // 보이는 높이 슬라이더 범위 (UI — 최대 25mm 를 조금 넘는 데까지만, 빨간 구간은 짧게). 거리와 무관하게 고정
/*RULES-END*/
const PRESETS = [
  { n: 1, fg: 'Space Black', bg: 'Builder Neon', mode: 'dark' },
  { n: 2, fg: 'Air White', bg: 'Space Black', mode: 'light' },
  { n: 5, fg: 'Builder Neon', bg: 'Space Black', mode: 'light' },
  { n: 3, fg: 'Air White', bg: 'Solid Gray', mode: 'light' },
  { n: 4, fg: 'Space Black', bg: 'Air White', mode: 'dark' },
  { n: 6, fg: 'Builder Neon', bg: 'Solid Gray', mode: 'light' },
];
const LS_KEY = 'eo-symbol-generator:pxmm';
const st = { pxmm: 5, calibrated: false, dist: 500, unit: 'px', vis: 12, mode: 'light', preset: 2, clear: true, icon: true, pngScale: 1, visReq: 12, artLimit: false, dpi: null, place: {}, content: {}, guide: false, kind: 'symbol', sigType: 'company', orient: 'v', sigName: 'Magazine' };   // kind = symbol | signature · sigType = company | service · orient = v | h   // guide = 화면에 클리어스페이스 박스 표시 (내보내기와 별개)   // place = 매체별 목업 심볼 자리 (목업에서 클릭해 바꿈)   // 배경은 내보내지 않음 (투명 고정 — Background 토글 폐기)
try { const v = parseFloat(localStorage.getItem(LS_KEY)); if (v > 1 && v < 30) { st.pxmm = v; st.calibrated = true; } } catch (e) {}
const $ = id => document.getElementById(id);
const fmt = (v, n = 3) => (Math.round(v * 10 ** n) / 10 ** n).toFixed(n);

// ===== 12. 크기 계산 =====
function sizes() {
  const S = st.vis;   // 보이는 높이 = 사용자가 정하는 결정값 (4-30mm) — 거리 때문에 바뀌지 않음 (이상한 비율은 디자이너가 판단)
  const physMm = S * st.dist / 500;                        // 매체에서의 실제 높이 = 보이는 높이 × 거리 비율
  const outPx = physMm * pxPerMm();   // 출력 px = 실제 높이 × 매체의 px/mm (화면 = 대상 화면 값 · 인쇄 = 매체 dpi)
  return { physMm, S, outPx };
}
function warnings(S) {   // 판정 = zoneAt (슬라이더 구간 색과 같은 경계 — RULES.zones 하나), 문구엔 숫자 없음 — 숫자는 Visual height 칸, 범위는 슬라이더 구간 색이 보여줌
  const sig = st.kind === 'signature', h = st.orient === 'h';
  if (sig && !SIG_FONT) return [[SIG_FONT_ERR ? 'bad' : 'info', SIG_FONT_ERR || 'Loading signature font']];
  const z = zoneAt(S);
  if (z === 'out') {
    if (S < RULES.minVis) return [['bad', 'Outside guide']];   // 4mm 미만 = 어느 형도 없음
    const lo = sizeZones().find(([, k]) => k === 'optimal')[0];   // 최적 구간 시작
    if (sig && S < lo) return [['bad', 'Use horizontal at this size']];   // 세로형 10mm 미만
    if (sig && h) return [['bad', 'Use vertical at this size']];   // 가로형 10mm 초과
    return [['bad', 'Not recommended']];   // 25mm 초과 = 그래픽 패턴 영역 (가이드 Scalability)
  }
  if (z === 'over') return [['warn', 'Above recommended size']];   // 권장 최대(15mm) 초과
  if (S <= RULES.minVis + ZONE_EPS) return [['warn', 'Minimum visual size']];
  return [['ok', sig && h ? 'Within guide range' : 'Within optimal range']];
}

// ===== 13. 시그니처 디스크립터 — 서체 아웃라인 · 커닝(GPOS) · 캡 박스 =====
// 서체 = 로컬 Founders Grotesk Regular (public/fonts, git 제외). 출력에는 글자 아웃라인 패스만 들어감 (서체 파일은 안 나감)
function gposKerner(bytes, off) {   // GPOS 'kern' 피처의 PairPos(형식 1 · 2, 확장 9) → (왼 글리프, 오른 글리프) → x 전진 보정 (폰트 단위)
  const dv = new DataView(bytes.buffer, bytes.byteOffset + off), u16 = p => dv.getUint16(p), i16 = p => dv.getInt16(p), u32 = p => dv.getUint32(p);
  const featL = u16(6), lookL = u16(8), idx = new Set();
  for (let i = 0, n = u16(featL); i < n; i++) { const r = featL + 2 + i * 6; if (String.fromCharCode(dv.getUint8(r), dv.getUint8(r + 1), dv.getUint8(r + 2), dv.getUint8(r + 3)) !== 'kern') continue; const f = featL + u16(r + 4); for (let j = 0, m = u16(f + 2); j < m; j++) idx.add(u16(f + 4 + j * 2)); }
  const cov = (p, g) => { if (u16(p) === 1) { let lo = 0, hi = u16(p + 2) - 1; while (lo <= hi) { const md = (lo + hi) >> 1, v = u16(p + 4 + md * 2); if (v === g) return md; if (v < g) lo = md + 1; else hi = md - 1; } return -1; }
    for (let i = 0, n = u16(p + 2); i < n; i++) { const r = p + 4 + i * 6; if (g >= u16(r) && g <= u16(r + 2)) return u16(r + 4) + g - u16(r); } return -1; };
  const cls = (p, g) => { if (u16(p) === 1) { const s = u16(p + 2), n = u16(p + 4); return g >= s && g < s + n ? u16(p + 6 + (g - s) * 2) : 0; }
    for (let i = 0, n = u16(p + 2); i < n; i++) { const r = p + 4 + i * 6; if (g >= u16(r) && g <= u16(r + 2)) return u16(r + 4); } return 0; };
  const vsize = f => { let n = 0; for (let b = f; b; b >>= 1) n += b & 1; return n * 2; };
  const xadv = (p, f) => { if (!(f & 4)) return 0; let q = p; if (f & 1) q += 2; if (f & 2) q += 2; return i16(q); };   // ValueRecord 의 XAdvance
  const subs = [];
  for (const li of [...idx].sort((a, b) => a - b)) {
    const L = lookL + u16(lookL + 2 + li * 2), type = u16(L);
    for (let s = 0, n = u16(L + 4); s < n; s++) { let p = L + u16(L + 6 + s * 2), t = type; if (t === 9) { t = u16(p + 2); p += u32(p + 4); } if (t === 2) subs.push(p); }
  }
  const memo = new Map();
  return (a, b) => {
    const k = a * 65536 + b; if (memo.has(k)) return memo.get(k);
    let v = 0;
    for (const p of subs) {
      const fmt = u16(p), ci = cov(p + u16(p + 2), a); if (ci < 0) continue;
      const f1 = u16(p + 4), f2 = u16(p + 6), s1 = vsize(f1), s2 = vsize(f2);
      if (fmt === 1) {
        const ps = p + u16(p + 10 + ci * 2), n = u16(ps), rec = 2 + s1 + s2; let hit = false;
        for (let i = 0; i < n; i++) { const r = ps + 2 + i * rec; if (u16(r) === b) { v = xadv(r + 2, f1); hit = true; break; } }
        if (hit) break;
      } else if (fmt === 2) {
        const c1 = cls(p + u16(p + 8), a), c2 = cls(p + u16(p + 10), b), n2 = u16(p + 14);
        v = xadv(p + 16 + (c1 * n2 + c2) * (s1 + s2), f1); break;
      }
    }
    memo.set(k, v); return v;
  };
}
function sigFontFrom(font) {   // fontkitten 글꼴 → 시그니처 조판용 { upm, cap, glyph(ch), kern(a, b) }
  font.glyphsForString('H');   // WOFF2 압축 풀기 (GPOS 원본 바이트 위치가 이때 정해짐)
  const t = font.directory.tables.GPOS, buf = font.stream.buffer, bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  const kern = t ? gposKerner(bytes, t.offset) : () => 0;
  return { upm: font.unitsPerEm, cap: font.capHeight, glyph: ch => font.glyphForCodePoint(ch.codePointAt(0)), kern };
}
function flattenPath(cmds, tol) {   // 글리프 패스 → 링 (곡선은 허용 오차 tol 폰트 단위로 잘게)
  const rings = []; let ring = null, x = 0, y = 0;
  const seg = (pts, f) => { const n = Math.max(2, Math.ceil(Math.sqrt(pts / tol))); for (let i = 1; i <= n; i++) ring.push(f(i / n)); };
  for (const { command: c, args: a } of cmds) {
    if (c === 'moveTo') { if (ring && ring.length > 2) rings.push(ring); ring = [[a[0], a[1]]]; [x, y] = a; }
    else if (c === 'lineTo') { ring.push([a[0], a[1]]); [x, y] = a; }
    else if (c === 'quadraticCurveTo') { const [x0, y0] = [x, y], [cx, cy, ex, ey] = a, d = Math.hypot(cx - x0, cy - y0) + Math.hypot(ex - cx, ey - cy);
      seg(d / 8, t => { const s = 1 - t; return [s * s * x0 + 2 * s * t * cx + t * t * ex, s * s * y0 + 2 * s * t * cy + t * t * ey]; }); [x, y] = [ex, ey]; }
    else if (c === 'bezierCurveTo') { const [x0, y0] = [x, y], [c1x, c1y, c2x, c2y, ex, ey] = a, d = Math.hypot(c1x - x0, c1y - y0) + Math.hypot(c2x - c1x, c2y - c1y) + Math.hypot(ex - c2x, ey - c2y);
      seg(d / 8, t => { const s = 1 - t; return [s * s * s * x0 + 3 * s * s * t * c1x + 3 * s * t * t * c2x + t * t * t * ex, s * s * s * y0 + 3 * s * s * t * c1y + 3 * s * t * t * c2y + t * t * t * ey]; }); [x, y] = [ex, ey]; }
    else if (c === 'closePath') { if (ring && ring.length > 2) rings.push(ring); ring = null; }
  }
  if (ring && ring.length > 2) rings.push(ring);
  return rings.map(r => { const o = openRing(r); return o.length > 2 ? o : null; }).filter(Boolean);
}
// 곡선 옆선 글자 — 캡 박스 경계는 H · h 로 잡음 (가이드 Signature › Descriptor: Studio → Htudio · Studih)
const SIG_CURVE_L = 'CGOQScdegoqs0689', SIG_CURVE_R = 'BCDGOQSbceops0389';
const isUpper = ch => ch !== ch.toLowerCase() || /[0-9]/.test(ch);
// 한 줄 조판: em = 조판 사이즈(H 단위), track = 자간(1/1000 em), spaceTrack = 공백 문자 자간. 반환 좌표 = H 단위 · y 아래로 · 베이스라인 0 · 펜 시작 0
const memo = (fn, max = 12) => { const m = new Map(); return (...a) => { const k = a.join('|'); if (m.has(k)) return m.get(k); const v = fn(...a); m.set(k, v); if (m.size > max) m.delete(m.keys().next().value); return v; }; };   // 같은 입력 = 같은 결과 (슬라이더 · 호버마다 다시 계산하지 않게). 결과는 읽기만 함
const symOf = memo((S, mode) => buildSymbol(S, mode));   // GEOM 의 buildSymbol 을 감쌈 (GEOM 은 그대로)
function setLine(F, text, em, track, spaceTrack) { return setLineM(text, em, track, spaceTrack); }
const setLineM = memo((text, em, track, spaceTrack) => setLineRaw(SIG_FONT, text, em, track, spaceTrack), 24);
function setLineRaw(F, text, em, track, spaceTrack) {
  const k = em / F.upm, chars = [...text], gl = chars.map(ch => F.glyph(ch)), polys = [];
  if (!chars.length) return { mp: [], capL: 0, capR: 0, capH: F.cap * k, missing: [] };   // 빈 디스크립터 = 글자 없이 캡 박스 자리만 (저장은 잠김)
  let pen = 0, lastPen = 0; const missing = [...new Set(chars.filter((ch, i) => !gl[i] || gl[i].id === 0))];   // 서체에 없는 글자 목록
  gl.forEach((g, i) => {
    const rings = flattenPath(g.path.commands, 0.25).map(r => closeRing(r.map(([x, y]) => [(pen + x) * k, -y * k])));
    if (rings.length) polys.push(polygonClipping.xor(...rings.map(r => [r])));   // 한 글자 안 윤곽 = 짝홀 (구멍 판별)
    lastPen = pen;
    pen += g.advanceWidth + (i < gl.length - 1 ? F.kern(g.id, gl[i + 1].id) : 0) + (chars[i] === ' ' ? spaceTrack : track) * F.upm / 1000;
  });
  const first = chars[0], last = chars[chars.length - 1];
  const edge = (ch, g, side) => { const sub = (side === 'L' ? SIG_CURVE_L : SIG_CURVE_R).includes(ch) ? F.glyph(isUpper(ch) ? 'H' : 'h') : g; return side === 'L' ? sub.bbox.minX : sub.bbox.maxX; };
  const capL = edge(first, gl[0], 'L') * k, capR = (lastPen + edge(last, gl[gl.length - 1], 'R')) * k;
  const mp = polys.length ? polygonClipping.union(...polys) : [];   // 글자끼리 겹쳐도 한 덩어리
  return { mp, capL, capR, capH: F.cap * k, missing };
}
const GUIDE = '/en/02-logo/';   // 가이드 사이트 Logo 챕터 (같은 서버의 상대 주소)
const FONTKIT_URL = './vendor/fontkitten/index.js', FONT_URL = '/fonts/founders-grotesk-regular.woff2';   // 시그니처 의존 — fontkitten 1.0.3 (MIT) 은 함께 둠, 서체는 가이드와 같은 public/fonts (git 제외, 클라이언트가 넣음)
let SIG_FONT = null, SIG_FONT_ERR = /^https?:$/.test(location.protocol) ? '' : 'Signature needs the guide server — run npm run dev and open /tools/logo-generator/index.html';   // 서체는 아래 모듈 스크립트가 읽어 넣음. 파일을 직접 열면(file://) 브라우저가 모듈 · 폰트 읽기를 막아 시그니처가 안 됨 → 서버 주소로 열라고 알림
const sigText = () => st.sigType === 'company' ? 'EO Studio' : st.sigName.trim();   // 비면 빈 채로 (EO 를 채우지 않음)
const boxU = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
function buildSig(S, mode) {   // 반환 = 심볼과 같은 꼴 { mp, box } + 라이트 기준 박스(lbox) · 클리어스페이스(cs). 좌표 H = 1, 라이트 심볼 = [0, lightW] × [0, 1]
  const F = SIG_FONT, o = st.orient, sp = SIG[o], text = sigText();
  const light = symOf(S, 'light'), sym = mode === 'dark' ? symOf(S, 'dark') : light, lw = light.lightW;
  const Ew = bboxOf(lerpGeo(GEO_MIN, GEO_REG, interpT(S)).E).w;   // W = 지금 크기의 E 블록 폭
  const L = setLine(F, text, sp.em, 0, o === 'h' ? sp.space : 0);
  const lx = o === 'v' ? lw / 2 + sp.nudge - (L.capL + L.capR) / 2 : lw + Ew * sp.gapW - L.capL;
  const base = o === 'v' ? 1 + sp.drop + L.capH : 1 - sp.lift;
  const cap = { x0: L.capL + lx, x1: L.capR + lx, y0: base - L.capH, y1: base };
  const lbox = boxU({ x0: 0, y0: 0, x1: lw, y1: 1 }, cap), cs = o === 'v' ? .5 : L.capH;
  let txt = mapMP(L.mp, (x, y) => [x + lx, y + base]), smp = sym.mp;
  if (mode === 'dark') {   // 심볼 = 라이트 심볼 자리에 x · y 가운데 (buildSymbol), 글자 = 세로형 캡 박스 가운데 · 가로형 캡 박스 왼변 그대로, 베이스라인 유지. 전체를 다시 옮기지 않음 (틀 = 라이트 박스 + 클리어스페이스)
    const D = setLine(F, text, sp.emDark, sp.trackDark, o === 'h' ? sp.spaceDark : sp.trackDark);
    const dx = o === 'v' ? (cap.x0 + cap.x1) / 2 - (D.capL + D.capR) / 2 : cap.x0 - D.capL;
    txt = D.mp.length ? offsetMP(mapMP(D.mp, (x, y) => [x + dx, y + base]), SIG.darkOffset) : [];
  }
  const mp = [...smp, ...txt];
  return { mp, box: bboxOf(mpPoints(mp)), lbox, cs, sig: true, orient: o, text, missing: L.missing };
}
function frameFor(c, clear) {   // 내보내는 틀 — 심볼은 GEOM 의 frameOf, 시그니처는 라이트 박스 + 독자 클리어스페이스 (Right side correction 없음)
  const s = c.sym;
  if (!s.sig) return frameOf(s, c.z.S, clear, st.icon);
  if (!clear) return { x0: s.box.x0, y0: s.box.y0, w: s.box.w, h: s.box.h, left: 0, right: 0 };
  const b = s.lbox, cs = s.cs;
  return { x0: b.x0 - cs, y0: b.y0 - cs, w: b.x1 - b.x0 + 2 * cs, h: b.y1 - b.y0 + 2 * cs, left: cs, right: cs };
}

// ===== 14. 렌더 — SVG 마크업 생성 =====
function compose() {
  const z = sizes(), symOnly = symOf(z.S, st.mode), sig = st.kind === 'signature' && SIG_FONT, sym = sig ? buildSig(z.S, st.mode) : symOnly, frame = frameFor({ z, sym }, st.clear);   // 시그니처 = 서체를 읽은 뒤부터 (그 전엔 심볼)
  const p = PRESETS.find(q => q.n === st.preset);
  return { z, sym, symOnly, frame, fg: HEX[p.fg], bgView: HEX[p.bg], preset: p };   // bgView = 작업공간 보기용 (내보내기는 늘 투명)
}
function svgMarkup(c, H, opts = {}) {
  const W = c.frame.w * H, Hh = c.frame.h * H, f = v => (Math.round(v * 1000) / 1000).toString();
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(W)} ${f(Hh)}" width="${f(opts.cssW ?? W)}" height="${f(opts.cssH ?? Hh)}">`;
  s += `<path fill="${c.fg}" fill-rule="evenodd" d="${pathD(c.sym.mp, c.frame, H)}"/>`;
  return s + '</svg>';
}
function fileBase(c) {
  const H = Math.round(c.z.outPx * 100) / 100;
  const s = c.sym, kind = s.sig ? `eo-signature-${s.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'eo'}-${s.orient === 'v' ? 'vertical' : 'horizontal'}` : 'eo-symbol';
  return `${kind}-${st.mode}-${st.unit === 'px' ? H + 'px' : mmText(c.z.physMm) + 'mm'}${st.clear ? '-clearspace' : ''}${!s.sig && st.clear && st.icon ? '-icon' : ''}`;
}

// ===== 15. 화면 갱신 =====
const sigPair = p => p.fg !== 'Builder Neon';   // 시그니처 컬러 = 여섯 페어 중 넷 (가이드 Signature › Color: Builder Neon 글자 페어 제외)
function renderPresets(sym) {   // 썸네일 = 지금 크기 · 모드의 실제 심볼. 프레임은 라이트 심볼 박스(0..lightW × 0..1) → 다크 심볼이 반전 보정만큼 크게 보임
  const f = v => (Math.round(v * 1000) / 1000).toString(), H = 100, frame = { x0: 0, y0: 0 };
  const svg = fg => `<svg viewBox="0 0 ${f(sym.lightW * H)} ${H}" aria-hidden="true"><path fill="${fg}" fill-rule="evenodd" d="${pathD(sym.mp, frame, H)}"/></svg>`;
  const fn = document.activeElement?.classList.contains('preset') ? document.activeElement.dataset.n : null;   // 키보드로 고른 칸 = 다시 그린 뒤에도 초점 유지
  $('presets').innerHTML = PRESETS.filter(p => p.mode === st.mode).map(p =>
    `<button class="preset${p.n === st.preset ? ' on' : ''}${st.kind === 'signature' && !sigPair(p) ? ' off' : ''}" data-n="${p.n}" data-bg="${p.bg}" style="background:${HEX[p.bg]}" aria-label="${p.fg} on ${p.bg}">${svg(HEX[p.fg])}</button>`).join('');
  $('presets').querySelectorAll('button').forEach(b => b.onclick = () => { st.preset = +b.dataset.n; update(); });
  if (fn) $('presets').querySelector(`[data-n="${fn}"]`)?.focus();
}
// 목업 안 로고 상한 — 자리마다 1-2개 여백은 붙어 있는 기준(앵커)이라 침범할 일이 없고, 반대쪽 여백에 닿으면 말이 안 되게 큰 것 → 슬라이더가 거기서 더 오르지 않음
// 조건(어느 자리든 같음): 로고 폭 + 좌우 여백 2개 ≤ 면 폭, 로고 높이 + 위아래 여백 2개 ≤ 면 높이. 여백 = artPlace 와 같은 식 (긴 변 비율, 가로 ×0.9, 최소 H/2)
const capLen = (b, fa, fh, m) => { const lo = Math.min((b - 2 * m) / fa, 2 * m / fh), hi = b / (fa + fh); return hi > 2 * m / fh ? hi : lo; };   // fa·H + 2·max(m, fh·H/2) ≤ b 를 만족하는 가장 큰 H
function artLimitS(c) {   // 지금 매체 · 콘텐츠에서 허용되는 가장 큰 Visual height (mm, 500mm 환산)
  const a = artFor(); if (!a) return Infinity;
  const f2 = frameFor(c, false), fw = f2.w, fh = f2.h;
  const H = Math.min(...a.slots.map(([[, , bw, bh], m]) => Math.min(capLen(bw, fw, fh, m * 0.9), capLen(bh, fh, fh, m))));
  return H * 500 / st.dist;
}
function update() {
  if (st.kind === 'signature' && !sigPair(PRESETS.find(p => p.n === st.preset))) st.preset = PRESETS.find(p => p.mode === st.mode && sigPair(p)).n;   // 시그니처로 바꾸면 쓰지 않는 페어 → 같은 모드의 첫 허용 페어
  syncDevice();   // 매체 → 화면/인쇄 · 출력 px/mm 를 먼저 맞춘 뒤 계산
  let c;
  try { c = compose(); $('err').style.display = 'none'; }
  catch (e) { $('err').textContent = 'Generation failed: ' + e.message + (typeof polygonClipping === 'undefined' ? ' — could not load polygon-clipping from the CDN (check the connection).' : ''); $('err').style.display = 'block'; return; }
  { const lim = artLimitS(c), want = st.visReq; st.artLimit = want > lim + 1e-6;   // 목업 안 로고가 반대쪽 여백에 닿으면 그 크기에서 멈춤 (빨간 메시지) — 사용자가 정한 값(visReq)은 지우지 않음: 거리 · 로고 종류를 되돌리면 원래 크기로
    const nv = st.artLimit ? Math.max(MM_MIN, Math.floor(lim * 100) / 100) : want;
    if (Math.abs(nv - st.vis) > 1e-9) { st.vis = nv; $('hSlider').value = st.vis; if (document.activeElement !== $('hmm')) $('hmm').value = mmText(st.vis); c = compose(); } }
  const { z, sym, frame } = c;
  // 보정 · 크기
  if (document.activeElement !== $('dist')) showDist();
  $('openCalib').classList.toggle('nudge', !st.calibrated); $('openCalib').textContent = st.calibrated ? 'Calibrated' : 'Not calibrated';   // 상태 그대로 — 보정 전 깜빡임 유도 · 보정 후 멈춤 (누르면 다시 맞춤)
  const sigBlock = st.kind === 'signature' && (!SIG_FONT || (sym.sig && (!sym.text || sym.missing.length)));   // 시그니처 저장 잠금 — 서체 못 읽음 · 빈 디스크립터 · 서체에 없는 글자
  const list = [...(st.artLimit ? [['bad', 'Too large for this layout']] : []), ...(sym.sig && !sym.text ? [['bad', 'No descriptor — use the symbol instead']] : sym.sig && sym.missing.length ? [['bad', `Missing glyphs: ${sym.missing.join(', ')}`]] : []), ...warnings(z.S)];
  $('dlSvg').disabled = $('dlPng').disabled = sigBlock;   // 대형 매체 단계가 먼저
  const wh = list.slice(0, 1).map(([k, m]) => `<div class="msg ${k}"><span>${m}</span></div>`).join('');   // 한 줄: 안내 > bad > warn > ok/info
  if ($('warns').dataset.h !== wh) { $('warns').dataset.h = wh; $('warns').innerHTML = wh; marquee(); }
  if (document.activeElement !== $('hmm')) $('hmm').value = mmText(z.S); if (document.activeElement !== $('hSlider')) $('hSlider').value = z.S;
  if (document.activeElement !== $('hreal')) $('hreal').value = mmText(z.physMm);   // 매체에서의 실제 높이 (인쇄물에 놓을 크기)
  if (document.activeElement !== $('hpx')) $('hpx').value = Math.round(z.outPx * (st.unit === 'px' ? st.pngScale : 1));    // 저장될 파일의 심볼 높이 px (화면 = 매체 px/mm × 1x-4x · 인쇄 = 고른 dpi)
  $('modeLight').classList.toggle('on', st.mode === 'light'); $('modeDark').classList.toggle('on', st.mode === 'dark');
  renderPresets(c.symOnly);   // 썸네일은 심볼 (페어 고르기용)
  { const sig = st.kind === 'signature', co = st.sigType === 'company';   // Logo 섹션 — Symbol 이면 시그니처 행 비활성 (늘 자리를 지킴)
    $('kSym').classList.toggle('on', !sig); $('kSig').classList.toggle('on', sig);
    $('tCo').classList.toggle('on', co); $('tSv').classList.toggle('on', !co); $('oV').classList.toggle('on', st.orient === 'v'); $('oH').classList.toggle('on', st.orient === 'h');
    ['typeRow', 'layRow'].forEach(id => $(id).classList.toggle('off', !sig)); $('nameRow').classList.toggle('off', !sig || co);
    if (document.activeElement !== $('sigName')) $('sigName').value = co ? 'EO Studio' : st.sigName; $('sigName').disabled = !sig || co; }
  $('hSlider').style.setProperty('--zones', zoneTrack());   // 슬라이더 구간 색
  { const m = medium(), v = (m.contents?.find(([k]) => k === curContent()) || [])[2] ?? m.vis, f = (v - MM_MIN) / (MM_MAX - MM_MIN), x = `calc(var(--slider-thumb-w) * 0.5 + ${(f * 100).toFixed(3)}% - var(--slider-thumb-w) * ${f.toFixed(5)})`;   // 매체 · 콘텐츠 처음 값 자리 = 눈금 (Website 7 등)
    const zc = `var(--slider-zone-${zoneAt(v)})`;   // 눈금 색 = 그 자리 구간 색
    $('hSlider').style.setProperty('--vis-mark', v ? `linear-gradient(to right, transparent calc(${x} - var(--slider-tick-w) / 2), ${zc} calc(${x} - var(--slider-tick-w) / 2) calc(${x} + var(--slider-tick-w) / 2), transparent calc(${x} + var(--slider-tick-w) / 2))` : 'none'); }

  $('iconWrap').classList.toggle('disabled', !st.clear || !!sym.sig);   // 시그니처 = 자체 클리어스페이스라 오른쪽 보정 없음
  { const pg = sym.sig ? 'signature' : 'symbol', ci = $('clearInfo'); ci.href = `${GUIDE}${pg}#clearspace`; $('iconInfo').href = GUIDE + 'symbol#clearspace'; ci.setAttribute('aria-label', `Guide: ${sym.sig ? 'Signature' : 'Symbol'} › Clearspace`); }   // i 링크 = 지금 로고의 클리어스페이스 섹션
  // 프리뷰
  const H = z.outPx;
  const aH = z.S * st.pxmm;   // 가운데 로고 = 정한 Visual height (거리에 반응하지 않음)   // As seen — 이 화면을 50cm 에서 볼 때, 현장에서 그 거리로 보는 것과 같은 크기 (500mm 환산 S × 화면 보정값). 매체가 달라도 S 가 같으면 같은 크기
  $('workspace').style.background = c.bgView;   // 작업공간 전체 = 선택한 페어의 배경색 (보기 전용 — 내보내기는 늘 투명)
  { const h = c.bgView.replace('#', ''), [rr, gg, bb] = [0, 2, 4].map(k => parseInt(h.substr(k, 2), 16) / 255), L = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;   // 바탕 밝기
    $('workspace').style.setProperty('--art-line-w', L > 0.5 ? 'var(--art-line-w-on-light)' : 'var(--border-w)'); }   // 밝은 바탕이면 목업 · 가이드 선을 조금 굵게
  $('clear').checked = st.clear; $('icon').checked = st.icon && !sym.sig; $('guide').checked = st.guide;   // 새로고침 때 브라우저가 복원한 체크 상태를 st 기준으로 맞춤
  const gf = frameFor(c, true), gx = (gf.x0 - frame.x0) * aH, gy = (gf.y0 - frame.y0) * aH;   // 화면용 클리어스페이스 박스 — 내보내기 설정과 별개로 (Show clearspace guide)
  if (!medium().real) $('actual').innerHTML = svgMarkup(c, H, { cssW: frame.w * aH, cssH: frame.h * aH })   // 폰은 renderArt 가 실물 목업으로 채움 (한 번만 그림)
    + (st.guide ? csGuideSvg(c, gf, gx, gy, aH) : '');
  renderArt(c);   // 로고를 먼저 그린 뒤 — 그림이 로고에 닿지 않게 높이를 묶음
  $('pngScale').querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', st.unit === 'mm' ? DPI_OPTS[i] === printDpi() : +b.dataset.v === st.pngScale));
  document.querySelectorAll('aside .tg:not(.saves) button, .preset').forEach(b => b.setAttribute('aria-pressed', b.classList.contains('on')));   // 고른 상태 = 화면 읽기 프로그램에도
}

// ===== 16. 내보내기 =====
function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
$('dlSvg').onclick = () => { const c = compose();
  if (st.unit === 'mm') download(new Blob([pdfMarkup(c)], { type: 'application/pdf' }), fileBase(c) + '-cmyk.pdf');   // 인쇄 = PDF (mm · 가이드 CMYK)
  else download(new Blob([svgMarkup(c, c.z.outPx)], { type: 'image/svg+xml' }), fileBase(c) + '.svg'); };
$('dlPng').onclick = () => {
  const pr = st.unit === 'mm', c = compose(), k = pr ? 1 : st.pngScale, H = c.z.outPx * k, dpi = printDpi();   // 인쇄 = 고른 dpi 그대로 (배율 없음)
  const name = fileBase(c) + (pr ? `@${dpi}dpi` : k > 1 ? `@${k}x` : '') + '.png';   // 이름은 지금 설정으로 (저장이 끝나기 전에 설정을 바꿔도 그대로)
  const w = Math.max(1, Math.round(c.frame.w * H)), h = Math.max(1, Math.round(c.frame.h * H));
  if (w > PNG_MAX_SIDE || h > PNG_MAX_SIDE || w * h > PNG_MAX_AREA) { $('err').textContent = `PNG would be ${w} × ${h} px — too large for the browser. Choose a lower dpi, or save the PDF.`; $('err').style.display = 'block'; return; }   // 브라우저 캔버스 한계 (넘으면 빈 파일) — 빌보드 300dpi 등
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.translate((cv.width - c.frame.w * H) / 2, (cv.height - c.frame.h * H) / 2);   // 반올림 오차는 중앙으로 분산
  ctx.fillStyle = c.fg; ctx.fill(new Path2D(pathD(c.sym.mp, c.frame, H)), 'evenodd');
  cv.toBlob(async b => { if (!b) { $('err').textContent = 'PNG could not be created. Try a smaller size.'; $('err').style.display = 'block'; return; } if (pr) b = await pngWithDpi(b, dpi); download(b, name); }, 'image/png');
};
const PNG_MAX_SIDE = 16384, PNG_MAX_AREA = 16384 * 16384;   // 브라우저 캔버스 한계 (Chrome · Safari 공통으로 안전한 값)
// 인쇄 출력 — PNG 에 dpi(pHYs) 넣기 · PDF(CMYK) 만들기
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (const x of b) c = CRC_T[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
async function pngWithDpi(blob, dpi) {   // IHDR 바로 뒤에 pHYs 청크 (단위 = 미터당 픽셀) — 일러 · 포토샵이 실제 크기로 엶
  const src = new Uint8Array(await blob.arrayBuffer()), ppm = Math.round(dpi / 0.0254), ch = new Uint8Array(21), dv = new DataView(ch.buffer);
  dv.setUint32(0, 9); ch.set([112, 72, 89, 115], 4); dv.setUint32(8, ppm); dv.setUint32(12, ppm); ch[16] = 1; dv.setUint32(17, crc32(ch.subarray(4, 17)));
  const parts = [src.subarray(0, 8 + 25), ch], sv = new DataView(src.buffer, src.byteOffset);   // 시그니처 + IHDR, 새 pHYs
  for (let o = 8 + 25; o < src.length;) { const len = sv.getUint32(o), end = o + 12 + len; if (String.fromCharCode(...src.subarray(o + 4, o + 8)) !== 'pHYs') parts.push(src.subarray(o, end)); o = end; }   // 원래 pHYs 가 있으면 뺌 (브라우저마다 다름)
  return new Blob(parts, { type: 'image/png' });
}
const CMYK = { 'Builder Neon': [5, 0, 95, 0], 'Day Blue': [60, 0, 10, 0], 'Bay Green': [60, 0, 50, 0], 'Medium Gray': [2, 0, 0, 45], 'Solid Gray': [4, 0, 0, 95], 'Space Black': [60, 60, 0, 100], 'Air White': [1, 2, 2, 0] };   // 가이드 Color › 팔레트의 인쇄용 값 (Air White 는 백색 용지로 대체 가능)
function pdfMarkup(c) {   // 한 쪽짜리 PDF — 쪽 크기 = 내보내는 틀(mm → pt), 로고 = 짝홀 채우기 한 번, 색 = 가이드 CMYK
  const H = c.z.physMm * 72 / 25.4, W = c.frame.w * H, Hh = c.frame.h * H, f = v => (Math.round(v * 1000) / 1000).toString();
  const [C, M, Y, K] = CMYK[c.preset.fg].map(v => v / 100);
  let path = ''; for (const poly of c.sym.mp) for (const ring of poly) path += openRing(ring).map(([x, y], i) => `${f((x - c.frame.x0) * H)} ${f(Hh - (y - c.frame.y0) * H)} ${i ? 'l' : 'm'}`).join('\n') + '\nh\n';
  const body = `${C} ${M} ${Y} ${K} k\n${path}f*\n`;
  const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(W)} ${f(Hh)}] /TrimBox [0 0 ${f(W)} ${f(Hh)}] /Contents 4 0 R /Resources << >> >>`,
    `<< /Length ${body.length} >>\nstream\n${body}endstream`];
  let pdf = '%PDF-1.4\n'; const off = [];
  objs.forEach((o, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return pdf;
}

// ===== 17. 컨트롤 연결 =====
const mmText = v => (Math.round(v * 10) / 10).toFixed(1);   // 항상 소수 한 자리 — 자릿수가 바뀌며 숫자가 뛰지 않게 (실제 값과 같은 자리까지)
const sizeZones = () => RULES.zones[st.kind !== 'signature' ? 'symbol' : st.orient === 'h' ? 'sigH' : 'sigV'];   // 지금 형의 구간 (RULES)
const zoneAt = v => zoneOf(sizeZones(), v);   // 슬라이더 색 · 눈금 · 상태 메시지가 모두 이것 하나로 판정
function zoneTrack() {   // 보이는 높이 구간(warnings 와 같은 경계)을 슬라이더 위치로
  const lo = MM_MIN, hi = MM_MAX;
  const pct = S => { const f = Math.max(0, Math.min(1, (S - lo) / (hi - lo))); return f <= 0 ? '0%' : f >= 1 ? '100%' : `calc(var(--slider-thumb-w) * 0.5 + ${(f * 100).toFixed(3)}% - var(--slider-thumb-w) * ${f.toFixed(5)})`; };   // 트랙은 패널 폭 전체, 구간 경계는 썸 가운데가 지나는 자리
  const z = sizeZones();
  const stops = z.slice(0, -1).map(([a, k], i) => `var(--slider-zone-${k}) ${pct(a)} ${pct(z[i + 1][0])}`);
  return `linear-gradient(to right, ${stops.join(', ')})`;
}
const clampVis = v => Math.min(MM_MAX, Math.max(MM_MIN, v));
$('hSlider').value = st.vis; $('hmm').value = mmText(st.vis);
const setVis = (v, keepField) => { st.visReq = st.vis = v; $('hSlider').value = v; if (!keepField) $('hmm').value = mmText(v); };   // Visual height 를 정하는 곳은 모두 여기로 (요청값 = 실제값, 상한은 update 에서)
$('hSlider').oninput = e => { setVis(+e.target.value); update(); };
$('hmm').oninput = e => { const v = parseFloat(e.target.value); if (v > 0) { setVis(clampVis(v), true); update(); } };
$('hmm').addEventListener('blur', () => { $('hmm').value = mmText(st.vis); });   // 다 입력하면 실제 값으로 (범위 밖 · 상한)
$('hreal').onchange = e => { const v = parseFloat(e.target.value); if (v > 0) { setVis(clampVis(v * 500 / st.dist)); update(); } };
$('hpx').onchange = e => { const v = parseFloat(e.target.value) / (st.unit === 'px' ? st.pngScale : 1); if (v > 0) { setVis(clampVis(v / pxPerMm() * 500 / st.dist)); update(); } };
// 매체 = 쓰는 곳: 고르면 대표 거리로 한 번 맞추고, 출력 단위 · 해상도와 그림을 정함 (거리는 그 뒤 자유). MacBook 16″ = 가이드 기준 500mm · 5px/mm (기본 배율 1728px ÷ 345mm) / Desktop 24″ = FHD 100% 3.6px/mm · 65cm / iPhone 18 = 그 기기 논리 해상도(pt) / A4 · Poster · Billboard = 인쇄(dpi).
const PHONE_PXMM = 460 / 3 / 25.4;   // iPhone 18 (6.3″ · 460ppi · @3x) 논리 해상도 ≈ 6.04 pt/mm. 일반 모델 미발표(2026-11) — 같은 6.3″ 로 알려진 18 Pro 수치
const MEDIA = {   // 출력 기준 — 화면: 그 매체의 표준 px/mm · 인쇄: 그 매체의 실제 출력 해상도 dpi (대형 출력일수록 낮음)
  // vis = 매체를 고를 때 Visual height 처음 값 (그 매체에서 흔한 로고 크기 — 사용자가 직접 조정)
  // dist = 대표 거리 (매체마다 필수, 옵션 값은 매체 id) — 매체를 고르면 이 거리로 맞춤, 다른 경우만 거리 칸에서 직접 수정 (Symbol height 는 그대로, 실제 크기 · 출력만 변함)
  'iphone': { dist: 300, unit: 'px', pxmm: PHONE_PXMM, vis: 8, real: true, contents: [['feed', 'Feed 3:4'], ['story', 'Story 9:16'], ['video', 'Video 16:9']] },   // real = 실물 크기 목업 · contents = 디지털 매체의 콘텐츠 종류 (목업 프레임 · 로고 자리 후보가 바뀜, 인쇄 매체는 없음 → 비활성)   // iPhone 18
  'iphone-pm': { dist: 300, unit: 'px', pxmm: PHONE_PXMM, vis: 8.5, real: true, contents: [['feed', 'Feed 3:4'], ['story', 'Story 9:16'], ['video', 'Video 16:9']] },   // iPhone 18 Pro Max (6.9″ · 460ppi · @3x — 화면 72.9 × 158.4mm, 440 × 956 pt)
  'macbook': { dist: 500, unit: 'px', pxmm: 5.0, vis: 12, contents: [['video', 'Video 16:9'], ['web', 'Website', 7]] },   // MacBook 16″ (화면 345 × 223mm, 기본 1728 × 1117)
  'desktop-24': { dist: 650, unit: 'px', pxmm: 3.6, vis: 12, contents: [['video', 'Video 16:9'], ['web', 'Website', 7]] },   // Desktop 24″ (화면 531 × 299mm, FHD 100%)
  'desktop-27': { dist: 700, unit: 'px', pxmm: 2560 / 597.7, vis: 12, contents: [['video', 'Video 16:9'], ['web', 'Website', 7]] },   // Desktop 27″ (화면 597.7 × 336.2mm, QHD 100% · 4K 150% 와 같은 2560 × 1440 · 4.28px/mm) · 70cm
  'a4': { dist: 400, unit: 'mm', dpi: 300, vis: 10 },   // A4 document (210 × 297mm)   // 인쇄 매체 dpi = Export 의 dpi 버튼 처음 선택 (A4 300 · A2 150 · Billboard 20)
  'a2': { dist: 1200, unit: 'mm', dpi: 150, vis: 7 },   // A2 poster (420 × 594mm), 일반 인쇄 — 정면 = 갤러리 기준 대각선(727mm)의 1.5-2배 ≈ 1.2m · 지나가며 2.4m (같은 로고가 4mm 로 보이는 거리)
  'billboard': { dist: 40000, unit: 'mm', dpi: 20, vis: 4 },   // Billboard 48 × 14ft — 처음 값 4mm = 40m 에서 320mm (보드 높이의 약 7.5%). 실물 크기 출력 10-20dpi. 상황은 일반적인 하나만 (먼 거리는 로고가 가이드보다 커져 다루지 않음)
};
const medium = () => MEDIA[$('distPreset').value];
const DPI_OPTS = [20, 72, 150, 300];   // 인쇄 매체 PNG 해상도 버튼 — 20 빌보드 · 72 배너 · 사인 · 150 포스터 · 300 손에 드는 인쇄 (그 이상은 파일만 커짐)
const printDpi = () => st.dpi || medium().dpi;   // 고른 dpi (매체를 바꾸면 그 매체 처음 값으로)
const pxPerMm = () => st.unit === 'px' ? medium().pxmm : printDpi() / 25.4;   // 매체가 정함 — 화면이면 그 매체 px/mm, 인쇄면 그 매체 dpi (사용자 화면 보정값은 미리보기에만)
$('contSel').onchange = e => { st.content[$('distPreset').value] = e.target.value;   // 콘텐츠에 처음 Visual height 가 있으면 그 값 (Website 7), 없으면 매체 값으로
  const m = medium(), cv = (m.contents.find(([v]) => v === e.target.value) || [])[2] ?? m.vis; if (cv) setVis(cv); update(); };
$('distPreset').onchange = e => { st.dist = medium().dist; st.dpi = medium().dpi || null;   // 매체마다 대표 거리 (dist) — 옵션 값은 매체 id (같은 거리 매체가 둘이면 dist 로)
  const m = medium(), cv = m.contents ? ((m.contents.find(([v]) => v === curContent()) || [])[2] ?? m.vis) : m.vis; if (cv) setVis(cv); if (document.activeElement === $('dist')) $('dist').blur(); update(); showDist(); };   // 매체를 고르면 그 매체의 대표 거리 · 처음 Visual height 로 한 번 맞춤 (그 뒤 거리는 자유 — 매체는 그대로)
// 보는 거리 표시: 내부는 mm, 칸에는 3m 미만 cm · 3m 부터 m (Poster 까지 cm, Billboard 는 m)
const DIST_M_FROM = 3000;
let distUnit = 'cm';
function showDist() { distUnit = st.dist >= DIST_M_FROM ? 'm' : 'cm'; $('distUnit').textContent = distUnit; $('dist').value = distUnit === 'm' ? +(st.dist / 1000).toFixed(1) : Math.round(st.dist / 10); }
$('dist').oninput = e => { const v = parseFloat(e.target.value); if (v > 0) { st.dist = clampDist(v * (distUnit === 'm' ? 1000 : 10)); update(); } };   // 입력 중엔 단위를 바꾸지 않음
$('dist').addEventListener('blur', showDist);   // 다 입력하면 단위 다시 맞춤
const clampDist = d => Math.min(1000000, Math.max(50, d));   // 칸에 넣을 수 있는 거리 5cm ~ 1km
function syncDevice() {   // 고른 매체 이름 · 출력 기준
  const sel = $('distPreset'), m = medium();
  $('deviceVal').textContent = sel.options[sel.selectedIndex].textContent;
  st.unit = m.unit;   // 매체가 화면(px) / 인쇄(mm)를 정함
  const cs = $('contSel'), cur = curContent(); $('contRow').classList.toggle('off', !m.contents);   // 콘텐츠 = 디지털 매체만, 인쇄 매체는 비활성
  if (cs.dataset.for !== sel.value) { cs.innerHTML = (m.contents || [['', '—']]).map(([v, n]) => `<option value="${v}">${n}</option>`).join(''); cs.dataset.for = sel.value; }   // 목록은 매체가 바뀔 때만 다시 (열린 목록이 닫히지 않게)
  cs.value = cur || ''; cs.disabled = !m.contents;
  $('contVal').textContent = m.contents ? m.contents.find(([v]) => v === cur)[1] : '—';
  $('hpxLabel').innerHTML = m.unit === 'mm' ? `Output height · ${printDpi()} dpi` : 'Output height';   // 인쇄 매체만 출력 해상도를 라벨에
  const pr = m.unit === 'mm';   // 인쇄 = 1x-4x 자리가 dpi 버튼 · Save SVG 자리가 Save PDF (CMYK)
  $('pngScale').querySelectorAll('button').forEach((b, i) => b.textContent = pr ? DPI_OPTS[i] : (i + 1) + 'x');   // 단위(dpi)는 행 이름에
  $('scaleLabel').textContent = pr ? 'Resolution · dpi' : 'Scale';
  $('dlSvg').textContent = pr ? 'PDF ↓' : 'SVG ↓';
}
const setMode = m => { st.mode = m; if (PRESETS.find(p => p.n === st.preset).mode !== m) st.preset = PRESETS.find(p => p.mode === m).n; update(); };
$('modeLight').onclick = () => setMode('light');
$('modeDark').onclick = () => setMode('dark');
$('clear').onchange = e => { st.clear = e.target.checked; update(); };
$('icon').onchange = e => { st.icon = e.target.checked; update(); };
$('guide').onchange = e => { st.guide = e.target.checked; update(); };
$('kSym').onclick = () => { st.kind = 'symbol'; update(); };
$('kSig').onclick = () => { st.kind = 'signature'; update(); };
$('tCo').onclick = () => { st.sigType = 'company'; update(); };
$('tSv').onclick = () => { st.sigType = 'service'; update(); };
$('oV').onclick = () => { st.orient = 'v'; update(); };
$('oH').onclick = () => { st.orient = 'h'; update(); };
$('sigName').oninput = e => { const el = e.target, v = el.value, cap = v.replace(/^(\s*)(\p{Ll})/u, (m, sp, ch) => sp + ch.toUpperCase());   // 첫 글자는 늘 대문자 (입력칸에서 바로 바뀜 = 보이는 것과 나가는 것이 같음)
  if (cap !== v) { const p = el.selectionStart; el.value = cap; el.setSelectionRange(p, p); } st.sigName = cap; update(); };
$('pngScale').querySelectorAll('button').forEach((b, i) => b.onclick = () => { if (st.unit === 'mm') st.dpi = DPI_OPTS[i]; else st.pngScale = +b.dataset.v; update(); });
let rzRaf = 0; window.addEventListener('resize', () => { TOK_PX.clear(); cancelAnimationFrame(rzRaf); rzRaf = requestAnimationFrame(update); });   // 창 크기 = 한 프레임에 한 번만 다시 그림
// 길이 토큰의 실제 px — calc(var(--lh-unit) * 0.5) 같은 식은 getPropertyValue 가 문자열 그대로 돌려줘 parseFloat 로 못 읽으므로, 숨긴 요소 폭으로 계산값을 잼
// 상태 메시지가 한 줄을 넘치면: 멈춤(--msg-mq-wait) → 끝까지 흐름(--msg-mq-speed) → 멈춤 → 사라졌다 처음에서 나타남, 반복
const tokenSec = name => { const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v.endsWith('ms') ? parseFloat(v) / 1000 : parseFloat(v); };
function marquee() {
  const box = $('warns').querySelector('.msg'); if (!box) return;
  const sp = box.querySelector('span'); sp.getAnimations().forEach(a => a.cancel()); box.classList.remove('mq');
  const over = box.scrollWidth - box.clientWidth;
  if (over <= 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // 다 들어가거나 모션 줄이기 설정이면 말줄임 그대로
  box.classList.add('mq');
  const wait = tokenSec('--msg-mq-wait'), fade = tokenSec('--msg-mq-fade-dur'), move = over / (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--msg-mq-speed')) || 40);
  const T = wait + move + wait + fade, o = t => t / T, x = `translateX(${-over}px)`;
  sp.animate([
    { transform: 'translateX(0)', opacity: 1, offset: 0 },
    { transform: 'translateX(0)', opacity: 1, offset: o(wait) },
    { transform: x, opacity: 1, offset: o(wait + move) },
    { transform: x, opacity: 1, offset: o(wait + move + wait) },
    { transform: x, opacity: 0, offset: o(wait + move + wait + fade / 2) },
    { transform: 'translateX(0)', opacity: 0, offset: o(wait + move + wait + fade / 2) + 1e-4 },
    { transform: 'translateX(0)', opacity: 1, offset: 1 },
  ], { duration: T * 1000, iterations: Infinity });
}
addEventListener('resize', () => marquee());
document.fonts && document.fonts.ready.then(() => marquee());   // 서체가 늦게 오면 폭을 다시 잼
// ===== 18. 미디엄 그림 — 선 그림(mm 좌표) 안에 심볼을 실제 높이로. w · h = 그림 전체, at = 심볼 왼쪽 위 (심볼 폭 · 높이를 받아) =====
const artPlace = (box, w, h, m, where) => {
    // box = 콘텐츠 영역 [x, y, 폭, 높이] 안 모서리에 심볼 (가이드 Symbol › Placement 사인오프)
  // 여백 = 가이드 Typography › Margin: 콘텐츠 영역 긴 변의 1/24 (m), 가로는 10% 좁게 · 단 클리어스페이스 H/2 이상 (Symbol › Clearspace). 심볼이 커서 못 들어가면 줄임
  const [bx, by, bw, bh] = box, my = Math.max(0, Math.min(Math.max(m, h / 2), (bh - h) / 2)), mx = Math.max(0, Math.min(Math.max(m * 0.9, h / 2), (bw - w) / 2));
  return { c: [bx + (bw - w) / 2, by + (bh - h) / 2], tl: [bx + mx, by + my], tr: [bx + bw - mx - w, by + my], br: [bx + bw - mx - w, by + bh - my - h], bl: [bx + mx, by + bh - my - h], tc: [bx + (bw - w) / 2, by + my], bc: [bx + (bw - w) / 2, by + bh - my - h] }[where];
};
const PHONE_BODY = {   // 폰 본체 선 (세로 v · 가로 h) — 콘텐츠마다 다른 건 맨 뒤 콘텐츠 영역(zn)뿐
  iphone: { v: `<rect class="ln" width="71.9" height="150" rx="11"/><rect class="ln" x="1.6" y="1.6" width="68.7" height="146.8" rx="9.6"/><rect class="ln" x="25.95" y="4.6" width="20" height="6.2" rx="3.1"/><line class="ln" x1="23.95" y1="145" x2="47.95" y2="145"/>`, h: `<rect class="ln" width="150" height="71.9" rx="11"/><rect class="ln" x="1.6" y="1.6" width="146.8" height="68.7" rx="9.6"/><rect class="ln" x="4.6" y="25.95" width="6.2" height="20" rx="3.1"/><line class="ln" x1="63.0" y1="66.9" x2="87.0" y2="66.9"/>` },
  iphonePM: { v: `<rect class="ln" width="78" height="163.4" rx="12"/><rect class="ln" x="1.7" y="1.7" width="74.6" height="160.0" rx="10.4"/><rect class="ln" x="29.0" y="4.8" width="20" height="6.2" rx="3.1"/><line class="ln" x1="27.0" y1="158.4" x2="51.0" y2="158.4"/>`, h: `<rect class="ln" width="163.4" height="78" rx="12"/><rect class="ln" x="1.7" y="1.7" width="160.0" height="74.6" rx="10.4"/><rect class="ln" x="4.8" y="29.0" width="6.2" height="20" rx="3.1"/><line class="ln" x1="69.7" y1="73" x2="93.7" y2="73"/>` },
};
const SCREEN_BODY = {   // 노트북 · 모니터 본체 선 — 영상 · 웹이 같고, 다른 건 맨 뒤 콘텐츠 영역(zn)만
  'macbook': `<rect class="ln" x="6" width="358" height="246" rx="9"/><rect class="ln" x="12.5" y="7" width="345" height="223" rx="2"/><path class="ln" d="M170 7 V11.5 Q170 13 171.5 13 H198.5 Q200 13 200 11.5 V7"/><path class="ln" d="M0 246 H370 V250 Q370 253 367 253 H3 Q0 253 0 250 Z M160 246 V248.5 H210 V246"/>`,
  'desktop-24': `<rect class="ln" width="545" height="315" rx="6"/><rect class="ln" x="7" y="7" width="531" height="299"/><path class="ln" d="M248.5 315 L240.5 410 M296.5 315 L304.5 410"/><rect class="ln" x="162.5" y="410" width="220" height="12" rx="6"/>`,
  'desktop-27': `<rect class="ln" width="611.7" height="352.2" rx="6"/><rect class="ln" x="7" y="7" width="597.7" height="336.2"/><path class="ln" d="M281.85 352.2 L273.85 447.2 M329.85 352.2 L337.85 447.2"/><rect class="ln" x="195.85" y="447.2" width="220" height="12" rx="6"/>`,
};
const ART = {
  'iphone': {
    feed: { w: 71.9, h: 150, spec: { size: [66.6, 144.8], res: '402 × 874 px' }, slots: [[[1.6, 29.2, 68.7, 91.6], 91.6 / 24, 'tr', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // iPhone 18 피드 3:4 (1080 × 1440)
      d: `${PHONE_BODY.iphone.v}<rect class="zn" x="1.6" y="29.2" width="68.7" height="91.6"/>` },
    story: { w: 71.9, h: 150, spec: { size: [66.6, 144.8], res: '402 × 874 px' }, slots: [[[1.6, 13.94, 68.7, 122.13], 122.13 / 24, 'tr', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // iPhone 18 스토리 9:16 — 화면 폭에 맞춰 가운데 (위아래 여백 = 영상 16:9 의 좌우 여백과 같은 방식). 로고 자리 = 9:16 프레임 전체 — 위 · 아래 줄은 프레임 위아래 끝에서 여백(긴 변 1/24)만큼 (피드 3:4 줄과 다르게)
      d: `${PHONE_BODY.iphone.v}<rect class="zn" x="1.6" y="13.94" width="68.7" height="122.13"/>` },
    video: { w: 150, h: 71.9, spec: { size: [66.6, 144.8], res: '402 × 874 px' }, slots: [[[13.94, 1.6, 122.13, 68.7], 122.13 / 24, 'tr', ['tr', 'c']]],   // iPhone 18 영상 16:9 (가로)
      d: `${PHONE_BODY.iphone.h}<rect class="zn" x="13.94" y="1.6" width="122.13" height="68.7"/>` } },
  'iphone-pm': {
    feed: { w: 78, h: 163.4, spec: { size: [72.9, 158.4], res: '440 × 956 px' }, slots: [[[1.7, 31.96, 74.6, 99.47], 99.47 / 24, 'tr', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // iPhone 18 Pro Max 피드 3:4 (1080 × 1440)
      d: `${PHONE_BODY.iphonePM.v}<rect class="zn" x="1.7" y="31.96" width="74.6" height="99.47"/>` },
    story: { w: 78, h: 163.4, spec: { size: [72.9, 158.4], res: '440 × 956 px' }, slots: [[[1.7, 15.39, 74.6, 132.62], 132.62 / 24, 'tr', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // iPhone 18 Pro Max 스토리 9:16 — 화면 폭에 맞춰 가운데 (위아래 여백 = 영상 16:9 의 좌우 여백과 같은 방식). 로고 자리 = 9:16 프레임 전체 — 위 · 아래 줄은 프레임 위아래 끝에서 여백(긴 변 1/24)만큼 (피드 3:4 줄과 다르게)
      d: `${PHONE_BODY.iphonePM.v}<rect class="zn" x="1.7" y="15.39" width="74.6" height="132.62"/>` },
    video: { w: 163.4, h: 78, spec: { size: [72.9, 158.4], res: '440 × 956 px' }, slots: [[[15.39, 1.7, 132.62, 74.6], 132.62 / 24, 'tr', ['tr', 'c']]],   // iPhone 18 Pro Max 영상 16:9 (가로)
      d: `${PHONE_BODY.iphonePM.h}<rect class="zn" x="15.39" y="1.7" width="132.62" height="74.6"/>` } },
  'a4': { w: 210, h: 297, boost: 1.2, spec: { size: [210, 297] }, slots: [[[0, 0, 210, 297], 297 / 24, 'tl', ['tl', 'tc', 'tr', 'bl', 'bc', 'br']]],   // A4 document — 종이 실루엣, 왼쪽 위 (레터헤드 자리)
    d: `<rect class="ln" width="210" height="297"/>` },
  'macbook': { video: { w: 370, h: 253, ref: true, spec: { size: [345, 223], res: '1728 × 1117 px' }, slots: [[[12.5, 21.47, 345, 194.06], 345 / 24, 'tr', ['tr', 'c']]],   // MacBook 16″ 영상 16:9 (화면 16:10 안 가운데)
    d: `${SCREEN_BODY['macbook']}<rect class="zn" x="12.5" y="21.47" width="345" height="194.06"/>` },
    web: { w: 370, h: 253, ref: true, spec: { size: [345, 223], res: '1728 × 1117 px' }, slots: [[[12.5, 30.4, 345, 199.6], 345 / 48, 'tc', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // MacBook 16″ 웹사이트 — 메뉴 막대 24pt + 브라우저 막대 약 93pt(≈ 23.4mm) 아래 뷰포트, 로고 처음 = 위 가운데 (헤더) · 여백은 사방 모두 일반 지면의 절반 (긴 변 1/48, 클리어스페이스 H/2 는 지킴)
    d: `${SCREEN_BODY['macbook']}<rect class="zn" x="12.5" y="30.4" width="345" height="199.6"/>` } },
  'desktop-24': { video: { w: 545, h: 422, ref: true, spec: { size: [531, 299], res: '1920 × 1080 px' }, slots: [[[7, 7, 531, 299], 531 / 24, 'tr', ['tr', 'c']]],   // Desktop 24″ 영상 16:9 (화면 전체)
    d: SCREEN_BODY['desktop-24'] },
    web: { w: 545, h: 422, ref: true, spec: { size: [531, 299], res: '1920 × 1080 px' }, slots: [[[7, 35.9, 531, 270.1], 531 / 48, 'tc', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // Desktop 24″ 웹사이트 — 메뉴 막대 + 브라우저 막대 약 104px(≈ 28.9mm) 아래 뷰포트
    d: `${SCREEN_BODY['desktop-24']}<rect class="zn" x="7" y="35.9" width="531" height="270.1"/>` } },
  'desktop-27': { video: { w: 611.7, h: 459.2, ref: true, spec: { size: [597.7, 336.2], res: '2560 × 1440 px' }, slots: [[[7, 7, 597.7, 336.2], 597.7 / 24, 'tr', ['tr', 'c']]],   // Desktop 27″ 영상 16:9 (화면 전체) — Desktop 24″ 와 같은 짜임: 베젤 7 · 아래 턱 9 · 받침(목 95 · 발 220 × 12)은 같은 실물 크기
    d: SCREEN_BODY['desktop-27'] },
    web: { w: 611.7, h: 459.2, ref: true, spec: { size: [597.7, 336.2], res: '2560 × 1440 px' }, slots: [[[7, 31.28, 597.7, 311.92], 597.7 / 48, 'tc', ['tl', 'tc', 'tr', 'c', 'bl', 'bc', 'br']]],   // Desktop 27″ 웹사이트 — 메뉴 막대 + 브라우저 막대 104px(Desktop 24″ 와 같은 px, 4.28px/mm 라 ≈ 24.3mm) 아래 뷰포트
    d: `${SCREEN_BODY['desktop-27']}<rect class="zn" x="7" y="31.28" width="597.7" height="311.92"/>` } },
  'a2': { w: 420, h: 594, boost: 1.2, spec: { size: [420, 594], space: [420, 178.2] }, slots: [[[0, 415.8, 420, 178.2], 420 / 24, 'br', ['tl', 'tr', 'bl', 'br']]],   // Poster A2 — 조닝: 위 70% 그래픽 패턴 · 아래 30% 콘텐츠 (가이드 Typography › Zoning A판형), 로고 = 콘텐츠 영역 오른쪽 아래, 마진 = 콘텐츠 긴 변 1/24
    d: `<rect class="ln" width="420" height="594"/><path class="zn" d="M0 415.8 H420 M0 0 L420 415.8 M420 0 L0 415.8"/>` },
  'billboard': { w: 15830, h: 10870, boost: 1.55, spec: { size: [14630, 4270], space: [4389, 4270] }, slots: [[[600, 0, 4389, 4270], 4389 / 24, 'bl', ['tl', 'bl']]],   // Billboard — 48 × 14ft 보드 + 발판 + 기둥 하나 (가이드 Pattern › In Use 빌보드). 조닝: 왼쪽 30% 콘텐츠 · 오른쪽 70% 그래픽 패턴, 로고 = 콘텐츠 영역 왼쪽 아래
    d: `<rect class="ln" x="600" width="14630" height="4270"/><path class="ln" d="M2600 4270 V4570 M7915 4270 V4570 M13230 4270 V4570"/><rect class="ln" y="4570" width="15830" height="300"/><rect class="ln" x="7415" y="4870" width="1000" height="6000"/><path class="ln" d="M-800 10870 H16630"/><path class="zn" d="M4989 0 V4270 M4989 0 L15230 4270 M15230 0 L4989 4270"/>` },
};
// 목업 캡션 글 — 1줄 매체 이름 / 2줄 디지털: 화면 크기 · 해상도, 인쇄: 크기 · dpi (3m 부터 m)
function artLabel(a) {
  const sel = $('distPreset'), name = sel.options[sel.selectedIndex].textContent, [sw0, sh0] = a.spec.size, m = medium();
  const big = Math.max(sw0, sh0) >= DIST_M_FROM, u = v => big ? +(v / 1000).toFixed(1) : +(v / 10).toFixed(1);
  return { name, spec: `${u(sw0)} × ${u(sh0)} ${big ? 'm' : 'cm'} · ${m.unit === 'px' ? a.spec.res : `${printDpi()} dpi`}` };
}
const artTooBig = (a, sw, sh) => { const [w, h] = a.spec.space || a.spec.size; return sw * sh / (w * h) > ART_AREA_MAX; };   // 로고 면적 ÷ 로고가 놓인 공간
// 폰: 캘리브레이션 px/mm 로 고른 콘텐츠의 실물 크기 목업을 가운데에 — 그 안의 로고도 실제 크기
function renderReal(c, a) {   // 폰 = 고른 콘텐츠의 실물 크기 목업 하나 (캘리브레이션 px/mm) — 로고 · 클리어스페이스 윤곽도 실제 크기
  const f2 = frameFor(c, false), H = c.z.physMm, sw = f2.w * H, sh = f2.h * H, spots = artSpots(a, sw, sh, c), r = v => +v.toFixed(3), gf = frameFor(c, true);   // 클리어스페이스 윤곽 = 화면용 가이드 (내보내기와 별개)
  const syms = spots.map(([x, y]) => symMark(c, f2, x, y, sw, sh, r)
    + (st.guide ? `<g class="csGuide" transform="translate(${r(x + (gf.x0 - f2.x0) * H)} ${r(y + (gf.y0 - f2.y0) * H)}) scale(${1 / st.pxmm})">${csGuideInner(c, gf, H * st.pxmm)}</g>` : '')).join('');   // 클리어스페이스 = 가운데 로고와 같은 장표 문법 (화면 px 로 그려 mm 좌표에 맞춤)
  $('actual').innerHTML = `<div class="realArt" style="color:${c.fg};--art-fg:${artFg(c)};--art-bg:${c.bgView}"><svg class="mock${artHov ? ' hov' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a.w} ${a.h}" width="${r(a.w * st.pxmm)}" height="${r(a.h * st.pxmm)}">${a.d}${syms}${ghostMarks(c, a, f2, sw, sh, st.pxmm, r)}</svg></div>`;
}
// 목업 심볼 자리 — slots = [[면 x, y, 폭, 높이], 여백, 기본 자리, 후보 자리들] (매체마다 쓸 만한 자리만: 화면 UI = 위 모서리 · 가운데, 지면 = 네 모서리, 빌보드 = 콘텐츠 영역 왼쪽 위 · 아래)
const curContent = () => { const m = medium(); return m.contents ? (st.content[$('distPreset').value] || m.contents[0][0]) : null; };
const artKey = () => $('distPreset').value + ':' + (curContent() || '');   // 자리 기억 = 매체 + 콘텐츠별
const artFor = () => { const a = ART[$('distPreset').value]; return a && !a.d ? a[curContent()] : a; };   // 콘텐츠별 목업이 있으면 그것
const slotWhere = (i, sl) => ((st.place[artKey()] || [])[i]) || sl[2];   // 고른 자리 (없으면 기본)
// 자리 계산 — 가운데 계열(c · tc · bc)은 가로로 클리어스페이스 박스를 가운데에 (아이콘 보정을 켜면 오른쪽 여백이 줄어 심볼이 오른쪽으로 = 가이드 App & Social Icons › Alignment). 모서리는 심볼 가장자리 기준이라 그대로
function placeSym(c, sl, sw, sh, where) {
  const [x, y] = artPlace(sl[0], sw, sh, sl[1], where);
  if (!/^(c|tc|bc)$/.test(where)) return [x, y];
  const f2 = frameFor(c, false), fr = c.frame, H = c.z.physMm, [bx, , bw] = sl[0];
  return [bx + bw / 2 - fr.w * H / 2 + (f2.x0 - fr.x0) * H, y];
}
const artSpots = (a, sw, sh, c) => a.slots.map((sl, i) => placeSym(c, sl, sw, sh, slotWhere(i, sl)));
const symMark = (c, f2, x, y, sw, sh, r) => `<svg class="sym" x="${r(x)}" y="${r(y)}" width="${r(sw)}" height="${r(sh)}" viewBox="0 0 ${r(f2.w)} ${r(f2.h)}"><path fill-rule="evenodd" d="${pathD(c.sym.mp, f2, 1)}"/></svg>`;
function ghostMarks(c, a, f2, sw, sh, k, r) {   // 다른 자리 후보마다 흐린 심볼 + 누르기 쉬운 투명 영역 (화면 기준 최소 크기)
  const pad = tokenPx('--ghost-hit') / k;
  return a.slots.flatMap((sl, i) => {
    const cur = slotWhere(i, sl), cand = (sl[3] || ['tl', 'tr', 'bl', 'br']).filter(w => w !== cur).map(w => ({ w, p: placeSym(c, sl, sw, sh, w) }));
    const all = [...cand.map(o => o.p), placeSym(c, sl, sw, sh, cur)];   // 지금 자리도 장애물 (누를 일 없음)
    const cen = p => [p[0] + sw / 2, p[1] + sh / 2];
    return cand.map(({ w, p }) => {   // 클릭 영역 — 겹치는 이웃과는 두 중심의 한가운데에서 나눔 (위에 그려진 후보가 다 먹지 않게, 가로로 더 떨어졌으면 세로선 · 아니면 가로선)
      const [cx, cy] = cen(p); let x0 = p[0] - pad, y0 = p[1] - pad, x1 = p[0] + sw + pad, y1 = p[1] + sh + pad;
      for (const q of all) { if (q === p) continue; const [qx, qy] = cen(q), dx = qx - cx, dy = qy - cy;
        if (Math.abs(dx) >= sw + 2 * pad || Math.abs(dy) >= sh + 2 * pad || (!dx && !dy)) continue;   // 안 겹치면 그대로
        if (Math.abs(dx) / sw >= Math.abs(dy) / sh) { if (dx > 0) x1 = Math.min(x1, cx + dx / 2); else x0 = Math.max(x0, cx + dx / 2); }
        else { if (dy > 0) y1 = Math.min(y1, cy + dy / 2); else y0 = Math.max(y0, cy + dy / 2); } }
      return `<g class="artGhost" data-slot="${i}" data-where="${w}"><rect class="hit" x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}"/>${symMark(c, f2, p[0], p[1], sw, sh, r)}</g>`;
    });
  }).join('');
}
const artFg = c => st.mode === 'light' ? HEX['Air White'] : c.fg;   // 목업 · 가이드 선의 기준색 — 라이트 모드는 Air White 고정 (페어 심볼 색을 따르지 않음), 다크는 페어 글자색. 목업 속 로고는 늘 페어 색
let artHov = false;   // 마우스가 목업 위에 있나 — 다시 그릴 때 후보를 바로 보이게 (클릭 뒤 깜빡임 방지)
document.addEventListener('pointerover', e => { const on = !!(e.target.closest && e.target.closest('svg.mock')); if (on !== artHov) { artHov = on; document.querySelectorAll('svg.mock').forEach(s => s.classList.toggle('hov', on)); } });
document.addEventListener('click', e => { const g = e.target.closest && e.target.closest('.artGhost'); if (!g) return; (st.place[artKey()] ||= [])[+g.dataset.slot] = g.dataset.where; update(); });
const ART_REF = () => ART['desktop-24'].video, ART_REF_BOOST = 1.25;   // 화면 목업 배율 기준 = Desktop 24″ 를 기본 상자에 맞춘 배율 × 1.25 (MacBook 이 작아 보이지 않게 셋을 같이 키움)
function renderArt(c) {
  const a = artFor(), el = $('mediumArt'), m0 = medium();
  if (!a) { el.innerHTML = ''; return; }   // 목업이 없는 매체 = 그림 없음
  el.classList.toggle('real', !!m0.real); $('workspace').classList.toggle('realMode', !!m0.real);
  if (m0.real) renderReal(c, a);   // 폰 = 가운데에 실물 크기 목업 (아래에서 오른쪽 아래 정보는 그대로 그림)
  const f2 = frameFor(c, false), H = c.z.physMm, sw = f2.w * H, sh = f2.h * H, spots = artSpots(a, sw, sh, c);   // 심볼 자리 — 클리어스페이스 없이 심볼만
  const b = a.ref ? ART_REF() : a, k0 = Math.min(tokenPx('--art-w') / b.w, tokenPx('--art-h') / b.h) * (a.ref ? ART_REF_BOOST : 1);   // ref = 실물 비율 묶음 (MacBook · Desktop 24″ · 27″) — 모두 Desktop 24″ 를 기본 상자에 맞춘 배율로 그려, 서로 실제 크기 비율이 맞음
  const k = k0 * (a.boost || 1), r = v => +v.toFixed(3);   // boost = 세로로 긴 지면(A4 · A2)은 기본 상자에서 작아 보여 키움 — 면적이 Desktop · MacBook 본체와 비슷한 무게감 (A4 · A2 1.2, Billboard 보드 1.55)   // 목업 크기는 고정 (거리에 따라 변하지 않음) — 거리를 바꾸면 그 안의 로고 비율과 캡션 숫자만 변함
  el.style.color = c.fg; el.style.setProperty('--art-fg', artFg(c)); el.style.setProperty('--art-bg', c.bgView);   // 페어 글자색 · 바탕색 — 선은 둘을 섞은 불투명 색
  const [sw0, sh0] = a.spec.size, { name, spec } = artLabel(a);
  el.innerHTML = `<div class="artStage" style="height:${r(Math.max(tokenPx('--art-h'), a.h * k))}px"><svg class="mock${artHov ? ' hov' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${a.w} ${a.h}" width="${r(a.w * k)}" height="${r(a.h * k)}">${a.d}${spots.map(([x, y]) => symMark(c, f2, x, y, sw, sh, r)).join('')}${ghostMarks(c, a, f2, sw, sh, k, r)}</svg></div><div class="artCap"><span class="artName">${name}</span><span class="artSpec">${spec}</span></div>`;
  const tooBig = artTooBig(a, sw, sh), sigFar = !!c.sym.sig && $('distPreset').value === 'billboard';   // 로고 면적 ÷ 로고가 놓인 공간 (조닝 매체 = 콘텐츠 영역, 나머지 = 화면 · 지면 전체) · 빌보드에 시그니처 = 글자가 먼 거리에서 안 읽혀 비추천
  const warn = sigFar ? 'Signature not recommended on billboards' : tooBig ? 'Larger than the guide suggests' : '';
  el.insertAdjacentHTML('afterbegin', `<div class="artWarn"${warn ? '' : ' style="visibility:hidden"'}>${warn || '&nbsp;'}</div>`);   // 목업 위 고정 자리 (늘 자리를 잡아 두어 그림 · 캡션이 오르내리지 않음)   // 3줄: 매체 위 실제 로고 크기 · 출력 px (거리에 따라 목업과 같이 변함)   // 그림 = 위 (아랫변 가운데 기준) / 캡션 = 아래 가운데 (고정)
}
const TOK_PX = new Map();   // 토큰 px 값 (창 크기가 바뀌면 비움 — lh-unit 이 창에 따라 변할 수 있어서)
function tokenPx(name) { if (TOK_PX.has(name)) return TOK_PX.get(name); const d = document.createElement('div'); d.style.cssText = `position:absolute;visibility:hidden;width:var(${name})`; document.body.appendChild(d); const v = d.getBoundingClientRect().width; d.remove(); TOK_PX.set(name, v); return v; }

// 클리어스페이스 가이드 (화면용) — 장표 문법: 점선 격자(바깥 + 로고 경계선) · 모서리 칸에 H/2, 가로형 시그니처는 캡 하이트 E (네 칸 90°씩 회전)
function csGuideSvg(c, gf, gx, gy, aH) {
  const r = v => +v.toFixed(2), W = gf.w * aH, Hh = gf.h * aH;
  return `<svg class="csGuide" style="left:${r(gx)}px;top:${r(gy)}px;--art-fg:${artFg(c)};--art-bg:${c.bgView}" width="${r(W)}" height="${r(Hh)}" viewBox="0 0 ${r(W)} ${r(Hh)}">${csGuideInner(c, gf, aH)}</svg>`;
}
function csGuideInner(c, gf, aH) {   // 좌표 = 화면 px (aH = 심볼 높이 px) — 폰 실물 목업은 mm 좌표 안에 1/px·mm 로 줄여 넣음
  const s = c.sym, r = v => +v.toFixed(2), W = gf.w * aH, Hh = gf.h * aH, tb = (s.sig ? s.cs : .5) * aH, L = gf.left * aH, R = gf.right * aH;
  const xs = [0, L, W - R, W], ys = [0, tb, Hh - tb, Hh];
  let g = xs.map(x => `<line x1="${r(x)}" y1="0" x2="${r(x)}" y2="${r(Hh)}"/>`).join('') + ys.map(y => `<line x1="0" y1="${r(y)}" x2="${r(W)}" y2="${r(y)}"/>`).join('');
  const cells = [[0, 0, L, 0], [W - R, 0, R, 90], [W - R, Hh - tb, R, 180], [0, Hh - tb, L, 270]];   // [x, y, 폭, 회전] — 높이는 tb
  if (s.sig && s.orient === 'h' && SIG_FONT) {   // 캡 하이트 = 클리어스페이스 → 칸마다 E (가이드 Signature › Clearspace 장표)
    const E = setLine(SIG_FONT, 'E', SIG.h.em, 0, 0), d = pathD(mapMP(E.mp, (x, y) => [x - E.capL, y + E.capH]), { x0: 0, y0: 0 }, aH), sz = E.capH * aH;
    g += cells.map(([x, y, , a]) => `<path class="csE" fill-rule="evenodd" transform="translate(${r(x)} ${r(y)}) rotate(${a} ${r(sz / 2)} ${r(sz / 2)})" d="${d}"/>`).join('');
  } else if (Math.min(L, tb) >= tokenPx('--cs-label-min')) {
    g += cells.filter(([, , w]) => Math.abs(w - L) < .01).map(([x, y, w]) => `<text x="${r(x + w / 2)}" y="${r(y + tb / 2)}" text-anchor="middle" dominant-baseline="central">H/2</text>`).join('');   // 오른쪽 보정으로 좁아진 칸은 글자 없음
  }
  return g;
}

// ===== 19. 툴팁 — 켜진 행의 이름 · 인쇄 dpi 버튼에 마우스를 올리면 (보정 창과 같은 자리 · 모양) =====
const TIPS = {
  'Type': 'Company is EO Studio. Service uses your own descriptor.',
  'Layout': 'Horizontal at 4–10mm, vertical from 10mm up.',
  'Descriptor': 'The service name. Its first letter is capitalized automatically.',
  'Medium': 'Sets a typical viewing distance, output unit and resolution.',
  'Content': 'What the logo sits on. Changes the mockup and the available positions.',
  'Distance': 'Changes the real size. The visual size stays the same.',
  'Real size height': 'Symbol height as printed or displayed on the medium.',
  'Output height': 'Symbol height in the saved file.',
  'Scale': 'Multiplies the size of the saved PNG. Use 2x or higher for high-density screens.',
  'Resolution': 'Pixel density of the saved PNG. Hover over a value to see what it suits.',
  'Save': 'Saves the logo with the settings above. Vector for print and design work, PNG for quick use.',
  'Symbol height': 'Height as seen from 500mm — the measure the guide’s size rules are based on.',
  'Color': 'Color pairings from the guide. The signature uses four of the six.',
  'Logo': 'Symbol alone, or the signature with EO Studio or a service name.',
  'Viewing': 'Where and from how far the logo is seen. Sets the output unit and the mockup.',
  'Visual size': 'How big the logo looks from 500mm. This is the value you choose; the other sizes follow from it.',
  'Export': 'Saves outlined artwork with a transparent background. Clearspace and correction are set below.',
  'Include clearspace': 'Adds the clearspace around the logo in the saved file — H/2 for the symbol; the signature uses its own.',
  'Right side correction': 'Narrows the right clearspace so the symbol looks optically centered. The guide always applies it. Symbol only.',
  'Show clearspace guide': 'Shows the clearspace on the preview only. Not saved.',
};
const TIP_ABOUT = 'Calculates the optical corrections of the EO logo for the size it is seen at, so every use stays on brand.\n\n1. Choose the logo.\n2. Choose the medium it is used on.\n3. Set how big it should look, using the mockup as a reference.\n4. Pick a color pairing from the guide.\n5. Save in the format the job needs.';
const TIP_ABOUT_HINT = 'For anything unclear about using the logo, contact the EO design team.';   // 타이틀에 올리면 = 사용법
const TIP_I = { 'Include clearspace': 1, 'Right side correction': 1 };   // 토글 = 오른쪽 i 가 가이드
const PG = () => st.kind === 'signature' ? 'signature' : 'symbol';
const TIP_LINKS = {   // 이름을 누르면 가는 가이드 섹션 (지금 로고 종류에 맞춰) — 토글은 이름 = 체크라 오른쪽 i 로
  'Type': () => 'signature#usage-symbol-or-signature', 'Descriptor': () => 'signature#descriptor',
  'Distance': () => PG() + '#scalability', 'Symbol height': () => PG() + '#scalability', 'Color': () => PG() + '#color',
  'Logo': () => 'symbol#overview', 'Visual size': () => PG() + '#scalability',
};
function btnTip(b) {   // 저장 · 배율 버튼 = 지금 설정으로 나갈 파일 (크기 · 해상도 · 컬러 모드)
  const c = compose(), pr = st.unit === 'mm', fw = c.frame.w, fh = c.frame.h, px = k => `${Math.round(fw * c.z.outPx * k)} × ${Math.round(fh * c.z.outPx * k)} px`;
  if (b.id === 'dlSvg') return pr ? `Vector PDF, ${+(fw * c.z.physMm).toFixed(1)} × ${+(fh * c.z.physMm).toFixed(1)} mm, CMYK values from the guide. For print.` : `Vector SVG, one outlined path, ${px(1)}, RGB.`;
  if (b.id === 'dlPng') return pr ? `PNG ${px(1)} at ${printDpi()} dpi (saved in the file), RGB.` : `PNG ${px(st.pngScale)}${st.pngScale > 1 ? ` (${st.pngScale}x)` : ''}, RGB.`;
  const i = [...b.parentNode.querySelectorAll('button')].indexOf(b);   // 세로선(i) 빼고 버튼 순서
  return pr ? DPI_TIPS[i] : `PNG at ${i + 1} times the output size — ${px(i + 1)}.`;
}
const DPI_TIPS = ['Billboards printed at actual size, seen from 10m or more.', 'Banners and signage seen from 2–5m.', 'Posters seen from about 1m, such as A2.', 'Hand-held print such as A4 and business cards. A higher value only makes the file bigger.'];
let tipTimer = 0, tipHot = null;
const noOrphan = t => t.replace(/ (\S+)$/, '\u00A0$1');   // 고아 단어 방지 — 마지막 두 단어 사이 = 줄바꿈 없는 공백 (가이드 사이트 guide.ts 와 같은 방식, text-wrap: pretty 의 폴백)
const setHot = (el, key) => {   // 가리킨 이름 = 바로 색이 바뀜 (툴팁보다 먼저 피드백), 링크가 있으면 손가락 커서
  if (tipHot && tipHot !== el) tipHot.classList.remove('tipHot', 'tipLink');
  tipHot = el; if (!el) return;
  el.dataset.tipKey = key; el.classList.add('tipHot'); el.classList.toggle('tipLink', !!TIP_LINKS[key]);
};
const tipHide = () => { clearTimeout(tipTimer); $('tip').hidden = true; };
function tipShow(el, title, body, link) {
  clearTimeout(tipTimer);
  tipTimer = setTimeout(() => { if (!$('calib').hidden) return;   // 보정 중엔 안 띄움 (같은 자리)
    $('tipT').textContent = title; $('tipB').textContent = noOrphan(typeof body === 'function' ? body() : body); $('tipH').hidden = !link; if (link) $('tipH').textContent = link; $('tipH').classList.toggle('para', el.classList.contains('brand')); const t = $('tip'); t.hidden = false;
    const ar = document.querySelector('aside').getBoundingClientRect(), r = (el.closest('.row, .chkRow, .secHead, .brand') || el).getBoundingClientRect();
    t.style.left = (ar.right + tokenPx('--calib-gap')) + 'px';
    t.style.top = Math.max(tokenPx('--calib-gap'), Math.min(r.top - tokenPx('--panel-pad-y'), innerHeight - t.offsetHeight - tokenPx('--calib-gap'))) + 'px';   // 첫 줄 = 가리킨 행 높이 (아래로 넘치면 올림)
  }, tokenSec('--tip-delay') * 1000);
}
const CTL = 'input, select, button, .tg, .dd, .sf';
document.querySelector('aside').addEventListener('pointerover', e => {
  const row = e.target.closest('.row'), lab = row && !e.target.closest(CTL) && !row.closest('.row.off') ? row.querySelector(':scope > .label') : null;   // 행의 이름 쪽(조작부 밖) 어디든 — 글자 위만이 아니라
  const h2 = e.target.closest('.secHead h2'), info = e.target.closest('.chkRow .info'), chk = info ? info.parentNode.querySelector('.chk:not(.disabled)') : e.target.closest('.chkRow .chk:not(.disabled)'), b = e.target.closest('#pngScale button, #dlSvg, #dlPng');   // i 에 올려도 그 토글의 툴팁
  const key = lab ? lab.textContent.replace(/ ·.*$/, '').trim() : h2 ? h2.textContent.trim() : chk ? chk.textContent.trim() : null, hot = lab ? row : h2 || chk;
  if (key && TIPS[key]) { setHot(hot, key); return tipShow(hot, key, TIPS[key], TIP_LINKS[key] ? 'Click the name to open the guide ↗' : TIP_I[key] ? 'The i on the right opens the guide ↗' : ''); }
  setHot(null);
  if (e.target.closest('.brand .help')) return tipShow(e.target.closest('.brand'), 'EO Logo Generator', TIP_ABOUT, TIP_ABOUT_HINT);   // ? 에 올릴 때만
  if (e.target.closest('#openCalib')) return tipShow($('openCalib'), 'Card calibration', () => st.calibrated
    ? `Done — the preview shows the true visual size (${st.pxmm.toFixed(2)} px/mm). Calibrate again if you change screens.`
    : 'Screens differ in pixel density, so the preview can look bigger or smaller than it really is. Match a credit card once and the preview shows the true visual size. Do this before judging sizes.');
  if (b && !b.disabled && !(b.closest('#pngScale') && st.unit === 'px')) return tipShow(b, b.closest('#pngScale') ? b.textContent + ' dpi' : 'Save ' + b.textContent.replace(' ↓', ''), () => btnTip(b));   // 저장 버튼 제목 = Save SVG 처럼 풀어서
  tipHide();
});
document.querySelector('aside').addEventListener('pointerleave', () => { setHot(null); tipHide(); });
document.addEventListener('pointerdown', tipHide);
document.querySelector('aside').addEventListener('click', e => { const hot = e.target.closest('.tipLink'); if (hot && !e.target.closest(CTL)) window.open(GUIDE + TIP_LINKS[hot.dataset.tipKey](), '_blank', 'noopener'); });

// ===== 20. 신용카드 보정 =====
let calV = st.pxmm;
let CAL_MIN = 3;   // 카드 최소 px/mm — 열 때 토큰 --card-min-pxmm 에서 다시 읽음
const calSet = v => { calV = Math.min(+$('calSlider').max, Math.max(CAL_MIN, v)); drawCard(); };
function drawCard() { $('card').style.width = (85.6 * calV) + 'px'; $('card').style.height = (54 * calV) + 'px'; $('calSlider').value = calV; $('calOut').value = calV.toFixed(2); }   // 드래그 중 px/mm 칸이 따라감
$('openCalib').onclick = () => {
  if (!$('calib').hidden) { closeCal(); return; }   // 보정 중 다시 누르면 취소
  $('calib').hidden = false; $('openCalib').classList.add('on'); $('cardLayer').classList.add('open');
  $('openCalib').blur();   // Enter 가 버튼을 다시 눌러 닫지 않고 저장으로 가게
  const tok = tokenPx;
  const ar = document.querySelector('aside').getBoundingClientRect(), hr = $('sizeHead').getBoundingClientRect(), cb = $('calib').style;   // 팝업 = 메뉴창 오른쪽, 첫 줄이 Size 제목 줄과 같은 높이 (화면 아래로 넘치면 올림)
  cb.left = (ar.right + tok('--calib-gap')) + 'px'; cb.right = cb.bottom = 'auto';
  cb.top = Math.max(tok('--calib-gap'), Math.min(hr.top - tok('--panel-pad-y'), innerHeight - $('calib').offsetHeight - tok('--calib-gap'))) + 'px';
  const fitW = (innerWidth - tok('--panel-w') - 2 * tok('--stage-pad')) / 85.6, fitH = (innerHeight - 2 * tok('--stage-pad')) / 54;   // 카드가 작업공간에 다 보이는 최대 px/mm
  CAL_MIN = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-min-pxmm')) || 3; $('calSlider').min = CAL_MIN;   // 단위 없는 수
  $('calSlider').max = Math.max(CAL_MIN, Math.min(15, Math.floor(Math.min(fitW, fitH) * 100) / 100));   // max 를 먼저 정해야 drawCard 의 slider.value 가 잘리지 않음
  calV = Math.max(CAL_MIN, Math.min(st.pxmm, +$('calSlider').max)); drawCard();
};
$('calSlider').oninput = e => calSet(+e.target.value);
document.addEventListener('keydown', e => {   // 보정 중: ←→ 0.01 (Shift 0.1) · Enter 저장 · Esc 취소
  if ($('calib').hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); closeCal(); }
  else if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); $('calSave').click(); }
  else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.target !== $('calSlider') && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) {
    e.preventDefault(); calSet(Math.round((calV + (e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 0.1 : 0.01)) * 100) / 100);
  }
});
function closeCal() { $('calib').hidden = true; $('openCalib').classList.remove('on'); $('cardLayer').classList.remove('open'); }   // 저장 안 한 값은 되돌림
$('calCancel').onclick = closeCal;
document.addEventListener('pointerdown', e => { if (!$('calib').hidden && !$('openCalib').contains(e.target) && !$('cardLayer').contains(e.target) && !$('calib').contains(e.target)) closeCal(); });   // 바깥 클릭 시 닫힘 (팝업 · 카드 · 버튼 위는 제외)
$('calReset').onclick = () => { st.pxmm = 5; st.calibrated = false; try { localStorage.removeItem(LS_KEY); } catch (e) {} closeCal(); update(); };
$('calSave').onclick = () => { st.pxmm = calV; st.calibrated = true; try { localStorage.setItem(LS_KEY, String(calV)); } catch (e) {} closeCal(); update(); };
(() => {
  const h = $('cardHandle'); let start = null;
  h.addEventListener('pointerdown', e => { h.setPointerCapture(e.pointerId); start = { x: e.clientX, w: 85.6 * calV }; });
  h.addEventListener('pointermove', e => { if (!start) return; calSet((start.w + 2 * (e.clientX - start.x)) / 85.6); });   // 카드가 가운데 기준으로 커지므로 폭 변화 = 2 × 이동량 → 모서리가 커서를 따라감
  h.addEventListener('pointerup', () => { start = null; });
})();


update();
// 타이틀 왼쪽 EO 심볼 — regular 지오메트리의 라이트 심볼, Air White
try { const sym = buildSymbol(14, 'light'), fr = { x0: 0, y0: 0 }, H = 100; $('logo').innerHTML = `<svg class="logo" viewBox="0 0 ${(sym.lightW * H).toFixed(2)} ${H}" aria-hidden="true"><path fill="${HEX['Air White']}" fill-rule="evenodd" d="${pathD(sym.mp, fr, H)}"/></svg>`; } catch (e) { console.warn('logo', e); }
