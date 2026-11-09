# 용어 · 문형 · 인용 구조 통일안 (국문) — 1차: Typography 챕터

2026-11-07 합의안. **2026-11-08 Typography 챕터에 적용 완료** (Grid & Margin 은 Grid Setting › Zoning · Margin · Compound Grid 세 섹션이 됨). 아래 표의 "지금 섞인 것" 열은 적용 전 상태의 기록.
1차 적용 대상은 `content/guide.ko.md` 의 `# 03 Typography` 전체. **장기적으로는 가이드 전체**(Logo · Color · Graphic System · Applications)에 같은 작업을 한다 — 타이포그래피에서 정한 문형 규칙(2장)과 인용 규칙(3장)은 전 챕터 공통이고, 용어집(1장)은 챕터마다 표를 더한다. 영문 md 는 아직 옛 구조(인용 없음)라 국문 확정 뒤 번역 때 같은 규칙을 가져간다.

## 1. 용어집

국문 본문 기준. 영문 고유 명사(Line Unit · Reference Scale)는 **최초 개념 설명 한 곳에서만** 괄호 풀이를 붙인다. 2026-11-08 추가 결정: 섹션명은 영문(Linespacing · Letterspacing · Zoning …)으로 두되 본문 명사는 국문으로 쓴다 — Linespacing → **행간 비율**, Letterspacing → **자간**, Tonal Value → **회색도**(섹션은 삭제, 개념은 Setting Up 4 한 문장). 영문은 섹션명 · 링크 라벨과 Overview 첫 언급의 괄호에만 남는다.

| 개념 | 확정 표기 | 지금 섞인 것 → 처리 |
|---|---|---|
| 줄 사이 절대 높이 | **행간** (최초 설명: "행간, 즉 줄 사이의 절대 높이") | 기준행간 · 기본행간 그리드 → Line Unit · 베이스라인 그리드 |
| 행간 ÷ 글자 크기 | **행간 비율** (%) — 섹션명 · 링크 라벨만 Linespacing | 본문 Linespacing 25곳 → 행간 비율 (11-08). 단위가 구분: x = 행간, % = 행간 비율 |
| 글자 사이 | 본문 **자간**, 섹션명 · 링크 라벨은 Letterspacing | 링크 라벨 「자간」 → 「Letterspacing」 |
| 레벨 크기 | **배수**(x) | 배율 3곳 → 배수 |
| 레벨의 네 항목 | **배수 · 웨이트 · 행간 비율 · 자간** — 이 순서 고정 | 문장마다 다른 순서 → 통일 |
| 격자 전체 | **베이스라인 그리드** — 항상 풀네임(2026-11-08 결정). 문맥상 컬럼 · 모듈러와 묶어 말할 때만 **그리드** | 격자 → 베이스라인 그리드, 「그리드 라인」 → Compound Grid |
| 컬럼 격자 | **컬럼 그리드**, 세로 칸 **컬럼**, 사이 **거터** | 6열 · 4열의 "열" → 컬럼 |
| 가장자리 | **마진** | 여백 → 마진 (단 "글과 여백이 같은 비례로" 는 여백 유지) |
| 방향 | **상하 · 좌우**, 넷은 **네 변** | 위아래 · 위 · 아래 → 상하 |
| 글 덩어리의 밝기 | **회색도** — Tonal Value 섹션은 11-08 삭제, 정의는 Setting Up 4 와 Overview 카드. 다른 챕터(Logo · Graphic System)도 회색도 | Tonal Value 16곳 → 회색도 |
| 면 | **콘텐츠 영역 · 패턴 영역**, 둘을 묶을 땐 **영역** | 존 → 영역 (2026-11-08 결정, 본문에는 남은 곳 없음) |
| 값 표 | **Reference Scale** = 섹션(7레벨 묶음), **프리셋** = 그 안의 레벨별 값 | 기준값(Linespacing › Medium 1곳) → 레벨별 프리셋. "권장하는 … 값" 은 추천 의미라 그대로 |
| 체계 | **프레임워크** | 프레임웍 2곳 |
| 매체 | **지면** = 한 화면 · 한 페이지, **매체 · 포맷** = 종류 | 화면 2곳은 문맥상 유지 |

## 2. 문형 규칙

- **참조**: 문장 끝 `세부 지침은 [[#slug|섹션명]]을 참조하세요.` 하나로. 지금은 "…을 참조하세요 / …을 참조하며 / 빠른 참고가 필요할 때는 / …를 따릅니다" 네 가지. 다른 페이지의 규칙(graphic-pattern 등)을 가리킬 때만 `…를 따릅니다`.
- **정하다 계열**은 역할로 나눈다.
  - **정합니다** = 값을 고르는 결정 (레벨 수 · Line Unit · 배수)
  - **설정합니다** = 도구에 넣는 행위 (그리드 · 마진)
  - **다듬습니다 / 맞춥니다** = 반복 조정 (행간 비율 / 회색도)
  - **조정** = 이미 있는 값을 바꿀 때 (다국어 · 반전)
  - 결정합니다 · 구축합니다 · 세팅합니다 · 조절 · 조율 → 위 넷으로 흡수. 단 Setting Up 의 "교차 조율" 은 고유 표현이라 유지.
- **좁다 / 넓다**: 행간 · 자간을 바꿀 땐 **좁히다 / 넓히다**, 상태는 **좁다 / 넓다**. "조여진 · 열어 · 타이트 · 느슨 · 넉넉히" 는 Brand Typeface 의 서체 성격 묘사 한 곳만 남기고 규칙 문장에서는 뺀다.
- **행 / 줄**: **행** 으로 통일(행간과 짝). "줄" 은 "줄 바꿈" 같은 복합어에서만.
- **나열**은 ` · ` (기존 규칙).

## 3. 인용 구조

- **허브 둘 다 유지**: Overview 끝 문단 = 단순 나열, Setting Up = 단계별 인용. 단 Overview 나열 순서를 Setting Up 단계 순서와 같게 맞춘다.
- **개념 명사 섹션** (Line Unit · Linespacing · Letterspacing · Tonal Value · Reference Scale · Grid & Margin): 사전 항목처럼 어디서든, 교차로도 가리킬 수 있다.
- **잎 섹션** (Inversion · Multilingual · Alignment & Ragging · Don'ts): 다른 곳에서 "이 경우엔 여기" 로 한두 번만 가리키고, 잎끼리는 서로 가리키지 않는다.
- **참조 경로 표시(2026-11-09 확정)**: 라벨을 쓰지 않으면 파서가 독자 기준으로 표시한다. ① 같은 페이지 → 섹션명만(페이지 이름을 적어도 경로 없음, 아예 링크 없이 글자로만 언급해도 됨). ② 다른 페이지 → "페이지 › 섹션명". 헤드가 그 페이지에서 반복되는 묶음(Grid Setting · Grammar · Morphology · Partner Lockup …)이면 빠진다(Typography › Zoning). ③ 섹션명이 페이지 안에서 겹칠 때만 헤드를 남긴다(Typography › Linespacing › Founders Grotesk Medium). 한 번만 나오는 헤드(Over Imagery / Do's & Don'ts)는 세 단으로 보이며, 어색하면 라벨로 덮는다. 헤드 · 서브헤드 구조 자체는 분량 · 중요도에 맞춘 현재 상태를 유지한다.
- **개념 보조 인용**: 복잡하거나 특정한 개념을 설명하면서 이해를 돕기 위해 가리킬 때는 `[[경로|개념]]`처럼 문장 속 개념어를 라벨로 쓴다(「시그니처의 디스크립터」→ signature#inversion).
- **라벨**: 섹션명이 있으면 섹션명 그대로. 국문 최초 개념 설명 자리에서만 우리말 라벨 허용(건별로 보고 결정). 지금 바꿀 라벨: 「자간」→Letterspacing, 「웨이트」→Tonal Value, 「반전」→Inversion, 「Pretendard나 Noto Sans」→Multilingual, 「그리드 라인」→Grid & Margin, 「T1」(Multilingual 안)→Reference Scale, 「다국어 환경 전환」·「다크/라이트 모드 전환」(Overview 불릿)은 최초 설명 자리라 유지(2026-11-08 결정).

## 4. 현재 인용 트리 (2026-11-07 기준)

```
Brand Typeface › Founders Grotesk        → Reference Scale
Character Set › Medium                   → Multilingual (라벨 없음)
Overview 불릿                            → Multilingual「다국어 환경 전환」· Inversion「다크/라이트 모드 전환」
Overview 허브 문단                       → Reference Scale · Line Unit · Setting Up · Levelling & Sizing
                                           · Linespacing · Letterspacing · Tonal Value · Grid & Margin · Multilingual
Line Unit                                → Grid & Margin
Reference Scale                          → Tonal Value · Multilingual
Setting Up 1~6                           → L&S · Line Unit · Grid & Margin · L&S + Reference Scale
                                           · Linespacing · Tonal Value (+ Linespacing · Letterspacing)
Levelling & Sizing                       → Linespacing · Letterspacing「자간」· Tonal Value「웨이트」· Reference Scale
Linespacing › Medium                     → Reference Scale          Linespacing › Light → Line Unit
Letterspacing (4)                        → 없음
Tonal Value                              → Linespacing · Letterspacing「자간」· Multilingual「Pretendard나 Noto Sans」· Inversion「반전」
Alignment & Ragging                      → Grid & Margin「그리드 라인」
Grid & Margin                            → Line Unit
Inversion                                → Tonal Value · Reference Scale
Multilingual                             → Reference Scale「T1」
Don'ts                                   → 없음
```

## 5. 함께 처리할 것

- Setting Up 은 5단계로 확정(Overview "다섯 단계"와 일치). 5번 "값울" · 이중 공백 · "Linespacing와" 는 2026-11-08 정리.
- `scripts/typo-layout-ai.mjs` 의 setting-up 장표는 5장 기준 유지. 생성 결과 `~/Downloads/temp/typography-layout-ai/`.
- 영문 md 번역 때 라벨 규칙 동일 적용.

## 6. 결정 사항 (2026-11-08)

- 존 → 영역.
- 베이스라인 그리드는 항상 풀네임.
- Overview 불릿의 우리말 라벨 두 개 유지.

## 7. 실행 기록

1. 용어집 · 문형 승인 (11-07) → 2. Typography 챕터 전체 적용 (11-08, 44곳) → 3. 다음: 다른 챕터(Logo · Color · Graphic System · Applications)에 문형 · 인용 규칙 확장, 용어집 표 추가.
