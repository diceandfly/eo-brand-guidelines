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
| E3 | 2026-11-13 | Sub Symbol › Clearspace (본문 · 장표의 t 단위) | 2026-10-16 "스레드 두께 단위 T/t 폐기, 모든 수치는 H 기준" 결정과 어긋남 | 서브심볼은 아주 제한적으로만 쓰여 예외 규칙을 그대로 둠 |
| E4 | 2026-11-12 (11-13 가이드 최적 8-15mm 로 정리) | Symbol › Scalability ↔ 로고 생성기 RULES | 가이드 "최적 8-15mm" · 생성기 "최적 4-15mm" 가 다름 | 두 기준을 의도적으로 공존(docs/logo-generator/DEBT.md D20). 생성기 값 · 가이드 문장을 서로에 맞추지 말 것 |
| E5 | 2026-11-10 | Signature › 서비스 시그니처 캡션 "EO Studio" ↔ 장표 "Studio" 등 | 디스크립터 표기 불일치 | 디스크립터에 "EO" 를 넣을지는 인하우스가 결정 — 그때까지 차이 유지(md 주석) |
| E6 | 2026-11-10 | Typography › Reference Scale (8줄) ↔ 본문 "7레벨" | 목록은 T2 포함 8개 | T2 는 T1 의 가독성 우선 대안이라 레벨 수에 세지 않음. T1 과 한 지면에 같이 안 쓰여 Reference Scale · Inversion · Levelling 장표에는 T1 만(md 주석) |
| E7 | 2026-11-10 | Graphic Unit › Morphology | `rhythm-uniform-do` = `proportion-line-do`, `rhythm-excess-do` = `density-mass-do` 같은 그림 | "이상적인 형태" 라 같은 그림이 맞음 |
| E8 | 2026-11-10 | In Use 섹션 캡션 | "1. …" 번호, 한 장짜리(아이콘 · 파비콘)는 번호 없음 | 전 챕터 통일 규칙 |
| E9 | 2026-11-13 | 장표 속 제3자 상표(차량 · 앱 아이콘 · 협업 로고) · 더미 문구 | 실제 상표 · 더미 텍스트 노출 | 현 단계 허용(디자이너 "대체로 문제없음"). 외부 공개 전 확인은 디자이너 몫 |
| E10 | 2026-11-13 | 장표 전반 — 예: Graphic Unit › Shaft › 다양성(`shaft-diversity` 회색 3 + 네온 1 ↔ 본문 "고루") | 장표의 색 · 조합이 본문 규칙과 조금 다름 | 설명을 위해 일부 장표에 예외적 표현 · 조합을 썼을 수 있고, 다르면 본문 우선(Overview › Welcome 에 안내 문장). 장표를 고치지 말 것 |
| E11 | 2026-11-13 | Graphic Unit › Parameters (`param-thread-width`) ↔ `shape-do` | 노란 선 길이(컬럼의 40%)가 본문 "컬럼 폭에서 줄어드는 비율" 과 안 맞아 보임 | 왼쪽 장표는 파라미터가 어느 변인지 가리키는 그림이지 값을 정하는 그림이 아님, 오른쪽은 가능한 경우 하나 |
| E12 | 2026-11-13 | Graphic Unit › Don'ts (`unit-dont-4` Solid Gray 유닛) ↔ Graphic Pattern › Color `color-do-3` (Space Black on Neon) | 화면에서 둘 다 "Neon 위 어두운 유닛" 으로 보임 | 유닛 색이 분명히 다르고, 색에 대한 금지 · 허용을 보여 주는 장표라 문제없음 |
| E13 | 2026-11-13 | 슬로건 표기 — `alignment-do-2` · Graphic Pattern In Use 포스터 | "Build Anyway." 와 "Build anyway," 혼용 | 헤드카피냐 문장 속이냐는 형식 차이라 재량 허용 |
| E14 | 2026-11-13 | Typography › Reference Scale 자간 값의 `[Solid Gray]` · `[Space Black]` | 대괄호 문법이라 이름 없이 색 칩만 보임 | 가독성을 위해 의도적으로 칩만 둠 |
| E15 | 2026-11-13 | Graphic Unit › Pair › 파동(`pair-pulse`) | 본문 "중심대칭 또는 좌우대칭" ↔ 장표는 좌우대칭 하나 | 장표는 경우 하나를 보여 줌. 본문 유지 |
| E16 | 2026-11-13 (11-15 장표 채움 · 섹션 재구성) | Applications 페이지의 남은 장표 1장(Digital › 웹 툴) | 장표가 없어 플레이스홀더만 보임 | 장표 준비 중. Principles(= Colors › In Use 4번째) · 빌보드(= Graphic Pattern › In Use 2번째) · 거리 배너(= Colors › In Use 3번째)는 디자이너 지정으로 같은 이미지를 다시 씀. 2026-11-15 Advertisement 섹션을 Print 에 합침. 본문은 2026-11-14 디자이너 요청으로 구성은 그대로 두고 현재 규칙(Graphic Pattern › Color · Typography › Margin · 용어)에 맞춰 보완함. 장표가 들어오면 그때 본문과 대조 |
| E17 | 2026-11-13 | 참조 링크 "유닛 컬러" — Graphic Unit › Shaft › 다양성 → Graphic Pattern › Color, Graphic Pattern › Color → Graphic Unit › Color | 같은 라벨이 서로 반대 페이지로 감 | 문맥마다 가리키는 내용이 다름(다양성 = 여러 색을 쓰는 조합 규칙, Pattern › Color = 색의 뜻). 그대로 둠 |
| E18 | 2026-11-14 | Symbol › Don'ts 1번째(`dont-1` 가로 약 10%) · Signature › Don'ts 9번째(`dont-9` 세로 약 6%) | "늘리지 마세요" 인데 왜곡이 약해 잘 안 보임 | 실제로 흔히 일어날 법한 실수의 크기라 이 정도가 맞음 |
| E19 | 2026-11-14 | Symbol › Usage › Placement (`usage-placement` A3 칸) | 밝은 심볼 · 흐린 심볼이 한 칸에 둘, 범례 없음 | 디자이너가 그대로 두기로 함(의도된 표현) |
| E20 | 2026-11-14 | Symbol › Geometry · Lockup 가로형 · Signature › Partner Lockup 가로형 장표 | 본문에 없는 값(1 unit = H/30 · W = (29/30)H · 5° · 콜라보 기호 (2/3)W)이 장표에만 있음 | 도면 정보라 장표에만 둠. 본문에 옮기지 말 것 |
| E21 | 2026-11-14 | Signature › Inversion 세로형(`inversion-v` "Align center") ↔ Descriptor 세로형(`descriptor-v` H/100 왼쪽 보정) | 다크에서 H/100 보정이 빠진 것처럼 보임 | 라이트에서 한 번 보정한 위치를 기준으로 하므로 문제없음 |
| E22 | 2026-11-14 | Typography › Character Set Mono (`charset-mono` Small figures 행) | 분수 글리프가 두 줄로 깨진 것처럼 보임 | 공간 활용을 위한 원래 글리프 디자인 |
| E23 | 2026-11-14 | Colors › Don'ts 6장 좌하단 "Typography Checklist" | 컬러 장표에 타이포 라벨 | 이 섹션 공통 샘플 목업이라 문구 내용은 중요하지 않음 |
| E24 | 2026-11-14 | Colors › In Use 3번째 (`color-in-use-3` "08:00 - 11:00 PM") | 시작 시각에 AM/PM 없음 | 앞 시각은 뒤 표기로 유추하는 흔한 표기 |
| E25 | 2026-11-14 | Graphic Unit › Parameters (`param-thread-compression` "compression -1 / -2") | + 방향 예시가 없음 | 한 장표에서 둘 다 보이려고 반전하면 직관성이 떨어지고, 파라미터당 장표 2장은 양식 불일치라 타협. − 부호로 유추 |
| E26 | 2026-11-14 | Graphic Unit › Color (`color-gray` · `color-blue-green` SVG) | 캡션에 없는 Builder Neon 유닛이 섞여 있음 | 그 캔버스 안에서 그레이(블루 · 그린)의 역할을 보여 주는 그림이라 상관없음 |
| E27 | 2026-11-14 | Graphic Unit › Morphology › Proportion | 4장만 Air White 유닛 | 분위기 환기, 그리고 컬러보다 형태에 집중시키려는 의도 |
| E28 | 2026-11-14 | Graphic Unit › Pair (`pair-peers` · `pair-rivals` 라벨 Peer · Rival) | 캡션은 복수(Peers · Rivals), 장표 라벨은 단수 | 라벨이 두 유닛 중 하나에 붙어 있어 단수가 맞음 |
| E29 | 2026-11-14 | Graphic Pattern › Color (`color-do-1` · `color-do-3` 등) | 캡션의 색 나열 순서 ↔ 장표의 색 순서 | 비주얼상 좋아서 장표 순서는 섞음. 캡션도 그대로 |

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
