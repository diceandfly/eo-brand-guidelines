# EO Brand Guidelines

EO 리브랜딩 웹 브랜드 가이드라인. Astro 정적 사이트.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
```

- 글·이미지 배치: `content/guide.en.md`, `content/guide.ko.md` (문법은 파일 상단 주석). 두 언어가 함께 빌드되며 `/en/…`, `/ko/…`
- 이미지: `public/assets/`
- 디자인 토큰: `src/styles/tokens.css`
- 편집 가이드: `docs/file-management.md`

## 배포 (클라이언트 인수인계)

이 저장소에는 **폰트 파일이 없습니다.** Founders Grotesk 는 유료 서체라 git 에 넣지 않고(`.gitignore` 와 `.githooks` 가 막음), 라이선스를 가진 쪽이 자기 컴퓨터에서 폰트를 넣어 빌드합니다. 빌드 결과(`dist/`)에는 폰트가 포함되므로, 그 폴더만 호스팅에 올리면 됩니다.

1. 저장소를 클론하고 `npm install`.
2. `public/fonts/README.md` 에 적힌 woff2 6개를 `public/fonts/` 에 넣습니다 (파일명 그대로).
3. `npm run build` → `dist/` 가 완성된 정적 사이트입니다. 이 폴더를 호스팅(Vercel · Netlify · S3 · 사내 서버 등 정적 파일을 올릴 수 있는 곳)에 배포합니다.
4. 폰트 파일과 `dist/` 는 저장소에 커밋하거나 푸시하지 않습니다. 커밋을 시도하면 훅이 막습니다 (`npm install` 이 `prepare` 스크립트로 `git config core.hooksPath .githooks` 를 실행해 훅을 켭니다).

자동 배포(푸시할 때마다 빌드)가 필요하면 폰트를 저장소 밖에 두는 방식이 필요합니다. 예: 클라이언트 CDN 에 폰트를 올리고 `src/styles/fonts.css` 의 경로를 그 주소로 바꾸기. 그 전까지는 위의 로컬 빌드 방식이 가장 단순합니다.

`/en/…` 은 영문, `/ko/…` 은 국문이며 첫 페이지는 `/ko/01-overview/welcome` 입니다.
