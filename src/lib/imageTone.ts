/**
 * 이미지 가장자리를 빌드 때 한 번 재서 두 가지를 돌려줍니다 (Figure.astro):
 *  · tone  'light' | 'dark' — 카드 테두리(1px 띠)가 이미지 가장자리 위에 놓이므로, 호버 색을 밝은 회색/어두운 회색 중 어느 쪽으로 할지 (data-tone).
 *          카드에서 보이는 영역(배율 zoom 안쪽) 기준.
 *  · edge  '#rrggbb' | null — 가장자리가 한 가지 색이면 그 색. 라이트박스가 배경을 이 색으로 깔아 프레임이 화면 끝까지 이어지게 합니다.
 *          전체 이미지(배율 1) 기준이며, 띠 안 픽셀의 흩어짐(표준편차)이 uniform(0~255) 이하일 때만 단색으로 봅니다. 사진·그라데이션은 null.
 *
 * 비용을 작게: sharp 로 64×64 로 한 번만 줄여 받아(원본 해상도·채널 통계 호출 없이) JS 로 띠 평균을 냅니다.
 * 결과는 node_modules/.cache/eo-image-tone.json 에 (경로 · 수정 시각 · 크기 · 배율 · 배경색) 키로 저장해
 * 빌드·dev 재시작·npm run assets 에서 다시 재지 않습니다. 브라우저에서는 아무 일도 하지 않습니다.
 */
import fs from 'node:fs';
import path from 'node:path';

export type Tone = 'light' | 'dark';
export interface EdgeInfo { tone: Tone; edge: string | null; }

const LIGHT_THRESHOLD = 0.5;   // 가장자리 평균 휘도(0~1, 감마 보정)가 이 값보다 크면 밝은 이미지
const RING = 0.03;             // 가장자리 띠의 두께 (보이는 영역 각 변 길이에 대한 비율)
const SAMPLE = 64;             // 줄여서 재는 크기 (px). 띠 두께가 최소 1px 이 되도록 RING × SAMPLE ≥ 1
const EDGE_SAMPLE = 256;       // 라이트박스 배경색용 가장자리 1px 띠를 잴 때의 크기 (px)

const CACHE_FILE = path.join(process.cwd(), 'node_modules', '.cache', 'eo-image-tone.json');
type Cache = Record<string, EdgeInfo>;
let cache: Cache | null = null;
let dirty = false;
const loadCache = (): Cache => {
  if (cache) return cache;
  try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch { cache = {}; }
  return cache!;
};
const saveCache = () => {
  if (!dirty || !cache) return;
  try { fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true }); fs.writeFileSync(CACHE_FILE, JSON.stringify(cache)); dirty = false; } catch {}
};
process.on('exit', saveCache);

/** srgb 평균값(0~255)으로 상대 휘도 근사 (BT.709 계수, 감마 보정) */
function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** 띠 평균색과 흩어짐. size 가 샘플 한 변, t 가 띠 두께(px), lo~hi 가 보이는 영역 */
function ringAt(data: Buffer, size: number, t: number, lo = 0, hi = size - 1) {
  let r = 0, g = 0, b = 0, n = 0;
  const px: number[] = [];
  const count = new Map<number, number>();                     // 최빈색 (정확한 RGB). 평균은 1px 어두운 테두리 줄·라벨 글자에 끌려가므로 배경색은 최빈색으로
  for (let y = lo; y <= hi; y++) for (let x = lo; x <= hi; x++) {
    if (x >= lo + t && x <= hi - t && y >= lo + t && y <= hi - t) continue;   // 띠 안쪽은 건너뜀
    const i = (y * size + x) * 3;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    px.push(i);
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  const mr = r / n, mg = g / n, mb = b / n;
  let v = 0;
  for (const i of px) v += (data[i] - mr) ** 2 + (data[i + 1] - mg) ** 2 + (data[i + 2] - mb) ** 2;
  let mode = 0, best = -1;
  for (const [k, c] of count) if (c > best) { best = c; mode = k; }
  return { r: mr, g: mg, b: mb, spread: Math.sqrt(v / (n * 3)), mode: { r: mode >> 16, g: (mode >> 8) & 255, b: mode & 255 } };   // spread: 채널 공통 표준편차 (0~255)
}
const hex = (c: number) => Math.round(c).toString(16).padStart(2, '0');

/**
 * @param publicSrc  <img src> 값 (/assets/…). public/ 아래 파일로 읽습니다.
 * @param zoom       카드 안 배율. 1 보다 크면 가운데만 보이므로 tone 은 그만큼 안쪽 띠로 잽니다.
 * @param background 투명 부분을 깔 색 (#rrggbb). 카드가 놓이는 면의 색이어야 투명 PNG·SVG 가 제대로 판정됩니다.
 * @param uniform    가장자리를 단색으로 볼 흩어짐 상한 (0~255). tokens.css --lightbox-bg-uniform
 */
export async function imageEdge(publicSrc: string, zoom = 1, background = '#000000', uniform = 6): Promise<EdgeInfo | undefined> {
  const file = path.join(process.cwd(), 'public', decodeURI(publicSrc));
  let st: fs.Stats;
  try { st = fs.statSync(file); } catch { return undefined; }
  const key = `v4|${publicSrc}|${st.mtimeMs}|${st.size}|${zoom}|${background}|${uniform}`;
  const c = loadCache();
  if (c[key]) return c[key];

  const sharp = (await import('sharp')).default;
  const { data } = await sharp(file).resize(SAMPLE, SAMPLE, { fit: 'fill' }).flatten({ background }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const z = Math.max(1, zoom);
  const inset = Math.round(SAMPLE * (1 - 1 / z) / 2);          // 배율로 잘려 나가는 픽셀 수 (각 변)
  const lo = inset, hi = SAMPLE - inset - 1;                   // 보이는 영역의 첫·끝 픽셀
  const t = Math.max(1, Math.round((hi - lo + 1) * RING));     // 띠 두께(px)
  const seen = ringAt(data, SAMPLE, t, lo, hi);
  const tone: Tone = luminance(seen.r, seen.g, seen.b) > LIGHT_THRESHOLD ? 'light' : 'dark';
  // 라이트박스 배경용 가장자리 색: 전체 이미지의 가장 바깥 1px 띠를 더 큰 샘플(EDGE_SAMPLE)로 잼.
  // 1920px 짜리 장표의 프레임 여백(약 20px)이 1px 보다 넓어야 안쪽 도형이 띠에 섞이지 않음 (1920/256 ≈ 7.5px per px)
  // 줄이지 않고 원본 가장 바깥 1px 띠를 그대로 잼 (줄이면 보간으로 색이 섞임). 색은 띠의 최빈색 — 내보내기 때 생기는 1px 어두운 줄(1081px 장표 등)이나 라벨이 평균을 끌어내리지 않게
  const edgeRaw = await sharp(file).flatten({ background }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const full = ringAtRect(edgeRaw.data, edgeRaw.info.width, edgeRaw.info.height, 1);
  const info: EdgeInfo = { tone, edge: full.spread <= uniform ? `#${hex(full.mode.r)}${hex(full.mode.g)}${hex(full.mode.b)}` : null };
  c[key] = info; dirty = true;
  return info;
}

/** 직사각형 원본의 바깥 t px 띠 — ringAt 과 같은 통계 (평균 · 흩어짐 · 최빈색) */
function ringAtRect(data: Buffer, w: number, h: number, t: number) {
  let r = 0, g = 0, b = 0, n = 0, v = 0;
  const count = new Map<number, number>();
  const idx: number[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x >= t && x < w - t && y >= t && y < h - t) continue;
    const i = (y * w + x) * 3;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
    idx.push(i);
    const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
    count.set(k, (count.get(k) ?? 0) + 1);
  }
  const mr = r / n, mg = g / n, mb = b / n;
  for (const i of idx) v += (data[i] - mr) ** 2 + (data[i + 1] - mg) ** 2 + (data[i + 2] - mb) ** 2;
  let mode = 0, best = -1;
  for (const [k, c] of count) if (c > best) { best = c; mode = k; }
  return { r: mr, g: mg, b: mb, spread: Math.sqrt(v / (n * 3)), mode: { r: mode >> 16, g: (mode >> 8) & 255, b: mode & 255 } };
}

/** 밝기만 필요할 때 (imageEdge 의 tone) */
export async function imageTone(publicSrc: string, zoom = 1, background = '#000000'): Promise<Tone | undefined> {
  return (await imageEdge(publicSrc, zoom, background))?.tone;
}
