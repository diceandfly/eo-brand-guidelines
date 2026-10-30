# Fonts

Founders Grotesk 는 유료 서체라 폰트 파일을 git 에 넣지 않습니다. 폰트 파일은 라이선스를 가진 쪽(클라이언트)이 직접 관리하고, 이 저장소에는 파일이 들어오지 않도록 세 겹으로 막혀 있습니다.

- `.gitignore` 가 `public/fonts/*` 와 모든 `*.woff2 · *.woff · *.ttf · *.otf · *.eot` 를 무시합니다.
- `.githooks/pre-commit` 이 폰트 파일(과 `dist/`)이 든 커밋을 거부합니다. `git add -f` 로 강제해도 막힙니다.
- `.githooks/pre-push` 가 푸시되는 모든 커밋을 다시 검사합니다.

훅은 `git config core.hooksPath .githooks` 로 켭니다(저장소를 새로 클론하면 한 번 실행). 사이트는 이 폴더에 파일이 있어야 제대로 보입니다.

## 배포 담당자(클라이언트)가 할 일
1. 이 저장소를 클론합니다.
2. 아래 6개 파일을 이 폴더(`public/fonts/`)에 그대로 넣습니다. 파일명이 같아야 합니다.
3. `npm install` → `npm run build` 를 실행하면 `dist/` 에 폰트가 포함된 정적 사이트가 만들어집니다. 그 `dist/` 를 배포합니다.

```
founders-grotesk-light.woff2
founders-grotesk-regular.woff2
founders-grotesk-medium.woff2
founders-grotesk-semibold.woff2
founders-grotesk-mono-regular.woff2
founders-grotesk-mono-medium.woff2
```

파일명이 다르면 `src/styles/fonts.css` 의 경로를 같이 고치세요. 폰트 파일과 빌드 결과물(`dist/`)은 공개 저장소에 올리지 마세요.

## Pretendard (한글)
`pretendard/` 의 서브셋 woff2 92개는 무료(OFL) 서체지만 역시 git 에 넣지 않습니다. `npm run fonts:ko` 가 CDN 에서 내려받고
`src/styles/pretendard.css` · `src/lib/pretendard-preload.json` 을 함께 만듭니다. 클론한 뒤 한 번 실행하세요.
