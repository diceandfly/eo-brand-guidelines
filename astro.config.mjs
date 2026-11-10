import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { fontWarnings } from './scripts/lib/check-fonts.mjs';

// 콘텐츠(content/guide.*.md)는 src/lib/guide.ts 가 Vite 모듈로 읽으므로
// 저장하면 라우트 재계산과 브라우저 새로고침이 자동으로 일어납니다. 별도 감시 플러그인은 필요 없습니다.
// 빌드(npm run build, npm run assets)는 개발 서버와 다른 Vite 캐시 폴더를 씁니다.
// 같은 폴더를 쓰면 개발 서버가 켜진 채 빌드했을 때 개발 서버의 GSAP 등 의존성 캐시가 덮여
// 브라우저에 "504 Outdated Optimize Dep" 가 나고 스크립트(스무스 스크롤, 이미지 확대)가 통째로 멈춥니다.
const isBuild = process.argv.includes('build');

// public/assets 에 이미지를 넣거나 지우면 브라우저를 새로고침한다 (색인은 src/lib/content.ts 가 폴더 mtime 으로 다시 계산).
const watchAssets = () => ({
  name: 'eo-watch-assets',
  configureServer(server) {
    const dir = new URL('./public/assets', import.meta.url).pathname;
    server.watcher.add(dir);
    const reload = (file) => { if (file.startsWith(dir)) server.ws.send({ type: 'full-reload', path: '*' }); };
    server.watcher.on('add', reload).on('unlink', reload).on('addDir', reload).on('unlinkDir', reload);
  },
});

// 빌드 시작 때 폰트 파일(git 에 없음)이 public/fonts 에 다 있는지 확인. 없으면 경고만 하고 빌드는 계속 (사이트는 폴백 서체로 보임)
const checkFontsOnBuild = () => ({
  name: 'eo-check-fonts',
  hooks: {
    'astro:build:start': ({ logger }) => {
      for (const w of fontWarnings(fileURLToPath(new URL('.', import.meta.url)))) logger.warn(w);
    },
  },
});

export default defineConfig({
  integrations: [checkFontsOnBuild()],
  site: 'http://localhost:4321',
  vite: { cacheDir: isBuild ? 'node_modules/.vite-build' : 'node_modules/.vite', plugins: [watchAssets()] },
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false }
});
