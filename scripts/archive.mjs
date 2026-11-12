/**
 * 핸드오프 아카이브 만들기: npm run archive [-- <git ref>]      (기본 ref = 태그 handoff-final)
 *   예) git tag handoff-final          ← 최종 핸드오프 커밋에 태그
 *       npm run archive                ← 그 태그 시점 가이드를 public/archive/handoff/ 에 고정
 *
 * 하는 일
 *   1. ref 를 임시 git worktree 로 꺼내 그 시점 코드 · md · 이미지 그대로 빌드 (EO_ARCHIVE=<커밋 날짜> → 목차에 아카이브 표시)
 *   2. 결과에서 서체(fonts/)와 로고 생성기(tools/)는 빼고 (둘 다 현재 것을 같이 씀 · 서체는 라이선스상 저장소에 넣지 않음)
 *   3. HTML · 색인 JSON · CSS 의 사이트 경로(/en · /ko · /assets · /_astro · /favicon.svg)를 /archive/handoff/… 로 바꿈.
 *      목차의 "현재 가이드" 링크(data-archive-exit)만 그대로 둠
 *   4. public/archive/handoff/ 에 놓고 archive.json(ref · 커밋 · 날짜) 기록. 이전 사본은 지우지 않고 .trash/ 로
 * 이후 npm run build 가 public/ 째로 dist 에 복사하므로 배포에 같이 나갑니다. 아카이브는 고치지 않습니다 — 다시 만들 때만 이 명령.
 * 검색창 이스터에그(src/lib/archive.ts 의 ARCHIVE_KEY)가 이 경로로 이동합니다. 아카이브가 없으면 이스터에그는 아무 일도 하지 않음.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { toTrash } from './lib/trash.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '/archive/handoff';                        // src/lib/archive.ts 의 ARCHIVE_BASE 와 같아야 함 (npm test 가 확인)
const DEST = path.join(ROOT, 'public', BASE);
const SKIP = new Set(['fonts', 'tools', 'archive']);    // 아카이브에 넣지 않는 최상위 항목 (+ 빌드 부산물 *.mjs)
const ref = process.argv[2] ?? 'handoff-final';

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
const die = m => { console.error(`✗ ${m}`); process.exit(1); };

let commit;
try { commit = git('rev-parse', '--verify', '--quiet', `${ref}^{commit}`); } catch { die(`git ref "${ref}" 가 없습니다. 최종 핸드오프 커밋에서 git tag handoff-final 을 먼저 하세요.`); }
try { git('cat-file', '-e', `${commit}:src/lib/archive.ts`); } catch { die(`${ref} 에는 아카이브 기능(src/lib/archive.ts)이 없습니다. 기능이 들어간 뒤의 커밋이어야 합니다.`); }
const date = git('log', '-1', '--format=%ci', commit).slice(0, 10);   // 커밋 날짜 (YYYY-MM-DD) = 목차의 기준 날짜

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eo-archive-'));
const work = path.join(tmp, 'src'), out = path.join(tmp, 'out');
console.log(`▸ ${ref} (${commit.slice(0, 7)} · ${date}) 빌드 중…`);
try {
  git('worktree', 'add', '--detach', work, commit);
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(work, 'node_modules'));   // 의존성은 지금 저장소 것을 빌려 씀
  execFileSync(path.join(work, 'node_modules/.bin/astro'), ['build', '--outDir', out], { cwd: work, stdio: 'inherit', env: { ...process.env, EO_ARCHIVE: date } });

  // 경로 바꾸기 — 따옴표 · 괄호 · = 뒤(속성값 · url() · meta refresh) 또는 site 주소 뒤에 오는 사이트 경로만
  const SITE_PATH = /(?<!data-archive-exit href=")(?<=["'(=]|localhost:4321)\/(en|ko|assets|_astro|favicon\.svg)(?=[/"'#?.)]|$)/g;
  const LEFT = /["'(=]\/(en|ko|assets|_astro)\//;
  let pages = 0, leaks = [];
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const staging = path.join(tmp, 'archive');
  fs.mkdirSync(staging);
  for (const name of fs.readdirSync(out)) if (!SKIP.has(name) && !name.endsWith('.mjs')) fs.cpSync(path.join(out, name), path.join(staging, name), { recursive: true });
  for (const f of walk(staging)) {
    const ext = path.extname(f);
    if (['.html', '.json', '.css'].includes(ext)) {
      const s = fs.readFileSync(f, 'utf8'), r = s.replace(SITE_PATH, `${BASE}/$1`);
      if (r !== s) fs.writeFileSync(f, r);
      if (ext === '.html') pages++;
      if (LEFT.test(r.replaceAll(/data-archive-exit href="[^"]*"/g, ''))) leaks.push(path.relative(staging, f));
    } else if (ext === '.js' && LEFT.test(fs.readFileSync(f, 'utf8'))) leaks.push(path.relative(staging, f));   // 스크립트 안의 고정 경로는 바꾸지 않으므로 있으면 알림
  }
  if (leaks.length) throw new Error(`아카이브 밖(현재 가이드)을 가리키는 경로가 남았습니다:\n  ${leaks.join('\n  ')}`);
  fs.writeFileSync(path.join(staging, 'archive.json'), JSON.stringify({ ref, commit, date, builtAt: new Date().toISOString() }, null, 2) + '\n');

  if (fs.existsSync(DEST)) console.log(`  이전 아카이브 → ${path.relative(ROOT, toTrash(ROOT, DEST))}`);
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.cpSync(staging, DEST, { recursive: true });
  const mb = walk(DEST).reduce((s, f) => s + fs.statSync(f).size, 0) / 1e6;
  console.log(`✓ public${BASE}/ — HTML ${pages}개 · ${mb.toFixed(1)}MB · 기준 ${date}. 확인 후 커밋하세요 (이미지는 지금 것과 같으면 git 이 한 번만 저장).`);
} catch (e) {
  console.error(`✗ ${e.message}`); process.exitCode = 1;   // 실패해도 public/archive 는 그대로 (임시 폴더에서만 작업)
} finally {
  try { fs.unlinkSync(path.join(work, 'node_modules')); } catch { /* 링크 전에 실패 */ }   // 링크만 끊음 (대상 node_modules 는 그대로)
  fs.rmSync(tmp, { recursive: true, force: true });
  git('worktree', 'prune');   // 임시 worktree 기록 정리 (git 2.15 도 되게 worktree remove 대신 폴더 삭제 + prune)
}
