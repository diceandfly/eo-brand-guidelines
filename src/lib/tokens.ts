/**
 * tokens.css 를 빌드 때 읽는 작은 파서. 디자인 수치를 코드에서도 같은 값으로 쓰기 위한 것:
 * 컬러 칩의 복사 HEX(--c-*), Do/Don't 카드 배율(--dodont-zoom-N), 이미지 톤 판정의 배경색(--bg).
 * 순수 함수라 Vite 없이(scripts/*.mjs) 도, 브라우저 스크립트(motion.ts · Layout.astro)에서도 씁니다.
 * 파일은 src/lib/content.ts(Vite) 또는 스크립트가 읽어 넘깁니다.
 * 시간 토큰 해석(parseSeconds)과 휘도 공식(luminance · hexLuminance)도 여기 한 벌만 둡니다.
 */
export type Tokens = Map<string, string>;

/** `--name: value;` 를 전부 모읍니다. 같은 이름이 여러 번이면 첫 정의(:root)가 기준 */
export function parseTokens(css: string): Tokens {
  const t: Tokens = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) if (!t.has(m[1])) t.set(m[1], m[2].trim());
  return t;
}

export function tokenNumber(t: Tokens, name: string, fallback: number): number {
  const v = parseFloat(t.get(name) ?? '');
  return Number.isFinite(v) ? v : fallback;
}

/**
 * 색 토큰을 #rrggbb 로. var() 참조와 color-mix(in srgb, A, B p%) 를 따라갑니다 (가이드의 시맨틱 색은 전부 이 두 형태).
 * 그 밖의 표현(rgb(), 이름 색 등)은 fallback.
 */
export function tokenHex(t: Tokens, name: string, fallback = '#000000'): string {
  const hex = resolveColor(t, t.get(name) ?? '', 0);
  return hex ?? fallback;
}

function resolveColor(t: Tokens, value: string, depth: number): string | null {
  if (depth > 12) return null;
  const v = value.trim();
  let m: RegExpMatchArray | null;
  if ((m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i))) {
    const h = m[1].length === 3 ? [...m[1]].map(c => c + c).join('') : m[1];
    return `#${h.toLowerCase()}`;
  }
  if ((m = v.match(/^var\((--[a-z0-9-]+)\)$/i))) return resolveColor(t, t.get(m[1]) ?? '', depth + 1);
  if ((m = v.match(/^color-mix\(\s*in\s+srgb\s*,(.*)\)$/i))) {
    const parts = splitTop(m[1]);
    if (parts.length !== 2) return null;
    const [a, b] = parts.map(p => {
      const pm = p.match(/^(.*?)\s*(\d+(?:\.\d+)?)%$/);
      return { color: (pm ? pm[1] : p).trim(), pct: pm ? parseFloat(pm[2]) : null };
    });
    const pa = a.pct ?? (b.pct !== null ? 100 - b.pct : 50);
    const pb = b.pct ?? 100 - pa;
    const ca = resolveColor(t, a.color, depth + 1), cb = resolveColor(t, b.color, depth + 1);
    if (!ca || !cb) return null;
    const mix = (i: number) => Math.round((parseInt(ca.slice(i, i + 2), 16) * pa + parseInt(cb.slice(i, i + 2), 16) * pb) / (pa + pb));
    return `#${[1, 3, 5].map(i => mix(i).toString(16).padStart(2, '0')).join('')}`;
  }
  return null;
}

/** 최상위 쉼표로 나눔 (괄호 안 쉼표는 무시) */
function splitTop(s: string): string[] {
  const out: string[] = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim());
}

/** 시간 토큰 값 → 초. "360ms" → 0.36, "0.4s" · "0.4" → 0.4. 숫자가 아니면 null */
export function parseSeconds(raw: string): number | null {
  const v = parseFloat(raw);
  if (!Number.isFinite(v)) return null;
  return raw.trim().endsWith('ms') ? v / 1000 : v;
}

/** sRGB 채널(0~255) → 상대 휘도 0~1 (WCAG · BT.709 계수, 감마 보정) */
export function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** #rgb · #rrggbb → 상대 휘도. 잘못된 값은 검정(0)으로 봄 */
export function hexLuminance(hex: string): number {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map(x => x + x).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return 0;
  const [r, g, b] = h.match(/../g)!.map(x => parseInt(x, 16));
  return luminance(r, g, b);
}
