/**
 * 이미지 가져오기: npm run import -- <페이지> [폴더]      (미리 보기: npm run import -- <페이지> --dry)
 *   예) npm run import -- symbol
 *       npm run import -- sub-symbol ~/Desktop/export
 *
 * 폴더(기본: 다운로드/temp)의 이미지를 국문 가이드(content/guide.ko.md)의 이미지 이름에 맞춰
 * public/assets/<챕터>/<페이지>/<주제 번호>-<이름>.<확장자> 로 복사합니다. 원본은 그대로 둡니다.
 *   - 파일명 앞 접두어(마지막 _ 까지, 예: "20261016 Finalization_")와 앞 번호(예: 03-)는 떼고 비교합니다.
 *   - 공백은 - 로 바꿉니다 ("icon-in use" → icon-in-use). 대소문자는 무시합니다(가이드 이름 · 예전 파일 이름도 소문자로 비교).
 *   - 같은 이름의 예전 파일(번호·확장자·대소문자가 달라도)은 새 파일로 바꿉니다. 단 그림이 같으면 건드리지 않습니다.
 *     바뀌는 예전 파일은 지우지 않고 .trash/<날짜-시각>/ 로 옮깁니다 (scripts/lib/trash.mjs).
 *     다시 내보내면 그림이 같아도 바이트가 달라질 수 있어서, 바이트가 다르면 픽셀로 한 번 더 비교합니다(sharp).
 *   - 가이드에 자리가 없는 파일은 복사하지 않고 목록으로 알려 줍니다.
 * 같은 이미지 이름이 여러 페이지에 있으므로(clearspace, dont-1 …) 페이지를 꼭 지정합니다.
 * 폴더 안에 페이지 이름의 하위 폴더(예: temp/typography/)가 있으면 그 폴더에서만 가져옵니다.
 * 페이지별로 하위 폴더를 나눠 두면 이름이 겹쳐도 다른 페이지 이미지가 섞이지 않습니다.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { loadManifest, EXTS, stripNum as strip } from './lib/manifest.mjs';
import { toTrash } from './lib/trash.mjs';

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'public', 'assets');
const args = process.argv.slice(2).filter(a => a !== '--dry');
const dry = process.argv.includes('--dry');
const [subArg, dirArg] = args;

const entries = loadManifest(ROOT).ko;              // 빌드 없이 md 를 직접 파싱 (scripts/lib/manifest.mjs)
const pages = [...new Set(entries.map(e => e.page))];
const slugOf = p => p.split('/').slice(-1)[0];

if (!subArg) {
  console.log('페이지를 지정하세요. 예) npm run import -- symbol\n\n가능한 페이지:');
  for (const p of pages) console.log(`  ${slugOf(p).padEnd(18)} ${entries.filter(e => e.page === p).length}자리`);
  process.exit(1);
}
const page = pages.find(p => slugOf(p) === subArg) ?? pages.find(p => p.endsWith(subArg));
if (!page) { console.error(`"${subArg}" 페이지를 찾지 못했습니다. 인자 없이 실행하면 목록이 나옵니다.`); process.exit(1); }

const baseDir = (dirArg ?? path.join(os.homedir(), 'Downloads', 'temp')).replace(/^~(?=\/|$)/, os.homedir());
if (!fs.existsSync(baseDir)) { console.error(`폴더가 없습니다: ${baseDir}`); process.exit(1); }
const subDir = path.join(baseDir, slugOf(page));
const srcDir = fs.existsSync(subDir) && fs.statSync(subDir).isDirectory() ? subDir : baseDir;
console.log(`가져오는 폴더: ${srcDir}${srcDir === baseDir ? '  (페이지 하위 폴더 없음)' : ''}`);

const norm = s => strip(s.toLowerCase().replace(/^.*_/, '')).trim().replace(/\s+/g, '-');   // 접두어(마지막 _ 까지) → 앞 번호(파서와 같은 stripNum) → 공백은 -
const slots = new Map(entries.filter(e => e.page === page).map(e => [strip(e.path.split('/').pop()).toLowerCase(), e]));
const sameName = (file, name) => strip(path.basename(file, path.extname(file))).toLowerCase() === name;   // 폴더 안 예전 파일 ↔ 자리 이름 (번호 · 확장자 · 대소문자 무시)
const md5 = buf => crypto.createHash('md5').update(buf).digest('hex');
const fileHash = f => md5(fs.readFileSync(f));
// 픽셀 비교: 디코드한 원시 픽셀의 해시. 같은 그림이면 같은 해시. 디코드 실패(깨진 파일 등)면 null (→ 바뀐 것으로 취급)
const pixelHash = async f => { try { return md5(await sharp(f).raw().toBuffer()); } catch { return null; } };
const sameImage = async (a, b) => {
  if (fileHash(a) === fileHash(b)) return 'bytes';
  const pa = await pixelHash(a), pb = pa && await pixelHash(b);
  return pa && pa === pb ? 'pixels' : false;
};

const files = fs.readdirSync(srcDir).filter(f => EXTS.includes(path.extname(f).slice(1).toLowerCase()));
let added = 0, updated = 0, same = 0, reexported = 0;
const changedNames = [], addedNames = [];
const unmatched = [];
const done = new Set();
for (const f of files) {
  const name = norm(path.basename(f, path.extname(f)));
  const slot = slots.get(name);
  if (!slot) { unmatched.push(f); continue; }
  const dst = path.join(ASSETS, `${slot.path}${path.extname(f).toLowerCase()}`);
  const dir = path.dirname(dst);
  const src = path.join(srcDir, f);
  done.add(name);
  // 비교 대상: 같은 자리의 파일, 없으면 같은 이름의 예전 파일 (번호·확장자가 달라도)
  const prev = fs.existsSync(dst) ? dst
    : fs.existsSync(dir) ? (fs.readdirSync(dir).map(o => path.join(dir, o)).find(o => sameName(o, name)) ?? null)
    : null;
  const verdict = prev && await sameImage(prev, src);
  if (verdict === 'bytes') { same++; continue; }
  if (verdict === 'pixels') { reexported++; continue; }                // 그림은 같고 다시 내보내기만 됨
  const existed = fs.existsSync(dir) && fs.readdirSync(dir).some(o => sameName(o, name));
  if (!dry) {
    fs.mkdirSync(dir, { recursive: true });
    for (const o of fs.readdirSync(dir)) {                    // 같은 이름의 예전 파일(같은 자리 포함)은 지우지 않고 .trash/ 로 (번호·확장자·대소문자가 달라도)
      if (sameName(o, name)) toTrash(ROOT, path.join(dir, o));
    }
    fs.copyFileSync(src, dst);
  }
  existed ? updated++ : added++;
  (existed ? changedNames : addedNames).push(name);
  console.log(`${dry ? '[dry] ' : ''}${existed ? '교체' : '추가'}  ${path.relative(ASSETS, dst)}`);
}
const missing = [...slots.keys()].filter(n => !done.has(n) && !slots.get(n).src);
console.log(`\n${slugOf(page)}: 그림이 바뀜 ${updated} · 새로 추가 ${added} · 같음 ${same + reexported} (다시 내보내기만 된 것 ${reexported})${dry ? '  (미리 보기, 복사 안 함)' : ''}`);
if (changedNames.length) console.log(`  바뀐 이미지: ${changedNames.join(', ')}`);
if (addedNames.length) console.log(`  새 이미지: ${addedNames.join(', ')}`);
if (unmatched.length) console.log(`\n가이드에 자리가 없는 파일 ${unmatched.length} (복사 안 함. 이름을 가이드의 이미지 이름과 맞추세요):\n  ${unmatched.join('\n  ')}`);
if (missing.length) console.log(`\n아직 비어 있는 자리 ${missing.length}:\n  ${missing.join(', ')}`);
