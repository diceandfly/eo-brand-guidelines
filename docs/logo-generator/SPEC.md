# EO Logo Generator — 현재 사양 (2026-11-12)

정적 웹 도구 `public/tools/logo-generator/`. 가이드(content/guide.ko.md › Symbol · Signature)의 규칙대로 EO 심볼과 시그니처를 **보이는 크기 기준**으로 생성해 내보낸다(화면 SVG · PNG, 인쇄 CMYK PDF · dpi PNG). 디자인 툴 대체가 아니라 "보이는 크기 기준 시각 보정 계산기". 가이드 목차 Logo › Download(`## Download {href=/tools/logo-generator/index.html}`)가 새 탭으로 연다.

## 0. 파일 · 실행 · 의존성
- 파일: `index.html`(마크업) · `fonts.css`(서체 선언) · `tokens.css`(모든 수치 · 색 — 가이드 tokens.css 와 같은 규칙: A 시스템 · B 요소, `--<요소>-<부분>-<속성>-<상태>`) · `tool.css`(토큰만 참조하는 규칙, 블록 순서 = tokens.css 목차) · `geom.js`(심볼 지오메트리, 확정 — GEOM-START/END) · `app.js`(상태 · 시그니처 조판 · 목업 · 내보내기 · 툴팁, geom.js 다음에 읽는 같은 전역 공간. 맨 위 RULES-START/END 블록 = 가이드에서 온 수치 — 크기 구간 · 시그니처 규격 · 면적 상한, npm test [5] 가 고정) · `sig-font.js`(서체 읽는 모듈) · `vendor/`(polygon-clipping 0.15.7 · fontkitten 1.0.3, 둘 다 MIT, 라이선스 동봉).
- 실행: `npm run dev` → `http://localhost:4321/tools/logo-generator/index.html` (빌드하면 `dist/tools/logo-generator/` 로 그대로 복사). 빌드 단계 없음 — Astro 는 public 을 복사만 한다. file:// 로 열면 시그니처 서체를 못 읽는다(심볼은 동작, 경고 표시).
- 서체: 가이드와 같은 `public/fonts/`(git 제외, 클라이언트가 넣음). 시그니처는 `founders-grotesk-regular.woff2` 의 아웃라인을 쓴다(출력에는 아웃라인만). 없으면 Signature 가 "Signature font missing" 으로 잠긴다.
- 가이드 링크(i · 이름 클릭)는 같은 서버의 `/en/02-logo/…`.
- 검사: `npm test` 의 [5] — geom.js 를 node 에서 돌려 확정 수치(다크 총높이 · 오른쪽 클리어스페이스 식)를, app.js 의 HEX · CMYK 를 가이드 스와치와 대조 (`scripts/lib/logo-generator-check.mjs`).
- 정본 지오메트리 SVG 는 `docs/logo-generator/source/` (geom.js 안에 문자열로도 들어 있음).

## 1. 심볼 지오메트리 (geom.js — 확정, 손대지 않음)
- 정본: regular = `symbol-g-regular-300.svg`(H = 30), min = `symbol-g-min-100.svg`(H = 10). `symbol-g-regular.svg` · `symbol-g-min.svg` · `symbol-regular.svg` · `symbol-min.svg` 는 쓰지 않는다.
- H = E 블록 높이, W = E 블록 폭. 변하는 모든 파라미터(블록 간격 5.22u → 4u 포함)는 min ↔ regular 선형 보간.
- 보간 축 = 보이는 높이 S(500mm 환산 mm): S ≤ 4mm min, S ≥ 14mm regular, 그 위는 스케일만.
- 십자 가로팔이 더 두껍고 짧은 것, O 모서리 컷 9 × 8.05u 는 의도된 광학 보정. O 블록은 거울 평균으로 좌우대칭.
- 다크(가이드 Symbol › Inversion, 일러 작업 순서 그대로 2026-11-13): ① E 블록 전체 · O 팔각형을 블록 중심 기준 정비율 확대(높이 +2/30H) — 십자 구멍은 원래 크기 ② H/60 외곽선 오프셋 — 바깥 윤곽은 밖으로, 십자는 안으로(2026-11-13 사용자 결정 H/100 → H/60, 생성기 상수 DARK_OFFSET · DARK_HOLE_OFFSET) ③ 간격 = 라이트 − H/30(regular 4/30 → 3/30). 총 높이 1.1H, 십자 = 라이트 − 2/60H(길이 · 팔 두께 모두, npm test [5] 고정).

## 2. 크기 축
- **Visual height(= Symbol height, S)** 가 사용자 결정값. 500mm 에서 보이는 심볼 높이(mm), 슬라이더 4-30mm. 거리 · 매체 때문에 자동으로 바뀌지 않는다(매체를 고를 때만 그 매체의 처음 값으로 한 번 맞춤).
- 실제 높이 = S × 거리 ÷ 500. 출력 px = 실제 높이 × 매체 px/mm(화면) 또는 dpi ÷ 25.4(인쇄).
- Viewing 섹션에서 Real size height · Output height 를 직접 넣으면 S 로 역산.
- 경고(심볼): 4mm 미만 Outside guide · 4mm Minimum visual size · 15mm 까지 Within optimal range · 15-25mm Above recommended size · 25mm 초과 Not recommended. 슬라이더 구간 색도 같다(4-15 최적 · 15-25 권장 초과 · 그 밖 가이드 밖). 가이드 문장의 최적 8-20mm 보다 권장 최대 15mm 를 우선.
- 경고(시그니처): 4mm 미만 없음 · 가로형 4mm 이상 10mm 미만(10 이상 Use vertical, 2026-11-15) · 세로형 10mm 부터(10 미만 Use horizontal, 15 초과 권장 초과, 25 초과 Not recommended). 구간 색도 형별.
- 상태 색: ok = Bay Green · warn = Medium Gray · bad = 경고 주황 #DD5A2D(가이드 사이트 `--warn-orange`, 브랜드 컬러 아님).

## 3. Logo 섹션 — Symbol | Signature
- Signature: Type Company(“EO Studio” 고정) | Service(Descriptor 입력, 처음 값 Magazine, 첫 글자는 입력칸에서 자동 대문자) · Layout Vertical | Horizontal. Symbol 이면 시그니처 행은 비활성으로 자리만 지킨다.
- 시그니처 규격(가이드 Signature › Descriptor · Clearspace · Inversion). 좌표 H = 라이트 심볼 높이.
  - 세로형: Founders Grotesk Regular 58.8/125 H(≈ 0.47H), 자간 0. 캡 박스 윗변 = 심볼 아래 H/5, 심볼과 가운데 정렬 후 왼쪽 H/100. 클리어스페이스 H/2.
  - 가로형: 1.3H, 자간 0, 공백 문자만 −6%. 캡 박스 왼변 = 심볼 오른쪽 + W/2, 베이스라인 = 심볼 바닥 − H/10. 클리어스페이스 = H(2026-11-14, 캡 하이트에서 변경).
  - 곡선 옆선 첫 · 끝 글자는 캡 박스 경계를 H · h 로 잡는다(C G O Q S c d e g o q s 0 6 8 9 / B C D G O Q S b c e o p s 0 3 8 9).
  - 커닝 = 서체 GPOS 'kern'(일러스트레이터 Auto · Metrics 와 같음).
  - 다크: 심볼은 [[symbol#inversion]] 변환 후 라이트 심볼 자리에 x · y 가운데. 글자는 세로형 0.48H · 가로형 1.35H, 자간 세로형 −1% · 가로형 −2%(공백 −7%, 2026-11-12 확정), 바깥 오프셋 H/200. 세로형은 원래 캡 박스 가운데, 가로형은 원래 캡 박스 왼변에 맞추고 베이스라인 유지. 전체를 다시 옮기지 않는다.
- 시그니처 컬러 = 여섯 페어 중 넷(Builder Neon 글자 페어 5 · 6 제외, 가이드 Signature › Color). 제외 페어는 심볼만 흐리게(칸 · 테두리 유지), 시그니처로 바꿀 때 쓰던 페어가 제외면 같은 모드의 첫 페어로.
- 시그니처는 Right side correction 을 쓰지 않는다(자동 비활성). 내보내는 틀 = 라이트 기준 박스 ± 독자 클리어스페이스.
- 저장 잠금(Save 의 SVG ↓ · PNG ↓ 회색): Descriptor 가 비면 “No descriptor — use the symbol instead”, 서체에 없는 글자가 있으면 “Missing glyphs: 한, 글”(빠진 글자 나열), 서체를 못 읽었을 때도 잠김. 메시지는 크기 경고 줄에 주황. 빈 Descriptor 는 EO 를 채우지 않고 캡 박스 자리만 둔다.

## 4. Viewing 섹션 — 매체
매체 = 프리셋(대표 거리 · 출력 단위 · px/mm 또는 dpi · 처음 Visual height · 목업). 고른 뒤 거리는 자유.

| 매체 | 거리 | 출력 | 처음 S | 콘텐츠 |
|---|---|---|---|---|
| iPhone 18 | 30cm | 6.04 pt/mm (460ppi @3x) | 8 | Feed 3:4 · Story 9:16 · Video 16:9 |
| iPhone 18 Pro Max | 30cm | 같음 | 8.5 | 같음 |
| MacBook 16″ | 50cm | 5 px/mm (1728 × 1117) | 12 | Video 16:9 · Website(7) |
| Desktop 24″ | 65cm | 3.6 px/mm (1920 × 1080) | 12 | Video 16:9 · Website(7) |
| Desktop 27″ | 70cm | 4.28 px/mm (2560 × 1440) | 12 | Video 16:9 · Website(7) |
| A4 document | 40cm | 300dpi | 10 | — |
| A2 poster | 120cm | 150dpi | 7 | — |
| Billboard 48 × 14ft | 40m | 20dpi | 5 | — |

- 콘텐츠에 처음 값이 있으면(Website 7) 그 값, 없으면 매체 값.

## 5. 작업공간 미리보기
- 가운데 로고 = **As seen**: S × 화면 보정 px/mm. 이 화면을 50cm 에서 볼 때 현장에서 보는 것과 같은 크기. 매체가 달라도 S 가 같으면 같은 크기.
- 타이틀(EO Logo Generator)에 올리면 툴팁 = 툴 소개 한 줄 + 사용 5단계(로고 → 매체 → 보이는 크기 → 컬러 → 파일) + EO 디자인팀 문의.
- 화면 보정 버튼에 올리면 툴팁: 보정 전 = 왜 필요한지(화면마다 픽셀 밀도가 달라 미리보기 크기가 틀림, 크기 판단 전에 먼저), 보정 후 = 완료 · px/mm. 툴팁 마지막 줄 = “Click the name to open the guide ↗” / 토글은 “The i on the right opens the guide ↗”, i 에 올려도 그 토글 툴팁. 본문은 고아 단어 방지(마지막 두 단어 사이 nbsp + text-wrap: pretty).
- 화면 보정: Visual size 제목 줄의 Not calibrated → 신용카드(85.6 × 54mm) 틀을 실물에 맞춤 → px/mm 저장(localStorage). 보정 전에도 동작.
- 바탕 = 고른 컬러 페어의 배경색(보기 전용).
- Show clearspace guide(기본 꺼짐): 가운데 로고에 장표 문법의 클리어스페이스 — 점선 격자(바깥 + 로고 경계선), 모서리 칸에 작은 H/2(가로형 시그니처는 H, label × 0.6, 오른쪽 보정으로 좁아진 칸은 생략, 칸이 작으면 생략). 폰 실물 목업 안의 클리어스페이스도 같은 문법(화면 px 로 그려 mm 좌표에 맞춤).
- 오른쪽 아래 = 매체 목업 + 이름 · 화면 크기 · 해상도(인쇄는 dpi). 폰은 가운데에 캘리브레이션 실물 크기 목업.
  - MacBook · Desktop 24″ · 27″ 목업은 실제 크기 비율이 서로 맞는다(Desktop 24″ 를 기본 상자에 맞춘 배율 × 1.25 로 셋 다 그림). A4 · A2 · Billboard 는 상자 맞춤 + 보정 배율(boost).
  - 목업 속 로고 자리: 기본 자리 + 후보(흐린 심볼, 호버 · 클릭으로 이동, 매체 + 콘텐츠별 기억). 겹치는 후보의 클릭 영역은 두 중심 사이에서 나눈다.
  - 여백: 콘텐츠 영역 긴 변 1/24, 가로는 10% 좁게, 최소 H/2. Website 는 1/48(헤더 자리 · 위 가운데 처음), Story 는 9:16 프레임 전체 기준 7곳, A2 · Billboard 는 조닝의 콘텐츠 영역 안.
  - 크기 상한: 목업 안 로고가 반대쪽 여백에 닿는 크기(로고 + 여백 2개 > 면 폭 또는 높이)에서 Visual height 가 더 오르지 않고 크기 경고 줄에 빨강 “Too large for this layout”. 자리와 무관(붙은 여백은 앵커라 침범 없음). 거리 · 매체 · 로고 종류를 바꿔 넘치면 그 상한으로 보이고, 사용자가 정한 값(visReq)은 남아 있어 되돌리면 원래 크기로 돌아온다. 메시지는 넘치는 동안 계속.
  - 목업 위 알림(경고 주황): 로고 면적이 놓인 공간의 10%를 넘으면 Larger than the guide suggests, 빌보드에서 시그니처를 고르면 Signature not recommended on billboards.
  - 목업 선 색: 라이트 모드 Air White 고정, 다크 모드는 페어 글자색.

## 6. Color 섹션
- Light | Dark 토글 + 여섯 페어(Symbol › Color): 라이트 2 Air White on Space Black · 3 Air White on Solid Gray · 5 Builder Neon on Space Black · 6 Builder Neon on Solid Gray / 다크 1 Space Black on Builder Neon · 4 Space Black on Air White. 모드를 바꾸면 그 모드의 페어만 고를 수 있다.
- HEX: Builder Neon #F9EE3A · Day Blue #6EC6D2 · Bay Green #66B88A · Medium Gray #8E8E8E · Solid Gray #2A2B2B · Space Black #000000 · Air White #FCFBF5.

## 7. Export 섹션
- Export 는 다른 섹션과 같은 글자 행(2026-11-12, 채운 버튼 폐기): Scale `1x | 2x | 3x | 4x`(토글 문법, 고른 값 = 네온 글자 + 밑줄) · Save `SVG ↓  PNG ↓`(흰 글자, 호버 네온, ↓ = 누르면 저장). 배경은 늘 투명.
- Include clearspace(기본 켜짐, 옛 Output clearspace): 심볼 · 세로형 시그니처 네 변 H/2, 가로형 시그니처 H.
- Right side correction(심볼만, 기본 켜짐 — 가이드도 2026-11-12 부터 “항상 보정”): 오른쪽 클리어스페이스 = H × (0.42 + 0.0012 × S), S ≥ 67mm 면 H/2(가이드 Symbol › Clearspace). 다크 심볼은 라이트 기준 박스에 가운데.
- Output height(Viewing) = 저장될 파일의 심볼 높이 px — 화면은 1x-4x 배율 반영, 인쇄는 고른 dpi 기준. 직접 고치면 그 배율로 크기를 역산.
- 화면 매체: SVG(evenodd 패스 하나, fill = 페어 글자색, 크기 = 출력 px) · PNG 1x-4x.
- PNG 가 브라우저 캔버스 한계(한 변 16384px)를 넘으면 저장하지 않고 위쪽 빨간 띠에 안내(낮은 dpi 또는 PDF). 파일명은 누른 순간의 설정.
- 인쇄 매체(A4 · A2 · Billboard): Scale 행이 `Resolution · dpi  20 | 72 | 150 | 300`(처음 선택 = 매체 dpi: A4 300 · A2 150 · Billboard 20), Save 의 SVG ↓ 자리가 PDF ↓. PDF = 쪽 크기 mm(틀 그대로) · 벡터 짝홀 채우기 · 가이드 CMYK 값(Builder Neon C5 M0 Y95 K0, Space Black C60 M60 Y0 K100, Air White C1 M2 Y2 K0 …), 파일명 `-cmyk.pdf`. PNG = 고른 dpi 의 px + pHYs(dpi) 정보, 파일명 `@300dpi`. Output height 도 고른 dpi 기준.
- 파일명: `eo-symbol-{light|dark}-{H}px|{mm}mm[-clearspace][-icon]` / `eo-signature-{descriptor}-{vertical|horizontal}-{light|dark}-…`, PNG 는 `@2x` 등 접미.

## 8. UI 원칙
- 메뉴 순서: Logo → Viewing → Visual size → Color → Export. 디자인 수치는 `<style>` 맨 위 토큰(A 시스템 · B 요소)에서만.
- 메뉴창 · 보정 창: 글 선택 · 끌기 금지, 커서는 일반 화살표(누르는 것만 손가락).
- 툴팁: 켜진 행의 이름(행의 조작부 밖 어디든) · 섹션 제목 5개 · 체크 토글 · dpi 값(1x-4x 는 없음) · Save 의 SVG · PNG · PDF(제목은 Save SVG 처럼, 지금 설정으로 나갈 크기 · 해상도 · 컬러 모드)에 0.25s 머물면 보정 창과 같은 면 · 자리(메뉴창 오른쪽, 가리킨 행 높이)에 제목(밑줄 속성 이름) + 다음 줄 설명. 비활성 행은 없음. 올리는 즉시 이름이 밝아짐(툴팁만) 또는 네온 + 손가락(가이드 링크 있음). 링크 있는 이름은 툴팁 마지막 줄 “Click the name to open the guide.”, 누르면 새 탭: Type → Signature › Usage(Symbol or Signature) · Descriptor → Signature › Descriptor · Distance · Symbol height → 지금 로고의 Scalability · Color → 지금 로고의 Color · Logo → Symbol › Overview · Visual size → 지금 로고의 Scalability. 제목(이미 흰색)은 밑줄로 피드백. Layout · Content 는 링크 없음. 체크 토글은 이름 = 체크라 오른쪽 i 가 가이드 링크(툴팁 마지막 줄 “The i opens the guide.”).
- 강조색 = Builder Neon(선택 · 슬라이더 손잡이 · 주 버튼). 입력 중 밑줄 = Air White.
- 서체 = Founders Grotesk(본문) · Founders Grotesk Mono(라벨), 행간 단위 기준.

## 9. 보류 · 범위 밖
파비콘 정수 스냅, 서브심볼, Output height 를 Export 로 옮길지(보류), 큰 로고와 오른쪽 아래 목업의 겹침, 핸드오프 방식(git).
