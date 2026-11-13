# 기술부채 정리 플랜 (2026-11-13)

핸드오프 뒤로 미뤘던 기술 항목을 한 단계씩 정리한다. 실행은 메인 세션, 단계마다 서브 세션이 크로스체크.
출처: `research/tech-debt-2026-11-10.md`(가이드, 29건 중 남은 것) · `docs/logo-generator/DEBT.md`(생성기, 처리 완료).

## 진행 규칙
- 한 단계 = 커밋 하나(필요하면 둘). 커밋 메시지 머리에 `[TD-n]`.
- 단계마다 **전후 dist 비교**: 바꾸기 전 `npm run build` → `dist` 를 `research/td-baseline/` 로 복사, 바꾼 뒤 다시 빌드해 HTML 차이를 본다. "출력은 그대로"가 목표인 단계(TD-1 · 2 · 3)는 차이 0 이어야 함(스크립트 위치만 다른 경우는 그 줄만).
- `npm test` 전부 통과 + 브라우저 확인(데스크탑 · 모바일 375px)은 매 단계 기본.
- 사용자가 커밋 안 한 편집(guide.*.md · 이미지 · tokens.css)은 건드리지 않음. 같은 파일을 고쳐야 하면 HEAD 기준으로 내 변경만 커밋.
- 크로스체크 요청 형식: 커밋 해시 + 이 문서의 해당 단계 "크로스체크" 목록. 서브 세션은 코드 수정 없이 보고만.
- 구조가 바뀌는 단계(2 · 3 · 4 · 6)는 문서 갱신(CLAUDE.md · docs/file-management.md · tokens.css 머리말)이 완료 기준에 포함.
- 기준선 재생성: `research/td-baseline/` 은 gitignore 라 지워질 수 있음 → `git worktree add /tmp/td-start td-start` 에서 사용자 미커밋 편집을 덮어 빌드하거나, 각 단계 직전 커밋으로 `git stash` 없이 새 기준선을 만든다(단계별 비교는 직전 단계 dist 가 기준).

---

## TD-0 기준선 (작업 전)
- `git tag td-start` · `npm run build` 후 `research/td-baseline/` 에 dist 사본.
- 페이지별 스크린샷(데스크탑 1440 · 모바일 375, 국문 12쪽) — 시각 비교용.
- 크로스체크: 없음.

## TD-1 드로어 ↔ 모션 전역 결합 해소 — 작음, 위험 낮음
지금: 전역 `window.__smoother`(motion.ts 가 넣고 Layout.astro 드로어가 꺼내 `paused()`), `window.__scrollGuardOff`(인라인 스크롤 가드가 넣고 motion.ts 가 호출).
바꿈: 전역 대신 문서 이벤트 두 개.
- `eo:nav` (detail `{ open }`) — 드로어가 보내고 motion.ts 가 받아 스무더 정지/재개.
- `eo:scroll-ready` — motion.ts 가 시작 단계를 마치면 보내고, 인라인 가드가 받아 해제(3초 자동 해제는 유지).
- motion.ts 안에서 스무더를 다시 만들 때(`__smoother = null` → 재생성) 드로어 상태를 기억해 새 스무더에도 적용.
파일: `src/layouts/Layout.astro`, `src/lib/motion.ts`.
완료 기준: `grep -rn "window.__" src` 0건 · 모바일에서 드로어 열면 본문 안 굴러감 · 닫으면 다시 굴러감 · 데스크탑 첫 로드 가드가 3초 전에 풀림 · dist HTML 은 인라인 스크립트 줄만 다름.
크로스체크: 이벤트 이름 오타 · 리스너 해제 누락 · 스무더 재생성 경로(창 폭 변경으로 모바일 ↔ 데스크탑)에서 정지 상태가 새 스무더에 넘어가는지 · 드로어가 열린 채 창을 넓히면 풀리는지.

## TD-2 모바일 경계 899/900 한 곳으로 — 작음, 위험 낮음
지금: base.css `@media` 3곳 + motion.ts `mobileMQ` + Layout.astro 드로어, 주석으로만 연결(@media 에는 CSS 변수를 쓸 수 없음).
바꿈: `src/lib/tokens.ts` 에 `MOBILE_MAX = 899` 하나 → motion.ts · Layout.astro 는 이 값으로 미디어 쿼리 문자열을 만듦. base.css · 생성기 tool.css 는 숫자 그대로 두되 `npm test` 에 "@media 경계가 MOBILE_MAX(899/900)와 같은지" 검사 추가.
완료 기준: 경계를 한 곳에서 바꾸면 테스트가 나머지를 잡음 · dist 차이는 번들 위치뿐(Layout.astro 인라인 모듈이 tokens.ts 를 import 하며 외부 파일로 빠지면 "스크립트 위치만" 으로 완화) · 문서(CLAUDE.md · tokens.css 머리말 · base.css 주석 · file-management.md · 생성기 tokens.css/tool.css 주석) 갱신.
크로스체크: 899(max) / 900(min) 쪽이 뒤바뀐 곳 없는지 · 테스트가 실제로 어긋남을 잡는지(일부러 바꿔 보고 되돌림).

## TD-3 파서가 만드는 UI 마크업 한 곳으로 — 중간, 위험 중간
지금: Copy 알약 HTML 이 `guide.ts`(컬러 칩) · `SwatchVal.astro` 두 벌, 참조 알약도 같은 부품을 guide.ts 안에서 따로 조립, 검색 색인용 `stripTags` 가 그 마크업을 정규식으로 다시 벗김(마크업을 바꾸면 세 곳).
바꿈:
- `src/lib/ui-markup.ts`(순수 함수) — `tipHtml(kind)` · `copyButtonHtml(...)` 등. guide.ts 와 SwatchVal.astro(`set:html`)가 같은 함수를 씀.
- 알약 span 에 `data-noindex` 를 달고 stripTags 는 그 표시만 지움(마크업 모양에 덜 의존).
파일: `src/lib/guide.ts`, `src/components/SwatchVal.astro`, 새 `src/lib/ui-markup.ts`.
완료 기준: dist HTML 차이 = `data-noindex` 속성 추가분만 · 검색 색인(`/<lang>/search-index.json`) 차이 0 · 칩 · 값 · 참조 알약 호버/복사 동작 그대로.
크로스체크: 색인 차이 0 확인 · 영문/국문 aria-label 그대로 · 알약 글자가 드래그 복사에 섞이지 않는지(글자는 CSS content 유지) · Layout.astro 복사 스크립트 선택자([data-copy] · is-copied)가 공유 함수 출력과 맞는지 · SwatchVal 이 set:html 로 바뀌며 이스케이프가 달라지지 않는지. CLAUDE.md 구조 목록에 ui-markup.ts 추가.

## TD-4 검사 체계 — 범용 lint 대신 프로젝트 규칙 검사 — 작음
의견: ESLint · Prettier 는 들이지 않음. 1인 유지보수 · 핸드오프 저장소에서 전체 재포맷은 이력만 흐리고, 이 프로젝트에서 실제로 깨지는 건 "토큰 규칙" 쪽.
바꿈: `npm test` 에 [7] 규칙 검사 추가
- base.css: raw HEX 0(지금도 0) · 정의 안 된 `var(--…)` 참조 0 · `!important` 0(지금 0)
- 가이드 tokens.css: 아무 데서도 안 쓰는 토큰 리포트(모션 토큰은 motion.ts 이름 참조 포함)
- `window.__` 0(TD-1 고정) · 경계 899/900(TD-2)
문서 · 잔재 정리(2026-11-13 재검증에서 편입): `scripts/typo-chart.mjs` 사용법을 docs/file-management.md 에 한 줄(내부 장표 도구) · CLAUDE.md 의 "스크롤스파이는 후속 라운드" 문장 갱신(motion.ts 2.5 에 이미 구현) · 안 쓰는 `Section.astro` `data-section` 속성 정리 · 튜토리얼 `[[symbol#color]]` 예시가 실제 해석 규칙과 맞는지 확인.
CI: 로컬 전용이라 지금은 안 둠. 클라이언트가 GitHub Actions 를 쓰면 핸드오프 때 `npm ci && npm test` 한 줄 워크플로 추가(폰트 없는 환경에서도 test 는 통과하도록 이미 리포트 처리됨).
완료 기준: 새 검사가 현재 상태에서 통과 · 일부러 어긴 경우 실패.
크로스체크: 검사가 오탐 없이 현재 통과하는지 · 일부러 어긴 3가지(raw HEX · 없는 토큰 · window.__)를 잡는지.

## TD-5 첫 로드 스크롤 가드 — 싼 안 먼저(A), 안 되면 SPA(B) 결정
지금: ScrollSmoother 가 준비되기 전 휠이 튀는 걸 막으려고 첫 로드에 `scroll-hold` 로 잠깐 잠금(`--scroll-guard-hold`).
- **A(먼저)**: 스무더를 smooth 0 으로 즉시 만들고 시작 단계 뒤 목표값으로 올림. 가드가 막는 두 가지 중 (a) 스무더 시작 단계(0.5초) 점프만 줄이고 (b) 모듈 로드 전 네이티브 스크롤은 남으므로 목표는 "가드 = 모듈 로드까지". 측정 기준 2026-11-13 잠금 531ms(25 → 556ms). motion.ts 안에서 끝남. 작음. [3] 모션 대체값 테스트(--scroll-guard-hold) 갱신 포함.
- **B(A 로 부족할 때만)**: Astro 클라이언트 라우터로 페이지 전환 때 스무더를 세션 내내 유지. 크다 — 스크롤스파이 · 라이트박스 · 검색 · 목차 상태 · 인라인 스크립트 재실행 · 아카이브 이스터에그까지 전부 다시 확인. 별도 브랜치(워크트리)에서 시도하고 회귀가 하나라도 남으면 버림.
완료 기준(A): 트랙패드 관성 스크롤 중 페이지 이동해도 튐 없음 · 가드 시간 측정값 감소 · 앵커 도착(#섹션) 위치 그대로.
B 착수 조건: A 뒤에도 잠금 > 300ms 이거나 사용자가 튐을 재현할 때만. 아니면 B 는 시도하지 않음(핸드오프 직전 회귀 면적이 가장 큼).
크로스체크: 앵커 직행 · 뒤로 가기(bfcache) · 백그라운드 탭(Cmd+클릭) · 모바일(스무더 없음) 경로.

## TD-6 이미지 용량 — 시각 기준 우선 (2026-11-13 사용자 추가)
먼저 목표를 정함: 배포 없는 로컬 가이드라 "핸드오프 dist 묶음 크기 · 클라이언트 PC 로컬 로딩 · 추후 배포 대비" 중 무엇을 위한 것인지, 현재 dist 이미지 합계 · 페이지당 최대 숫자와 함께 결과표 단계에서 사용자에게 확인.
원칙: 원본 장표(`public/assets`)는 건드리지 않음. 빌드 때 dist 에만 가벼운 사본을 만들고, 화질은 "눈으로 구분 안 됨"이 기준(용량은 그다음).
- PNG(그래픽 장표): 무손실 WebP — 픽셀 동일, 화질 손실 0. 무손실이 원본보다 크면 원본 유지.
- JPG(사진 · 목업): 고화질 WebP/AVIF(품질 90 안팎) — 원본 대비 지각 차이 지표(SSIM 등)가 기준을 넘는 파일은 원본 유지. 결과표(파일별 용량 · 지표)를 먼저 보고 확정.
- 크기: 원본 해상도 유지(1920 × 1080 은 카드 최대 표시 폭 × 2 배율과 비슷). 2560 · 5000px 대 몇 장만 표시 최대 크기에 맞춘 사본 추가 여부를 결과표에서 결정.
- `<picture>`(WebP + 원본 폴백)로 넣어 지원 안 되는 환경은 원본. imageTone(가장자리 밝기) · 라이트박스 · 거울 확장이 같은 파일을 쓰는지 확인.
- public/ 은 Astro 가 복사만 하므로 변환은 별도 빌드 단계(scripts/*.mjs, sharp 기존 의존성) — 빌드 시간 · 캐시 · `.trash` 규칙 · `npm run assets` 와의 관계를 문서화.
- 화질 최종 기준은 지표(SSIM 등)보다 사용자 눈 비교(TD-0 스크린샷).
- 진행 전 결과표로 사용자 컨펌(장표 관련은 사전 컨펌 규칙).
완료 기준: 무손실 PNG 는 원본과 픽셀 차이 0 · 페이지 시각 비교(TD-0 스크린샷)에서 차이 없음 · 이미지 합계 용량 표.
크로스체크: 무손실 사본 픽셀 대조 · 폴백 경로 · 라이트박스/거울 확장/호버 테두리 동작.

## TD-7 접근성 소묶음 — 작음 (2026-11-13 재검증에서 편입)
- 마크업만: Sidebar.astro 챕터 토글 `<a role="button" aria-current="true">` · 언어 표시 `aria-current="true"` 를 의미에 맞게(토글은 aria-expanded, 현재 언어는 aria-current="page" 또는 표시만).
- 화면이 달라지는 것은 사용자 결정 후: 검색 입력 · 컬러 값 버튼의 `:focus-visible` 표시(지금 outline: none, 키보드 포커스에만 보임), 라이트박스 닫기 버튼(지금 Esc · 클릭만).
완료 기준: dist 차이 = 해당 aria 속성뿐 · 키보드로 목차 · 검색 · 라이트박스 순회.
크로스체크: 낭독기 의미(aria) · 키보드 순회.

## 하지 않음 (이유)
- 스크롤스파이 매 프레임 읽기: 체감 문제 없음.
- research/tech-debt-2026-11-10.md 33건 재검증(2026-11-13 서브 세션): 23건 처리됨, 남은 6건 중 20 · 33a · 32a → TD-4, 31a → TD-7, 26b(pretendard 다운로드 체크섬)는 위험 낮아 안 함, 30a(assets 워크) 체감 없어 안 함.

## 순서
TD-0 → TD-1 → TD-2 → TD-3 → TD-4 → TD-7 → TD-5A → (B 여부 결정) → TD-6 (결과표 컨펌 후 적용)
