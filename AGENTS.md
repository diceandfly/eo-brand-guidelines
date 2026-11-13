# 먼저 읽을 것 — AI 작업자 공통 노티스

> **Read this first.** Any AI agent (Claude Code, Codex, Cursor, Copilot …) must read this file before analyzing or changing this repository. Section 1 lists issues that *look* like errors but were deliberately allowed by the designer — do not report them as bugs and do not "fix" them. The rest of the file is in Korean.

이 저장소는 EO 브랜드 가이드라인(Astro 정적 사이트)입니다. 코드 · 콘텐츠를 분석하거나 고치기 전에 이 문서를 먼저 읽으세요. 규칙 · 용어 · 구조의 정본은 [CLAUDE.md](CLAUDE.md), 작업 순서 · 검증은 [docs/handoff-ai.md](docs/handoff-ai.md) 입니다.

---

## 1. 디자이너 예외 결정 — 오류로 보고하지 말 것

전수검사(2026-11-13, `docs/content-check-plan.md`) 등에서 문제로 제기됐으나 **디자이너가 판단해 허용한 것**입니다. 겉보기엔 규칙 위반 · 불일치지만 의도입니다. 다시 발견해도 보고 · 수정하지 마세요. 새 예외는 디자이너 승인을 받은 뒤에만 이 표에 추가합니다(날짜 · 위치 · 겉보기 문제 · 허용 이유).

| # | 결정일 | 위치 | 겉보기 문제 | 허용 이유 |
|---|---|---|---|---|
| E1 | 2026-11-10 (11-13 근거 추가) | Graphic Pattern › Zoning (`grid-do-1` 롤업) · Typography › Zoning (`zoning-ratio` 롤업 · `zoning-4-division` 좌측 열) | "세로로 나눌 때 패턴 상단 · 가로로 나눌 때 우측 우선" 규칙과 반대로 패턴이 하단 · 좌측 | 규칙은 "우선"(권장)이라 예외 가능. 롤업 · 거리 배너처럼 바닥에 세우는 매체는 빌더 · 집이 땅에 선 형상이고, compression 이 촘촘한 쪽이 땅을 연상시켜 하단 배치가 어울림. 4분할은 Typography › Zoning 이 "번갈아 두기" 를 허용 |
| E2 | 2026-11-13 | Graphic Unit › Formation › 규모 (`formation-scale`) | "Peer" 칸 두 유닛의 방향이 본문(같은 방향 나란히)과 달라 보임 | 메타포 장표는 연상에 어느 정도 자유도가 있다는 것을 상정한 그림 |
| E3 | 2026-11-13 | Sub Symbol › Clearspace (본문 · 장표의 t 단위) | 2026-10-16 "스레드 두께 단위 T/t 폐기, 모든 수치는 H 기준" 결정과 어긋남 | 서브 심볼은 아주 제한적으로만 쓰여 예외 규칙을 그대로 둠 |
| E4 | 2026-11-12 | Symbol › Scalability ↔ 로고 생성기 RULES | 가이드 "최적 8-20mm" · 생성기 "최적 4-15mm" 가 다름, 가이드 안에서 최적 상한(20) > 권장 최대(15) | 두 기준을 의도적으로 공존(docs/logo-generator/DEBT.md D20). 생성기 값 · 가이드 문장을 서로에 맞추지 말 것 |
| E5 | 2026-11-10 | Signature › 서비스 시그니처 캡션 "EO Studio" ↔ 장표 "Studio" 등 | 디스크립터 표기 불일치 | 디스크립터에 "EO" 를 넣을지는 인하우스가 결정 — 그때까지 차이 유지(md 주석) |
| E6 | 2026-11-10 | Typography › Reference Scale (8줄) ↔ 본문 "7레벨" | 목록은 T2 포함 8개 | T2 는 T1 의 가독성 우선 대안이라 레벨 수에 세지 않음. T1 과 한 지면에 같이 안 쓰여 Reference Scale · Inversion · Levelling 장표에는 T1 만(md 주석) |
| E7 | 2026-11-10 | Graphic Unit › Morphology | `rhythm-uniform-do` = `proportion-line-do`, `rhythm-excess-do` = `density-mass-do` 같은 그림 | "이상적인 형태" 라 같은 그림이 맞음 |
| E8 | 2026-11-10 | In Use 섹션 캡션 | "1. …" 번호, 한 장짜리(아이콘 · 파비콘)는 번호 없음 | 전 챕터 통일 규칙 |
| E9 | 2026-11-13 | 장표 속 제3자 상표(차량 · 앱 아이콘 · 협업 로고) · 더미 문구 | 실제 상표 · 더미 텍스트 노출 | 현 단계 허용(디자이너 "대체로 문제없음"). 외부 공개 전 확인은 디자이너 몫 |

결정 대기 중인 항목은 `research/content-check/findings.csv`(로컬 전용, git 제외)에 있습니다 — 여기 오르기 전까지는 예외가 아닙니다.

## 2. 절대 규칙 (어기면 되돌려야 하는 것)

- **서체 파일 · `dist/` 커밋 · 푸시 금지.** Founders Grotesk 는 유료 라이선스. `.gitignore` 와 `.githooks` pre-commit/pre-push 가 막지만, 우회하지 말 것. 공개물에는 아웃라인 이미지만.
- **국문(`content/guide.ko.md`)이 최종본.** 국문 문장을 다듬지 말 것. 숫자 · 고유명사 · 오타처럼 명백한 것만 제안하고 디자이너가 정함. 영문은 국문에 맞춰 고침(2026-11-10 1:1 동기화 이후 국문을 고치면 영문도 같이).
- **장표(이미지)는 디자이너가 사전 컨펌한 것만 교체 · 수정.** 직접 그리거나 재생성하지 말 것. "교체" = 디자이너가 폴더에 둔 파일을 `npm run import` 로 들여오는 것.
- **브랜드 팔레트 7색(`--c-*`) 고정.** `EO color palette final.svg` 기준. 중간 톤은 `color-mix()`.
- **로고 생성기 `public/tools/logo-generator/geom.js` 는 확정본** — 손대지 않음(회귀 검사 `npm test` [5]).
- **`public/archive/handoff/` 는 손으로 고치지 않음** — `npm run archive` 생성물.
- **푸시는 디자이너가 요청할 때만.** 커밋은 작업 단위로 바로 해도 됨.
- 디자인 수치는 `src/styles/tokens.css` 에만, `base.css` 는 토큰 참조만(`npm test` [7] 이 검사). 행간 비율 토큰은 숫자(1.4), % 금지(아이폰 웹킷에서 깨짐).

## 3. 표기 · 문체 (국문)

- 나열은 ` · `, 영어 단어 + 조사는 붙여 씀(thread가), symbol 은 "심볼"(심벌 아님).
- 용어는 [docs/terms.md](docs/terms.md). 팔레트 이름은 대소문자까지 고정(Builder Neon …).
- md 안 `!~ … ~!` 는 디자이너 메모 — 발견하면 가이드 문장으로 정리하고 표시를 지움.
- 장표를 가리킬 때는 토큰 이름보다 "섹션 › N번째".

## 4. 이스터에그 — `designisgood`

가이드 검색창에 `designisgood` 을 입력하면 **최종 핸드오프 시점에 고정한 가이드**(`/archive/handoff/…`)의 같은 페이지로 이동하고, 거기서 다시 입력하면 현재 가이드로 돌아옵니다. 아카이빙 기념이자 공식 디자이너 커뮤니케이션용이며 클라이언트도 동의했습니다.
- 구현: `src/lib/archive.ts`, `src/components/Search.astro`. 아카이브 쪽 목차 아래에 네온 표시(빌드 환경 변수 `EO_ARCHIVE`).
- 아카이브는 최종 핸드오프 날 `git tag handoff-final` → `npm run archive` → 커밋으로 한 번 만듭니다. 그 전에는 이스터에그가 아무 일도 하지 않습니다(정상). 로고 생성기는 아카이브하지 않음(항상 현재 버전).
- 이 기능을 "숨은 라우트 · 불필요한 코드" 로 보고 지우지 마세요.

## 5. 더 읽을 곳

- [CLAUDE.md](CLAUDE.md) — 구조 · 용어 · 타이포 · 컬러 규칙(정본)
- [docs/handoff-ai.md](docs/handoff-ai.md) — 불변식 · 작업 순서 · 검증 · 런타임 함정
- [docs/HANDOFF.md](docs/HANDOFF.md) — 사람용 요약
- [docs/file-management.md](docs/file-management.md) — 콘텐츠 · 이미지 · 아카이브 튜토리얼
- [docs/logo-generator/](docs/logo-generator/) — 생성기 사양(SPEC) · 부채(DEBT)
