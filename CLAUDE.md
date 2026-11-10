# EO Brand Guidelines (web)

EO 리브랜딩의 웹용 브랜드 가이드라인. Astro 정적 사이트, 로컬 개발 전용(배포 없음).

## 구조와 역할 분리
- `content/guide.en.md` / `content/guide.ko.md` — 모든 글·이미지 배치. 언어별 한 파일, 문법 동일(상단 주석). 두 언어가 함께 빌드되어 `/en/…`, `/ko/…` 로 나뉘고 목차 하단 EN | KR 로 전환. 콘텐츠 변경은 이 파일만 수정.
- `public/assets/<NN-chapter>/<NN-subchapter>/<NN>-<name>.*` — 이미지. `![name]` 토큰과 1:1(페이지 폴더 안에서 이름으로 찾음, 파일명 앞 NN = 주제 순서, 정렬용이라 파서는 무시). 주제 = 목차 라벨. 없으면 넣을 경로가 적힌 플레이스홀더. `npm run assets`(scripts/assets.mjs)가 국문 구조 기준으로 폴더 생성·번호 맞춤·빈 폴더 정리.
- `src/styles/tokens.css` — 모든 디자인 수치(레이아웃·타이포·컬러·비율·모션). 디자인 튜닝은 이 파일만 수정. 구성: A 시스템(타입 · 컬러 · 공통 치수 · 공통 모션은 종류별) + B 요소(페이지 셸 → 목차 → 그리드 · 섹션 → 다음 버튼 → 칩 · 알약 → 이미지 · 카드 → 컬러 카드 → 라이트박스 → 페이지 전환 · 스크롤, 요소 안은 치수 → 비율 → 색 → 모션). 새 토큰은 사이트 전체에 같은 뜻으로 쓰이면 A, 아니면 그 요소 블록에.
- `src/styles/base.css` — 토큰을 참조하는 레이아웃 CSS. 숫자를 직접 쓰지 말고 토큰을 추가해 참조할 것.
- `src/lib/guide.ts` — guide.<lang>.md 파서(순수 Node, Vite 의존 없음). 문법을 바꾸면 guide.<lang>.md 상단 튜토리얼도 같이 갱신. `src/lib/content.ts` 가 md·tokens.css 를 Vite 모듈로 읽어 넘기고 빌드 동안 메모(페이지는 content.ts 의 `loadGuide`/`loadAllGuides`/`TOKENS` 를 씀). `src/lib/tokens.ts` 는 tokens.css 를 코드에서 읽는 파서(컬러 HEX, Do/Don't 배율, 면 색)와 시간 토큰 해석 · 휘도 공식(브라우저 스크립트 · scripts 도 이것만 씀). `scripts/*.mjs` 는 빌드 없이 guide.ts 를 직접 호출(`scripts/lib/manifest.mjs` — 번호 떼기 · 경로 변환도 여기서 가져감). assets · import 가 지우거나 덮어쓸 파일은 `.trash/` 로 옮김.
- `src/components/` — Section(텍스트+미디어 슬롯), Figure(이미지/플레이스홀더/배지/캡션), Swatch · SwatchVal(컬러 카드 · 복사 값), Sidebar, Search, Logo.
- `src/lib/imageTone.ts` — 빌드 때 이미지 가장자리 밝기를 재서(sharp) 카드 호버 테두리를 밝은 회색/어두운 회색 중 어느 쪽으로 할지 정함(`data-tone`). 색·두께·시간은 tokens.css `--img-border-hover*` / `--img-border-w-hover*` / `--img-border-hover-dur`.
- `src/lib/motion.ts` — GSAP 모션(스무스 스크롤 ScrollSmoother, 앵커 이동, 이미지 라이트박스). 수치는 tokens.css B-9(페이지 전환 · 스크롤) · B-8(라이트박스) · B-2(목차 슬라이드) 의 모션 토큰에서 읽음. 고정 요소(목차·상단 바·라이트박스)는 `#smooth-wrapper` 밖에 둘 것.

## 용어 (대화에서 이 이름으로 통일)
챕터(`# 02 Logo`) > 페이지(`## Logo`, 화면 하나 = URL 하나; `{toc=none}` 을 붙이면 목차에 섹션 목록을 펼치지 않음) > 섹션(`### Head`, 선택적 `#### Subhead`). `### ++ Head` 는 목차에 올릴 섹션 표시 — 한 페이지에 `+` 가 하나라도 있으면 표시된 것만, 없으면 전부 자동.
레이아웃: `text`(이미지 없음) / `basic`(텍스트 5컬럼 + 이미지 6컬럼, `--sec-text-cols` / `--sec-media-cols`) / `wide`(12컬럼, 여러 장이면 세로로 쌓임) / `half`(6컬럼) / `grid-2|3|4` / `text-2|3|4`(본문 문단을 N단으로, 모바일은 한 단). 섹션 여러 개를 한 12컬럼 행에 놓으려면 `::: split` … `:::` 로 감싸고 섹션마다 `{span=N}`(생략 시 균등 분배; `sectionBlocks`, `.sec-split`).
아이템: 이미지, 카드(이미지+캡션), 스와치. 배지 `{do}` `{dont}` `{con}`(conditional, 흰 삼각형).

## 타이포 규칙
5레벨 고정: display / heading / body / ui / label. 행간이 기준 단위(`--lh-unit`). 레벨마다 m(행간 배수)·p(행간÷폰트)·ls·w 토큰만 가지며 폰트 사이즈는 계산값. 레벨을 늘리지 말 것.
검색 · 스와치 · 로고 폴백의 파생 배율은 허용(새 레벨 아님): 검색 결과 ui × `--search-result-scale`, 컬러 카드 패널 body × `--swatch-panel-scale`(밝은 면 × `--swatch-panel-fg-light-scale`), 로고 폴백 글자 `--nav-logo-h`.
서체는 Founders Grotesk(본문 포함)와 Founders Grotesk Mono(label)만 사용. woff2는 `public/fonts/`(git 제외).

## 컬러 규칙
브랜드 팔레트 7색(`--c-*`)은 `EO color palette final.svg` 기준이며 임의로 바꾸지 않는다. UI는 시맨틱 토큰(`--bg`, `--fg`, `--accent` …)만 참조. 중간 톤은 새 HEX 대신 `color-mix()`. 배지 색(`--badge-do`, `--badge-dont`, `--badge-con`)은 UI 전용이며 브랜드 컬러가 아님(`--c-` 접두는 팔레트 7색만).
본문·캡션의 참조 링크는 `[[page#section|라벨]]`(guide.ts `resolveXrefs`, 라벨은 목차에서 "페이지 › 섹션" 자동, `[[→ page#section]]` 이면 화살표 포함, `[[https://…|라벨]]` 은 외부 링크 새 탭).
본문·캡션에 영문 공식 명칭(Builder Neon 등 7색)을 쓰면 파서(`colorChips`)가 이름 앞에 색 칩을 붙인다. 이름 표기는 대소문자까지 고정. 본문은 섹션 안 첫 언급에만 칩(캡션은 매번), `[Builder Neon]` 은 칩만, `[+Builder Neon]` 은 칩+이름 강제. 칩은 복사 버튼(호버 Copy 알약, 클릭 시 HEX 복사, 스크립트는 Layout.astro).

## 작업 방식
- 사용자는 한국어, 두괄식 소통을 선호하며 미확정 사항은 착수 전에 토론한다.
- 데스크탑 우선. 모바일(899px 이하)은 목차 드로어와 세로 스택만 보장.
- 스크롤스파이는 후속 라운드. `Sidebar.astro`의 `data-scrollspy` / `data-target`, `Section.astro`의 `data-section`이 그 자리.
- 상세 튜토리얼: `docs/file-management.md`.

## 실행
`npm run dev` → http://localhost:4321  /  `npm run build` → `dist/`(md 경고가 있으면 오류로 멈춤)  /  `npm test` → scripts/test.mjs (경고 0 · 플레이스홀더 수 · 모션 대체값 · astro check, EN/KO 패리티는 리포트)
