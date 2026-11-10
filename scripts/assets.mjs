/**
 * 이미지 폴더 정리: npm run assets   (미리 보기만: npm run assets -- --dry)
 *
 * public/assets 를 <챕터>/<페이지>/<주제 번호>-<이름> 규칙으로 맞춥니다. 기준은 국문(content/guide.ko.md)입니다.
 *   1. 페이지마다 폴더를 만듭니다 (파일이 아직 없어도 넣을 곳이 보이도록).
 *   2. 이미 있는 이미지의 앞 번호를 지금 주제 순서에 맞춥니다 (번호가 없으면 붙임)
 *      (섹션 순서를 바꿔 번호가 밀렸을 때, 예전 public/assets/logo/… 위치에 있을 때).
 *   3. 비어 버린 예전 폴더를 지웁니다.
 *   4. 빠진 이미지 수와, 어디에서도 쓰지 않는 파일을 알려 줍니다.
 * 파일을 지우지는 않습니다. 쓰지 않는 파일은 목록만 보여 줍니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadManifest, srcToRel, srcToFile } from './lib/manifest.mjs';

const MASTER = 'ko';
const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'public', 'assets');
const KEEP = ['brand'];                               // 사이트 자체 로고 등, 콘텐츠 이미지가 아닌 폴더
const dry = process.argv.includes('--dry');

const manifest = loadManifest(ROOT);                  // 빌드 없이 md 를 직접 파싱 (scripts/lib/manifest.mjs)
const entries = manifest[MASTER];
const rel = p => path.relative(ASSETS, p).split(path.sep).join('/');
const act = (msg, fn) => { console.log(`${dry ? '[dry] ' : ''}${msg}`); if (!dry) fn(); };

// 1·2. 폴더 만들기와 옮기기 (문서 순서대로. 예전 위치의 같은 파일을 두 곳이 가리키면 먼저 나온 쪽이 가져감)
const expectedDirs = new Set();                       // 지금 구조에 있어야 하는 폴더
const createdDirs = new Set();                        // 이번 실행에서 (만들었거나 dry 로 만든 셈 친) 폴더
let moved = 0, created = 0, missing = 0;
const missingByPage = new Map();
for (const e of entries) {
  const dir = path.join(ASSETS, path.dirname(e.path));
  expectedDirs.add(rel(dir));
  if (!fs.existsSync(dir) && !createdDirs.has(rel(dir))) {
    createdDirs.add(rel(dir));
    act(`폴더   ${rel(dir)}/`, () => fs.mkdirSync(dir, { recursive: true }));
    created++;
  }
  if (!e.src) { missing++; missingByPage.set(e.page, (missingByPage.get(e.page) ?? 0) + 1); continue; }
  const from = srcToFile(ROOT, e.src);
  const to = path.join(ASSETS, `${e.path}${path.extname(from)}`);
  if (from === to || !fs.existsSync(from)) continue;
  if (fs.existsSync(to)) { console.log(`건너뜀 ${rel(to)} 이(가) 이미 있어 ${rel(from)} 을 옮기지 않음`); continue; }
  act(`이동   ${rel(from)}  →  ${rel(to)}`, () => fs.renameSync(from, to));
  moved++;
}

// 3. 비어 버린 폴더 지우기 (지금 구조에 없는 폴더만, 안쪽부터)
const prune = dir => {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) if (d.isDirectory()) prune(path.join(dir, d.name));
  const r = rel(dir);
  if (dir === ASSETS || KEEP.includes(r.split('/')[0])) return;
  const left = fs.readdirSync(dir).filter(n => n !== '.DS_Store');
  const isExpected = [...expectedDirs].some(x => x === r || x.startsWith(`${r}/`));
  if (!left.length && !isExpected) act(`삭제   ${r}/ (빈 폴더)`, () => fs.rmSync(dir, { recursive: true }));
};
prune(ASSETS);                                        // --dry 면 act 가 출력만 함

// 4. 보고
const noExt = f => f.replace(/\.[^./]+$/, '');
const used = new Set(Object.values(manifest).flat().flatMap(e =>          // 지금 자리(path) 또는 빌드 때 찾은 자리(src)
  [e.path, e.src && noExt(srcToRel(e.src))].filter(Boolean)));
const files = [];
const walk = dir => { for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
  const p = path.join(dir, d.name);
  if (d.isDirectory()) walk(p); else if (d.name !== '.DS_Store') files.push(rel(p));
} };
walk(ASSETS);
const unused = files.filter(f => !used.has(noExt(f)) && !KEEP.includes(f.split('/')[0]));

console.log(`\n이동 ${moved} · 새 폴더 ${created} · 빠진 이미지 ${missing} / ${entries.length} (기준: guide.${MASTER}.md)`);
for (const [page, n] of missingByPage) console.log(`  ${page}  빠진 이미지 ${n}`);
if (unused.length) {
  console.log(`\n어디에서도 쓰지 않는 파일 ${unused.length} (지우지 않았습니다. 이름이 토큰과 같은지 확인하세요):`);
  for (const f of unused) console.log(`  ${f}`);
}
if (dry) console.log('\n미리 보기였습니다. 실제로 정리하려면 npm run assets');
