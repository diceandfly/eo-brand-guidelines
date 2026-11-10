/**
 * 폰트 파일 확인: src/styles/fonts.css · pretendard.css 가 가리키는 woff2 가 public/fonts/ 에 다 있는지 셉니다.
 * 폰트는 라이선스 때문에 git 에 없으므로(public/fonts/README.md) 새 클론에서 빠뜨리기 쉽습니다.
 * astro.config.mjs 가 빌드 시작 때 부르고(없으면 경고만, 빌드는 계속), npm test 도 리포트에 씁니다.
 */
import fs from 'node:fs';
import path from 'node:path';

const SOURCES = [
  { css: 'src/styles/fonts.css', fix: 'Founders Grotesk 파일을 public/fonts/ 에 넣으세요 (public/fonts/README.md)' },
  { css: 'src/styles/pretendard.css', fix: 'npm run fonts:ko 를 실행하세요 (Pretendard 서브셋을 public/fonts/pretendard/ 에 받음)' },
];

/** @returns {{ css: string, fix: string, total: number, missing: string[] }[]} */
export function checkFonts(root) {
  return SOURCES.map(({ css, fix }) => {
    const file = path.join(root, css);
    const urls = fs.existsSync(file)
      ? [...new Set([...fs.readFileSync(file, 'utf8').matchAll(/url\(['"]?(\/fonts\/[^'")]+\.woff2)['"]?\)/g)].map(m => m[1]))]
      : [];
    const missing = urls.filter(u => !fs.existsSync(path.join(root, 'public', decodeURI(u))));
    return { css, fix, total: urls.length, missing };
  });
}

/** 빠진 파일이 있으면 경고 문구 목록 (없으면 빈 배열) */
export function fontWarnings(root) {
  return checkFonts(root).filter(r => r.missing.length).map(r =>
    `[fonts] ${r.css} 의 woff2 ${r.total}개 중 ${r.missing.length}개가 public 에 없습니다 (예: ${r.missing.slice(0, 3).join(', ')}). ${r.fix}`);
}
