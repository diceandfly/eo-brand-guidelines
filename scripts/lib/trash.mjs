/**
 * 지우거나 덮어쓸 파일을 삭제하지 않고 프로젝트의 .trash/ 로 옮깁니다 (scripts/assets.mjs · scripts/import.mjs).
 * 실행마다 .trash/<날짜-시각>/ 폴더 하나에 원래 경로 그대로 모이므로, 잘못 정리됐으면 그 폴더에서 되돌리면 됩니다.
 * .trash/ 는 git 에서 무시합니다. 다 확인했으면 폴더째 지우세요.
 */
import fs from 'node:fs';
import path from 'node:path';

const d = new Date(), p2 = n => String(n).padStart(2, '0');
const stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}`;   // 20261110-103015 (현지 시각)

/** file(파일 또는 폴더)을 <root>/.trash/<stamp>/<root 기준 경로> 로 옮기고 옮긴 경로를 돌려줍니다 */
export function toTrash(root, file) {
  const dest = path.join(root, '.trash', stamp, path.relative(root, file));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(file, dest);
  return dest;
}
