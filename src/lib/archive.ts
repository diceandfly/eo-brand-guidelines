/**
 * 핸드오프 아카이브 — 최종 핸드오프 시점 가이드를 통째로 고정해 둔 사본 (npm run archive → public/archive/handoff/).
 *   · 검색창에 ARCHIVE_KEY 를 치면 아카이브의 같은 페이지로, 아카이브에서 다시 치면 현재 가이드로 (Search.astro)
 *   · 아카이브는 고치지 않습니다. 다시 만들 때만 npm run archive (이전 사본은 .trash/ 로)
 *   · 로고 생성기(/tools/…)와 서체(/fonts/…)는 고정하지 않고 현재 것을 같이 씀
 * 브라우저 스크립트도 이 파일을 가져가므로 Node 전용 코드를 넣지 말 것.
 */
export const ARCHIVE_BASE = '/archive/handoff';
export const ARCHIVE_KEY = 'designisgood';
/** 아카이브 빌드 때 scripts/archive.mjs 가 넘기는 환경 변수 (값 = 기준 날짜). 있으면 목차에 아카이브 표시 */
export const ARCHIVE_ENV = 'EO_ARCHIVE';
