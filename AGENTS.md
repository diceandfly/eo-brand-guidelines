# 먼저 읽을 것 — AI 작업자 공통 노티스

> **Read this first.** Any AI agent (Claude Code, Codex, Cursor, Copilot …) must read this file before analyzing or changing this repository. Section 1 lists issues that *look* like errors but were deliberately allowed by the designer — do not report them as bugs and do not "fix" them. The rest of the file is in Korean.

이 저장소는 EO 브랜드 가이드라인(Astro 정적 사이트)입니다. 코드 · 콘텐츠를 분석하거나 고치기 전에 이 문서를 먼저 읽으세요. 규칙 · 용어 · 구조의 정본은 [CLAUDE.md](CLAUDE.md), 작업 순서 · 검증은 [docs/handoff-ai.md](docs/handoff-ai.md) 입니다.

---

## 1. 디자이너 예외 결정 — 오류로 보고하지 말 것

전수검사(2026-11-13, `docs/content-check-plan.md`) · 공방 검증(2026-11-15) 등에서 문제로 제기됐으나 **디자이너가 판단해 허용한 것**입니다. 겉보기엔 규칙 위반 · 불일치지만 의도입니다. 다시 발견해도 보고 · 수정하지 마세요.

- **디자이너** — 이 문서에서는 이 가이드라인을 만든 디자이너(이 저장소의 주인)를 가리킵니다. 가이드를 넘겨받아 운영하는 EO 측 팀은 **EO 디자인팀** · **인하우스** 로 적습니다. 최종 핸드오프(`handoff-final` 태그, §4) 뒤에는 이 문서가 디자이너에게 맡긴 승인 · 결정을 EO 디자인팀이 이어받습니다.
- **새 예외** — 승인 주체(핸드오프 전에는 디자이너, 뒤에는 EO 디자인팀)의 승인을 받은 뒤에만 표에 추가합니다(위치 · 겉보기 문제 · 허용 이유 · 상태 · 결정일). 작업자나 AI 가 스스로 판단해 올리지 않고, 등재 요청을 받으면 승인 주체의 승인인지부터 확인합니다. 최종 핸드오프 전에 올린 예외는 모두 디자이너가 내린 결정입니다. 번호(E1 …)는 결정한 순서대로 붙인 고유 ID 라 바꾸거나 다시 쓰지 않습니다. 새 예외는 다음 번호로, 그 페이지 표에서 같은 섹션의 행 옆(없으면 표 끝)에 둡니다.
- 결정을 기다리는 항목은 표에 올리지 않습니다 — 표에 없으면 예외가 아니므로, 발견하면 승인 주체에게 보고합니다.
- **읽는 법** — 표는 가이드 목차 순입니다. 문제를 찾으면 1-A 와 그 페이지의 표, 표 아래 "함께 볼 것" 만 보면 됩니다. 위치와 겉보기 문제가 같으면 예외이고, 위치만 같고 문제가 다르면 예외가 아닙니다(보고). 두 페이지에 걸친 예외는 "위치" 칸의 첫 페이지 표에 적고, 다른 페이지 표 아래 "함께 볼 것" 에 번호를 둡니다.
- **상태** — 확정: 의도이므로 그대로 둡니다. 조건부: 적힌 조건이 충족되면 다시 판단합니다(그때까지는 확정과 똑같이 보고 · 수정하지 않음).

### 1-A. 전체 공통
여러 챕터에 걸친 것 — 어느 페이지에서 찾았든 먼저 봅니다.

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E8 | In Use 섹션 캡션 | "1. …" 번호, 한 장짜리(아이콘 · 파비콘)는 번호 없음 | 전 챕터 통일 규칙 | 확정 | 2026-11-10 |
| E9 | 장표 속 제3자 상표(차량 · 앱 아이콘 · 협업 로고) · 더미 문구 | 실제 상표 · 더미 텍스트 노출 | 현 단계 허용(디자이너 "대체로 문제없음"). 외부 공개 전 확인은 디자이너 몫 | 조건부 — 외부 공개 전에 디자이너가 확인 | 2026-11-13 |
| E10 | 장표 전반 — 예: Graphic Unit › Shaft › 다양성(`shaft-diversity` 회색 3 + 네온 1 ↔ 본문 "고루") | 장표의 색 · 조합이 본문 규칙과 조금 다름 | 설명을 위해 일부 장표에 예외적 표현 · 조합을 썼을 수 있고, 다르면 본문 우선(Overview › Welcome 에 안내 문장). 장표를 고치지 말 것 | 확정 | 2026-11-13 |
| E13 | 슬로건 표기 — `alignment-do-2` · Applications › Print › 포스터(옛 Graphic Pattern In Use 포스터) | "Build Anyway." 와 "Build anyway," 혼용 | 헤드카피냐 문장 속이냐는 형식 차이라 재량 허용 | 확정 | 2026-11-13 |

### 1-B. 페이지별 (가이드 목차 순)

#### 02 Logo › Symbol

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E20 | Symbol › Geometry · Lockup 가로형 · Signature › Partner Lockup 가로형 장표 | 본문에 없는 값(1 unit = H/30 · W = (29/30)H · 5° · 콜라보 기호 (2/3)W)이 장표에만 있음 | 도면 정보라 장표에만 둠. 본문에 옮기지 말 것 | 확정 | 2026-11-14 |
| E4 | Symbol › Scalability ↔ 로고 생성기 RULES | 가이드 "최적 8-15mm" · 생성기 "최적 4-15mm" 가 다름 | 두 기준을 의도적으로 공존(docs/logo-generator/DEBT.md D20). 생성기 값 · 가이드 문장을 서로에 맞추지 말 것 | 확정 | 2026-11-12 (11-13 가이드 최적 8-15mm 로 정리) |
| E32 | Symbol › Scalability · Signature › Scalability 장표 좌상단 네모 ("1cm · Optimized at 1cm on screen") | 125px(≈25mm) 행 옆에 있어 그 크기가 "최적" 이라는 뜻처럼, 또는 본문의 최적 범위(8-15mm)와 다른 기준처럼 보임 | 이 장표의 범례 정보(화면에서 1cm 로 보이는 기준 네모)일 뿐 크기 규칙이 아님. 장표의 모든 수치는 실제 픽셀 · 인쇄 크기가 아니라 눈에 보이는 크기 기준 | 확정 | 2026-11-13 |
| E39 | Symbol › Scalability · Signature › Scalability 본문과 Symbol 장표의 권장 최대 크기 "70px(약 15mm, 1/33)" | 약 5px/mm 로 셈하면 70px = 14mm 이고 15mm = 75px = 1/33 이라 세 값이 딱 맞지 않음(로고 생성기의 경계는 15mm) | 대략적인 기준이며, 1.4cm 보다 1.5cm 로 말하는 쪽을 사람들이 선호해 15mm 로 적음. px · mm 를 서로 맞춰 고치지 말 것 | 확정 | 2026-11-15 |
| E19 | Symbol › Usage › Placement (`usage-placement` A3 칸) | 밝은 심볼 · 흐린 심볼이 한 칸에 둘, 범례 없음 | 디자이너가 그대로 두기로 함(의도된 표현) | 확정 | 2026-11-14 |
| E18 | Symbol › Don'ts 1번째(`dont-1` 가로 약 10%) · Signature › Don'ts 8번째(`dont-8` 세로 약 6%) | "늘리지 마세요" 인데 왜곡이 약해 잘 안 보임 | 실제로 흔히 일어날 법한 실수의 크기라 이 정도가 맞음 | 확정 | 2026-11-14 |

#### 02 Logo › Sub Symbol

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E3 | Sub Symbol › Clearspace (본문 · 장표의 t 단위) | 2026-10-16 "스레드 두께 단위 T/t 폐기, 모든 수치는 H 기준" 결정과 어긋남 | 서브심볼은 아주 제한적으로만 쓰여 예외 규칙을 그대로 둠 | 확정 | 2026-11-13 |

함께 볼 것: E30(Don'ts 6번째 ↔ 핀 배지) — Applications 표

#### 02 Logo › Signature

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E31 | Signature › Scalability 장표 (`scalability`) | 본문의 권장 최대 크기(70px · 약 15mm · 1/33) 행이 장표에 없음 | 디자이너 결정으로 장표에서는 생략, 본문에만 둠 | 확정 | 2026-11-15 |
| E36 | Signature › Scalability 본문 "6-10mm … 'Studio' 버전 대안" ↔ 로고 생성기(이 안내 없음) | 본문의 권고가 생성기에 없고, "EO Studio" 디스크립터가 심볼과 이어져 "EO EO" 로 읽히는 문제도 매듭지어지지 않은 것처럼 보임 | 권고이지 규칙이 아님. 심볼이 모노그램으로 읽히면 "EO" 가 두 번 이어져 어색하다는 논의가 있었고, 공백 문자 테스트로 "EO Studio" 디스크립터의 회색도를 고르게 해 보이는 크기 8-10mm 까지 심볼과 뚜렷이 나뉘게 함(일부 해소). 보는 사람이 브랜드를 이미 아는지에 따라 갈리므로 논의는 아직 유효 — 현재의 현실적 사용 범위에서는 적절, 최종 탐색은 인하우스 몫(E5 와 같은 맥락). 생성기에 안내를 더하거나 권고를 규칙으로 바꾸지 말 것 | 조건부 — 인하우스의 최종 탐색 결과가 나오면 다시 판단 | 2026-11-15 |
| E5 | Signature › 서비스 시그니처 캡션 "EO Studio" ↔ 장표 "Studio" 등 | 디스크립터 표기 불일치 | 디스크립터에 "EO" 를 넣을지는 인하우스가 결정 — 그때까지 차이 유지(md 주석) | 조건부 — 인하우스가 디스크립터 표기(EO 포함 여부)를 정하면 다시 판단 | 2026-11-10 |
| E33 | Signature › Usage › Symbol or Signature 본문 ("텍스트가 또렷하게 읽히지 않을 만큼 작은 자리") | 시그니처 대신 심볼을 쓰는 "작은 자리" 에 수치 기준이 없음(Scalability 의 최소 크기 4mm · 20px 와 이어지지 않음) | 상황 · 사용자 · 디바이스를 디자이너가 종합적으로 고려할 일이라 보이는 크기가 기준이 되는데, 실험 연구를 한 바 없어 명시적 기준을 두지 않음(2026-11-15 괄호 안 수치 삭제). 수치를 다시 넣지 말 것 | 확정 | 2026-11-15 |
| E21 | Signature › Inversion 세로형(`inversion-v` "Align center") ↔ Descriptor 세로형(`descriptor-v` H/100 왼쪽 보정) | 다크에서 H/100 보정이 빠진 것처럼 보임 | 라이트에서 한 번 보정한 위치를 기준으로 하므로 문제없음 | 확정 | 2026-11-14 |

함께 볼 것: E32(Scalability 장표 좌상단 네모) · E20(Partner Lockup 가로형) · E18(Don'ts 8번째) — Symbol 표

E34(Scalability 장표의 10mm 경계 표기)는 2026-11-15 본문을 장표에 맞춰 고치면서 뺐습니다(경계인 10mm 에서는 두 형 모두). 빠진 번호는 다시 쓰지 않습니다.

#### 03 Typography

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E22 | Typography › Character Set Mono (`charset-mono` Small figures 행) | 분수 글리프가 두 줄로 깨진 것처럼 보임 | 공간 활용을 위한 원래 글리프 디자인 | 확정 | 2026-11-14 |
| E6 | Typography › Reference Scale (8줄) ↔ 본문 "7레벨" | 목록은 T2 포함 8개 | T2 는 T1 의 가독성 우선 대안이라 레벨 수에 세지 않음. T1 과 한 지면에 같이 안 쓰여 Reference Scale · Inversion · Levelling 장표에는 T1 만(md 주석) | 확정 | 2026-11-10 |
| E14 | Typography › Reference Scale 자간 값의 `[Solid Gray]` · `[Space Black]` | 대괄호 문법이라 이름 없이 색 칩만 보임 | 가독성을 위해 의도적으로 칩만 둠 | 확정 | 2026-11-13 |

함께 볼 것: E1(Zoning `zoning-ratio` · `zoning-4-division`) — Graphic Pattern 표

#### 04 Color › Colors

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E24 | Colors › In Use 행잉 배너 (`color-hanging-banner` "08:00 - 11:00 PM") | 시작 시각에 AM/PM 없음 | 앞 시각은 뒤 표기로 유추하는 흔한 표기 | 확정 | 2026-11-14 |
| E23 | Colors › Don'ts 6장 좌하단 "Typography Checklist" | 컬러 장표에 타이포 라벨 | 이 섹션 공통 샘플 목업이라 문구 내용은 중요하지 않음 | 확정 | 2026-11-14 |

함께 볼 것: E16(In Use 이미지를 Applications 에서 다시 씀) — Applications 표

#### 05 Graphic System › Graphic Unit

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E37 | Graphic Unit › Motif("shaft가 두꺼울수록 앞으로 나아가는 힘도 강해집니다") ↔ Vocabulary › Shaft › 다양성("무조건 두꺼울수록 좋은 것이 아니라 각기 다른 개성") | 연달아 읽으면 shaft 두께의 뜻이 상충처럼 보임 | 메타포는 맥락마다 다르게 읽음 — Motif 는 shaft 의 일반 정의(힘의 세기), 다양성은 여러 유닛을 나란히 놓을 때의 성격 차이 | 확정 | 2026-11-15 |
| E11 | Graphic Unit › Parameters (`param-thread-width`) ↔ Morphology › Shape 1번째(`shape-do`) | `shape-do` 는 캡션 수치(top 40% · bottom 10%)와 그림에서 잰 변의 비율이 달라 보임. `param-thread-width` 는 노란 선 길이(컬럼의 40%)가 본문 괄호 "컬럼 폭에서 줄어드는 비율" 과 안 맞아 보였으나, 2026-11-16 본문 괄호를 "윗변은 컬럼 폭 대비 폭, 아랫변은 컬럼 폭에서 줄어드는 비율" 로 고쳐 풀림 | 왼쪽 장표는 파라미터가 어느 변인지 가리키는 그림이지 값을 정하는 그림이 아님, 오른쪽은 가능한 경우 하나. 두 장 모두 수치를 재는 도면이 아니므로, 그림에서 잰 비율을 캡션 · 본문의 수치와 대조하지 말 것 | 확정 | 2026-11-13 (11-15 shape-do 캡션 수치 포함, 11-16 본문 괄호 수정) |
| E25 | Graphic Unit › Parameters (`param-thread-compression` "compression -1 / -2") | + 방향 예시가 없음 | 한 장표에서 둘 다 보이려고 반전하면 직관성이 떨어지고, 파라미터당 장표 2장은 양식 불일치라 타협. − 부호로 유추 | 확정 | 2026-11-14 |
| E40 | Graphic Unit › Parameters · Don'ts, Graphic Pattern › Zoning 본문의 "EO Graphic Builder" ↔ 저장소 | 가이드가 유닛을 만드는 도구로 가리키는 EO Graphic Builder(빌더 내 도움말 포함)가 저장소 · 핸드오프 문서에 없음 | 빌더는 프로젝트 중반에 인하우스에 납품했고, 인하우스가 필요에 맞게 고쳐 쓰며 따로 관리하는 도구라 이 저장소의 범위가 아님. 빠졌다고 보고하거나 가이드의 빌더 언급을 고치지 말 것 | 확정 | 2026-11-16 |
| E26 | Graphic Unit › Color (`color-gray` · `color-blue-green` SVG) | 캡션에 없는 Builder Neon 유닛이 섞여 있음 | 그 캔버스 안에서 그레이(블루 · 그린)의 역할을 보여 주는 그림이라 상관없음 | 확정 | 2026-11-14 |
| E17 | 참조 링크 "유닛 컬러" — Graphic Unit › Shaft › 다양성 → Graphic Pattern › Color, Graphic Pattern › Color → Graphic Unit › Color | 같은 라벨이 서로 반대 페이지로 감 | 문맥마다 가리키는 내용이 다름(다양성 = 여러 색을 쓰는 조합 규칙, Pattern › Color = 색의 뜻). 그대로 둠 | 확정 | 2026-11-13 |
| E15 | Graphic Unit › Pair › 파동(`pair-pulse`) | 본문 "중심대칭 또는 좌우대칭" ↔ 장표는 좌우대칭 하나 | 장표는 경우 하나를 보여 줌. 본문 유지 | 확정 | 2026-11-13 |
| E28 | Graphic Unit › Pair (`pair-peers` · `pair-rivals` 라벨 Peer · Rival) | 캡션은 복수(Peers · Rivals), 장표 라벨은 단수 | 라벨이 두 유닛 중 하나에 붙어 있어 단수가 맞음 | 확정 | 2026-11-14 |
| E2 | Graphic Unit › Formation › 규모 (`formation-scale`) | "Peer" 칸 두 유닛의 방향이 본문(같은 방향 나란히)과 달라 보임 | 메타포 장표는 연상에 어느 정도 자유도가 있다는 것을 상정한 그림 | 확정 | 2026-11-13 |
| E7 | Graphic Unit › Morphology | `rhythm-uniform-do` = `proportion-line-do`, `rhythm-excess-do` = `density-mass-do` 같은 그림 | "이상적인 형태" 라 같은 그림이 맞음 | 확정 | 2026-11-10 |
| E27 | Graphic Unit › Morphology › Proportion | 4장만 Air White 유닛 | 분위기 환기, 그리고 컬러보다 형태에 집중시키려는 의도 | 확정 | 2026-11-14 |
| E12 | Graphic Unit › Don'ts (`unit-dont-4` Solid Gray 유닛) ↔ Graphic Pattern › Color `color-do-3` (Space Black on Neon) | 화면에서 둘 다 "Neon 위 어두운 유닛" 으로 보임 | 유닛 색이 분명히 다르고, 색에 대한 금지 · 허용을 보여 주는 장표라 문제없음 | 확정 | 2026-11-13 |

함께 볼 것: E10(`shaft-diversity`) — 1-A

#### 05 Graphic System › Graphic Pattern

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E1 | Graphic Pattern › Zoning (`grid-do-1` 롤업) · Typography › Zoning (`zoning-ratio` 롤업 · `zoning-4-division` 좌측 열) | "세로로 나눌 때 패턴 상단 · 가로로 나눌 때 우측 우선" 규칙과 반대로 패턴이 하단 · 좌측 | 규칙은 "우선"(권장)이라 예외 가능. 롤업 · 행잉 배너처럼 바닥에 세우거나 기둥에 매다는 매체는 빌더 · 집이 땅에 선 형상이고, compression 이 촘촘한 쪽이 땅을 연상시켜 하단 배치가 어울림. 4분할은 Typography › Zoning 이 "번갈아 두기" 를 허용 | 확정 | 2026-11-10 (11-13 근거 추가) |
| E35 | Graphic Pattern › Pattern Gutter 본문 ("thread gutter의 1.5배" ↔ "20-25px 수준") | thread gutter 10-20px 의 1.5배는 15-30px 인데 본문은 20-25px | 각 범위의 가운데 값으로 보면 맞음 — thread gutter 10-20px 의 가운데 15px × 1.5 = 22.5px = 20-25px 의 가운데. 규칙은 배수(1.5배)이고 px 는 그 대표값이라 양 끝(15 · 30px)까지 넓혀 적지 않음 | 확정 | 2026-11-15 |
| E29 | Graphic Pattern › Color (`color-do-1` · `color-do-3` 등) | 캡션의 색 나열 순서 ↔ 장표의 색 순서 | 비주얼상 좋아서 장표 순서는 섞음. 캡션도 그대로 | 확정 | 2026-11-14 |

함께 볼 것: E13(`alignment-do-2` 슬로건) — 1-A, E12(`color-do-3`) · E17("유닛 컬러" 링크) · E40(Zoning 의 "EO Graphic Builder") — Graphic Unit 표

#### 05 Graphic System › Applications

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E16 | Applications 페이지 | Approach(깃발) · Print 2번째(행잉 배너) · 3번째(포스터)가 Colors › In Use 1 · 2 · 3번째와 같은 이미지 | 디자이너 지정으로 다시 씀. 2026-11-15 Graphic Pattern › In Use 를 없애고 그 장표(포스터 3장 · 빌보드 · 명함 · 영상 썸네일)를 Applications 로 옮김(Print = 빌보드 · 포스터 · 명함, Digital 4번째 = 영상 썸네일 — 맥 목업만 남김). 2026-11-15 Advertisement 섹션을 Print 에 합침. 이 페이지의 결과물은 확정 사양이 아닌 예시(Approach 첫 문단에 안내) — 실제 제작 사양과 다르다고 지적하지 말 것. 본문은 2026-11-14 디자이너 요청으로 구성은 그대로 두고 현재 규칙(Graphic Pattern › Color · Typography › Margin · 용어)에 맞춰 보완했고, 2026-11-15 장표를 채운 뒤 본문과 대조함 | 확정 | 2026-11-13 (11-15 장표 채움 · 섹션 재구성 · 포스터 포함) |
| E30 | Applications › Merch › 핀 배지 (`app-pin-badge` 서브심볼 E 블록 단독) ↔ Sub Symbol › Don'ts 6번째 "서브심볼을 EO 심볼 대신 단독 아이덴티티로 쓰지 마세요" | 서브심볼만 단독으로 쓴 것처럼 보임 | Sub Symbol 본문이 "파비콘 · 핀 배지처럼 … 아주 작은 정사각형 공간에 한하여 사용" 으로 핀 배지를 쓰임새로 명시 | 확정 | 2026-11-15 |

함께 볼 것: E13(Print 포스터 슬로건) — 1-A

#### 로고 생성기 (`public/tools/logo-generator`)

| # | 위치 | 겉보기 문제 | 허용 이유 | 상태 | 결정일 |
|---|---|---|---|---|---|
| E38 | 로고 생성기 — 매체가 빌보드일 때 시그니처를 고르면 뜨는 알림 "Signature not recommended on billboards" ↔ 가이드(같은 문장 없음) | 가이드에 근거 문장이 없어 생성기만의 규칙처럼 보임 | 아주 작게 보이는 경우에는 심볼을 권장한다는 뜻의 안내 — Signature › Usage 의 "텍스트가 또렷하게 읽히지 않을 만큼 작은 자리에서는 시그니처 대신 EO 심볼을 단독으로" 와 같은 맥락. 가이드에 빌보드 문장을 따로 두지 않기로 함 | 확정 | 2026-11-15 |

함께 볼 것: E4(크기 구간 "최적 4-15mm") — Symbol 표, E36("Studio" 대안 안내 없음) — Signature 표

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
