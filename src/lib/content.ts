/**
 * Vite 전용 입구: 콘텐츠(md)와 tokens.css 를 모듈로 읽어 파서(guide.ts)에 넘기고, 결과를 빌드 동안 메모합니다.
 * 파일을 fs 가 아니라 Vite 모듈로 읽어야 dev 서버가 의존성으로 추적해, md 를 저장하면 라우트와 페이지를 다시 계산하고
 * 새로고침합니다. (이 모듈이 다시 평가되면 메모도 함께 비워집니다.)
 * 파서 자체(guide.ts)는 Vite 없이도 돌아가므로 scripts/*.mjs 는 fs 로 읽어 직접 호출합니다.
 */
import fs from 'node:fs';
import { loadGuide as parseGuide, LANGS, type Guide, type Lang } from './guide';
import { parseTokens } from './tokens';
import tokensCss from '../styles/tokens.css?raw';

const CONTENT_FILES = import.meta.glob('/content/guide.*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** tokens.css 의 모든 토큰 (빌드 때 코드에서 참조할 값) */
export const TOKENS = parseTokens(tokensCss);

const cache = new Map<Lang, Guide>();

// 개발 서버: public/assets 에 파일을 넣거나 지우면 이미지 색인이 낡는다 (md 를 저장해야만 다시 계산됐음).
// 폴더의 mtime 은 안의 파일이 생기거나 없어질 때 바뀌므로, 폴더 mtime 합을 서명으로 삼아 바뀌면 메모를 비운다. 빌드에서는 한 번만 계산.
let assetsSig = '';
function assetsSignature(): string {
  const root = `${process.cwd()}/public/assets`;
  const parts: string[] = [];
  const walk = (dir: string) => {
    let st; try { st = fs.statSync(dir); } catch { return; }
    parts.push(String(st.mtimeMs));
    for (const d of fs.readdirSync(dir, { withFileTypes: true })) if (d.isDirectory()) walk(`${dir}/${d.name}`);
  };
  walk(root);
  return parts.join('|');
}
export function loadGuide(lang: Lang): Guide {
  if (import.meta.env.DEV) {
    const sig = assetsSignature();
    if (sig !== assetsSig) { assetsSig = sig; cache.clear(); }
  }
  let g = cache.get(lang);
  if (!g) {
    const source = CONTENT_FILES[`/content/guide.${lang}.md`];
    if (source === undefined) throw new Error(`content/guide.${lang}.md 가 없습니다`);
    g = parseGuide(lang, source, TOKENS, { strict: !import.meta.env.DEV });   // astro build: 오타 · 깨진 참조가 있으면 빌드 중단, dev 서버: 경고만
    cache.set(lang, g);
  }
  return g;
}

/** 모든 언어의 가이드를 한 번에 */
export function loadAllGuides(): Record<Lang, Guide> {
  return Object.fromEntries(LANGS.map(l => [l, loadGuide(l)])) as Record<Lang, Guide>;
}
