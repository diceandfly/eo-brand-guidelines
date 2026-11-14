# EO Brand Guidelines (web)

**먼저 [AGENTS.md](AGENTS.md)** — 디자이너가 허용한 예외(오류로 보고 · 수정 금지) · 절대 규칙 · 이스터에그. 아래 줄로 자동으로 함께 읽힘.
@AGENTS.md

EO 리브랜딩의 웹용 브랜드 가이드라인. Astro 정적 사이트, 로컬 개발 전용(배포 없음).

## 구조와 역할 분리
- `content/guide.en.md` / `content/guide.ko.md` — 모든 글·이미지 배치. 언어별 한 파일, 문법 동일(상단 주석). 두 언어가 함께 빌드되어 `/en/…`, `/ko/…` 로 나뉘고 목차 하단 EN | KR 로 전환. 콘텐츠 변경은 이 파일만 수정.
- `public/assets/<NN-chapter>/<NN-subchapter>/<NN>-<name>.*` — 이미지. `![name]` 토큰과 1:1(페이지 폴더 안에서 이름으로 찾음, 파일명 앞 NN = 주제 순서, 정렬용이라 파서는 무시). 주제 = 목차 라벨. 없으면 넣을 경로가 적힌 플레이스홀더. `npm run assets`(scripts/assets.mjs)가 국문 구조 기준으로 폴더 생성·번호 맞춤·빈 폴더 정리.
- `src/styles/tokens.css` — 모든 디자인 수치(레이아웃·타이포·컬러·비율·모션). 디자인 튜닝은 이 파일만 수정. 구성: A 시스템(타입 · 컬러 · 공통 치수 · 공통 모션은 종류별) + B 요소(페이지 셸 → 목차 → 그리드 · 섹션 → 다음 버튼 → 칩 · 알약 → 이미지 · 카드 → 컬러 카드 → 라이트박스 → 페이지 전환 · 스크롤, 요소 안은 치수 → 비율 → 색 → 모션). 새 토큰은 사이트 전체에 같은 뜻으로 쓰이면 A, 아니면 그 요소 블록에. 레이아웃 치수(간격 · 패딩 · 들여쓰기 · 레이아웃 폭)는 `calc(var(--lh-unit) * N)`, N 은 ¼ 단위 — 배수만 바꿈. 범위값(min · max) · 스크립트가 읽는 토큰(motion.ts num/ms) · 조형 디테일(아이콘 · 알약 · 2–8px 보정)은 px 숫자. 목록은 tokens.css A-3 주석, npm test [7] 이 검사.
- `src/styles/base.css` — 토큰을 참조하는 레이아웃 CSS. 숫자를 직접 쓰지 말고 토큰을 추가해 참조할 것.
- `src/lib/guide.ts` — guide.<lang>.md 파서(순수 Node, Vite 의존 없음). 문법을 바꾸면 guide.<lang>.md 상단 튜토리얼도 같이 갱신. `src/lib/content.ts` 가 md·tokens.css 를 Vite 모듈로 읽어 넘기고 빌드 동안 메모(페이지는 content.ts 의 `loadGuide`/`loadAllGuides`/`TOKENS` 를 씀). `src/lib/tokens.ts` 는 tokens.css 를 코드에서 읽는 파서(컬러 HEX, Do/Don't 배율, 면 색)와 시간 토큰 해석 · 휘도 공식(브라우저 스크립트 · scripts 도 이것만 씀). `scripts/*.mjs` 는 빌드 없이 guide.ts 를 직접 호출(`scripts/lib/manifest.mjs` — 번호 떼기 · 경로 변환도 여기서 가져감). assets · import 가 지우거나 덮어쓸 파일은 `.trash/` 로 옮김.
- `src/components/` — Section(텍스트+미디어 슬롯), Figure(이미지/플레이스홀더/배지/캡션), Swatch · SwatchVal(컬러 카드 · 복사 값), Sidebar, Search, Logo.
- `src/lib/ui-markup.ts` — 파서와 컴포넌트가 함께 쓰는 마크업 한 벌(호버 알약 `tipHtml`: 컬러 칩 · 컬러 값 Copy, 참조 링크 Jump · Open · Mail). 알약 글자는 CSS content 라 마크업에 글자를 넣지 말 것(검색 색인 · 드래그 복사에 섞임).
- `src/lib/imageTone.ts` — 빌드 때 이미지 가장자리 밝기를 재서(sharp) 카드 호버 테두리를 밝은 회색/어두운 회색 중 어느 쪽으로 할지 정함(`data-tone`). 색·두께·시간은 tokens.css `--img-border-hover*` / `--img-border-w-hover*` / `--img-border-hover-dur`.
- `src/lib/motion.ts` — GSAP 모션(스무스 스크롤 ScrollSmoother, 앵커 이동, 이미지 라이트박스). 수치는 tokens.css B-9(페이지 전환 · 스크롤) · B-8(라이트박스) · B-2(목차 슬라이드) 의 모션 토큰에서 읽음. 고정 요소(목차·상단 바·라이트박스)는 `#smooth-wrapper` 밖에 둘 것.
- `public/archive/handoff/` — 최종 핸드오프 시점 가이드의 고정 빌드(`npm run archive` = scripts/archive.mjs, git 태그 `handoff-final` 기준, 서체 · 생성기 제외). 손으로 고치지 않음. 검색창 `designisgood` 이스터에그가 같은 페이지로 왕복(`src/lib/archive.ts`, Search.astro), 목차에 아카이브 표시(빌드 환경 변수 EO_ARCHIVE). 튜토리얼 docs/file-management.md §8.
- `public/tools/logo-generator/` — 로고 생성기(빌드 없는 정적 도구: index.html · fonts.css · tokens.css · tool.css · geom.js(확정, 손대지 않음) · app.js · sig-font.js · vendor/). 목차 Logo › Download(`## Download {href=…}` 링크 항목, 새 탭)로 열림. 서체는 public/fonts 공유. 디자인 튜닝은 생성기 tokens.css 만(가이드 tokens.css 와 이름 · 블록 순서 · 주석 규칙은 같고 값은 별개), tool.css 는 토큰만 참조하는 규칙. 사양 · 부채 기록은 `docs/logo-generator/`, 회귀 검사는 npm test [5].

## 용어 (대화에서 이 이름으로 통일)
챕터(`# 02 Logo`) > 페이지(`## Logo`, 화면 하나 = URL 하나; `{toc=none}` 을 붙이면 목차에 섹션 목록을 펼치지 않음) > 섹션(`### Head`, 선택적 `#### Subhead`). `### + Head` 는 목차에 올릴 섹션 표시 — 한 페이지에 `+` 가 하나라도 있으면 표시된 것만, 없으면 전부 자동. `### + Head {toc=group}`(헤드만 있는 섹션)은 바로 뒤에 연달아 오는 같은 헤드의 서브헤드 섹션들을 목차에서 그 항목 아래 하위 목록으로 보여 줌 — 체계적인 묶음 전용(Vocabulary · Morphology · Grammar), 흩어진 같은 헤드는 안 묶임.
레이아웃: `text`(이미지 없음) / `basic`(텍스트 5컬럼 + 이미지 6컬럼, `--sec-text-cols` / `--sec-media-cols`) / `wide`(12컬럼, 여러 장이면 세로로 쌓임) / `half`(6컬럼) / `grid-2|3|4` / `text-2|3|4`(본문 문단을 N단으로, 모바일은 한 단). 섹션 여러 개를 한 12컬럼 행에 놓으려면 `::: split` … `:::` 로 감싸고 섹션마다 `{span=N}`(생략 시 균등 분배; `sectionBlocks`, `.sec-split`).
아이템: 이미지, 카드(이미지+캡션), 스와치. 배지 `{do}` `{dont}` `{con}`(conditional, 흰 삼각형). 기기 목업: `{device}`(화면 자리만 투명한 PNG 목업 — 바로 다음 줄 이미지가 그 화면 안에 들어가고, 확대 보기도 목업째. 화면 자리는 빌드 때 imageTone.ts `deviceScreen` 이 잼). 카드 안 움직임: `{scroll}`(카드보다 세로로 긴 이미지를 위 → 아래로 나눠 내림) · `{slide}`(연달아 놓인 `{slide}` 이미지들이 카드 하나에서 한 장씩 옆으로 넘어감, 캡션은 첫 줄 것. 첫 줄을 `{slide=3:4}` 로 쓰면 그 비율의 장을 자르지 않고 나란히 놓아 일정한 속도로 흐름) — Section.astro 가 묶고 motion.ts 4 가 움직임, 수치는 tokens.css `--card-scroll-*` · `--card-slide-*`.

## 타이포 규칙
5레벨 고정: display / heading / body / ui / label. 행간이 기준 단위(`--lh-unit`). 레벨마다 m(행간 배수)·p(행간÷폰트, 숫자 1.4 = 140% — % 금지: 아이폰 웹킷에서 깨짐, npm test [7])·ls·w 토큰만 가지며 폰트 사이즈는 계산값. 레벨을 늘리지 말 것.
검색 · 스와치 · 로고 폴백의 파생 배율은 허용(새 레벨 아님): 검색 결과 ui × `--search-result-scale`, 컬러 카드 패널 body × `--swatch-panel-scale`(밝은 면 × `--swatch-panel-fg-light-scale`), 로고 폴백 글자 `--nav-logo-h`.
서체는 Founders Grotesk(본문 포함)와 Founders Grotesk Mono(label)만 사용. woff2는 `public/fonts/`(git 제외).

## 컬러 규칙
브랜드 팔레트 7색(`--c-*`)은 `EO color palette final.svg` 기준이며 임의로 바꾸지 않는다. UI는 시맨틱 토큰(`--bg`, `--fg`, `--accent` …)만 참조. 중간 톤은 새 HEX 대신 `color-mix()`. 배지 색(`--badge-do`, `--badge-dont`, `--badge-con`)은 UI 전용이며 브랜드 컬러가 아님(`--c-` 접두는 팔레트 7색만).
본문·캡션의 참조 링크는 `[[page#section|라벨]]`(guide.ts `resolveXrefs`, 라벨은 목차에서 "페이지 › 섹션" 자동, `[[→ page#section]]` 이면 화살표 포함, `[[https://…|라벨]]` 은 외부 링크 새 탭).
본문·캡션에 영문 공식 명칭(Builder Neon 등 7색)을 쓰면 파서(`colorChips`)가 이름 앞에 색 칩을 붙인다. 이름 표기는 대소문자까지 고정. 본문은 섹션 안 첫 언급에만 칩(캡션은 매번), `[Builder Neon]` 은 칩만, `[+Builder Neon]` 은 칩+이름 강제. 칩은 복사 버튼(호버 Copy 알약, 클릭 시 HEX 복사, 스크립트는 Layout.astro).

## 작업 방식
- 사용자는 한국어, 두괄식 소통을 선호하며 미확정 사항은 착수 전에 토론한다.
- 데스크탑 우선. 모바일(899px 이하)은 목차 드로어와 세로 스택만 보장. 경계 정본 = `src/lib/tokens.ts` `MOBILE_MAX`(@media 숫자는 npm test [7] 이 대조).
- 스크롤스파이: motion.ts 2.5 — 목차 `[data-scrollspy]`(현재 페이지) 안 `a[data-target]` 을 섹션 id 기준으로 강조(`--spy-line`).
- 상세 튜토리얼: `docs/file-management.md`. 핸드오프 안내: 사람용 `docs/HANDOFF.md` · AI 작업자용 `docs/handoff-ai.md`(불변식 · 작업 순서 · 검증 · 런타임 함정).

## 실행
`npm run dev` → http://localhost:4321  /  `npm run build` → `dist/`(md 경고가 있으면 오류로 멈춤. 끝에 이미지 사본 생성 — PNG → 무손실 `.png.webp` · JPG → AVIF q90 4:4:4 `.jpg.avif`, 원본 불변, `scripts/lib/optimize-images.mjs`, Figure 가 빌드에서만 `<picture>`. 개발 서버는 원본만이라 사본 결과는 `npm run preview` 로 확인)  /  `npm test` → scripts/test.mjs (경고 0 · 플레이스홀더 수 · 모션 대체값 · astro check, EN/KO 패리티는 리포트)
