# Handoff — AI 작업자용 체계 안내

이 저장소에서 작업하는 AI 에이전트(Claude Code 등)를 위한 문서입니다. 사람용 요약은 [HANDOFF.md](HANDOFF.md).
**먼저 [AGENTS.md](../AGENTS.md)** — 디자이너가 허용한 예외 목록(오류로 보고 · 수정 금지) · 절대 규칙 · 이스터에그.
**우선순위**: 저장소 루트 [CLAUDE.md](../CLAUDE.md)(규칙 · 용어 · 구조, 매 세션 자동 로드)가 정본이고, 이 문서는 그것을 작업 순서 · 불변식 · 검증 방법으로 다시 엮은 것입니다. 둘이 다르면 CLAUDE.md 를 따르고 이 문서를 고치세요.

---

## 0. 한 줄 요약
Astro 5 정적 사이트. 콘텐츠는 `content/guide.{ko,en}.md` 두 파일, 디자인 수치는 `src/styles/tokens.css` 한 파일, 레이아웃 CSS 는 토큰만 참조하는 `src/styles/base.css`. 빌드 없는 정적 도구로 로고 생성기(`public/tools/logo-generator/`)가 같이 들어 있음. 회귀 검사는 `npm test`.

## 1. 명령
| 명령 | 하는 일 | 언제 |
|---|---|---|
| `npm run dev` | 개발 서버 :4321 (원본 이미지) | 편집 중 |
| `npm test` | [1] md 파서 경고 0 · HTML 태그/따옴표 짝 · [2] 플레이스홀더 수 · [3] motion.ts 대체값 = 토큰 · [4] astro check · [5] 로고 생성기(지오메트리 · HEX/CMYK · 토큰 · RULES · 서체) · [6] 아카이브 경로 · [7] 프로젝트 규칙(raw HEX 0 · !important 0 · 정의 안 된 var() 0 · window.__ 0 · 모바일 경계 899/900) | 모든 변경 뒤 |
| `npm run build` | `dist/` + 이미지 사본(PNG → `.png.webp` 무손실, JPG → `.jpg.avif` q90 4:4:4) | 배포 · 확인 |
| `npm run preview` | 빌드 결과 서빙(사본 이미지가 쓰이는 화면) | 빌드 확인 |
| `npm run import -- <페이지> [폴더] [--dry]` | 내보낸 장표를 이름으로 찾아 제자리에 복사 | 장표 교체 |
| `npm run assets [-- --dry]` | 이미지 폴더 · 번호 정리(국문 구조 기준) | 섹션 순서 변경 뒤 |
| `npm run archive [-- <ref>]` | 태그 `handoff-final` 시점 가이드를 `public/archive/handoff/` 에 고정 | 최종 핸드오프 날 한 번 |
| `npm run fonts:ko` | Pretendard 서브셋 내려받기 | 새 클론 |

## 2. 구조 지도
```
content/guide.ko.md · guide.en.md   콘텐츠 정본(국문이 구조 기준). 문법 튜토리얼은 각 파일 상단 주석
public/assets/<NN-챕터>/<NN-페이지>/<NN>-<이름>.*   이미지. md 의 ![이름] 과 1:1 (앞 번호는 정렬용, 파서는 무시)
src/styles/tokens.css   모든 디자인 수치. A 시스템(타입 · 컬러 · 공통 치수 · 모션) + B 요소 블록
src/styles/base.css     토큰만 참조하는 레이아웃 CSS (숫자 · HEX 직접 금지 — [7] 이 검사)
src/lib/guide.ts        md 파서(순수 Node). 문법을 바꾸면 md 상단 튜토리얼도 같이
src/lib/content.ts      md · tokens.css 를 Vite 모듈로 읽고 빌드 동안 메모
src/lib/tokens.ts       tokens.css 파서 · 시간 해석 · 휘도 · 모바일 경계 MOBILE_MAX(=899)
src/lib/ui-markup.ts    파서와 컴포넌트가 함께 쓰는 마크업(호버 알약 tipHtml)
src/lib/motion.ts       GSAP: 스무스 스크롤 · 앵커 이동 · 스크롤스파이 · 페이지 전환 · 라이트박스
src/lib/imageTone.ts    빌드 때 이미지 가장자리 밝기 측정(호버 테두리 · 라이트박스 배경)
src/lib/archive.ts      아카이브 경로 · 이스터에그 키(designisgood)
src/components/         Section · Figure · Swatch · SwatchVal · Sidebar · Search · Logo
scripts/                test · assets · import · archive · typo-chart(내부 장표 도구) · lib/(check-rules · optimize-images · logo-generator-check …)
public/tools/logo-generator/   로고 생성기(index.html · fonts.css · tokens.css · tool.css · geom.js · app.js · sig-font.js · vendor/)
public/archive/handoff/        핸드오프 아카이브(생성물, 손대지 않음)
docs/                   file-management.md(사람용 튜토리얼) · logo-generator/SPEC.md · DEBT.md · tech-debt-plan.md · terms.md
```

## 3. 불변식 (어기면 안 되는 것)
1. **서체 라이선스** — Founders Grotesk 파일(woff/woff2/otf/ttf/eot)과 `dist/` 는 커밋 · 푸시 · 업로드 · 공개 페이지 노출 금지. `.gitignore` + `.githooks/pre-commit` · `pre-push` 가 막음. 우회하지 말 것. 공개물은 아웃라인 이미지만.
2. **팔레트 7색**(`--c-*`)은 확정. UI 는 시맨틱 토큰만 참조, 중간 톤은 `color-mix()`. 배지 색은 UI 전용.
3. **타이포 5레벨 고정**(display / heading / body / ui / label). 레벨 추가 금지. 행간이 기준 단위(`--lh-unit`), 글자 크기는 계산값. 허용된 파생 배율은 CLAUDE.md 에 열거된 것뿐.
4. **디자인 수치는 tokens.css 에만.** 새 토큰은 사이트 전체 의미면 A, 아니면 해당 요소 B 블록에. base.css 는 토큰 참조만.
5. **국문이 최종본.** 국문 문장은 임의로 다듬지 말고 어색하면 사람에게 검토 요청. 국문을 바꾸면 영문도 같은 커밋에서 맞춤(용어표 docs/terms.md).
6. **장표(이미지)는 사람이 사전 승인한 파일만** 교체 · 수정 · 재생성. "교체해 줘"는 보통 사람이 폴더에 둔 파일을 `npm run import` 하라는 뜻.
7. **로고 생성기 `geom.js` 의 확정 지오메트리**와 `app.js` RULES 블록 수치는 `npm test` [5] 가 고정. 바꾸려면 사람의 결정이 먼저.
8. **아카이브(`public/archive/handoff/`)는 손으로 고치지 않음.** 다시 만들 때만 `npm run archive`.
9. **모바일 경계**는 `src/lib/tokens.ts` `MOBILE_MAX`. CSS `@media` 숫자는 [7] 이 대조.
10. **모듈 간 통신은 문서 이벤트**(`eo:nav` · `eo:scroll-ready`). `window.__` 전역 금지([7]).

## 4. 자주 하는 작업
- **글 수정**: `content/guide.ko.md` → 같은 위치 `guide.en.md` → `npm test`. 참조 링크는 `[[page#section|라벨]]`, 컬러 이름(Builder Neon 등 대소문자 고정)은 파서가 칩을 붙임.
- **섹션 추가**: 헤드 `### Head`(선택 `#### Subhead`), 레이아웃 플래그 `{layout=wide|half|grid-N|text-N}`, 목차 노출은 `### + Head`(헤드 앞에 `+` 하나. 한 페이지에 `+` 가 하나도 없으면 전부 자동으로 오름), 서브헤드를 목차 하위 목록으로 묶으려면 `### + Head {toc=group}`. 이미지 토큰 `![이름]` 을 쓰고 파일을 넣거나 플레이스홀더로 둠. 끝나면 `npm run assets -- --dry` 로 번호 확인.
- **장표 교체**: 사람이 둔 폴더 확인 → 파일 이름이 대상 이름과 맞는지 → `npm run import -- <페이지> <폴더> --dry` → 실행 → `npm test` → 커밋. 덮어쓴 원본은 `.trash/` 로 감.
- **디자인 튜닝**: tokens.css 값만. 모션 토큰을 바꾸면 motion.ts 의 대체값도 같게([3]).
- **로고 생성기**: 디자인은 생성기 `tokens.css`, 규칙은 `app.js` RULES, 사양 `docs/logo-generator/SPEC.md`.

## 5. 핸드오프 아카이브 · 이스터에그
- 사용: 검색창에 `designisgood`(`src/lib/archive.ts` `ARCHIVE_KEY`) → 지금 페이지의 `/archive/handoff/…` 로 이동, 아카이브에서 다시 치면 현재 가이드로(Search.astro). 아카이브 빌드에는 환경 변수 `EO_ARCHIVE=<날짜>` 가 들어가 목차에 표시 + "현재 가이드" 링크(`data-archive-exit`).
- 생성: `git tag handoff-final` → `npm run archive` → `public/archive/handoff/` 커밋. scripts/archive.mjs 가 태그를 임시 worktree 로 빌드 → fonts · tools 제외 → 경로를 `/archive/handoff/…` 로 재작성 → `archive.json`(ref · 커밋 · 날짜) 기록. [6] 이 경로 누수 · 서체 포함 여부 검사.
- 아카이브가 없으면 이스터에그는 아무 일도 하지 않음. 로고 생성기와 서체는 아카이브에서도 현재 것을 공유.

## 6. 런타임 주의점 (실제로 겪은 함정)
- **행간 비율 토큰(`--t-*-p`)은 숫자(1.4 = 140%)로.** % 로 적고 CSS 에서 `tan(atan2(p, 1%))` 로 숫자로 바꾸던 방식은 아이폰(크롬 포함, 모두 웹킷)에서 본문 0px · 타이틀 300px 대로 깨졌음(데스크탑 크롬의 모바일 흉내로는 안 보임). [7] 이 % 토큰 · atan2 를 막음. 모바일 확인은 실기기(`npm run dev -- --host` → 같은 와이파이에서 맥 IP:포트).
- **터치 전용 기기는 스무스 스크롤 없음**(motion.ts `touchOnly`, 브라우저 기본 관성 스크롤). ScrollSmoother 는 터치에서 smoothTouch 0 이면 네이티브 모드로 만들어지는데, 거기에 `smooth()` 로 값을 올리면 끊김이 생김.
- **ScrollSmoother 를 smooth 0 으로 만들지 말 것.** 래퍼 고정 · transform · 스크럽 트윈이 안 만들어져 나중에 `smooth()` 로 올려도 네이티브 스크롤과 겹침(덜 부드러움 + 페이지 끝 빈 공간). 시작 단계용으로는 `STARTUP_SMOOTH = 0.01`(motion.ts 1).
- **GSAP 시작 단계(0.5초)는 바로 끝냄.** ScrollTrigger · ScrollSmoother 는 만들어진 뒤 `gsap.delayedCall(0.5)` 동안 스크럽을 건너뛰어 스크롤이 부드럽지 않게 점프하고, 이 0.5초는 GSAP 시계라 무거운 첫 로드에선 더 길어짐("로드 직후 스무스 스크롤이 풀림"). motion.ts `endGsapStartup` 이 첫 refresh 직후 전역 타임라인에서 그 타이머(지연 0.5 · 길이 0)를 찾아 바로 실행 — GSAP 내부 구현 의존이라 gsap 을 올리면 로드 직후 첫 휠이 부드러운지 다시 확인(못 찾으면 `--scroll-guard-hold` 폴백).
- **섹션 이동 뒤 본문 위치 맞춤(`syncSmoother`).** 이동 트윈은 스무더를 paused 로 두고 scrollTop 을 직접 옮기는데, ScrollSmoother 는 paused 동안 본문 transform 을 다음 스크롤 갱신 때 그려서 마지막 프레임이 안 그려짐. 프레임이 밀리면(빌드본, 이미지 디코딩이 겹칠 때) 섹션보다 수십~수백 px 위에서 멈춤 — 개발 서버에서는 안 보이고 `npm run preview` 에서만 재현(2026-11-14). 트윈 종료 · 즉시 이동 뒤 `syncSmoother()` 를 지우지 말 것. 점검: preview 에서 다른 페이지의 `#섹션` 링크를 눌러 도착 위치가 `--anchor-offset`(56px)인지.
- **#섹션 으로 들어온 페이지**는 스크롤 가드를 `--scroll-guard-hold` 동안 유지(기본 앵커 이동과 도착 트윈이 겹치지 않게).
- **이미지 사본은 빌드에만.** Figure 는 `import.meta.env.PROD` 에서만 `<picture>`. 개발 서버 화면 ≠ 빌드 화면(이미지 파일만 다름) → 확인은 `npm run preview`. 선택자는 `.fig__frame img`(picture 가 끼므로 `> img` 쓰지 말 것), `.fig__frame picture { display: contents }`.
- **폰트 대기.** 웹폰트는 `font-display: block`. 본문 page-in 은 `html.fonts-wait` 동안 첫 장면(투명)에서 멈춤 — Layout.astro 인라인 스크립트가 DOMContentLoaded → 두 프레임 → `document.fonts.ready` 또는 `--page-in-font-wait`(1000ms) 뒤 해제. dev · preview 서버는 `/fonts/*` 가 no-cache(매 페이지 재검증)라 폰에서 대기가 보일 수 있음 — 배포 서버는 긴 캐시.
- **헤드리스/숨김 브라우저에서는 rAF · ResizeObserver 가 멈춤.** 스크롤 · 애니메이션 · 라이트박스 열림 상태를 측정할 때 값이 고정돼 보이면 환경 탓을 먼저 의심하고 보이는 실제 브라우저 창에서 확인.
- **런타임 회귀 점검 고정 항목**: 로드 뒤 `#smooth-wrapper` 가 position fixed, 로드 2초 뒤 끝까지 스크롤해 `.next` 아래 0–200px(데스크탑 · 500px 리사이즈), 콘솔 오류 0.

## 7. 검증 방법(변경 종류별)
| 변경 | 최소 검증 |
|---|---|
| md 글 | `npm test` |
| tokens.css · base.css | `npm test` + 브라우저(데스크탑 · 375px) |
| 출력이 그대로여야 하는 리팩터 | 바꾸기 전 · 후 `npm run build` 결과 HTML 비교(스크립트 · 주석 · 해시를 정규화하면 차이 0), search-index JSON 동일 |
| motion.ts | 위 6절 고정 항목 + 앵커 도착 · 드로어 · Cmd+F · 라이트박스 |
| 이미지 · 빌드 | `npm run build` 로그 "이미지 사본 N장" · preview 에서 깨진 이미지 0 |
| 로고 생성기 | `npm test` [5] + 생성기 화면 |

## 8. 결정 기록 · 남은 것
- 기술부채 정리 이력과 근거: [docs/tech-debt-plan.md](tech-debt-plan.md)(TD-1~7, 하지 않기로 한 것 포함 — SPA 전환은 불필요로 결론, ESLint/Prettier 대신 [7] 규칙 검사).
- 로고 생성기 사양 · 부채: [docs/logo-generator/SPEC.md](logo-generator/SPEC.md) · [DEBT.md](logo-generator/DEBT.md).
- 사람 결정 대기로 남겨 둔 것: 디스크립터에 "EO" 포함 여부(guide.ko.md 주석) — 인하우스 결정 전까지 장표 · 캡션 표기 차이는 고치지 않음.
