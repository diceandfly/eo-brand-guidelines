/**
 * content/guide.<lang>.md (en, ko) 를 파싱해 챕터 > 페이지 > 섹션 트리를 만듭니다.
 * 빌드(또는 dev 서버) 시점에 Node 에서만 실행됩니다.
 *
 * 문법은 content/guide.ko.md 상단 튜토리얼 주석을 참고하세요 (국문이 최종 기준).
 */
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { tokenHex, type Tokens } from './tokens.ts';

export type Layout = 'basic' | 'text' | 'wide' | 'half' | 'grid-2' | 'grid-3' | 'grid-4' | 'text-2' | 'text-3' | 'text-4';   // text-N: 본문 문단을 N단으로 (데스크탑)

export interface ImageItem {
  kind: 'image';
  token: string;          // guide.<lang>.md 에 쓴 그대로. 예: clearspace (예전 형식 logo/clearspace 도 허용)
  name: string;           // 파일 이름(확장자 제외). 토큰의 마지막 / 뒤. 페이지 폴더 안에서 이 이름으로 찾음
  path: string;           // 넣을 자리: 02-logo/01-symbol/04-clearspace (확장자 제외, 플레이스홀더에 표시. 앞 번호 = 주제 순서)
  src: string | null;     // 파일이 있으면 /assets/… 경로, 없으면 null(플레이스홀더)
  badge?: 'do' | 'dont' | 'con';   // 캡션 앞 아이콘: 체크 / 엑스 / 삼각형(conditional, 조건부)
  strike?: boolean;       // Don't 대각선. {dont} 이면 자동, {dont nostrike} 면 끔
  zoom?: number;          // 카드 안 배율. {zoom=1.2} 로 직접 지정, {nozoom} 이면 1 (Do/Don't 그리드 기본 배율도 끔)
  bg?: string | true;     // 확대 보기 배경: {bg-color} = 거울 확장 대신 가장자리 색(빌드 때 측정)으로 채움(true), {bg-color=#2A2B2B} · {bg-color=solid-gray} = 그 색 (CSS 색 문자열)
  cover?: boolean;        // 확대 보기 {bg-cover}: 이미지를 화면에 꽉 채움 (object-fit: cover, 넘치는 쪽은 잘림). 거울 확장 · 배경색 없음. 모바일은 기본 보기
  caption?: string;       // HTML. 한글 구간은 <span class="ko"> 로 래핑됨
}
export interface SwatchItem {
  kind: 'swatch';
  name: string;
  hex: string;
  rows: SwatchRow[];      // 컬러 카드의 스펙 행 (Pantone → CMYK → RGB → HEX → 그 밖). values 하나하나가 복사 단위
}
export interface SwatchRow { label: string; values: string[]; note?: string; }
export type Item = ImageItem | SwatchItem;

export interface Section {
  id: string;             // 앵커 id (목차 라벨 기준: 헤드, 헤드가 페이지 이름과 같으면 서브헤드. 중복 시 -2, -3…)
  label: string;          // 목차 라벨 = 이미지 주제 이름 (헤드. 헤드가 페이지 이름과 같거나 + 가 서브헤드 줄에 있으면 서브헤드)
  crumb: string[];        // 참조 링크 글자 [헤드, 서브헤드] 또는 [라벨] — 헤드가 페이지 이름과 다르고 서브헤드가 있으면 둘 다 (flushSection 에서 확정)
  split?: number;           // ::: split … ::: 로 묶인 섹션: 같은 번호끼리 한 12컬럼 행에 나란히 (sectionBlocks)
  span?: number;          // 행 안에서 차지하는 그리드 컬럼 수 {span=N}. 생략하면 남은 컬럼을 균등 분배 (loadGuide 끝에서 확정)
  head: string;
  subhead?: string;
  bodyHtml: string;
  layout: Layout;
  ratio?: string;         // "5 / 4" 형식. 없으면 레이아웃 기본 토큰 사용
  zoom?: number;          // 섹션 안 이미지 전체의 카드 배율 {zoom=1.5}. 이미지별 {zoom=…}/{nozoom} 이 우선
  items: Item[];
  tocMark: boolean;       // ### + 로 목차에 올리라고 표시한 섹션
  markOnSubhead?: boolean; // + 가 서브헤드 줄(#### + …)에 있었음 → 목차 라벨은 서브헤드
}
export interface SubRef { url: string; name: string; chapterNum: string; chapterName: string; }
export interface Sub {
  name: string;
  slug: string;
  url: string;
  chapterNum: string;
  chapterName: string;
  chapterSlug: string;
  sections: Section[];
  navSections: { id: string; head: string; key: string }[];   // 목차에 오르는 섹션 (key = 중복 판정용: 라벨, 서브헤드 라벨은 "헤드 / 서브헤드"). ### + 표시가 하나라도 있으면 표시된 것만, 없으면 전부(자동)
  tocSections: boolean;   // false 면 목차에서 섹션 목록을 펼치지 않음 (## 이름 {toc=none})
  prev?: SubRef;
  next?: SubRef;
}
export interface Chapter {
  num: string;
  name: string;
  slug: string;           // 예: 02-logo
  subs: Sub[];
}
export interface Guide { lang: Lang; chapters: Chapter[]; }

const ROOT = process.cwd();
/** 언어. 두 언어가 한 사이트에 같이 빌드되며 URL 은 /en/… , /ko/… 로 나뉩니다. */
export const LANGS = ['en', 'ko'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
export const LANG_LABEL: Record<Lang, string> = { en: 'EN', ko: 'KR' };   // 목차 하단 전환 버튼 표기
/** 화면낭독기용 문구 (aria-label · 상태 알림). 화면에 보이는 UI 글자(Search, No results 등)는 디자인상 영문 그대로 */
export const UI_TEXT = {
  en: { toc: 'Table of contents', openToc: 'Open table of contents', language: 'Language', search: 'Search the guidelines', clear: 'Clear search', results: 'Search results', found: (n: number) => (n ? `${n} results` : 'No results'), lightbox: 'Image viewer', copy: 'Copy', do: 'Do', dont: "Don't", con: 'Conditional' },
  ko: { toc: '목차', openToc: '목차 열기', language: '언어', search: '가이드라인 검색', clear: '검색어 지우기', results: '검색 결과', found: (n: number) => (n ? `결과 ${n}개` : '결과 없음'), lightbox: '이미지 확대 보기', copy: '복사', do: 'Do', dont: "Don't", con: 'Conditional' },
} satisfies Record<Lang, Record<string, unknown>>;
/** 페이지 경로(/ko/…, /en/…)로 언어 판별. 언어 정보가 props 로 오지 않는 컴포넌트용 */
export const langFromPath = (path: string): Lang => (LANGS as readonly string[]).includes(path.split('/')[1]) ? (path.split('/')[1] as Lang) : DEFAULT_LANG;
/**
 * 콘텐츠(md)와 tokens.css 는 호출자가 읽어 넘깁니다: 사이트는 src/lib/content.ts(Vite 모듈 → dev 서버가 의존성 추적),
 * scripts/*.mjs 는 fs. 그래서 이 파서는 Vite 없이도 Node 에서 바로 돌아갑니다.
 */
const ASSETS = path.join(ROOT, 'public', 'assets');
export const EXTS = ['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'];   // 이미지 확장자 (우선순위 순). scripts/*.mjs 도 공유

const GRID_COLS = 12;   // 본문 그리드 컬럼 수 (tokens.css --cols 와 같음). {span} 의 상한

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

/**
 * 이미지 파일 규칙: public/assets/<챕터>/<페이지>/<주제 번호>-<이름>.<확장자>
 *   예: 02-logo/01-symbol/04-clearspace.png  (주제 = 목차 항목, 번호 = 페이지 안 주제 순서)
 * 폴더와 파일명 앞 번호는 탐색기에서 페이지 순서대로 정렬되게 하는 용도라 파서는 무시합니다(번호를 떼고 이름으로 비교).
 * 이미지는 그 페이지 폴더 안에서 파일 이름으로 찾습니다. 그래서 섹션 순서를 바꿔 번호가 달라져도,
 * 영문·국문 구조가 잠시 달라도 이미지가 끊기지 않습니다. 번호를 지금 순서에 맞추려면 npm run assets (scripts/assets.mjs).
 */
const stripNum = (dir: string) => dir.replace(/^\d+-/, '');
export const stripFileNum = (name: string) => name.replace(/^\d{2}-/, '');   // 파일명 앞 두 자리 정렬 번호 (예: 04-clearspace → clearspace)
const pad2 = (n: number) => String(n).padStart(2, '0');

/** 페이지 폴더 안의 이미지 목록: 이름(확장자 제외) → assets 기준 경로들 */
function subAssetIndex(chapterSlug: string, chapterName: string, subSlug: string): Map<string, string[]> {
  const index = new Map<string, string[]>();
  const findDir = (parent: string, ...slugs: string[]) => {
    if (!fs.existsSync(parent)) return null;
    const hit = fs.readdirSync(parent, { withFileTypes: true })
      .find(d => d.isDirectory() && (slugs.includes(d.name) || slugs.includes(stripNum(d.name))));
    return hit ? hit.name : null;
  };
  const chDir = findDir(ASSETS, chapterSlug, slugify(chapterName));
  if (!chDir) return index;
  const subDir = findDir(path.join(ASSETS, chDir), subSlug);
  if (!subDir) return index;
  const walk = (rel: string) => {
    for (const d of fs.readdirSync(path.join(ASSETS, rel), { withFileTypes: true })) {
      const r = `${rel}/${d.name}`;
      if (d.isDirectory()) { walk(r); continue; }
      const m = d.name.match(/^(.+)\.([a-z0-9]+)$/i);
      if (!m || !EXTS.includes(m[2].toLowerCase())) continue;
      const key = stripFileNum(m[1]);
      index.set(key, [...(index.get(key) ?? []), r]);
    }
  };
  walk(`${chDir}/${subDir}`);
  return index;
}

function resolveAsset(item: ImageItem, index: Map<string, string[]>): string | null {
  const noExt = (r: string) => r.replace(/\.[^./]+$/, '');
  const rank = (r: string) => `${noExt(r) === item.path ? 0 : 1}\0${EXTS.indexOf(r.split('.').pop()!.toLowerCase())}`;   // 제자리 우선, 같으면 svg → png …
  const hits = (index.get(item.name) ?? []).sort((a, b) => rank(a).localeCompare(rank(b)));
  return hits[0] ? `/assets/${hits[0]}` : null;
}

/** 줄 끝의 {…} 속성을 떼어 냅니다. {layout=grid-3} {zoom=1.6} 처럼 여러 개로 나눠 써도 모두 합칩니다. */
function takeAttrs(text: string): [string, Record<string, string>] {
  const groups: string[] = [];
  let m: RegExpMatchArray | null;
  while ((m = text.match(/\{([^}]*)\}\s*$/))) { groups.unshift(m[1]); text = text.slice(0, m.index).trimEnd(); }
  return [text.trim(), parseAttrs(groups.join(' '))];
}

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of raw.matchAll(/(\w+)\s*=\s*([^\s}]+)/g)) out[m[1]] = m[2];
  return out;
}

function normalizeRatio(r?: string): string | undefined {
  if (!r) return undefined;
  const m = r.match(/^(\d+(?:\.\d+)?)[:/](\d+(?:\.\d+)?)$/);
  return m ? `${m[1]} / ${m[2]}` : undefined;
}

function pickLayout(explicit: string | undefined, items: Item[]): Layout {
  const allowed: Layout[] = ['basic', 'text', 'wide', 'half', 'grid-2', 'grid-3', 'grid-4', 'text-2', 'text-3', 'text-4'];
  if (explicit && (allowed as string[]).includes(explicit)) return explicit as Layout;
  const n = items.length;
  if (n === 0) return 'text';
  if (n === 1) return 'basic';
  if (n === 2) return 'grid-2';
  if (n % 3 === 0) return 'grid-3';
  return 'grid-4';
}

/**
 * 한글 구간을 <span class="ko"> 로 감쌉니다. 한글로 시작하고 끝나는 최대 구간이며,
 * 사이의 공백과 문장부호(. , · : ; ! ? 따옴표 괄호)는 구간에 포함되고 라틴 문자·숫자에서 끊깁니다.
 * CSS 의 .t-body .ko 가 한글만 따로 크기·자간·웨이트·베이스라인을 보정합니다.
 */
const KO_RUN = /[가-힣ㄱ-ㅎㅏ-ㅣ](?:[가-힣ㄱ-ㅎㅏ-ㅣ\s.,·:;!?'"‘’“”()~…]*[가-힣ㄱ-ㅎㅏ-ㅣ.,·:;!?’”)…])?/g;
function wrapKo(html: string): string {
  return mapText(html, seg => seg.replace(KO_RUN, m => `<span class="ko">${m}</span>`));
}

/** HTML 의 텍스트 세그먼트에만 fn 을 적용 (태그는 그대로). skipInside 면 <code>·<pre>·<a> 안은 건너뜀 (코드는 글자 그대로, 링크 안에는 버튼을 넣지 않음) */
function mapText(html: string, fn: (seg: string) => string, skipInside = false): string {
  let depth = 0;
  return html.split(/(<[^>]+>)/).map(seg => {
    if (seg.startsWith('<')) {
      if (skipInside) {
        if (/^<(code|pre|a)\b/i.test(seg)) depth++;
        else if (/^<\/(code|pre|a)>/i.test(seg)) depth = Math.max(0, depth - 1);
      }
      return seg;
    }
    return depth || !seg ? seg : fn(seg);
  }).join('');
}

/**
 * 곧은 따옴표를 둥근 따옴표로 (표시용). guide.<lang>.md 에는 " 와 ' 로 쓰고, 화면에는 “ ” ‘ ’ 로 나옵니다.
 * 앞 글자가 공백·줄 시작·여는 괄호면 여는 따옴표, 아니면 닫는 따옴표. 글자 사이의 ' 는 아포스트로피(’).
 * 태그 안(속성)과 <code>·<pre> 안은 건드리지 않습니다. 이미 둥근 따옴표로 쓴 글자는 그대로 둡니다.
 * 나열의 " · " 와 짝 표기의 " / " 는 앞 공백을 줄바꿈 없는 공백으로 바꿔, 줄이 기호로 시작하지 않게 합니다 (기호는 앞 단어에 붙고 뒤에서만 줄바꿈).
 */
const OPENS_AFTER = /[\s([{\u2014\u2013\-/“‘]/;
const LETTER = /[\p{L}\p{N}]/u;
function smartQuotes(html: string): string {
  let prev = ' ';
  let code = 0;
  return html.split(/(<[^>]+>)/).map(seg => {
    if (seg.startsWith('<')) {
      if (/^<(code|pre)\b/i.test(seg)) code++;
      else if (/^<\/(code|pre)>/i.test(seg)) code = Math.max(0, code - 1);
      if (/^<\/?(p|li|ul|ol|h\d|div|blockquote|br|td|th|tr)\b/i.test(seg)) prev = ' ';   // 블록 경계 = 줄 시작
      return seg;
    }
    if (code) { if (seg) prev = seg.at(-1)!; return seg; }
    const text = seg.replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'");
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') out += OPENS_AFTER.test(prev) ? '“' : '”';
      else if (c === "'") {
        const next = text[i + 1] ?? '';
        out += LETTER.test(prev) && LETTER.test(next) ? '’' : OPENS_AFTER.test(prev) ? '‘' : '’';
      } else out += c;
      prev = c;
    }
    return out.replace(/ ([·/]) /g, '\u00A0$1 ');
  }).join('');
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * 본문·캡션 속 브랜드 컬러의 영문 공식 명칭 앞에 색 칩을 붙입니다 (base.css .cref). 이름은 7색 고정이며 대소문자까지 같아야 합니다.
 * [Builder Neon] 처럼 대괄호로 감싸면 이름 없이 칩만 보입니다 (이름은 스크린 리더·검색용으로만 남고, 칩에 마우스를 올리면 툴팁).
 * 칩 색은 tokens.css 의 --c-<이름 소문자-하이픈> 이라 팔레트 값이 바뀌면 같이 바뀝니다. 태그 안(속성)과 <code>·<pre> 안은 건드리지 않습니다.
 */
const COLOR_NAMES = ['Builder Neon', 'Day Blue', 'Bay Green', 'Medium Gray', 'Solid Gray', 'Space Black', 'Air White'];
const colorSlug = (name: string) => name.toLowerCase().replace(/ /g, '-');
/** 이름 → HEX (tokens.css 3. COLOR 의 --c-* 를 빌드 때 읽음). 칩을 누르면 이 값을 복사 */
const colorHexes = (tokens: Tokens): Record<string, string> =>
  Object.fromEntries(COLOR_NAMES.map(n => [n, tokenHex(tokens, `--c-${colorSlug(n)}`, '').toUpperCase()]));
/** 한 번의 파싱 동안 공유하는 것: 언어(UI 문구), 컬러 HEX */
interface Ctx { lang: Lang; hex: Record<string, string>; }
const COLOR_DARK = new Set(['Space Black', 'Solid Gray']);   // 어두운 칩: 테두리만 보여 작아 보이는 착시를 CSS(--cref-grow-*)로 색마다 보정
const NAMES = COLOR_NAMES.join('|');
const COLOR_RE = new RegExp(`(?<![\\w-])(?:\\[(\\+?)(${NAMES})\\]|(${NAMES}))(?![\\w-])`, 'g');   // [Name] · [+Name] · Name
/**
 * @param seen  섹션 안에서 이미 칩을 붙인 이름. 주면 "섹션 첫 언급에만 칩" 규칙(본문), 없으면 언급마다 칩(캡션).
 *              [Builder Neon] 은 칩만, [+Builder Neon] 은 칩 + 이름을 규칙과 무관하게 강제.
 */
function colorChips(html: string, ctx: Ctx, seen?: Set<string>): string {
  const ui = UI_TEXT[ctx.lang];
  return mapText(html, seg => seg.replace(COLOR_RE, (_m, plus: string | undefined, bracketName: string | undefined, plainName: string | undefined) => {
      const name = (bracketName ?? plainName)!;
      const slug = colorSlug(name);
      const bracket = bracketName !== undefined && !plus;             // [Name] → 칩만
      const forced = bracketName !== undefined && !!plus;             // [+Name] → 칩 + 이름 (첫 언급 규칙 무시)
      if (bracketName === undefined && seen) {                        // 본문: 섹션 안 첫 언급에만 칩, 이후는 글자만
        if (seen.has(name)) return name;
        seen.add(name);
      } else if (forced && seen) seen.add(name);
      // 칩 = 복사 버튼. 호버하면 컬러 카드의 값과 같은 Copy 알약이 뜨고, 누르면 HEX 를 복사 (Layout.astro 의 공통 스크립트)
      const hex = ctx.hex[name];
      const tip = `<span class="swatch__tip t-label" aria-hidden="true"><span class="swatch__tip-text swatch__tip-text--copy"></span><span class="swatch__tip-text swatch__tip-text--done"></span></span>`;   // 글자는 CSS content (드래그 복사에 섞이지 않게)
      const chip = `<button type="button" class="cref__btn swatch__val" data-copy="${hex}" aria-label="${ui.copy} ${name} ${hex}"${bracket ? ` title="${name} ${hex}"` : ''}><i class="cref__chip${COLOR_DARK.has(name) ? ` cref__chip--dark cref__chip--${slug}` : ''}" style="--cref:var(--c-${slug})"></i>${tip}</button>`;
      return bracket ? `<span class="cref cref--only">${chip}<span class="sr-only">${name}</span></span>` : `<span class="cref">${chip}${name}</span>`;
    }), true);
}

/**
 * 고아 단어(orphan) 방지 — 문단·리스트 항목·캡션의 마지막 두 단어 사이 공백을 줄바꿈 없는 공백(&nbsp;)으로 바꿉니다.
 * 마지막 줄에 단어 하나만 남는 일이 없어지고, 영문(단어)·한글(어절) 모두 공백 기준이라 같은 규칙이 통합니다.
 * CSS 의 text-wrap: pretty 가 되는 브라우저에서는 그쪽이 더 넓게 처리하고, 이건 그 폴백입니다. 빌드 시 1회라 런타임 비용 0.
 */
function glueLastWords(html: string): string {
  const segs = html.split(/(<[^>]+>)/);          // 태그 / 텍스트 교차
  let seenWordAfter = false;                     // 뒤쪽(문단 끝 쪽)에 단어가 있었는가
  for (let i = segs.length - 1; i >= 0; i--) {
    const seg = segs[i];
    if (!seg || seg.startsWith('<')) continue;
    if (!seenWordAfter) {
      const trimmed = seg.replace(/\s+$/, '');
      if (!trimmed) continue;
      // 이 세그먼트 안에 "단어 공백 단어" 가 있으면 마지막 공백을 교체
      const m = trimmed.match(/^([\s\S]*\S)(\s+)(\S+)$/);
      if (m) { segs[i] = `${m[1]} ${m[3]}${seg.slice(trimmed.length)}`; return segs.join(''); }
      seenWordAfter = true;                      // 단어 하나뿐 → 앞 세그먼트의 끝 공백을 교체 대상으로
      continue;
    }
    // 뒤에 단어가 있고, 이 세그먼트가 공백으로 끝나며 그 앞에 단어가 있으면 그 공백을 교체
    const m = seg.match(/^([\s\S]*\S)(\s+)$/);
    if (m) { segs[i] = `${m[1]} `; return segs.join(''); }
    if (/\S/.test(seg)) return html;             // 공백 없이 바로 이어짐 → 교체할 공백 없음
  }
  return html;
}
const glueBlocks = (html: string) =>
  html.replace(/(<(p|li)\b[^>]*>)([\s\S]*?)(<\/\2>)/g, (_m, open, _tag, inner, close) => open + glueLastWords(inner) + close);

function md(src: string, ctx: Ctx): string {
  const s = src.trim();
  return s ? glueBlocks(wrapKo(colorChips(smartQuotes(marked.parse(s, { async: false, gfm: true, breaks: false }) as string), ctx, new Set()))) : '';   // 칩은 섹션 첫 언급에만
}

/**
 * 참조 링크 [[…]] 는 마크다운 변환 전에 자리표시자로 바꿔 둡니다. marked 가 안의 URL 을 자동 링크로 바꾸거나
 * 라벨이 다른 패스(컬러 칩 등)에 걸리지 않게 하기 위해서이며, 모든 섹션을 읽어 앵커 id 가 정해진 뒤 resolveXrefs 가 복원합니다.
 */
const XREF_MARK = (i: number) => `%%XREF${i}%%`;
const stashXrefs = (text: string, store: string[]): string =>
  text.replace(/\[\[([^\]]*?)\]\]/g, (_m, inner: string) => { store.push(inner); return XREF_MARK(store.length - 1); });

/**
 * @param source    content/guide.<lang>.md 전문
 * @param tokens    tokens.css 를 parseTokens 한 것 (컬러 칩 HEX)
 */
export function loadGuide(lang: Lang, source: string, tokens: Tokens): Guide {
  const ctx: Ctx = { lang, hex: colorHexes(tokens) };
  const xrefs: string[] = [];                                   // [[…]] 원문. 자리표시자 번호 = 배열 index
  const raw = stashXrefs(source.replace(/<!--[\s\S]*?-->/g, ''), xrefs);
  const lines = raw.split(/\r?\n/);

  const chapters: Chapter[] = [];
  let chapter: Chapter | null = null;
  let sub: Sub | null = null;
  let section: Section | null = null;
  let body: string[] = [];
  let pendingLayout: string | undefined;                   // 헤드/서브헤드 줄의 {layout=…} (섹션을 다 읽은 뒤 pickLayout 에서 확정)
  let split: number | undefined;                             // 열린 ::: split 묶음 번호
  let splitSeq = 0;
  let idsInSub = new Map<string, number>();

  // 목차 앵커 라벨: 헤드가 페이지 이름과 같으면(예: Colors 페이지의 "Color") 서브헤드를 쓴다.
  // 같은 라벨은 한 번만 노출하고 첫 섹션으로 연결한다.
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '');
  const navLabel = (sec: Section, s: Sub) => {
    const pageLike = norm(sec.head) === norm(s.name) || norm(sec.head) === norm(s.chapterName);
    return (pageLike || sec.markOnSubhead) && sec.subhead ? sec.subhead : sec.head;   // + 를 서브헤드 줄에 붙이면 헤드가 페이지 이름과 달라도 서브헤드가 라벨
  };
  const pageLikeOf = (sec: Section, s: Sub) => norm(sec.head) === norm(s.name) || norm(sec.head) === norm(s.chapterName);

  const flushSection = () => {
    if (!section || !sub) return;
    // 앵커 id = 목차 라벨의 슬러그 (헤드가 페이지 이름과 같으면 서브헤드). 헤드가 페이지 이름과 다르고 서브헤드까지 있으면
    // "헤드-서브헤드" (morphology-proportion) 로 서브헤드까지 참조할 수 있게. 같은 페이지 안에서 겹치면 -2, -3 …
    // 섹션을 다 읽은 뒤에 정해야 서브헤드를 쓸 수 있으므로 여기서 확정
    section.label = navLabel(section, sub);
    section.crumb = section.subhead && !pageLikeOf(section, sub) ? [section.head, section.subhead] : [section.label];
    const base = section.subhead && section.label === section.head ? `${slugify(section.head)}-${slugify(section.subhead)}` : slugify(section.label);
    const count = (idsInSub.get(base) ?? 0) + 1;
    idsInSub.set(base, count);
    section.id = count === 1 ? base : `${base}-${count}`;
    section.bodyHtml = md(body.join('\n'), ctx);
    section.layout = pickLayout(pendingLayout, section.items);
    pendingLayout = undefined;
    if (!/^(grid|text)-/.test(section.layout) && section.layout !== 'wide' && section.items.length > 1)
      console.warn(`[guide] "${section.head}${section.subhead ? ' / ' + section.subhead : ''}" (${section.layout}) 섹션의 이미지 ${section.items.length}개 중 첫 번째만 표시됩니다. 모두 보이려면 {layout=grid-2|3|4} 또는 {layout=wide}`);
    sub.sections.push(section);
    section = null;
    body = [];
  };

  // 페이지의 목차 항목 확정: ### + 표시가 있으면 그것만, 없으면 전부. 같은 라벨은 첫 섹션 하나만.
  const finalizeNav = (s: Sub) => {
    const marked = s.sections.filter(sec => sec.tocMark);
    const pool = marked.length ? marked : s.sections;
    s.navSections = [];
    for (const sec of pool) {
      const label = sec.label;
      const key = sec.markOnSubhead && sec.subhead ? `${sec.head} / ${sec.subhead}` : label;   // 서브헤드 라벨은 헤드까지 묶어 비교 (다른 헤드 아래 같은 서브헤드는 따로)
      if (!s.navSections.some(n => n.key === key)) s.navSections.push({ id: sec.id, head: label, key });
    }
  };

  for (const line of lines) {
    let m: RegExpMatchArray | null;

    if (/^:::\s*split\s*$/.test(line)) {                             // ::: split  → 다음 섹션들을 한 12컬럼 행에 (::: 로 닫음). 폭은 섹션의 {span=N}
      flushSection();
      if (split !== undefined) console.warn(`[guide] ::: split: 앞의 ::: split 가 닫히지 않았습니다 (${sub?.url ?? ''}). 새 행으로 넘어갑니다`);
      split = ++splitSeq;
      continue;
    }
    if (/^:::\s*$/.test(line)) {                                   // :::  → 행 끝
      flushSection();
      split = undefined;
      continue;
    }
    if ((m = line.match(/^#\s+(\d+)\s+(.+?)\s*$/))) {              // # 02 Logo
      flushSection();
      split = undefined;
      chapter = { num: m[1], name: m[2], slug: `${m[1]}-${slugify(m[2])}`, subs: [] };
      chapters.push(chapter);
      sub = null;
      continue;
    }
    if ((m = line.match(/^##\s+(.+?)\s*$/)) && chapter) {           // ## Logo {toc=none}
      flushSection();
      split = undefined;
      const [name, attrs] = takeAttrs(m[1]);
      const slug = slugify(name);
      sub = {
        name, slug,
        url: `/${lang}/${chapter.slug}/${slug}`,
        chapterNum: chapter.num, chapterName: chapter.name, chapterSlug: chapter.slug,
        sections: [], navSections: [],
        tocSections: attrs.toc !== 'none'
      };
      chapter.subs.push(sub);
      idsInSub = new Map();
      continue;
    }
    if ((m = line.match(/^###(\+?)\s+(\+\s*)?(.+?)\s*$/)) && sub) { // ### Head {layout=…}  /  #### + Head (목차에 올림, ###+ Head 도 가능)
      flushSection();
      const tocMark = m[1] === '+' || !!m[2];
      const [head, attrs] = takeAttrs(smartQuotes(m[3]));
      section = {
        id: '', label: head, crumb: [head], head, bodyHtml: '', layout: 'basic',   // id 는 flushSection 에서 (서브헤드까지 읽은 뒤)
        ratio: normalizeRatio(attrs.ratio), items: [], tocMark, split,
        zoom: Number.isFinite(parseFloat(attrs.zoom)) ? parseFloat(attrs.zoom) : undefined
      };
      pendingLayout = attrs.layout;
      if (attrs.span !== undefined) {                                 // {span=N}: ::: split 안에서 차지하는 컬럼 수
        const n = parseInt(attrs.span, 10);
        if (split === undefined) console.warn(`[guide] "${head}": {span=${attrs.span}} 은 ::: split 안에서만 뜻이 있습니다 (${sub.url}). 무시합니다`);
        else if (!(n >= 1 && n <= GRID_COLS)) console.warn(`[guide] "${head}": {span=${attrs.span}} 은 1~${GRID_COLS} 사이여야 합니다 (${sub.url}). 무시합니다`);
        else section.span = n;
      }
      continue;
    }
    if ((m = line.match(/^####\s+(\+\s*)?(.+?)\s*$/)) && section) { // #### Subhead  /  #### + Subhead {layout=…}  (+ 와 {…} 는 헤드 줄과 동일하게 동작)
      const [subhead, attrs] = takeAttrs(smartQuotes(m[2]));
      if (m[1]) { section.tocMark = true; section.markOnSubhead = true; }
      if (attrs.layout) pendingLayout = attrs.layout;
      if (attrs.ratio) section.ratio = normalizeRatio(attrs.ratio);
      if (Number.isFinite(parseFloat(attrs.zoom))) section.zoom = parseFloat(attrs.zoom);
      section.subhead = subhead;
      continue;
    }
    if ((m = line.match(/^!\[([^\]]+)\]\s*((?:\{[^}]*\}\s*)*)(.*)$/)) && section) {   // ![token]{dont nostrike zoom=1.2} caption  (] 와 { 사이 공백 허용, {zoom=1.5} {dont} 처럼 묶음을 나눠 써도 모두 합침)
      const token = m[1].trim();
      const name = token.split('/').pop()!.trim();
      const item: ImageItem = { kind: 'image', token, name, path: '', src: null };   // path·src 는 페이지를 다 읽은 뒤 확정
      const flags = [...m[2].matchAll(/\{([^}]*)\}/g)].map(g => g[1]).join(' ').trim().split(/\s+/).filter(Boolean);
      if (flags.includes('do')) item.badge = 'do';
      if (flags.includes('dont')) item.badge = 'dont';
      if (flags.includes('con')) item.badge = 'con';                   // 조건부(conditional): 삼각형, 대각선 없음
      if (item.badge === 'dont' && !flags.includes('nostrike')) item.strike = true;
      const z = flags.find(f => f.startsWith('zoom='));
      if (z && Number.isFinite(parseFloat(z.slice(5)))) item.zoom = parseFloat(z.slice(5));
      if (flags.includes('nozoom')) item.zoom = 1;
      const bg = flags.find(f => f === 'bg-color' || f.startsWith('bg-color='));   // {bg-color} · {bg-color=#hex} · {bg-color=palette-name}
      if (bg === 'bg-color') item.bg = true;
      else if (bg) { const v = bg.slice(9).trim(); item.bg = /^#?[0-9a-f]{3,8}$/i.test(v) ? (v.startsWith('#') ? v : '#' + v) : `var(--c-${v.toLowerCase().replace(/[^a-z0-9]+/g, '-')})`; }
      if (flags.includes('bg-cover')) item.cover = true;                     // {bg-cover}: 화면에 꽉 채움
      // 캡션은 한 줄. 본문처럼 \ 가 줄바꿈 (<br>): "위 줄 \ 아래 줄". 앞뒤 공백은 줄바꿈에 흡수
      if (m[3].trim()) item.caption = glueLastWords(wrapKo(colorChips(smartQuotes(escapeHtml(m[3].trim()).replace(/\s*\\\s*/g, '<br>')), ctx)))
        .replace(/^(\d{1,2})[ \u00A0]?\/[ \u00A0]*([\s\S]+)$/, '<span class="cap-num">$1/</span><span class="cap-body">$2</span>')    // HTML (컬러 칩, 한글 구간 래핑, 고아 단어 방지). "N/ 설명" → 번호 라벨(모노) + 글. 뒤 간격은 --cap-num-gap, 글은 .cap-body 로 묶어 둘째 줄부터도 글 시작선에 정렬 (Figure.astro 의 flex)
        .replace(/^(<span class="ko">)?([^<>\/\s]{1,16}(?: [^<>\/\s]{1,16})?)(<\/span>)?\/[ \u00A0]+([\s\S]+)$/, (_, o = '', w, c = '', rest) => `<span class="cap-key">${o}${w}${c}<span class="cap-slash">/</span></span><span class="cap-body">${rest}</span>`);   // 슬래시만 모노   // "키워드/ 설명" → 키워드 라벨(강조 웨이트) + 글. 한글 키워드는 wrapKo 의 <span class="ko"> 안팎을 허용
      section.items.push(item);
      continue;
    }
    if ((m = line.match(/^\[swatch\]\s*(.+)$/)) && section) {        // [swatch] Name | #HEX | spec | spec
      const parts = m[1].split('|').map(s => s.trim()).filter(Boolean);
      const [name, hex, ...specs] = parts;
      section.items.push({ kind: 'swatch', name: name ?? '', hex: hex ?? '#000000', rows: swatchRows(hex ?? '#000000', specs) });
      continue;
    }
    if (section) body.push(line);
  }
  flushSection();
  for (const ch of chapters) for (const s of ch.subs) finalizeNav(s);

  // ::: split 의 폭 확정: {span} 을 적지 않은 섹션은 남은 컬럼을 균등하게 나눠 가짐 (남은 게 모자라면 새 행에서 12 를 나눔)
  for (const ch of chapters) for (const s of ch.subs) {
    const splits = new Map<number, Section[]>();
    for (const sec of s.sections) if (sec.split !== undefined) splits.set(sec.split, [...(splits.get(sec.split) ?? []), sec]);
    for (const secs of splits.values()) {
      const open = secs.filter(x => x.span === undefined);
      if (!open.length) continue;
      const used = secs.reduce((a, x) => a + (x.span ?? 0), 0);
      const left = GRID_COLS - used;
      const each = Math.max(1, Math.floor((left >= open.length ? left : GRID_COLS) / open.length));
      for (const x of open) x.span = each;
    }
    for (const sec of s.sections) {                              // 좁은 폭에서 문단까지 나누면 글이 깨짐
      const m = sec.layout.match(/^text-(\d)$/);
      if (m && sec.span !== undefined && sec.span / Number(m[1]) < 3)
        console.warn(`[guide] "${sec.head}": 폭 ${sec.span}컬럼에서 {layout=${sec.layout}} 은 단이 ${(sec.span / Number(m[1])).toFixed(1)}컬럼이 되어 너무 좁습니다 (${s.url})`);
    }
  }

  // 이미지 경로 확정: <챕터>/<페이지 번호-이름>/<주제 번호>-<이름>.
  // 주제 = 목차 라벨 규칙과 같음(헤드, 헤드가 페이지 이름과 같으면 서브헤드). 번호는 페이지 안 주제 순서(목차 표시와 무관하게 전부 셈).
  for (const ch of chapters) ch.subs.forEach((s, si) => {
    const topics: string[] = [];
    for (const sec of s.sections) if (!topics.includes(sec.label)) topics.push(sec.label);
    const index = subAssetIndex(ch.slug, ch.name, s.slug);
    for (const sec of s.sections) {
      const label = sec.label;
      const topicNum = pad2(topics.indexOf(label) + 1);
      for (const it of sec.items) {
        if (it.kind !== 'image') continue;
        it.path = `${ch.slug}/${pad2(si + 1)}-${s.slug}/${topicNum}-${it.name}`;
        it.src = resolveAsset(it, index);
      }
    }
  });

  // prev / next 연결 (챕터 경계를 넘어 순서대로)
  const flat = chapters.flatMap(c => c.subs);
  flat.forEach((s, i) => {
    const ref = (t: Sub): SubRef => ({ url: t.url, name: t.name, chapterNum: t.chapterNum, chapterName: t.chapterName });
    if (i > 0) s.prev = ref(flat[i - 1]);
    if (i < flat.length - 1) s.next = ref(flat[i + 1]);
  });

  // 참조 링크 [[page#section|라벨]] → <a class="xref">. 본문·캡션 모두. 라벨을 생략하면 목차 라벨에서 "페이지 › 섹션" 을 만든다.
  //   [[graphic-pattern]]        → Graphic Pattern 페이지  [[graphic-pattern#grammar]] → "Graphic Pattern › Grammar"
  //   [[#grammar]]               → 같은 페이지의 섹션      [[02-logo/symbol#clearspace]] → 챕터로 한정 (같은 slug 가 여러 챕터에 있을 때)
  //   [[→ graphic-pattern#grammar]] → "→ Graphic Pattern › Grammar" (화살표도 링크 글자의 일부라 밑줄이 이어짐. -> 도 됨)
  //   [[graphic-pattern#grammar|문법 원칙]] → 라벨 직접 지정.   대상이 없으면 빌드 로그에 경고하고 글자만 남긴다
  //   [[https://eopla.net|EO Planet]] → 외부 링크 (새 탭). 라벨 없으면 "eopla.net"
  // 원문은 마크다운 변환 전에 자리표시자로 빠져 있었으므로(stashXrefs) 여기서 링크로 복원한다. 라벨은 본문과 같은 글자 처리(따옴표·한글 래핑)를 거친다.
  const NB = '\u00A0';
  const text = (plain: string) => wrapKo(smartQuotes(escapeHtml(plain)));
  const bySlug = (slug: string, chapterSlug?: string) => flat.find(x => x.slug === slug && (!chapterSlug || chapters.find(c => c.subs.includes(x))!.slug === chapterSlug));
  // 호버 알약: 컬러 칩의 Copy 알약(.swatch__tip)과 같은 부품. 글자(JUMP · OPEN · MAIL)는 CSS content 라 드래그 복사에 섞이지 않음.
  // 글자 뒤 화살표 SVG: 문서 안 이동(jump)은 →, 밖으로 나가는 링크(open · mail)는 ↗. 둘 다 같은 상자(viewBox 가 선에 딱 맞음)
  const XREF_ARROWS = {
    jump: `<svg class="xref__arrow" viewBox="2.75 2.75 8.5 8.5" aria-hidden="true"><path d="M3.5 7h7M7 3.5 10.5 7 7 10.5"/></svg>`,
    out: `<svg class="xref__arrow" viewBox="2.75 2.75 8.5 8.5" aria-hidden="true"><path d="M3.5 10.5 10.5 3.5M5 3.5h5.5V9"/></svg>`,
  };
  const xrefTip = (kind: 'jump' | 'open' | 'mail') =>
    `<span class="swatch__tip t-label" aria-hidden="true"><span class="swatch__tip-text swatch__tip-text--${kind}"></span>${XREF_ARROWS[kind === 'jump' ? 'jump' : 'out']}</span>`;
  const xrefHtml = (inner: string, here: Sub): string => {
    const bar = inner.indexOf('|');
    const rawTarget = bar >= 0 ? inner.slice(0, bar) : inner;
    const label = bar >= 0 ? text(inner.slice(bar + 1).trim()) : undefined;
    const arrowM = rawTarget.match(/^\s*(→|->)\s*/);
    const arrow = arrowM ? `→${NB}` : '';
    const target = rawTarget.slice(arrowM?.[0].length ?? 0).trim();
    const fallback = () => label ?? text(target);
    if (/^(https?:)?\/\//i.test(target) || /^mailto:/i.test(target)) {                 // 외부 링크: 새 탭. 라벨이 없으면 주소에서 프로토콜·끝 슬래시를 뺀 글자
      const shown = target.replace(/^(https?:)?\/\//i, '').replace(/^mailto:/i, '').replace(/\/$/, '');
      const kind = /^mailto:/i.test(target) ? 'mail' : 'open';
      return `<a class="xref xref--${kind}" href="${escapeHtml(target)}" target="_blank" rel="noopener">${arrow}${label ?? escapeHtml(shown)}${xrefTip(kind)}</a>`;
    }
    const [pagePart, ...secParts] = target.split('#');
    const secId = secParts.length ? secParts.join('-') : undefined;            // page#head#subhead → id "head-subhead"
    const [a, b] = pagePart.split('/');
    const s = !pagePart ? here : b ? bySlug(b, a) : bySlug(a);
    if (!s) { console.warn(`[guide] [[${target}]]: "${pagePart}" 페이지가 없습니다 (${here.url})`); return fallback(); }
    let href = s.url, auto = text(s.name);
    if (secId !== undefined) {
      const sec = s.sections.find(x => x.id === secId);
      if (!sec) { console.warn(`[guide] [[${target}]]: ${s.name} 페이지에 #${secId} 섹션이 없습니다 (${here.url}). 있는 id: ${s.sections.map(x => x.id).join(', ')}`); return fallback(); }
      href += `#${secId}`;
      const crumb = sec.crumb.map(text).join(`${NB}›${NB}`);   // 헤드 › 서브헤드 (헤드가 페이지 이름과 같으면 서브헤드만)
      auto = pagePart ? `${text(s.name)}${NB}›${NB}${crumb}` : crumb;
    }
    return `<a class="xref xref--jump" href="${href}">${arrow}${label ?? auto}${xrefTip('jump')}</a>`;
  };
  const resolveXrefs = (html: string, here: Sub): string => html.replace(/%%XREF(\d+)%%/g, (_m, i: string) => xrefHtml(xrefs[Number(i)], here));
  for (const s of flat) for (const sec of s.sections) {
    sec.bodyHtml = resolveXrefs(sec.bodyHtml, s);
    for (const it of sec.items) if (it.kind === 'image' && it.caption) it.caption = resolveXrefs(it.caption, s);
  }

  return { lang, chapters };
}

/** 검색 색인: 섹션 단위. 클라이언트 스크립트가 JSON 으로 받아 필터링합니다. */
/** u: url#id, c: 챕터, s: 페이지, h: 섹션 헤드, t: 제목(서브헤드, 없으면 헤드), b: 본문 */
export interface SearchEntry { u: string; c: string; s: string; h: string; t: string; b: string; }
const straightQuotes = (t: string) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");   // 검색어는 곧은 따옴표로 입력되므로 색인도 맞춤
const stripTags = (html: string) => straightQuotes(html.replace(/<span class="swatch__tip[^>]*>(?:<span[^>]*>[^<]*<\/span>)*<\/span>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim());
export function buildSearchIndex(guide: Guide): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const ch of guide.chapters) for (const sub of ch.subs) for (const sec of sub.sections) {
    const caps = sec.items.map(it => it.kind === 'image' ? stripTags(it.caption ?? '') : `${it.name} ${it.hex}`).join(' ');
    out.push({
      u: `${sub.url}#${sec.id}`,
      c: `${ch.num} ${ch.name}`,
      s: sub.name,
      h: straightQuotes(sec.head),
      t: straightQuotes(sec.subhead ?? sec.head),
      b: `${stripTags(sec.bodyHtml)} ${caps}`.slice(0, 400)
    });
  }
  return out;
}

/**
 * 스와치 스펙 문자열을 행으로. 두 가지 표기를 모두 받습니다.
 *   R249 G238 B58 / C5 M0 Y95 K0 / PANTONE 3945 C          (기존)
 *   RGB: 249 238 58 / CMYK: 5 0 95 0 / Pantone: 3945 C     (라벨: 값)
 * 숫자 뒤의 꼬리말(예: "or raw paper")은 복사 대상이 아닌 메모로 붙습니다.
 */
function swatchRows(hex: string, specs: string[]): SwatchRow[] {
  const named: Record<string, SwatchRow> = {};
  const extra: SwatchRow[] = [];
  const note = (t?: string) => (t && t.trim() ? t.trim() : undefined);
  for (const raw of specs) {
    const s = raw.trim();
    let m: RegExpMatchArray | null;
    if ((m = s.match(/^(?:rgb\s*:?\s*)?R\s*(\d+)\s*G\s*(\d+)\s*B\s*(\d+)\s*(.*)$/i)))
      named.RGB = { label: 'RGB', values: [m[1], m[2], m[3]], note: note(m[4]) };
    else if ((m = s.match(/^(?:cmyk\s*:?\s*)?C\s*(\d+)\s*M\s*(\d+)\s*Y\s*(\d+)\s*K\s*(\d+)\s*(.*)$/i)))
      named.CMYK = { label: 'CMYK', values: [m[1], m[2], m[3], m[4]], note: note(m[5]) };
    else if ((m = s.match(/^(rgb|cmyk)\s*:\s*([\d\s,]+?)\s*([^\d\s,].*)?$/i)))
      named[m[1].toUpperCase()] = { label: m[1].toUpperCase(), values: m[2].split(/[\s,]+/).filter(Boolean), note: note(m[3]) };
    else if ((m = s.match(/^(?:pantone|pms)\s*:?\s*(.+)$/i)))
      named.Pantone = { label: 'Pantone', values: [m[1].trim()] };
    else if ((m = s.match(/^([A-Za-z][\w ]*?)\s*:\s*(.+)$/)))
      extra.push({ label: m[1], values: [m[2].trim()] });
    else extra.push({ label: '', values: [], note: s });
  }
  const hexRow: SwatchRow = { label: 'HEX', values: [hex.toUpperCase()] };
  return [named.Pantone, named.CMYK, named.RGB, hexRow, ...extra].filter((r): r is SwatchRow => !!r);
}

/** 이미지 목록(문서 순서). scripts/assets.mjs 가 /asset-manifest.json 으로 받아 폴더를 정리합니다. */
export interface AssetEntry { page: string; path: string; src: string | null; }
/** 페이지의 섹션을 렌더 단위로: ::: split 로 묶인 연속 섹션은 하나의 split 블록(12컬럼 행에 나란히, 섹션마다 span), 나머지는 낱개 */
export type SectionBlock = { kind: 'section'; section: Section } | { kind: 'split'; id: number; sections: Section[] };
export function sectionBlocks(sub: Sub): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  for (const sec of sub.sections) {
    const last = blocks[blocks.length - 1];
    if (sec.split !== undefined && last?.kind === 'split' && last.id === sec.split) last.sections.push(sec);
    else if (sec.split !== undefined) blocks.push({ kind: 'split', id: sec.split, sections: [sec] });
    else blocks.push({ kind: 'section', section: sec });
  }
  return blocks;
}

export function assetEntries(guide: Guide): AssetEntry[] {
  const out: AssetEntry[] = [];
  for (const ch of guide.chapters) for (const s of ch.subs) for (const sec of s.sections) for (const it of sec.items) {
    if (it.kind === 'image') out.push({ page: s.url, path: it.path, src: it.src });
  }
  return out;
}

export function firstUrl(guide: Guide): string {
  return guide.chapters[0]?.subs[0]?.url ?? `/${guide.lang}`;
}

/** 다른 언어의 같은 페이지 URL. 같은 챕터·페이지 slug 가 없으면 그 언어의 첫 페이지. */
export function altUrl(guides: Record<Lang, Guide>, sub: Sub, target: Lang): string {
  const g = guides[target];
  const ch = g.chapters.find(c => c.slug === sub.chapterSlug);
  const match = ch?.subs.find(s => s.slug === sub.slug);
  return match?.url ?? firstUrl(g);
}

/**
 * 사이트 자체 로고를 SVG 마크업으로. 파일 대신 HTML 에 직접 넣어 페이지 전환 때 이미지를 다시 받으며 깜빡이지 않게 합니다.
 * 한 페이지에 두 번(목차, 모바일 상단 바) 들어가므로 id 는 지웁니다. SVG 가 아니면 null (→ <img> 사용).
 */
export function brandLogoSvg(): string | null {
  const p = path.join(ASSETS, 'brand', 'logo.svg');
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8')
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/\s(id|data-name)="[^"]*"/g, '')
    .replace(/<svg\b/, '<svg role="img" aria-label="EO"')
    .trim();
}

/** 사이트 자체 로고: public/assets/brand/logo.* (콘텐츠 이미지 폴더 규칙과 별개) */
export function brandLogoSrc(): string | null {
  const ext = EXTS.find(e => fs.existsSync(path.join(ASSETS, 'brand', `logo.${e}`)));
  return ext ? `/assets/brand/logo.${ext}` : null;
}
