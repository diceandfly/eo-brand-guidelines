// EO Logo Generator — 심볼 지오메트리 (확정, 손대지 않음). 정본 SVG 를 문자열로 품고 크기별 보간 · 다크 변환 · 클리어스페이스 틀을 계산. scripts/lib/logo-generator-check.mjs 가 이 파일을 node 에서 돌려 수치를 고정
/*GEOM-START*/
// ===== 1. 원본 SVG (정본) — file:// 에서 fetch 가 막히므로 문자열로 내장 =====
// min: symbol-g-min-100.svg (H = 10, 병합 전 원시 도형) / regular: symbol-g-regular-300.svg (H = 30, 1 좌표 = H/30)
const SRC_MIN = `<svg viewBox="0 0 21.17 10"><g id="content"><g><g>
<path class="cls-1" d="M18.14,0h-3.7l-3.03,2.68v4.63l3.03,2.68h3.7s3.04-2.68,3.04-2.68V2.67l-3.03-2.67Z"/>
<g><rect x="12.23" y="4.26" width="8.11" height="1.47"/>
<rect x="15.55" y=".9" width="1.47" height="8.21"/>
<polygon points="16.28 7.58 13.33 5 16.28 2.42 19.24 5 16.28 7.58"/></g></g>
<g><rect class="cls-1" x="2.46" width="4.75" height="10"/>
<polygon class="cls-1" points="0 1.56 0 2.42 7.21 2.42 9.67 .88 9.67 0 2.46 0 0 1.56"/>
<polygon class="cls-1" points="0 9.17 0 10 7.21 10 9.67 8.46 9.67 7.58 2.46 7.58 0 9.17"/>
<polygon class="cls-1" points="0 5.38 0 6.21 7.21 6.21 9.67 4.67 9.67 3.79 2.46 3.79 0 5.38"/></g>
</g></g></svg>`;
const SRC_REG = `<svg viewBox="0 0 62 30"><g id="content"><g>
<path class="cls-1" d="M58.25,16.87h-5.41l-3.59,3.11v6.02h-3.5v-6.02l-3.59-3.11h-5.41v-3.75h5.41l3.59-3.11v-6.02h3.5v6.02l3.59,3.11h5.41v3.75ZM53,0h-11l-9,8.05v13.9l9,8.05h10.99l9.01-8.05V8L53,0Z"/>
<polygon class="cls-1" points="29 3 29 0 22 0 22 0 7 0 7 0 7 0 0 5 0 8 7 8 7 11 0 16 0 19 7 19 7 22 0 27 0 30 22 30 29 25 29 22 22 22 22 19 29 14 29 11 22 11 22 8 29 3"/>
</g></g></svg>`;

// ===== 2. 상수 — 가이드 규칙 (H = 1) =====
const GAP_LIGHT = 4 / 30;      // regular 의 블록 간격 (폴백용). 실제 간격은 두 파일에서 읽어 다른 파라미터처럼 보간 (min100 5.22u → 300 4u)
const GAP_DARK_DELTA = 1 / 30;  // 다크 심볼은 라이트 간격에서 H/30 줄임 (regular: 4/30 → 3/30)
const DARK_OFFSET = 1 / 100;   // 다크 1단계 바깥 오프셋
const DARK_GROW = 2 / 30;      // 다크 2단계 블록 폭 · 높이 증가 (네 방향 H/30)
const S_MIN = 4, S_REG = 14;   // 보간 구간 (S500 mm)
// 폴백 수치 (파싱 실패 시, u = H/30 로 적음): min100 · 300 파일 실측
const U = 1 / 30;
const SPEC_PARAMS = {
  min: { shaftW: 14.25 * U, threadT: 7.26 * U, threadGap: 4.11 * U, slantDx: 7.38 * U, slantDy: 4.68 * U, Ow: 29.31 * U, cut: 9.09 * U, cutV: 8.04 * U,
         cross: { armL: 24.33 * U, armT: 4.41 * U, armLv: 24.63 * U, armTv: 4.41 * U, diaW: 17.73 * U, diaH: 15.48 * U, dcx: 0, dcy: 0 } },
  reg: { shaftW: 15 * U, threadT: 8 * U, threadGap: 3 * U, slantDx: 7 * U, slantDy: 5 * U, Ow: 29 * U, cut: 9 * U, cutV: 8.05 * U,
         cross: { armL: 21.5 * U, armT: 3.75 * U, armLv: 22.01 * U, armTv: 3.5 * U, diaW: 15 * U, diaH: 13 * U, dcx: 0, dcy: 0 } },
};
const CROSS_KEYS = ['armL', 'armT', 'armLv', 'armTv', 'diaW', 'diaH', 'dcx', 'dcy'];

// ===== 3. 작은 기하 유틸 =====
const EPS = 2e-3;   // 원본 좌표 반올림(min 0.001H, 300 파일 0.0003H) 이내는 같은 점 · 0/1 로 스냅
function ringArea(p) { let a = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; a += x1 * y2 - x2 * y1; } return a / 2; }
function bboxOf(pts) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
function mpPoints(mp) { const out = []; for (const poly of mp) for (const ring of poly) out.push(...ring); return out; }
function openRing(r) { const n = r.length; return (n > 1 && r[0][0] === r[n - 1][0] && r[0][1] === r[n - 1][1]) ? r.slice(0, -1) : r.slice(); }
function closeRing(r) { const o = r.map(p => [p[0], p[1]]); o.push([o[0][0], o[0][1]]); return o; }
function mapMP(mp, f) { return mp.map(poly => poly.map(ring => ring.map(([x, y]) => f(x, y)))); }
const lerp = (a, b, t) => a + (b - a) * t;
const near = (a, b) => Math.abs(a - b) < 1e-4;   // 보간 · 합집합 부동소수 오차 허용
// 단일 링으로 합집합 (구멍 없는 도형 전제)
function unionRing(rings) { const u = polygonClipping.union(...rings.map(r => [closeRing(r)])); if (u.length !== 1 || u[0].length !== 1) throw new Error('union is not a single ring'); return openRing(u[0][0]); }

// ===== 4. SVG 파싱 (정규식 — DOM 없이도 동작) =====
function attrsOf(tag) { const o = {}; tag.replace(/([\w:-]+)="([^"]*)"/g, (m, k, v) => { o[k] = v; }); return o; }
function nums(s) { return (s.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || []).map(Number); }
// path → 서브패스별 꼭짓점 배열. 직선 도형만: M L H V Z, S/C/Q 는 끝점만 (원본의 s 는 직선과 같음)
function parsePathD(d) {
  const tok = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
  const rings = []; let pts = null, i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0;
  const num = () => Number(tok[i++]);
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === 'Z') { x = sx; y = sy; if (pts && pts.length) rings.push(pts); pts = null; continue; }
    if (C === 'M') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; sx = x; sy = y; if (pts && pts.length) rings.push(pts); pts = [[x, y]]; cmd = rel ? 'l' : 'L'; continue; }
    if (C === 'L') { const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; }
    else if (C === 'H') { const a = num(); x = rel ? x + a : a; }
    else if (C === 'V') { const b = num(); y = rel ? y + b : b; }
    else if (C === 'S' || C === 'Q') { num(); num(); const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; }
    else if (C === 'C') { num(); num(); num(); num(); const a = num(), b = num(); x = rel ? x + a : a; y = rel ? y + b : b; }
    else throw new Error('unsupported path command ' + cmd);
    pts.push([x, y]);
  }
  if (pts && pts.length) rings.push(pts);
  return rings;
}
// 꼭짓점 정규화: 0/1 근처 y 스냅, 중복 · 일직선 점 제거, 방향 통일(양의 면적), 시작점 = 가장 위 · 가장 왼쪽
function canon(pts) {
  const p = pts.map(([x, y]) => [x, Math.abs(y) < EPS ? 0 : Math.abs(y - 1) < EPS ? 1 : y]);
  let q = [];
  for (const v of p) { const l = q[q.length - 1]; if (!l || Math.hypot(v[0] - l[0], v[1] - l[1]) > EPS) q.push(v); }
  while (q.length > 2 && Math.hypot(q[0][0] - q[q.length - 1][0], q[0][1] - q[q.length - 1][1]) <= EPS) q.pop();
  for (let changed = true; changed && q.length > 3;) {
    changed = false;
    for (let i = 0; i < q.length; i++) {
      const a = q[(i - 1 + q.length) % q.length], b = q[i], c = q[(i + 1) % q.length];
      const ux = b[0] - a[0], uy = b[1] - a[1], vx = c[0] - b[0], vy = c[1] - b[1];
      if (Math.abs(ux * vy - uy * vx) < 1e-6 * Math.hypot(ux, uy) * Math.hypot(vx, vy) && ux * vx + uy * vy > 0) { q.splice(i, 1); changed = true; break; }
    }
  }
  if (ringArea(q) < 0) q.reverse();
  let s = 0;
  for (let i = 1; i < q.length; i++) { const a = q[i], b = q[s]; if (a[1] < b[1] - 1e-3 || (Math.abs(a[1] - b[1]) <= 1e-3 && a[0] < b[0])) s = i; }
  return q.slice(s).concat(q.slice(0, s));
}

// ===== 4-1. 십자 구멍 — 파라미터로 읽고 다시 그림 (두 파일의 표현이 달라 꼭짓점 대응 불가) =====
// 파라미터: 가로팔 길이 · 두께, 세로팔 길이 · 두께, 중심 마름모 폭 · 높이, 팔각형 중심 대비 십자 중심 (dcx, dcy)
// 읽기 A: rect 2 + 마름모 polygon (min100)  /  읽기 B: 챔퍼가 든 한 링 (300) — 챔퍼 선분을 마름모 변으로 보고 축과의 교점으로 마름모 복원
function crossFromPieces(rects, dia, octC) {
  const bs = rects.map(bboxOf).sort((a, b) => b.w - a.w), hb = bs[0], vb = bs[1], db = bboxOf(dia);
  return { armL: hb.w, armT: hb.h, armLv: vb.h, armTv: vb.w, diaW: db.w, diaH: db.h, dcx: (db.x0 + db.x1) / 2 - octC[0], dcy: (db.y0 + db.y1) / 2 - octC[1] };
}
function crossFromRing(r, octC) {
  const hb = bboxOf(r), cx = (hb.x0 + hb.x1) / 2, cy = (hb.y0 + hb.y1) / 2;
  const hY = r.filter(p => near(p[0], hb.x0)).map(p => p[1]), vX = r.filter(p => near(p[1], hb.y0)).map(p => p[0]);
  const hTop = Math.min(...hY), ht = (Math.max(...hY) - hTop) / 2, vLeft = Math.min(...vX), vt = (Math.max(...vX) - vLeft) / 2;
  // 왼쪽 위 사분면 챔퍼: (vLeft - chX, hTop) → (vLeft, hTop - chY)
  const chX = vLeft - Math.max(...r.filter(p => near(p[1], hTop) && p[0] < cx).map(p => p[0]));
  const chY = hTop - Math.max(...r.filter(p => near(p[0], vLeft) && p[1] < cy).map(p => p[1]));
  const halfW = cx - (vLeft - chX - ht * chX / chY), halfH = cy - (hTop - chY - vt * chY / chX);
  return { armL: hb.w, armT: 2 * ht, armLv: hb.h, armTv: 2 * vt, diaW: 2 * halfW, diaH: 2 * halfH, dcx: cx - octC[0], dcy: cy - octC[1] };
}
// 파라미터 → 구멍 링 (가로 rect ∪ 세로 rect ∪ 마름모), 팔각형 좌표계
function crossRing(c, oct) {
  const ob = bboxOf(oct), cx = (ob.x0 + ob.x1) / 2 + c.dcx, cy = (ob.y0 + ob.y1) / 2 + c.dcy;
  const rect = (w, h) => [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]];
  return canon(unionRing([rect(c.armL, c.armT), rect(c.armTv, c.armLv), [[cx, cy - c.diaH / 2], [cx + c.diaW / 2, cy], [cx, cy + c.diaH / 2], [cx - c.diaW / 2, cy]]]));
}

// ===== 4-2. 소스 파싱 → { E: 링(E 병합 아웃라인, 왼쪽 = 0), oct: 팔각형(왼쪽 = 0), cross: 십자 파라미터 } =====
function parseSource(src) {
  const vb = nums(attrsOf(src.match(/<svg\b[^>]*>/)[0]).viewBox); const H = vb[3];
  let filled = [], holes = [];   // holes: { type, ring }
  for (const tag of src.match(/<(rect|polygon|path)\b[^>]*>/g)) {
    const type = tag.match(/^<(\w+)/)[1], a = attrsOf(tag);
    let rings;
    if (type === 'rect') { const x = +(a.x || 0), y = +(a.y || 0), w = +a.width, h = +a.height; rings = [[[x, y], [x + w, y], [x + w, y + h], [x, y + h]]]; }
    else if (type === 'polygon') { const n = nums(a.points), pts = []; for (let i = 0; i + 1 < n.length; i += 2) pts.push([n[i], n[i + 1]]); rings = [pts]; }
    else rings = parsePathD(a.d);
    rings = rings.map(r => r.map(([x, y]) => [x / H, y / H]));
    if ((a.class || '').includes('cls-1')) filled.push(...rings); else holes.push(...rings.map(ring => ({ type, ring })));
  }
  // 채움 링 중 다른 채움 링 안에 든 것은 구멍 (300 파일: 십자가 팔각형과 한 path)
  const bb = filled.map(bboxOf);
  const inside = (i, j) => i !== j && bb[i].x0 > bb[j].x0 && bb[i].x1 < bb[j].x1 && bb[i].y0 > bb[j].y0 && bb[i].y1 < bb[j].y1;
  const inner = filled.map((r, i) => filled.some((s, j) => inside(i, j)));
  holes = holes.concat(filled.filter((r, i) => inner[i]).map(ring => ({ type: 'ring', ring })));
  filled = filled.filter((r, i) => !inner[i]);
  // 팔각형 = 가장 오른쪽 채움 링, 나머지는 E 블록 조각
  const oi = filled.reduce((m, r, i, arr) => bboxOf(r).x1 > bboxOf(arr[m]).x1 ? i : m, 0);
  const octRaw = filled[oi], eParts = filled.filter((r, i) => i !== oi);
  if (!eParts.length || !holes.length) throw new Error('unexpected shape set');
  const ERaw = eParts.length > 1 ? unionRing(eParts) : eParts[0];
  const ex = Math.min(...ERaw.map(p => p[0])), ox = Math.min(...octRaw.map(p => p[0]));
  const gap = ox - Math.max(...ERaw.map(p => p[0]));   // 파일의 블록 간격 (E 오른쪽 끝 ↔ O 왼쪽 끝)
  const oct = symmetrizeX(canon(octRaw.map(([x, y]) => [x - ox, y]))), ob = bboxOf(oct), octC = [(ob.x0 + ob.x1) / 2, (ob.y0 + ob.y1) / 2];
  const hl = holes.map(h => ({ type: h.type, ring: h.ring.map(([x, y]) => [x - ox, y]) }));
  let cross;
  if (hl.length === 1) cross = crossFromRing(canon(hl[0].ring), octC);
  else {
    const rects = hl.filter(h => h.type === 'rect').map(h => h.ring), dia = hl.find(h => h.type !== 'rect');
    if (rects.length !== 2 || !dia) throw new Error('unexpected cross pieces');
    cross = crossFromPieces(rects, dia.ring, octC);
  }
  return { E: canon(ERaw.map(([x, y]) => [x - ex, y])), oct, cross, gap };
}
// 팔각형은 완벽한 좌우대칭(사용자 확인) — 작업 오차를 거울 평균으로 지움
function symmetrizeX(ring) {
  const b = bboxOf(ring), cx = (b.x0 + b.x1) / 2, out = ring.map(p => [p[0], p[1]]);
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = ring[i], mx = 2 * cx - x;
    let j = -1, best = 1e9; for (let k = 0; k < ring.length; k++) { const d = Math.abs(ring[k][0] - mx) + Math.abs(ring[k][1] - y); if (d < best) { best = d; j = k; } }
    if (j >= 0 && best < 0.02) { const ax = (x + (2 * cx - ring[j][0])) / 2, ay = (y + ring[j][1]) / 2; out[i] = [ax, ay]; }
  }
  return out;
}
const topoKey = g => [g.E.length, g.oct.length].join('/');
const withHole = g => ({ ...g, hole: crossRing(g.cross, g.oct) });

// ===== 5. 폴백 — 수치로 도형 조립 (원본 파싱 실패 시) =====
function buildFromParams(p) {
  const W = 29 / 30, dx = p.slantDx, dy = p.slantDy, sR = dx + p.shaftW;
  const tm = 1 - 2 * p.threadT - 2 * p.threadGap, ys = [[0, p.threadT], [p.threadT + p.threadGap, p.threadT + p.threadGap + tm], [1 - p.threadT, 1]];
  const thread = ([y0, y1]) => [[0, y0 + dy], [0, y1], [sR, y1], [W, y1 - dy], [W, y0], [dx, y0]];
  const E = unionRing([[[dx, 0], [sR, 0], [sR, 1], [dx, 1]], ...ys.map(thread)]);
  const ow = p.Ow, c = p.cut, cv = p.cutV;
  return { E: canon(E), oct: canon([[c, 0], [ow - c, 0], [ow, cv], [ow, 1 - cv], [ow - c, 1], [c, 1], [0, 1 - cv], [0, cv]]), cross: { ...p.cross } };
}

// ===== 6. 소스 로드: 파싱 → 실패하면 폴백 =====
let GEO_MIN, GEO_REG, GEO_SOURCE;
try {
  GEO_MIN = withHole(parseSource(SRC_MIN)); GEO_REG = withHole(parseSource(SRC_REG));
  if (topoKey(GEO_MIN) !== topoKey(GEO_REG)) throw new Error('vertex count mismatch ' + topoKey(GEO_MIN) + ' vs ' + topoKey(GEO_REG));
  GEO_SOURCE = 'svg';
} catch (e) {
  try { GEO_MIN = withHole(buildFromParams(SPEC_PARAMS.min)); GEO_REG = withHole(buildFromParams(SPEC_PARAMS.reg)); GEO_SOURCE = 'spec (' + e.message + ')'; }
  catch (e2) { GEO_SOURCE = 'error (' + e2.message + ')'; }
}

// ===== 7. 보간 — E · 팔각형은 대응 꼭짓점끼리, 십자는 파라미터별 선형 (S500 4mm = min, 14mm = regular, 밖은 고정) =====
function interpT(S) { return Math.min(1, Math.max(0, (S - S_MIN) / (S_REG - S_MIN))); }
function lerpGeo(a, b, t) {
  const L = (ra, rb) => ra.map((p, i) => [lerp(p[0], rb[i][0], t), lerp(p[1], rb[i][1], t)]);
  const cross = {}; for (const k of CROSS_KEYS) cross[k] = lerp(a.cross[k], b.cross[k], t);
  return withHole({ E: L(a.E, b.E), oct: L(a.oct, b.oct), cross, gap: lerp(a.gap ?? GAP_LIGHT, b.gap ?? GAP_LIGHT, t) });
}
// 파라미터 추출 (검증 표시용 — 생성에는 쓰지 않음)
function paramsOf(g) {
  const eb = bboxOf(g.E), ob = bboxOf(g.oct), hb = bboxOf(g.hole), c = g.cross;
  const sL = g.E[0][0];                                                                       // 시작점 = 맨 위 thread 윗변 왼쪽 = shaft 왼쪽
  const sR = Math.min(...g.E.filter(p => p[0] > sL + .1 && p[0] < eb.x1 - .1).map(p => p[0]));    // 오른쪽 홈 모서리 = shaft 오른쪽
  const yL = g.E.filter(p => near(p[0], sL)).map(p => p[1]).sort((a, b) => a - b);          // 왼쪽 홈 모서리 y: 0, t1 끝, t2 시작, t2 끝, t3 시작
  const slantY = Math.min(...g.E.filter(p => near(p[0], eb.x0)).map(p => p[1]));
  const cutH = Math.min(...g.oct.filter(p => near(p[1], ob.y0)).map(p => p[0])) - ob.x0;
  const cutV = Math.min(...g.oct.filter(p => near(p[0], ob.x0)).map(p => p[1])) - ob.y0;
  const hTop = (hb.y0 + hb.y1) / 2 - c.armT / 2, vLeft = (hb.x0 + hb.x1) / 2 - c.armTv / 2, cx = (hb.x0 + hb.x1) / 2, cy = (hb.y0 + hb.y1) / 2;
  const chX = vLeft - Math.max(...g.hole.filter(p => near(p[1], hTop) && p[0] < cx).map(p => p[0]));
  const chY = hTop - Math.max(...g.hole.filter(p => near(p[0], vLeft) && p[1] < cy).map(p => p[1]));
  return {
    shaftW: sR - sL, threadT: yL[1] - yL[0], threadTmid: yL[3] - yL[2], threadGap: yL[2] - yL[1], threadT3: 1 - yL[4],
    slantDeg: Math.atan2(slantY - eb.y0, sL - eb.x0) * 180 / Math.PI, slantDx: sL - eb.x0, slantDy: slantY - eb.y0,
    Ew: eb.w, Ow: ob.w, cutH, cutV,
    armL: c.armL, armT: c.armT, armLv: c.armLv, armTv: c.armTv, diaW: c.diaW, diaH: c.diaH, dcx: c.dcx, dcy: c.dcy, chX, chY, gap: g.gap ?? GAP_LIGHT,
  };
}

// ===== 8. 다각형 오프셋 (직선 도형 · miter): 각 변을 바깥 법선으로 밀고 이웃 변의 직선과 교차 =====
function cleanRing(r) {
  let p = openRing(r), changed = true;
  while (changed && p.length > 3) {
    changed = false;
    for (let i = 0; i < p.length; i++) {
      const a = p[(i - 1 + p.length) % p.length], b = p[i], c = p[(i + 1) % p.length];
      const e1x = b[0] - a[0], e1y = b[1] - a[1], e2x = c[0] - b[0], e2y = c[1] - b[1];
      const l1 = Math.hypot(e1x, e1y), l2 = Math.hypot(e2x, e2y);
      if (l1 < 1e-9 || Math.abs(e1x * e2y - e1y * e2x) < 1e-9 * l1 * l2 && e1x * e2x + e1y * e2y > 0) { p.splice(i, 1); changed = true; break; }
    }
  }
  return p;
}
// d > 0: 채움 영역 바깥으로. isHole: 구멍 링이면 구멍 안쪽으로 밀림(구멍이 좁아짐)
function offsetRing(ring, d, isHole) {
  const p = cleanRing(ring), n = p.length;
  const s = (ringArea(p) > 0 ? 1 : -1) * (isHole ? -1 : 1);   // s = +1 → 오른쪽 법선
  const L = [];
  for (let i = 0; i < n; i++) {
    const a = p[i], b = p[(i + 1) % n], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len, nx = s * uy, ny = -s * ux;
    L.push({ px: a[0] + nx * d, py: a[1] + ny * d, ux, uy, nx, ny });
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const A = L[(i - 1 + n) % n], B = L[i], den = A.ux * B.uy - A.uy * B.ux;
    if (Math.abs(den) < 1e-9) { out.push([p[i][0] + B.nx * d, p[i][1] + B.ny * d]); continue; }
    const t = ((B.px - A.px) * B.uy - (B.py - A.py) * B.ux) / den;
    out.push([A.px + A.ux * t, A.py + A.uy * t]);
  }
  return out;
}
function offsetMP(mp, d) {
  const res = mp.map(poly => poly.map((ring, i) => closeRing(offsetRing(ring, d, i > 0))));
  return polygonClipping.union(res);   // 정리
}

// ===== 9. 심볼 조립 — 라이트(병합 아웃라인) · 다크(Inversion 3단계) =====
// 반환 좌표계: H = 1, 라이트 심볼 박스 = [0, lightW] × [0, 1]. 다크는 라이트 박스 중심에 중앙 정렬.
function buildSymbol(S, mode) {
  const t = interpT(S), g = lerpGeo(GEO_MIN, GEO_REG, t), P = paramsOf(g);
  const gap = g.gap ?? GAP_LIGHT, Ew = bboxOf(g.E).x1, ox = Ew + gap, sh = r => closeRing(r.map(([x, y]) => [x + ox, y]));
  const E = [[closeRing(g.E)]];
  const O = [[sh(g.oct), sh(g.hole.slice().reverse())]];   // 구멍은 반대 방향 링
  const lightW = ox + bboxOf(g.oct).w;
  const info = { t, P, lightW, lightH: 1 };
  if (mode === 'light') return { mp: [...E, ...O], box: bboxOf(mpPoints([...E, ...O])), ...info };
  // 가이드 Symbol › Inversion (일러 작업 순서 그대로, 2026-11-13)
  // 1) E 블록 전체 · O 블록 팔각형을 블록 중심 기준 정비율 확대 (높이 +2/30H) — 십자 구멍은 원래 크기
  // 2) 바깥 윤곽은 밖으로, 십자 구멍은 안으로 H/100 오프셋 (일러: H/50 가운데 정렬 획을 아웃라인)  3) 간격 = 라이트 − H/30 (regular 4/30 → 3/30)
  const blocks = [E, O].map(mp0 => {
    const b0 = bboxOf(mpPoints(mp0)), k = (b0.h + DARK_GROW) / b0.h, cx = (b0.x0 + b0.x1) / 2, cy = (b0.y0 + b0.y1) / 2;
    const grown = mp0.map(poly => poly.map((ring, i) => i === 0 ? ring.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]) : ring));   // 구멍(i > 0)은 확대하지 않음
    const m = offsetMP(grown, DARK_OFFSET);
    return { mp: m, b: bboxOf(mpPoints(m)), k };
  });
  const [dE, dO] = blocks;
  const shiftO = dE.b.x1 + (gap - GAP_DARK_DELTA) - dO.b.x0;
  let mp = [...dE.mp, ...mapMP(dO.mp, (x, y) => [x + shiftO, y])];
  const b = bboxOf(mpPoints(mp)), dx = lightW / 2 - (b.x0 + b.x1) / 2, dy = .5 - (b.y0 + b.y1) / 2;
  mp = mapMP(mp, (x, y) => [x + dx, y + dy]);
  const box = bboxOf(mpPoints(mp));
  return { mp, box, ...info, dark: { kE: dE.k, kO: dO.k, Ew: dE.b.w, Ow: dO.b.w, gap: (dO.b.x0 + shiftO) - dE.b.x1 } };
}

// ===== 10. 프레임 (클리어스페이스 · 아이콘 보정) =====
function rightClear(S) { return S >= 67 ? .5 : .42 + .0012 * S; }
function frameOf(sym, S, clear, icon) {
  if (!clear) return { x0: sym.box.x0, y0: sym.box.y0, w: sym.box.w, h: sym.box.h, left: 0, right: 0 };
  const right = icon ? rightClear(S) : .5;   // 박스는 라이트 기준 H
  return { x0: -.5, y0: -.5, w: .5 + sym.lightW + right, h: 2, left: .5, right };
}
// 경로 문자열 (px 단위)
function pathD(mp, frame, H) {
  const f = v => (Math.round(v * 1000) / 1000).toString();
  let d = '';
  for (const poly of mp) for (const ring of poly) {
    const r = openRing(ring);
    d += 'M' + r.map(([x, y]) => f((x - frame.x0) * H) + ' ' + f((y - frame.y0) * H)).join('L') + 'Z';
  }
  return d;
}
/*GEOM-END*/
