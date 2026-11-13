/**
 * 빌드 후 이미지 사본 (TD-6, 2026-11-13) — 원본(public/assets)은 건드리지 않고 dist/assets 에만 가벼운 사본을 옆에 만듭니다.
 *   PNG  → <이름>.png.webp   무손실 WebP (픽셀 동일)
 *   JPG  → <이름>.jpg.avif   AVIF 품질 90 · 크로마 4:4:4 (색 번짐 없음, 사용자 확인: 화질 우선)
 * Figure.astro 가 빌드에서만 <picture> 로 이 사본을 먼저 내고 원본을 폴백으로 둡니다(개발 서버는 원본만 — 결과는 npm run build && npm run preview 로 확인).
 * 변환 결과는 원본 내용 해시로 node_modules/.cache/eo-images/ 에 캐시 → 두 번째 빌드부터는 복사만.
 * 사본이 원본보다 크면(지금은 0장) 사본 대신 원본을 같은 이름으로 복사해, <picture> 가 가리키는 파일은 언제나 존재.
 * 끝에 Figure 규칙과 같은 이름의 사본이 모든 PNG · JPG 옆에 있는지 확인하고, 빠지면 빌드를 멈춥니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

/** Figure.astro 와 같은 규칙: 원본 경로 → 사본 경로 · MIME. 대상이 아니면 null */
export function optimizedOf(src) {
  if (/\.png$/i.test(src)) return { src: `${src}.webp`, type: 'image/webp' };
  if (/\.jpe?g$/i.test(src)) return { src: `${src}.avif`, type: 'image/avif' };
  return null;
}

const ENCODE = {
  'image/webp': s => s.webp({ lossless: true, effort: 6 }),
  'image/avif': s => s.avif({ quality: 90, chromaSubsampling: '4:4:4', effort: 5 }),
};
const VERSION = 'v1-webp-lossless-e6-avif-q90-444-e5';   // 설정을 바꾸면 이 문자열도 바꿔 캐시를 새로

const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];

export async function optimizeImages(distDir, cacheDir, log = console.log) {
  const files = walk(path.join(distDir, 'assets')).filter(f => optimizedOf(f));
  fs.mkdirSync(cacheDir, { recursive: true });
  let before = 0, after = 0, made = 0, cached = 0, kept = 0;
  const queue = [...files], workers = Array.from({ length: 4 }, async () => {
    for (let f; (f = queue.shift());) {
      const out = optimizedOf(f), buf = fs.readFileSync(f);
      const key = crypto.createHash('sha1').update(VERSION).update(buf).digest('hex');
      const hit = path.join(cacheDir, key);
      let data;
      if (fs.existsSync(hit)) { data = fs.readFileSync(hit); cached++; }
      else { data = await ENCODE[out.type](sharp(buf)).toBuffer(); fs.writeFileSync(hit, data); made++; }
      if (data.length >= buf.length) { data = buf; kept++; }   // 더 커지면 원본 바이트를 그대로 (이미지는 확장자 · type 이 아니라 내용으로 판별되므로 그대로 표시됨. 2026-11-13 기준 0장)
      fs.writeFileSync(out.src, data);
      before += buf.length; after += data.length;
    }
  });
  await Promise.all(workers);
  const missing = files.filter(f => !fs.existsSync(optimizedOf(f).src));
  if (missing.length) throw new Error(`이미지 사본이 없음 ${missing.length}개: ${missing.slice(0, 3).join(', ')}`);
  const MB = b => (b / 1048576).toFixed(1);
  log(`이미지 사본 ${files.length}장 (새로 ${made} · 캐시 ${cached}${kept ? ` · 원본 유지 ${kept}` : ''}) — ${MB(before)}MB → ${MB(after)}MB`);
  return { files: files.length, before, after, kept };
}
