/**
 * 스크립트용 이미지 목록: 빌드 없이 md 와 tokens.css 를 읽어 파서(src/lib/guide.ts)를 직접 호출합니다.
 * Node 가 .ts 를 그대로 실행하므로(타입 제거) 별도 변환이 필요 없습니다. 결과 모양은 { ko: AssetEntry[], en: AssetEntry[] }.
 * 번호 떼기(stripNum)와 경로 변환(assetSrc · srcToRel · srcToFile)도 이 모듈을 거쳐 파서의 것을 씁니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadGuide, assetEntries, LANGS, EXTS, stripNum, assetSrc, srcToRel, srcToFile } from '../../src/lib/guide.ts';
import { parseTokens } from '../../src/lib/tokens.ts';

// 스크립트가 쓰는 파서 규칙은 여기서만 가져갑니다 (번호 떼기 · 경로 ↔ src 변환 · 이미지 확장자). 파서와 같은 한 벌
export { EXTS, stripNum, assetSrc, srcToRel, srcToFile };

export function loadManifest(root) {
  const tokens = parseTokens(fs.readFileSync(path.join(root, 'src', 'styles', 'tokens.css'), 'utf8'));
  return Object.fromEntries(LANGS.map(lang => {
    const source = fs.readFileSync(path.join(root, 'content', `guide.${lang}.md`), 'utf8');
    return [lang, assetEntries(loadGuide(lang, source, tokens))];
  }));
}
