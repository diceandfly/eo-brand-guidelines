// 시그니처 서체 — 로컬 Founders Grotesk Regular 를 fontkitten(vendor/ 에 함께 둠)으로 읽어 글자 아웃라인을 얻음. WOFF2 만 쓰므로 tiny-inflate(WOFF1 용)는 빈 모듈
let create;
try { ({ create } = await import(FONTKIT_URL)); } catch (e) { SIG_FONT_ERR = 'Signature engine missing (fontkitten)'; console.warn('fontkitten', e); }   // 정적 import 면 실패할 때 모듈째 멈춰 '불러오는 중' 에 갇힘 → 동적으로
if (create) try {
  const r = await fetch(FONT_URL); if (!r.ok) throw new Error('HTTP ' + r.status);
  SIG_FONT = sigFontFrom(create(new Uint8Array(await r.arrayBuffer())));
} catch (e) { SIG_FONT_ERR = 'Signature font missing — add founders-grotesk-regular.woff2 to public/fonts'; console.warn('signature font', e); }
update();
