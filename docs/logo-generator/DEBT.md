# EO Logo Generator — 개발부채 전수점검 (2026-11-12, 서브 세션)

대상: `index.html`(1475줄 · 149KB) 전체 + `SPEC.md` + 런타임 확인(localhost:4400, 콘솔). 지오메트리 수치는 런타임에서 재검증: 다크 총높이 1.0867H · 다크 간격 0.1000H · lightW 2.0667 — SPEC 과 일치. compose 0.3ms(심볼) · 3ms(시그니처), update 1.7ms — 성능 문제 없음.

## 처리 현황 (2026-11-12 메인 세션)
- 처리: A1 · A2(주석에 삼킨 코드 복구) · A3(가이드 국문 · 영문 −2% · 공백 −7%, 장표 재수출) · A4(취소) · B5(→ `public/tools/logo-generator/` git 편입, 가이드 목차 Logo › Download) · B6(vendor 고정 + 실패 메시지 분기) · B7(GUIDE 상수, 상대 주소) · B8 · B10(`npm test` [5]) · B9(MEDIA 키 = 매체 id, dist 분리) · C: c.bg · iconNote/fileOut 제거, setVis 통합(+ visReq 로 상한이 값을 지우지 않음), resize rAF, tokenPx 캐시, buildSymbol · setLine 메모, aria-pressed, 단일 HTML → index.html · tool.css · geom.js · app.js · sig-font.js 분리. D20(툴 최적 4-15) · D21(0.47H) · D22(유지).
- 남음: 스크립트 섹션 번호 정리, 899px 미디어쿼리, ART 폰 d 문자열 중복, paramsOf(GEOM 안이라 손대지 않음).
- 아래 줄 번호는 분리 전 단일 index.html 기준.

## A. 버그 (확실)
1. **툴팁 핸들러 ReferenceError** — 1405행 끝 주석 `// i 에 올려도 …, b = e.target.closest('#pngScale button, #dlSvg, #dlPng');` 안에 `b` 선언이 들어가 버림. 1413행 `if (b && …)` 에서 `b is not defined` → 툴팁 키가 없는 곳(저장 버튼 · 1x-4x · dpi 버튼)에 올리면 예외. **Save SVG/PNG · 배율 · dpi 툴팁이 전혀 안 뜸**(콘솔 재현 완료).
2. **calSlider.min 설정이 주석 속** — 1434행 `// 단위 없는 수 $('calSlider').min = CAL_MIN;`. 지금은 HTML min=3 과 토큰 3 이 같아 티가 안 나지만 토큰을 바꾸면 어긋남.
3. **가로형 다크 자간: 코드 −2%(SIG.h.trackDark −20) vs 가이드 440행 "자간 -1%"**. SPEC 은 "−2% 2026-11-12 확정" 이라 적었지만 가이드 본문은 안 바뀜. 공백 −7% 도 가이드에 없음(장표 09-inversion-h 에만 있음). 어느 쪽이 정본인지 정하고 세 곳(코드 · 가이드 · 장표) 통일.
4. ~~가로형 다크 조판 1.35H → 1.33H~~ — 취소(2026-11-12 사용자: "1.35가 맞음"). 코드 · 가이드 · 장표 모두 1.35H 유지.

## B. 구조 부채 (핸드오프 전에 정리해야 하는 것)
5. **버전 관리 밖** — `research/` 가 gitignore 라 생성기 자체가 git 에 없음. 사고 나면 복구 불가. 폴더를 `tools/logo-generator/` 로 옮기고 git 에 넣되 서체 · dist 는 기존 훅으로 차단(폰트 파일은 어차피 `public/fonts` 에서 상대 경로로 읽음).
6. **외부 의존 3종이 모두 환경 종속** — polygon-clipping CDN(오프라인 불가), `../../node_modules/fontkitten`(npm install 안 하면 시그니처 불가), `../../public/fonts/*.woff2`(클라이언트 보유). 번들 한 번 해서 `vendor/` 에 고정하거나, 최소한 로드 실패 메시지를 세 경우로 구분.
7. **가이드 링크 하드코딩** — `http://localhost:4321/en/02-logo/…` 가 HTML 2곳 + JS `GUIDE` 1곳 + `clearInfo.href` 1곳. 상수 하나로 모으고 배포 주소를 바꿀 수 있게.
8. **팔레트 · CMYK 값 중복** — `HEX` · `CMYK` 가 tokens.css · 가이드와 따로 적혀 있음(지금은 일치). 적어도 `scripts/test.mjs` 에서 tokens.css 와 대조.
9. **매체 ID 가 거리 문자열** — MEDIA 키 `'300' · '500' · '650' … + 'iphone-pm'`. `st.dist = medium().dist || parseFloat(option.value)` 로 ID 와 값이 섞임. 매체마다 `{ id, dist }` 로 분리.
10. **테스트 0** — GEOM 블록은 `/*GEOM-START*/ … /*GEOM-END*/` 로 잘라 쓸 수 있게 해 놓고도 쓰는 스크립트가 없음. node 로 GEOM 을 읽어 1.0867H · 0.1H · rightClear · 보간 끝값(min/regular 원본 재현)을 고정하는 회귀 테스트 추가(polygon-clipping 은 npm 에 있음).
11. **시그니처 주석 번호 뒤죽박죽** — 섹션 11 → 12 → 18 → 13 → 14 … 재배열.

## C. 코드 품질 (기능엔 영향 없음)
12. `compose()` 가 한 번의 update 에서 4-5번 호출됨(update · artLimitS 재계산 · btnTip · 저장). `frameFor(c,false)` 도 placeSym 마다. 값은 작지만 구조상 메모가 맞음.
13. `paramsOf(g)` 는 "검증 표시용 — 생성에는 쓰지 않음" 인데 buildSymbol 마다 계산 → 디버그 토글 뒤로.
14. 죽은 코드: `c.bg` 는 항상 null(배경 토글 폐기) → svgMarkup · PNG 의 bg 분기 · `GEO_SOURCE` 표시 안 됨 · `fmt` 가 gposKerner 안에서 가려짐.
15. "st.vis 바꾸고 슬라이더 · 입력칸 맞추기" 가 6곳에 복붙(hmm · hreal · hpx · contSel · distPreset · artLimit) → `setVis(v)` 하나.
16. ART 의 폰 d 문자열이 feed/story 에서 zn 만 다른데 통째로 중복, Desktop 24″/27″ 도 같은 패턴 → 템플릿 함수.
17. `resize` 에 update 전체 재렌더(스로틀 없음). 툴팁 `tokenPx` 가 호출마다 DOM 생성 → 캐시.
18. 접근성: 글자 토글 버튼에 `aria-pressed` 없음, 썸네일 선택 상태 aria 없음.
19. `@media (max-width: 899px)` 분기가 있으나 SPEC 은 데스크탑 전용 — 지울지 결정.

## D. 사양 결정 필요 (코드가 가이드와 다르게 "의도적으로" 간 곳)
20. **심볼 크기 구간** — 코드 4-15 최적 · 15-25 권장 초과 · 25 초과 비추천. 가이드 Symbol › Scalability 222행은 최적 8-20mm(40-100px), 권장 최대 15mm 는 Signature 쪽 문장. SPEC 이 "권장 최대 15mm 를 우선" 이라 적었지만 심볼 페이지 본문과 다름. 가이드를 고치거나 코드를 가이드에 맞추거나.
21. **세로형 조판 58.8/125H(0.4704H)** vs 가이드 "0.46H" — SPEC 은 "반올림 표기" 라고 하나 0.47 이 맞는 반올림. 가이드를 0.47H 로 고치든지 코드를 0.46 으로.
22. **목업 10% 면적 알림** — 메모리엔 "매체 높이 10% 같은 비율을 가이드 근거라고 말하지 말 것" 인데 `ART_AREA_MAX 0.10` 알림 "Larger than the guide suggests" 가 남아 있음(근거는 Symbol › Usage 5-10% 라 다른 규칙이긴 함). 문구 유지 여부.
23. 핸드오프 형태 — 단일 HTML 유지(장점: 열기만 하면 됨) vs Astro 사이트 안 `/tools/` 페이지(장점: 토큰 · 폰트 · 링크 공유, 빌드로 번들). 2부(클라이언트 입력 기능) 방향과 묶어 결정.

## 제안 순서
1차(즉시, 30분): A1 · A2 수정, A3 · A4 값 확정 후 코드 · 가이드 · 장표 동시 반영.
2차(핸드오프 준비): B5 git 편입 → B10 회귀 테스트 → B6 의존 고정 → B7 · B9.
3차(정리): C 항목 + D 결정.
