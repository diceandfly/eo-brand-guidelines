/**
 * 파서(guide.ts)와 컴포넌트가 함께 쓰는 작은 UI 마크업 — 한 벌만 둡니다.
 * 순수 함수(문자열만 만듦)라 Vite 없이 scripts 에서도, Astro 컴포넌트에서도(set:html) 씁니다.
 *
 * 호버 알약(.swatch__tip): 컬러 카드 값 · 본문 컬러 칩(Copy · Copied)과 참조 링크(Jump · Open · Mail)가 같은 부품.
 *   - 알약 글자는 CSS content(base.css)라 이 마크업 안에는 글자가 없습니다 → 드래그 복사 · 검색 색인(guide.ts stripTags)에 섞이지 않음.
 *     알약 안에 글자를 넣으면 검색 색인에 그 글자가 들어가니, 글자는 계속 CSS 로.
 *   - 복사 동작은 Layout.astro 공통 스크립트가 [data-copy] 버튼에 붙고 is-copied 클래스로 Copy → Copied 전환.
 */

export type TipKind = 'copy' | 'jump' | 'open' | 'mail';

/** 알약 글자 뒤 화살표: 문서 안 이동(jump)은 →, 밖으로 나가는 링크(open · mail)는 ↗. 둘 다 같은 상자(viewBox 가 선에 딱 맞음) */
const ARROWS = {
  jump: `<svg class="xref__arrow" viewBox="2.75 2.75 8.5 8.5" aria-hidden="true"><path d="M3.5 7h7M7 3.5 10.5 7 7 10.5"/></svg>`,
  out: `<svg class="xref__arrow" viewBox="2.75 2.75 8.5 8.5" aria-hidden="true"><path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9"/></svg>`,
};

const tipText = (k: string) => `<span class="swatch__tip-text swatch__tip-text--${k}"></span>`;

/** 호버 알약. copy = Copy/Copied 두 글자(복사 뒤 전환), 링크 = 글자 하나 + 화살표 */
export function tipHtml(kind: TipKind): string {
  const inner = kind === 'copy' ? tipText('copy') + tipText('done') : tipText(kind) + ARROWS[kind === 'jump' ? 'jump' : 'out'];
  return `<span class="swatch__tip t-label" aria-hidden="true">${inner}</span>`;
}
