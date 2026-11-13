# EO 브랜드 가이드라인 — 핸드오프 안내

EO 리브랜딩의 웹 브랜드 가이드라인과 로고 생성기입니다. 이 문서는 사람이 처음 받아 볼 때 읽는 한 장짜리 안내이고, 자세한 편집 방법은 [file-management.md](file-management.md), AI(Claude Code 등)에게 작업을 맡길 때의 체계적인 안내는 [handoff-ai.md](handoff-ai.md)에 있습니다.

## 1. 열어 보기
1. 저장소를 받고 `public/fonts/` 에 Founders Grotesk 파일 5개를 넣습니다(목록은 [public/fonts/README.md](../public/fonts/README.md)).
2. `npm install` → `npm run fonts:ko`(한글 서체, 처음 한 번).
3. `npm run dev` → 브라우저에서 http://localhost:4321
4. 배포용 정적 사이트: `npm run build` → `dist/` 폴더. 배포 전에 `npm run preview` 로 한 번 확인하세요(빌드에서만 이미지가 가벼운 사본으로 바뀝니다).

## 2. 무엇을 어디서 고치나
| 바꾸고 싶은 것 | 파일 |
|---|---|
| 글 · 이미지 배치 | `content/guide.ko.md`(국문, 기준) · `content/guide.en.md`(영문). 국문을 고치면 영문도 같이 |
| 이미지(장표) | `public/assets/<챕터>/<페이지>/` — 파일 이름이 md 의 `![이름]` 과 같아야 함. 내보낸 장표는 `npm run import -- <페이지>` 로 넣기 |
| 간격 · 글자 크기 · 색 · 모션 | `src/styles/tokens.css` 만 |
| 로고 생성기 디자인 | `public/tools/logo-generator/tokens.css` 만 |

고친 뒤 `npm test` 가 "모두 통과"면 안전합니다.

## 3. 꼭 지킬 것
- **서체 파일은 절대 저장소 · 공개 서버에 올리지 않습니다.** Founders Grotesk 는 유료 라이선스입니다. 저장소가 자동으로 막아 두었지만(커밋 · 푸시 검사), 배포할 때도 서체 파일이 공개 주소로 노출되지 않게 해 주세요.
- 브랜드 컬러 7색 · 심볼 지오메트리(`public/tools/logo-generator/geom.js`)는 확정값입니다. 바꾸지 않습니다.
- `public/archive/handoff/` 는 핸드오프 시점의 기록이라 손으로 고치지 않습니다.

## 4. 핸드오프 아카이브와 이스터에그 `designisgood`
최종 핸드오프 시점의 가이드를 사이트 안에 그대로 고정해 두었습니다.
- 가이드 **검색창에 `designisgood`** 을 입력하면, 보고 있던 페이지의 **핸드오프 당시 버전**으로 이동합니다. 아카이브 안에서 다시 입력하면 현재 가이드로 돌아옵니다. 아카이브에서는 목차 아래에 아카이브 표시와 "현재 가이드" 링크가 보입니다.
- 가이드가 앞으로 계속 바뀌어도, 처음 넘겨받은 기준이 무엇이었는지 언제든 확인할 수 있게 하려는 장치입니다(클라이언트 동의).
- 로고 생성기와 서체는 아카이브에서도 현재 것을 씁니다.
- 만드는 법(핸드오프 날 한 번): `git tag handoff-final` → `npm run archive` → 생긴 `public/archive/handoff/` 를 커밋. 아카이브를 만들기 전에는 `designisgood` 을 입력해도 아무 일도 일어나지 않습니다.

## 5. 로고 생성기
가이드 목차 **Logo › Download** 에서 새 탭으로 열립니다. 보이는 크기(500mm 거리 환산 높이)를 정하면 그 크기에 맞춰 광학 보정된 심볼 · 시그니처를 만들고 SVG · PNG · PDF(인쇄용 CMYK)로 저장합니다. 사양은 [docs/logo-generator/SPEC.md](logo-generator/SPEC.md).

## 6. 더 알아보기
- 편집 튜토리얼: [docs/file-management.md](file-management.md)
- 용어(챕터 › 페이지 › 섹션, 레이아웃 이름): [CLAUDE.md](../CLAUDE.md) 의 "용어"
- AI 에게 맡길 때: [docs/handoff-ai.md](handoff-ai.md)
