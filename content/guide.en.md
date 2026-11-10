<!--
=====================================================================
EO Brand Guidelines — 콘텐츠 파일 튜토리얼 (영어판)
=====================================================================
이 파일은 영어판입니다. 한국어판은 guide.ko.md이며 문법은 같습니다.
두 언어가 한 사이트에 같이 빌드됩니다. 영어판은 /en/… , 한국어판은 /ko/… 이고
목차 하단의 EN | KR로 전환합니다. 같은 챕터·페이지 이름(slug)이 있으면 같은 페이지로, 없으면 첫 페이지로 갑니다.

이 파일 하나가 사이트의 모든 글과 이미지 배치를 결정합니다.
이 주석 블록(<!-- -->)은 화면에 나오지 않습니다. 자유롭게 메모를 남기세요.

■ 위계 (기호로 구분)
  # 02 Logo              ← 챕터.   "번호 이름" 형식. 번호는 목차와 URL(/02-logo/…)에 쓰입니다.
  ## Logo                ← 페이지. 화면 하나 = URL 하나. URL: /02-logo/logo
  ### Construction       ← 섹션 헤드. 목차의 앵커로도 쓰입니다.
                            앵커 id = 목차 라벨의 슬러그 (헤드가 페이지 · 챕터 이름과 같으면 서브헤드, 예: #color-pairing).

■ 참조 링크 [[…]] (본문·캡션 어디서나)
  [[graphic-pattern#color]]            → "Graphic Pattern › Color" 링크. 글자는 목차에서 자동, 언어별 경로도 자동
  [[graphic-pattern]]                          → "Graphic Pattern" (페이지로)
  [[#grammar]]                         → 같은 페이지의 섹션 ("Grammar"). 페이지 이름을 적어도 대상이 현재 페이지면 경로 없이 섹션만
  [[graphic-unit#morphology#proportion]] → "Graphic Unit › Morphology › Proportion" (목차 기준: 헤드가 목차에 있으면 헤드 › 서브헤드, + 가 서브헤드 줄에 있으면 서브헤드만 → "Typography › Line Unit")
  [[→ graphic-pattern#color]]          → "→ Graphic Pattern › Color" (화살표까지 한 밑줄. 화살표는 → 한 글자만)
  [[graphic-pattern#grammar|grammar rules]]         → 링크 글자를 직접 지정
  [[https://eopla.net|EO Planet]]      → 외부 링크 (새 탭). 라벨이 없으면 "eopla.net" 처럼 주소가 글자로
    → 페이지 이름 = URL의 slug (symbol, signature, graphic-pattern …), 섹션 = 앵커 id = 헤드(헤드가 페이지 이름과 같으면 서브헤드).
      헤드가 페이지 이름과 다르고 서브헤드가 있으면 id 는 헤드-서브헤드 (morphology-proportion).
      없는 대상은 개발 서버(npm run dev)에서는 경고 후 글자만 남고, npm run build 는 오류로 멈춥니다. 페이지 이름은 사이트 전체에서 하나여야 합니다.
    → 본문에서는 일반 마크다운 링크 [글자](주소)도 됩니다. 캡션은 마크다운을 거치지 않아 **강조** · \ 줄바꿈 · [[참조]] 만 됩니다.
    → 트리로 쓰려면 마크다운 중첩 불렛 그대로: "- 항목" 아래 두 칸 들여쓴 "  - [[symbol#color]]"
  #### Primary Lockup    ← 서브헤드 (선택). 헤드 바로 다음 줄에만 씁니다. 없으면 표시되지 않습니다.
  그 아래 줄들            ← 본문. 마크다운(문단, 굵게, 링크, 목록)을 쓸 수 있습니다.
                            **굵게** 는 웨이트 한 단계(300 → 400) + 네온 색(tokens.css --t-body-strong-c)으로 강조됩니다. 언더라인은 쓰지 않습니다 — 링크 · 참조만 언더라인이라 둘이 바로 구분됩니다. 언더라인은 링크 · 참조 전용.
                            불릿 글자는 쓴 대로입니다: "- 항목" 은 –(엔 대시), "+ 항목" 은 +. 파서는 깊이를 보지 않지만 가이드의 규칙은 1단 · 2단(두 칸 들여쓴 중첩) 모두 "- " 입니다 (tokens.css --t-body-bullet-dash / --t-body-bullet-plus).
                            키워드 소개는 그냥 글로, 앞뒤를 띄운 긴 대시로 씁니다: "- 키워드 — 설명" (강조하려면 "- **키워드** — 설명"). 캡션도 같음: "![x] 세로형 — 설명". 아무것도 인식하지 않는 그냥 글자입니다.
                            (2026-11-04 폐기한 슬래시 라벨 "키워드/ 설명" · "키워드// 설명" 은 2026-11-10 파서에서도 지웠습니다. 그때의 md · 파서는 git 태그 archive/keyword-labels-2026-11-04)

■ 이미지 (한 줄에 하나)
  ![construction]
    → 파일 이름만 씁니다. 이 페이지의 이미지 폴더 안에서 같은 이름의 .svg .png .jpg .jpeg .webp .gif .avif를 찾아 넣습니다 (같은 이름이 여럿이면 이 순서로 우선).
      파일: public/assets/<챕터>/<페이지>/<주제 번호>-<이름>  예) public/assets/02-logo/01-symbol/04-clearspace.png
      주제 = 목차 항목(헤드, 헤드가 페이지 이름과 같으면 서브헤드). 앞 번호는 페이지 순서대로 정렬하기 위한 것이라
      없거나 틀려도 이미지는 나옵니다. 이름만 붙여 넣어도(clearspace.png) 됩니다.
    → 파일이 아직 없으면 넣을 경로와 비율이 적힌 플레이스홀더 박스가 나옵니다.
    → 섹션 순서를 바꾸거나 이름만 붙여 넣은 뒤 npm run assets를 실행하면 파일 앞 번호를 지금 순서에 맞춰 줍니다.
  ![dont-stretch]{dont} Don't stretch or distort the logo
    → {do} 또는 {dont} 를 붙이면 캡션 줄 맨 앞에 체크 / 엑스 아이콘이 붙습니다.
    → {dont} 이미지에는 빨간 대각선이 자동으로 그려집니다 (카드와 확대 보기 모두). 끄려면 {dont nostrike}.
    → {con} 은 조건부(conditional, 애매한 경우): 흰 삼각형 아이콘, 대각선 없음. 캡션이 없으면 "Conditional".
    → 카드 안 배율: {zoom=1.2} 를 붙이면 그 이미지만 카드 안에서 가운데 기준 1.2배로 보입니다 (확대 보기는 원본).
      Do/Don't 카드는 그리드별 기본 배율(tokens.css --dodont-zoom-2/3/4)을 따르고, {do nozoom} 처럼 쓰면 그 카드만 끕니다.
    → 확대 보기 배경: {bg-color} 를 붙이면 그 이미지는 거울 확장 대신 가장자리 색(빌드 때 측정한 단색)으로 화면을 채웁니다.
      {bg-color=solid-gray} 처럼 팔레트 색을 직접 적을 수도 있습니다(팔레트 이름은 소문자-하이픈, HEX 는 받지 않음). 가장자리가 단색이 아니고 색도 없으면 기본 막.
    → 확대 보기 꽉 채움: {bg-cover} 를 붙이면 이미지를 화면에 꽉 채웁니다(비율이 다르면 넘치는 쪽이 잘림). 거울 확장 · 배경색 없음, 모바일은 기본 보기.
      여러 개는 띄어서 함께 씁니다: ![dont-3]{dont nostrike zoom=1.3} 캡션
      섹션 전체에 걸려면 헤드나 서브헤드 줄에 씁니다: ### Symbol {layout=grid-3 zoom=1.5}. {bg-color} · {bg-cover} 도 같은 자리에 쓰면 섹션 이미지 전체의 기본이 되고,
      이미지별 {bg-color}/{bg-cover} 가 우선합니다. 섹션 기본을 끄고 기본 거울 확장으로 되돌리려면 그 이미지에 {bg-mirror}
      중괄호는 나눠 써도 됩니다: {layout=grid-3} {zoom=1.5}, 이미지 줄도 마찬가지: ![dont-8]{zoom=1.55} {dont} 캡션
      (이미지 태그 > 섹션 zoom > Do/Don't 그리드 기본값 순서로 적용)
    → 위 목록에 없는 플래그 · 숫자가 아닌 zoom · 팔레트에 없는 색 이름은 개발 서버에서는 경고 후 무시, npm run build 는 오류로 멈춥니다.
    → Do/Don't만 있는 섹션은 4:3 카드입니다. 원본은 16:9로 만들면 카드에서는 가운데 4:3이 보이고, 확대하면 전체가 보입니다.
    → 뒤에 글을 쓰면 이미지 아래 캡션이 붙습니다 (= 카드). 배지만 있고 글이 없으면 "Do" / "Don't" 가 기본 문구.
    → 캡션 앞 번호: "1. 설명" 처럼 쓰면(일반 md 순서 목록과 같은 표기) 화면에는 숫자만 "1" 로 붙고(본문 순서 목록 마커와 같은 서체 · 들여쓰기 · 간격, tokens.css --t-body-marker-gap) 줄이 넘어가면 글은 첫 줄 글 시작선으로 돌아갑니다. 두 자리 번호("01." · "12.")는 칸이 두 자리 폭(tokens.css --t-body-olist-indent-2)으로 넓어지므로, 한 섹션에 10 이상이 있으면 "01." 처럼 전부 두 자리로 씁니다. "위 줄 \ 아래 줄" 로 줄을 나누면 줄마다 번호를 인식합니다.
      키워드는 "세로형 — 설명" 처럼 앞뒤를 띄운 긴 대시로 그냥 글로 씁니다 ("1. 마진 — 설명" 은 번호 + 키워드). 캡션 안의 **…** 는 본문 강조와 같습니다.

■ 줄바꿈
  엔터 두 번 = 새 문단(문단 간격). 엔터 한 번은 같은 문단으로 이어집니다(공백 하나).
  문단을 나누지 않고 줄만 바꾸려면 줄 끝에 \ 를 붙입니다: Build Anyway.\ ← 다음 줄이 바로 아래에
  이미지·Do/Don't 캡션은 한 줄로 쓰므로, 줄바꿈 자리에 \ 를 넣습니다: ![token]{do} 윗줄 \ 아랫줄

■ 따옴표
  본문·캡션·헤드 어디서든 곧은 따옴표 " 와 '로 씁니다. 화면에는 자동으로 둥근 따옴표 “ ” ‘ ’로 바뀝니다.
    → "Build Anyway." 는 “Build Anyway.”로, Don't는 Don’t로 표시됩니다. `코드` 안은 바뀌지 않습니다.

■ 나열 (가운뎃점)
  나열은 앞뒤를 띄운 가운뎃점으로 씁니다: situations · formats · communications. 숫자 사이는 "2 or 3 times"처럼 말로 풉니다.
    → 점 앞 공백은 화면에서 줄바꿈 없는 공백이 되어, 줄이 점으로 시작하지 않습니다.

■ 스와치 (컬러 스펙 카드)
  [swatch] Builder Neon | #F9EE3A | R249 G238 B58 | C5 M0 Y95 K0 | PANTONE 3945 C
    → 이름 | HEX | 이후는 자유 항목. HEX는 색면 채우기에 쓰입니다.
  본문·캡션에 Builder Neon · Day Blue · Bay Green · Medium Gray · Solid Gray · Space Black · Air White를
    영문 공식 명칭 그대로 쓰면 이름 앞에 색 네모가 자동으로 붙습니다 (대소문자 동일, 7색 고정).
    본문에서는 한 섹션 안에서 처음 나올 때만 네모가 붙고, 같은 이름이 다시 나오면 글자만 나옵니다 (캡션은 매번 붙음).
    [Builder Neon]처럼 대괄호로 감싸면 이름 없이 색 네모만, [+Builder Neon]은 첫 언급이 아니어도 네모 + 이름을 강제로 보입니다.
    (마우스를 올리면 이름이 툴팁으로.)
    색 네모에 마우스를 올리면 Copy 알약이 뜨고, 누르면 HEX 값이 복사됩니다 (컬러 카드의 값과 같은 동작).

■ 레이아웃
  섹션 안의 이미지/스와치 개수로 자동 결정됩니다.
    0개 → text    (텍스트만, 8컬럼)
    1개 → basic   (텍스트 5컬럼 + 이미지 6컬럼)
    2개 → grid-2  (텍스트 아래 2열)
    3·6·9개 → grid-3
    그 외 → grid-4
  직접 지정하려면 헤드 뒤에 중괄호로 씁니다.
    ### Character Set {layout=wide}            ← 텍스트 아래 12컬럼 전폭 이미지(여러 장이면 세로로 쌓임)
    ### Alignment {layout=half}                ← 텍스트 아래 6컬럼 이미지
    ### Core Palette {layout=grid-4}           ← 개수와 무관하게 4열
    ### Graphic Unit {layout=grid}             ← 그리드로 두되 열 수는 개수로 자동 (2장 이하 grid-2, 3의 배수 grid-3, 그 밖 grid-4)
    ### Don'ts {layout=grid-3 ratio=4:5}       ← 비율도 함께. 기본값: basic/half 5:4, wide 2:1, grid 4:5
    ### Credits {layout=text-2}                ← 문단을 2단으로: 본문의 문단(엔터 두 번)·목록을 차례로 2단에. text-3 · text-4도. 모바일은 한 단
  섹션 여러 개를 한 행(12컬럼)에 나란히 놓으려면 ::: split로 감싸고, 섹션마다 차지할 컬럼 수를 {span=N} 으로 적습니다.
    ::: split
    ### Thank You {span=4}
    …
    ### Contact {span=4}
    …
    ### Credits {span=4}
    …
    :::
    → span을 생략하면 남은 컬럼을 균등하게 나눕니다 (셋이면 4·4·4, 하나만 6이면 6·3·3). 합이 12를 넘으면 다음 행으로.
    → 행 안에서는 섹션이 세로 흐름(헤드 → 본문 → 이미지)이 됩니다. 이미지가 많은 섹션은 좁아지니 글 위주 섹션에 쓰세요. 모바일은 전부 전폭.
  없는 레이아웃 이름(gird-3 등)은 개발 서버에서는 경고 후 자동 판정, npm run build 는 오류로 멈춥니다.

■ 자주 하는 작업
  섹션 추가     : ### 헤드 한 줄 + 본문 + ![이미지]를 원하는 위치에 끼워 넣으면 끝.
  섹션 순서 변경 : 블록째 잘라 붙이기.
  페이지 추가  : ## 이름 한 줄. 목차·URL·다음 버튼이 자동으로 갱신됩니다.
  섹션 목록 숨김 : ## 이름 {toc=none}  ← 이 페이지는 목차에서 섹션 목록을 펼치지 않음 (섹션이 하나뿐이면 자동으로 숨김)
  같은 헤드 반복 : 가능합니다 (예: Character Set 3개). 목차에는 한 번만 표시되고 첫 번째로 이동합니다.
  목차에 올릴 섹션 고르기 : ### + Construction  ← 헤드 앞에 + 를 붙이면 그 섹션만 목차에 오름 (에디터에서는 제목으로 보임).
                        한 페이지에 + 가 하나라도 있으면 + 붙은 것만, 하나도 없으면 전부(자동) 올라갑니다.
                        서브헤드 줄에 붙이면(#### + Clearspace) 목차에는 서브헤드가 올라갑니다. 헤드가 반복되는 섹션에 유용합니다.
                        {layout=…} 속성도 헤드 줄·서브헤드 줄 어느 쪽에 써도 됩니다. 단 {span=N} 은 헤드 줄에만 (서브헤드 줄에서는 무시).
                  헤드가 페이지 이름이나 챕터 이름과 같으면(Colors 페이지의 "Color" — 대소문자 · 기호 · 끝의 s 는 무시하고 비교) 목차에는 서브헤드가 표시됩니다.

■ 지금 상태
  guide.ko.md의 영어 번역입니다. 헤드·이미지 줄·split 블록은 국문과 줄 단위로 같게 유지합니다 (구조가 어긋나면 에셋 폴더가 어긋남).
  [대괄호] 안은 아직 확정되지 않아 채워야 하는 값입니다.
=====================================================================
-->

# 01 Overview

## Welcome

### Welcome to the EO Brand Guidelines
EO is a media brand for builders. It rallies builders (Rallying), stands with builders of conviction (Conviction), and has their backs (Backing). Recording the founder's journey as it is, and carrying that story to the next builder: that is what EO does.

These guidelines describe the fundamental elements of the EO identity system: logo · typography · color · graphic system. Their purpose is to make the brand's content and services look and read as one EO, in San Francisco · Seoul · Vietnam alike.

Build Anyway.

The EO Brand Team



## Legal Brand Guidelines {toc=none}

### Legal Brand Guidelines
EO · the EO monogram · the block symbol · "Build Anyway" · "Entrepreneur Onwards" and other trademarks owned by EO Studio (hereafter the **EO Logos**), together with the brand's distinctive aesthetic features such as the symbol · graphic units · patterns · EO's look and feel (hereafter the Brand Assets), are the exclusive property of EO Studio. Except as permitted here, any use of the EO Logos or Brand Assets requires the prior permission of EO Studio.

::: split
### Do's
- Always follow these brand guidelines when using the EO Logos and Brand Assets.
- You may use the EO Logos to indicate that you have appeared in EO content or taken part in an EO program. Do not, however, give the impression that EO endorses or sponsors your product or service.
- When citing EO videos and articles, credit the source clearly as "EO" and provide a link to the original.
- Use the EO Logos and Brand Assets only as provided in the original files, unaltered, and only within the approved color pairings.


### Don'ts
- Do not include the EO Logos, or any logo confusingly similar to them, in a company · product · service · event · community name, URL, social media account, or trademark.
- Do not alter or recombine the [[symbol|EO symbol]] · [[graphic-unit|graphic units]] · [[graphic-pattern|patterns]] for use as your own graphics.
- Do not re-edit or re-upload EO's videos · articles · thumbnails without EO's permission.
- Do not copy or imitate the look and feel (layout · color combinations · typefaces · graphic system) of EO's website · magazine · social channels.
- Do not use the EO Logos alongside political · religious messages · adult content · discriminatory content.
- Do not use the EO Logos or Brand Assets on merchandise without permission.
:::



# 02 Logo

## Symbol

### Logo
#### + Overview
The EO logo is the umbrella term covering the EO symbol · [[signature|signature]] · [[sub-symbol|EO sub symbol]] covered in this chapter.

This page describes how to apply the EO symbol across situations · formats · communications, from a small sign-off to large-scale display use.
![hero] {zoom=1.05}


### Symbol
A graphic metaphor that makes the brand recognizable through a screw motif, and a monogram logo that holds the two letters E and O. This form of the logo is hereafter called the **EO symbol**.

The EO symbol is the most iconic and effective way to signal the media brand EO.
![symbol] {zoom=1.065}


### Symbol
#### + Motif
The EO symbol is designed around the three parts of a screw: shaft · thread · head.

- **Thread** — One turn of the thread stands for a cycle of problem solving.
- **Shaft** — The shaft stands for the process of building and the builder's journey, and expresses the courage to keep moving forward (Build Anyway).
- **Head** — The head stands for a single small problem solved, or a single builder.
![motif] {zoom=1.05}


### Symbol
#### + Geometry {layout=wide}
The E block, which depicts the facade of a screw, consists of a shaft and three threads, the basic geometry of the [[graphic-unit#parameters|graphic unit]]. The O block is an octagonal screw head pierced by a cross-shaped hole. Set side by side, the two blocks stand for "Entrepreneur Onwards".
![geometry]


### Symbol
#### + Clearspace
Clearspace is the minimum safeguard that protects the symbol when it sits next to other visual elements such as typography · graphic units · images · the edge of the page. With H as the vertical height of one E block, always keep a clearspace of at least H/2 on all four sides between the symbol and every adjacent element.

When the symbol sits at the center of a small frame, such as an app icon or profile image, its visual weight drifts to the left the smaller it is seen. Correct this by narrowing only the right clearspace, which pushes the symbol to the right. **Right clearspace = H × (0.42 + 0.0012 × S)**, where S is the symbol height actually seen on screen (mm); at S of 67mm or more, keep H/2 as is. The symbol moves right within the frame by (H/2 − right clearspace) ÷ 2. For how to apply it, see [[#app-and-social-icons-alignment|App & Social Icons › Alignment]]. This is an approximation derived from measurements at a desktop viewing distance of 500mm across seen heights of 4-50mm, with a maximum error of ±0.02mm.
![clearspace] {zoom=1.05}


### Symbol
#### + Scalability
The EO symbol is designed and tested to work across a range of sizes. Every size rule is based on the height seen at a distance of 500mm; for media viewed from farther away, apply it to the height converted to the end user's typical viewing distance (actual height × 500 ÷ distance).

- Optimal range — A height of 40-100px (about 8-20mm) on a 16-inch Mac display viewed from 500mm. Relative to viewing distance, this is 1/60-1/25 of the distance; on other media, scale by this ratio. The optical correction of the thread angle is also tuned to this range.
- Recommended maximum size — A height of 70px (about 15mm, 1/33 of the viewing distance). On typical pages, we recommend staying within this size.
- Minimum size — A height of 20px on screen (about 4mm, 1/125 of the viewing distance) and 4mm in print. Below this, the threads of the E block blur together, so ask the EO design team to review.
- Maximum size — A height of 125px (about 25mm, 1/20 of the viewing distance). Any larger and the symbol reads as a flat shape rather than a graphic. When you need a stronger presence, use the [[graphic-pattern#donts|graphic pattern]] instead of the symbol.
![scalability] {zoom=1.05}


### + Usage
#### Placement
The EO symbol is a strong but simple shape. On typical pages, we therefore recommend using it as a sign-off in one of the four corners of the content area. In a video thumbnail that invites the click, the main content should be the protagonist; on a poster that catches the eye, the graphic pattern should be. The symbol's presence should step back to let them lead.

As a sign-off, place the symbol in the corner farthest from the person or [[graphic-pattern#donts|graphic pattern]] that is the protagonist of the layout, with appropriate space from the other visual elements around it. This keeps symbol placement simple and consistent, while leaving enough flexibility to accommodate a dynamic graphic system.
![usage-placement]


### Usage {layout=grid-2}
#### Do's & Don'ts
When using the symbol for display, **do not raise its visual hierarchy simply by scaling it up.** Leave ample space around the symbol, so that it keeps its impact at a moderate size. Ideally, the symbol's actual footprint is 5-10% of the whole empty space, with space around it of at least 2-3 times the symbol's width.
![usage-do-1]{do} Ideally, a symbol at 5-10% of the empty space it sits in
![usage-do-2]{do} Generous space around the symbol gives it ample presence at a moderate size
![usage-dont-1]{dont} Do not fill the empty space with the symbol alone
![usage-dont-2]{dont} Do not place the symbol where there is not enough space around it


### Symbol
#### + Color{layout=grid-3} {zoom=1.6}
The EO symbol has six basic color pairings. **Always render the symbol in a single color,** and when you are unsure of the background color, use one of the following.
![color-1] 1. Space Black on Builder Neon
![color-2] 2. Air White on Space Black
![color-3] 3. Air White on Solid Gray
![color-4] 4. Space Black on Air White
![color-5] 5. Builder Neon on Space Black
![color-6] 6. Builder Neon on Solid Gray


### Symbol
#### + Inversion
The EO symbol is built by default as a light symbol in bright colors such as Builder Neon · Air White on dark backgrounds such as Space Black · Solid Gray. If you simply invert the colors to use a dark symbol on a light background, an optical illusion makes the shape look smaller and the gaps look wider.

In that case, convert the light symbol in the following order.

1. Offset the outline outward by H/100.
2. Scale each of the two blocks up proportionally by H/30 in all four directions.
3. Reduce the gap between the two enlarged blocks from the original (4/30)H to (3/30)H to complete the dark symbol.

This converts a light symbol of any size into a dark symbol of the same level.

On a light background, clearspace also looks larger than it is, so keep the clearspace area of the light symbol of the same level unchanged and center the dark symbol within it.
![inversion] {zoom=1.05}


### + Over Imagery {layout=grid-2}
#### Do's & Don'ts {zoom=1.05}
The EO symbol must always read clearly over photography, so overlay an Air White symbol on images with sufficient contrast. If an image is too bright or has overly white areas, the symbol risks being lost in the composition. In that case, overlay a gradient or black box at about 30% opacity before applying the symbol.

The composition of the photo should be simple enough for the symbol to stand out. Images that are overly complex, or that have their key subject dead center, become confusing once the symbol is placed on them. With this in mind, choose images, or adjust the image position in relation to the logo.

The guidance in this section focuses on overlays on still images rather than on video sequences whose composition changes.
![imagery-do-1]{do} {bg-cover} The symbol placed where it has sufficient contrast with the background
![imagery-do-2]{do} {bg-cover} When a photo with uneven brightness must be used, a gradient overlay at about 30% opacity secures contrast
![imagery-dont-1]{dont} {bg-cover} Do not place the symbol over the main silhouette of the person · object the photo focuses on
![imagery-dont-2]{dont} {bg-cover} Do not place the symbol where it lacks contrast with the photo


### + Partner Lockup
#### Horizontal
The image below shows the basic horizontal lockup of the EO symbol with the logos of partner brands and collaborators.

Optically adjust the elements so that they appear the same size. After matching the size of each logo, insert a gap and a vertical divider · collaboration mark between them. Based on the width of one E block (W), the gap between the EO symbol and the partner logo is 1.5W with a divider and 2W with a collaboration mark. Always keep the two logos optically centered vertically.
![lockup-h] {zoom=1.05}


### Partner Lockup
#### Vertical
The image below shows the basic vertical lockup of the EO symbol with the logos of partner brands and collaborators.

Optically adjust the elements so that they appear the same size. After matching the size of each logo, insert a horizontal divider between them. The gap between the EO symbol and the partner logo is 1.5H, where H is the height of the EO symbol. Always keep the two logos optically centered horizontally.
![lockup-v] {zoom=1.05}


### Partner Lockup
#### Optical Adjustment
A partner brand's logo sometimes does not balance perfectly when aligned with the EO symbol. Because the EO symbol is wide and heavy, a thin or tall partner logo looks smaller even at the same mathematical height.

In such cases, optically scale the partner logo up or down to create a more equal hierarchy.
![lockup-optical] {zoom=1.05}


### + App & Social Icons
#### Alignment
Because the EO symbol is asymmetric, its visual weight shifts to the left the smaller it is seen. In an app icon or profile image, do not simply center the symbol itself; center the clearspace box from [[#clearspace|Clearspace]] in the icon area instead. The correction for the icon area's size and viewing distance follows the clearspace rule.
![icon-alignment] {zoom=1.05}


### App & Social Icons
#### In Use
The image below shows the EO symbol applied to an app icon.
![icon-in-use] {bg-cover}


### Symbol {layout=grid-3} {zoom=1.6}
#### + Don'ts
To keep the EO symbol consistent and strong, do not reinterpret, alter, or decorate it. This page shows examples of alterations to avoid. When the company name must appear, use the EO signature instead of the symbol. When a sub-brand needs to be identified, create a Service Signature in consultation with the EO design team.
![dont-1]{dont} Do not stretch or distort the symbol
![dont-2]{dont} Do not rotate the symbol
![dont-3]{dont} Do not add an outline to the symbol
![dont-4]{dont} Do not use a black outline on a light background
![dont-5]{dont} Do not use a version in which the number of threads in the E, the angle of the O, or the gap between the blocks has changed (such as a still from the logo animation)
![dont-6]{dont} Do not apply visual effects such as glow · shadow · gradient to the symbol
![dont-7]{dont} Do not make the symbol so large that it fills most of the space it sits in
![dont-8]{dont} {bg-cover} Do not create graphics by joining or simply repeating the symbol
![dont-9]{dont} Do not add arbitrary context around the symbol without the permission of the EO design team


## Signature

### Signature
#### + Overview
The **signature** is a combination logo that pairs the EO symbol with the text of a company or service name, horizontally or vertically. This page describes how to apply the EO signature across situations · formats · communications.

The combination logo that pairs the symbol with the text "EO Studio" is hereafter called the **Company Signature**, and a combination logo that pairs the symbol with a service name is called a **Service Signature**.

Where the company itself steps forward, such as contracts · proposals · official documents · job postings · website footers, prefer the Company Signature. For each service's brand communication, prefer its Service Signature. Everywhere else the media brand EO must be signaled, such as videos · thumbnails · social posts · posters · content sign-offs, prefer the EO symbol.
![overview] {zoom=1.05}


### Signature
#### + Descriptor {layout=grid-2} {zoom=1.05}
The text part of the signature, excluding the symbol, is called the **descriptor**. Any word, whether a company name · service name · domain, follows the specifications below exactly. The height (H) and width (W) of one E block of the symbol are the basis for every size setting.

When the first or last letter of the descriptor is a glyph with a curved side, such as S · o, keep the text left aligned on its baseline and temporarily replace it with H if it is uppercase or h if it is lowercase, to set the edge of the cap box. For example, “Studio” takes its left edge from “Htudio” and its right edge from “Studih”.

Always get approval from the EO design team when creating a new descriptor or changing an existing one. Do not use temporary names, such as those of campaigns or events, as descriptors.
![descriptor-v] Vertical — set in Founders Grotesk Regular, type size 0.46H, tracking 0. Place the top of the cap box H/5 below the bottom edge of the symbol, center it on the symbol, then shift it left by H/100. This is because the E block of the EO symbol has the higher tonal value, which shifts the visual center to the left.
![descriptor-h] Horizontal — set in Founders Grotesk Regular, type size 1.3H, tracking 0, with a separate tracking of -6% applied only to the space characters between words. Place the left side of the cap box W/2 from the right edge of the symbol, and raise the baseline H/10 above the bottom edge of the symbol.


### Signature
#### + Clearspace {layout=grid-2}
The signature also needs space around it, on the same principle as the EO symbol. The base unit, however, differs by form.

![clearspace-v] {zoom=1.05} Vertical — with H as the vertical height of one E block, keep a clearspace of at least H/2 on all four sides around the whole signature.
![clearspace-h] {zoom=1.6} Horizontal — based on the cap height of the uppercase E in the descriptor, keep a clearspace of at least one cap height on all four sides around the whole signature.


### Signature
#### + Scalability
As in the Symbol section, sizes on this page are given as the symbol height on a 16-inch Mac display (about 5px/mm) viewed from 500mm. On other media, convert using the ratio in parentheses (symbol height relative to viewing distance).

The smaller the signature is seen, the more the symbol and descriptor read as a single mass; the larger it is seen, the more each letter of the descriptor comes into focus. The form therefore depends on the visible size, and the threshold is a symbol height of 10mm (50px, 1/50).

- **Below 10mm (50px, 1/50), use only the horizontal signature.** The horizontal form keeps the symbol and descriptor evenly visible even at small sizes. Above 6mm (30px, 1/80), the space between the words of "EO Studio" becomes noticeable, and the signature can appear split into three masses: symbol · EO · Studio. Within the 6-10mm range, consider using the "Studio" version as an alternative.
- **At 10mm and above, use only the vertical signature.** From this size, the descriptor of the vertical form (cap height about 2.4mm) reads clearly. The recommended maximum size is a symbol height of 15mm (70px, 1/33), and the maximum is a symbol height of 25mm (125px, 1/20).
- As with the minimum size of the symbol, do not use the signature below 4mm (20px, 1/125) either.
![scalability] {zoom=1.05}


### + Company Signature
#### Vertical

The vertical Company Signature centers "EO Studio" beneath the EO symbol. For its construction, see the vertical specifications in [[#descriptor|Descriptor]].
![company-v] {zoom=1.05}


### Company Signature
#### Horizontal
The horizontal Company Signature places "EO Studio" to the right of the EO symbol. For its construction, see the horizontal specifications in [[#descriptor|Descriptor]].

For anyone who has encountered EO before, the EO symbol may already read as "EO", so consider using only "Studio" in the descriptor of the horizontal form.
![company-h] {zoom=1.6}


<!-- Whether the descriptor includes "EO" (EO Studio / Studio) is on hold for the in-house team to decide (2026-11-10). Until then, do not fix differences in notation between the slides and the captions. -->
### + Service Signature
#### Vertical {layout=grid-4} {zoom=2.05}
Examples of the vertical Service Signature. All are built to the same descriptor specifications; check that they read as one family even though the names differ.
![service-v-studio] 1. EO Studio · company
![service-v-magazine] 2. EO Magazine · web magazine
![service-v-planet] 3. EO Planet · community
![service-v-newsletter] 4. EO Newsletter · newsletter


### Service Signature
#### Horizontal {layout=grid-4} {zoom=3}
Examples of the horizontal Service Signature. All are built to the same descriptor specifications; check that they read as one family even though the names differ.
![service-h-studio] 1. EO Studio · company
![service-h-magazine] 2. EO Magazine · web magazine
![service-h-planet] 3. EO Planet · community
![service-h-newsletter] 4. EO Newsletter · newsletter


### + Usage {layout=grid-2}
#### Symbol or Signature
Choose between the signature and the EO symbol by who is speaking. Use the signature where the company EO Studio, or a service the company runs, is the speaker, and the EO symbol for content from EO as a media brand. Use only one of the two in a single deliverable.

Because the signature carries text, it needs more room than the EO symbol. Where the space is too small for the text to read clearly (below a symbol height of [20px] in digital or [4mm] in print), use the EO symbol alone instead of the signature.

If you are unsure, first check whether the deliverable truly needs the company name EO Studio. If it does not, the EO symbol is enough. If you are still unsure, ask the EO design team.
![usage-do-1]{do} The signature on emails · official documents and other materials that speak for the company
![usage-dont-1]{dont} Do not use the signature as a content sign-off
![usage-do-2]{do} The EO symbol used as a content sign-off
![usage-dont-2]{dont} Do not use the signature and the EO symbol together in one deliverable


### Signature
#### + Color {layout=grid-2}
The signature uses four of the six color pairings of the EO symbol. **Always render the symbol and the type in the same color.**
![color-1] {zoom=1.05} 1. Air White on Space Black
![color-2] {zoom=1.05} 2. Air White on Solid Gray
![color-3] {zoom=1.6} 3. Space Black on Air White
![color-4] {zoom=1.6} 4. Space Black on Builder Neon


### Signature
#### + Inversion {layout=grid-2}
Like the symbol, the signature is built by default as a light signature in bright colors such as Builder Neon · Air White on dark backgrounds such as Space Black · Solid Gray. If you simply invert the colors to use a dark signature on a light background, an optical illusion makes the symbol look thinner and more spread out, and the letters of the descriptor look one step lighter despite the same weight.

- Vertical — Convert the light symbol by the [[symbol#inversion]] rules, and center it in both x · y where the light symbol was. Keep the descriptor centered in its original cap box position, with the baseline in its original position. Keep the weight at Regular and invert only the color, then set the type size to 0.48H · tracking to -1%, and finish by offsetting the outline outward by H/200.
- Horizontal — Convert the light symbol by the same rules, and center it in both x · y where the light symbol was. Left align the descriptor to the left edge of the original cap box, with the baseline in its original position. Keep the weight at Regular and invert only the color, then set the type size to 1.35H · tracking to -1%, and finish by offsetting the outline outward by H/200.

This keeps the [[typography#inversion|tonal value]] balance between the symbol and the descriptor on a light background the same as in the light signature. Center the finished dark signature in x · y on the clearspace of the light signature of the same level, and use it as is.
![inversion-v] {zoom=1.05}
![inversion-h] {zoom=1.05}


### Partner Lockup
#### Horizontal
The EO signature can be locked up with the logos of partner brands and collaborators. The images in this section show examples of the basic lockup.

Optically adjust the elements so that they appear the same size. After matching the size of each logo, you can insert a gap and a divider · collaboration mark between them. Based on the width of one E block (W), set the gap between the EO symbol and the partner logo to 1.5W with a divider and 2W with a collaboration mark.
![partner-h] {zoom=1.05}


### + Partner Lockup
#### Vertical
The EO signature can also be locked up vertically with the logos of partner brands and collaborators. On the right is an example of the basic vertical lockup.

Optically adjust the elements so that they appear the same size. After matching the size of each logo, you can insert a gap and a divider between them. Set the gap between the two logos to 1.5 times the height of the EO signature (H), and place the divider horizontally at its center.

Always keep the logos optically centered.
![partner-v] {zoom=1.05}


### Signature {layout=grid-3}
#### + Don'ts
The signature is a fixed combination with a defined relationship between symbol and descriptor. Do not change or rebuild its components separately.
![dont-1]{dont} Do not use the vertical signature at a size so small that the descriptor is hard to read
![dont-2]{dont} {zoom=2.3} Do not use the horizontal signature at a symbol height larger than 10mm (50px, 1/50)
![dont-3]{dont} {zoom=1.6} Do not use a different typeface for the descriptor
![dont-4]{dont} {zoom=1.6} Do not change the font settings of the descriptor
![dont-5]{dont} {zoom=1.6} Do not break the descriptor onto multiple lines
![dont-6]{dont} {zoom=1.5} Do not use the words "EO Studio" alone as a logo
![dont-7]{dont} {zoom=2.4} Do not combine the sub symbol with a descriptor
![dont-8]{dont} {zoom=1.6} Do not color the symbol and the descriptor differently
![dont-9]{dont} {zoom=1.6} Do not stretch or distort the signature
![dont-10]{dont} {zoom=1.6} Do not apply glow · shadow · gradient effects
![dont-11]{dont} {zoom=1.6} Do not reduce legibility by placing the signature over complex images



## Sub Symbol

### + Sub Symbol
The form that uses the E block · O block detached from the symbol is hereafter called the **sub symbol**. Use it only in very small square spaces where the full EO symbol is hard to recognize, such as favicons · pin badges. Where the size varies by medium, such as app icons · social media avatars, the EO symbol is the default. The designer decides whether to switch to the sub symbol based on the actual visible size, and the EO design team reviews the decision.

The sub symbol cannot fully replace the EO symbol, so always use the EO symbol where there is enough room. Because the E block shares its geometry with the [[graphic-unit#motif|graphic unit]], it connects naturally to the whole graphic system even at small sizes.
![overview] {zoom=1.05}


### Sub Symbol
#### + Clearspace
The sub symbol also needs space around it, on the same basis as the EO symbol. With t as the height of one thread element, always keep a clearspace of at least t on all four sides between the symbol and every adjacent element.

The clearspace is based on a Builder Neon sub symbol on a Space Black background. Because the O block has a lower tonal value than the E block, a separate 1.04x correction is applied.
![clearspace] {zoom=1.05}


### Sub Symbol
#### + Color {layout=grid-2} {zoom=1.05}
The sub symbol uses only two combinations, Builder Neon on Space Black · Space Black on Builder Neon, and each element is always rendered in a single color. In very small spaces such as favicons, optical distortion grows large relative to the size of the shape, so when inverting the colors, scale each block up by 1.1x.
![color-1] 1. Builder Neon on Space Black
![color-2] 2. Space Black on Builder Neon


### Favicon
#### In Use
The image below shows the EO sub symbol applied to a favicon.
![favicon-in-use] {zoom=1.2}


### Sub Symbol {layout=grid-3}
#### + Don'ts {zoom=1.6}
The sub symbol is part of the EO symbol and follows the same principles. Do not alter its shape or decorate it, and do not use it outside its defined purposes.
![dont-1]{dont} Do not stretch or distort the sub symbol
![dont-2]{dont} Do not rotate the sub symbol
![dont-3]{dont} Do not flip the sub symbol horizontally
![dont-4]{dont} Do not add an outline to the sub symbol
![dont-5]{dont} Do not adjust the clearspace arbitrarily
![dont-6]{dont} {zoom=1.08} Do not use the sub symbol as a standalone identity in place of the EO symbol


# 03 Typography

## Typography

### + Brand Typeface
#### Founders Grotesk
EO's typeface is the Founders Grotesk family.

Founders Grotesk reinterprets the early-20th-century grotesques of Miller & Richard and Caslon. Its simple geometry, narrow apertures and tight tracking make it read like solid blocks at large sizes. It gives a clear impression without ornament, and the monospaced member of the same family can evoke the builder's motifs of engineering and spec sheets.

Each weight has a fixed role. Use Medium for display and headlines, Regular for sub-headlines, Light for body copy, and Mono Regular for informational text. For the detailed criteria, see [[#reference-scale|Reference Scale]].
![brand-typefaces]{bg-color}


### Character Set
#### Founders Grotesk Medium
The following image shows most of the characters of Founders Grotesk Medium. Medium is the default weight for display and headlines. It supports Latin Extended characters, including Vietnamese tone marks. For scripts it does not support, such as Hangul, use the typefaces in [[#multilingual]].
![charset-medium]{bg-color}


### Character Set
#### Founders Grotesk Regular
The following image shows most of the characters of Founders Grotesk Regular. Regular is the default weight for sub-headlines (D2 · H2 · H3), bridging the hierarchy between the Medium of headlines and the Light of body copy. In brand communication with short body copy, such as posters · banners, it also serves as body copy at the level directly below the display headline.
![charset-regular]{bg-color}


### Character Set
#### Founders Grotesk Light
The following image shows most of the characters of Founders Grotesk Light. Light is the default weight for body copy. At large sizes its thin strokes look as if they float, so do not use it for display or headlines.
![charset-light]{bg-color}


### Character Set
#### Founders Grotesk Mono
The following image shows most of the characters of Founders Grotesk Mono Regular. As a monospaced typeface, it readily recalls builder motifs such as engineering · spec sheets, so it can serve as a supporting device that enriches a layout. Use it for tags · dates · reading time · color specs · caption numbers, and not for headlines or body copy.
![charset-mono]{bg-color}


### + Typographic Framework {layout=grid-2}
#### Overview {zoom=1.1}
EO typography is **a baseline grid framework measured and scaled from the space type occupies**, not from type settings. Set the value of the Line Unit (the base leading, that is, the absolute height between lines), then set each level's leading as a multiple (x) of it; the type size follows automatically by dividing the leading by the linespacing (leading ÷ type size).

- Separating the setting of hierarchy from the matching of tonal value gives an easier point of entry when a project's typography system has to be built from scratch.
- When [[#multilingual|switching to another language]], the space type occupies stays the same even if the typeface or type size changes, so layout variation is minimal, and adjusting only the tonal value keeps the look and feel consistent.
- [[#inversion|Switching between dark and light mode]] has the same advantage.
- In an AI Assisted Design workflow, two levels of decision can be separated: the AI's efficient layout building and the designer's eye. Leave the broad hierarchy that follows the content logic to the AI, and refine the visual finish through the separately held values, such as linespacing.

Read this chapter in the order the framework is carried out. If you need values ready to use, see the presets in [[#reference-scale|Reference Scale]]. If you are building anew, set the Line Unit following [[#line-unit|Line Unit]] and set up the typography through the five steps of [[#setting-up|Setting Up]]. For the detailed criteria of each step, see [[#levelling-and-sizing|Levelling & Sizing]] · [[#linespacing-founders-grotesk-medium|Linespacing]] · [[#letterspacing-founders-grotesk-medium|Letterspacing]]; for layout, [[#zoning|Zoning]] · [[#margin|Margin]] · [[#compound-grid|Compound Grid]]; for other languages and alternative typefaces, [[#multilingual|Multilingual]].
![framework-1]{bg-cover} **Line Unit** — the base leading of the page. The unit that sets every distance in the layout.
![framework-2]{bg-cover} **Level** — a tier of text divided by role. Each has four parameters: multiple (x) · weight · linespacing · tracking
![framework-3]{bg-cover} **Linespacing** — the ratio of leading to type size. 140% means the leading is 1.4 times the type size
![framework-4]{bg-cover} **Tonal value** — the brightness of a block of text seen from a distance. The criterion for balance between levels


### Typographic Framework
#### + Line Unit {zoom=1.3}
The Line Unit is the base unit of the page. Set the leading of every level as a multiple of the Line Unit; the actual type size is the leading divided by the linespacing (%). From here on, the Line Unit is abbreviated as x: values written in x are multiples of the Line Unit, and values written in % are all linespacing ratios. For example, 2.5x means the leading of that level is set at 2.5 times the Line Unit.

As a rule, base the Line Unit on **the content, or the component of it, that is used most widely · most often and carries the most weight on the page**.

- In content layouts, the leading of the body level usually becomes the Line Unit.
- In visual communication without significant body copy (posters · banners · key visuals), set the Line Unit at 1x or 0.5x the height of the symbol.
- The recommended Line Unit for web and editorial environments is 28px. Adjust it at the designer's discretion to suit the page size and the reader's viewing distance.

Once the Line Unit is set, subtract the top and bottom margins from the full height of the content area, set a baseline grid in whole multiples of the Line Unit, and reuse it across content in the same series. For details on grid and margin, see [[#margin|Margin]] and [[#compound-grid|Compound Grid]].
![line-unit]{bg-color}


### Typographic Framework
#### + Reference Scale {layout=wide}
A seven-level preset based on Line Unit 1x = 28px. The first letter of a level name is the role of its content: D for display, H for headline, T for text, C for caption. This web guideline is set in four of these levels, H1 · H3 · T1 · C1; refer to the unused ones when creating new levels. Each level specifies multiple (x) · weight · linespacing · tracking, and the size in parentheses is the type size rendered on screen at 1x = 28px.

- **D1** — 6x / Medium / 80% / -2.5%. One or two words, such as a tagline or core keyword, on a poster or key visual
- **H1** — 2.5x / Medium / 100% / -1.5% (70px). Main headline · page title
- **D2** — 2.5x / Regular / 100% / -2% (70px). Display at headline level, campaign slogan · sub copy · quotation
- **H2** — 2x / Regular / 115% / -1% (49px). Sub-headline
- **H3** — 1.25x / Regular / 125% / -0.5% [Solid Gray] · 0 [Space Black] (28px). Section head · subhead
- **T1** — 1x / Light / 140% / +1% [Solid Gray] · +1.5% [Space Black] (20px). Body > brand communication first
- **T2** — 1x / Light / 150% / +1.5% [Solid Gray] · +2% [Space Black] (18.67px). Body > readability first
<!-- T2 is an alternative to T1 (a readability-first variant), so it is not counted among the levels. It is never used on the same page as T1 and its tonal value is almost the same, so the slides (Reference Scale · Inversion · Levelling) draw only T1. The mismatch between "seven levels" and the eight list items is intentional; a more logical name might be T1A (alternate) — user decision 2026-11-10 -->
- **C1** — 0.5x / Mono Regular / 111% / -7% (12.6px). Caption · label · tag · spec · date · button

The recommended weight for each level follows these criteria: Medium for display and headlines (D1 · H1), Regular for sub-display and sub-headlines (D2 · H2 · H3), Light for body copy (T1), Mono Regular for informational text (C1). Use Founders Grotesk Semibold only in a limited way, at the designer's discretion, for optical correction when Medium-level display text is inverted onto a light background and set small. To emphasize keywords within body copy, do not change the weight; use the Builder Neon color with an underline.

Set level multiples in steps of 1x · 0.5x · 0.25x, and refine linespacing and tracking so that the tonal value carries consistently from each level to its neighbors. For the adjusted values for Korean and Vietnamese, see [[#multilingual|Multilingual]].

Founders Grotesk has narrow apertures and tight tracking, so at body level set it in Light with generous linespacing and slightly opened tracking. The presets are designed with a focus on visual communication: we recommend T1 for content where the text read in one go runs to only a few paragraphs, and T2 where the readability of body copy matters most.

All the presets above assume Air White text on a Solid Gray background. When Air White text is used on a Space Black background, apply 0.5% wider tracking to the relatively small levels H3 · T1 · T2.
![reference-scale]{bg-color}


### Typographic Framework
#### + Setting Up {layout=grid-3}
How to set up typography in a new medium or format. This is less a fixed sequence than a process of converging on the best result by tuning steps 3-4 against each other.

1. Decide the number of typography levels. Decide which levels to use based on the amount of information shown on the page. For details, see [[#levelling-and-sizing|Levelling & Sizing]].
2. Set the Line Unit and set a baseline grid in the content area of the page. As a rule, size the Line Unit from the content, or the component of it, that carries the most weight or occupies the most space on the page. For details on the Line Unit, see [[#line-unit|Line Unit]]; for grid setting, [[#margin|Margin]] · [[#compound-grid|Compound Grid]].
3. Place the content on the grid and set the hierarchy with each level's multiple. Set the multiples in steps of 1x · 0.5x · 0.25x. For details, see [[#levelling-and-sizing|Levelling & Sizing]]. Starting from the values in [[#reference-scale|Reference Scale]] and adjusting them to the medium also works well.
4. Refine weight · linespacing · tracking · color · line breaks for each level to match the tonal value. Tonal value is the brightness of a block of text seen from a distance; it is right when every level looks like the same text enlarged · reduced, at the same brightness. Place the levels side by side and squint, or zoom the screen out, and the differences show. As a rule, the larger the type, the lower the linespacing; the smaller the type, the higher. For details, see [[#linespacing-founders-grotesk-medium|Linespacing]].
5. Repeat steps 3-4 until the levels reach a balance in which they look consistently enlarged · reduced according to the hierarchy.
![setting-up-1]{bg-color} 1. Decide the number of levels
![setting-up-2]{bg-cover} 2. Set the Line Unit and set a baseline grid in the content area.
![setting-up-3]{bg-color} 3. Place the content on the grid and set the hierarchy with each level's multiple
![setting-up-4]{bg-color} 4. Match linespacing and tonal value
![setting-up-5]{bg-color} 5. Repeat steps 3-4 to complete the layout


### Typographic Framework
#### + Levelling & Sizing {layout=wide}
Divide levels by the role of the content. The one or two words that represent the page are display (D), the point where reading starts is headline (H), the text read down the page is text (T), and the information supporting the text is caption (C). Numbers within a role run in order of size.

- **Number of levels** — Headline and body, or headline · body · caption. Dividing levels by role is the default, but the difficulty of keeping typography consistent rises steeply with too many levels, so first consider whether information of similar role and priority can be merged into one level.
- **Contrast between levels** — The look and feel of typography is largely decided by the degree of contrast between adjacent levels. For roles to be told apart at a glance, the step from body (1x) to headline must be at least double (2-3x), and so must the step from headline to display. Within a role that handles detailed content (H2 → H3), a multiple of about 1.5 is appropriate. Keep all multiples to steps of 1x · 0.5x · 0.25x so that they fit the baseline grid.
- **Symbol and levels** — Treat the symbol like a level. Setting 1x or 0.5x of the symbol height as the Line Unit ties the symbol and the typography to the same unit. The size of the symbol follows [[symbol#scalability]].

As a rule, the larger the level, the heavier the weight and the tighter the linespacing and tracking. In practice, though, levelling is less a linear procedure in table-of-contents order than a process of tuning [[#linespacing-founders-grotesk-medium|Linespacing]] · [[#letterspacing-founders-grotesk-medium|Letterspacing]] · weight against each other at the same time. For the preset values, see [[#reference-scale|Reference Scale]].
![levelling-sizing]{bg-color}


### + Linespacing
#### Founders Grotesk Medium
Linespacing is the height of the space one line of type occupies divided by the type size, expressed in % as in common office software. In the same space, lower linespacing makes the type larger. It corresponds to Line height % in Figma, line-height in CSS and Auto Leading in InDesign. Linespacing can vary with format and type of communication; for the presets by level, see [[#reference-scale|Reference Scale]].

Headlines and display have linespacing of 100% or less, that is, leading equal to or tighter than the type size. The goal is for the lines to read as one block, and the lower limit is the point just before ascenders and descenders touch. Avoid extremely loose or tight linespacing, and where possible consider revising part of the copy.
![linespacing-medium]{bg-color}


### Linespacing
#### Founders Grotesk Regular
The linespacing of sub-headlines (H2 · H3) sits between headline and body (115-120%). They often run to 2-4 lines, so apply wider leading than headlines to raise readability somewhat. D2, the Regular at headline size, follows the same leading rule as headlines.

Sub-headlines often sit directly above body copy, so also check that their leading does not fall out of step with the body's baseline grid.
![linespacing-regular]{bg-color}


### Linespacing
#### Founders Grotesk Light
Body copy creates its reading rhythm with leading wider than the type size. The longer a line, the more leading it needs, so the eye does not lose the next line. Too wide, though, and the lines drift apart, the paragraph scatters and the visual finish suffers. Within the range that secures readability without strain, tighten the leading little by little until a consistent gray mass forms.

In content-centered layouts, the leading of the body copy becomes the [[#line-unit|Line Unit]]. Changing the body's Line Unit stretches or shrinks the whole digital layout vertically at the same ratio.
![linespacing-light]{bg-color}


### Linespacing
#### Founders Grotesk Mono Regular
Captions · labels · tags · specs (C1) are short, one or two lines, with small type. Mono has wide letters and a large x-height, so with leading as open as body copy the lines look as if they float; set it at a tighter ratio than body copy.

The leading of C1 is half the Line Unit. Two lines of caption equal the height of one line of body copy, so informational text also sits on the same baseline grid.
![linespacing-mono]{bg-color}


### + Letterspacing
#### Founders Grotesk Medium
In large type the spaces between letters look larger too, so tighten the tracking. The reference point is where the letters sit together like one block but the strokes stop just short of touching (some horizontally open glyphs may touch each other). Too tight, and combinations of consecutive vertical strokes read as one mass; too loose, and words scatter into letters and the headline loses its weight.
![letterspacing-medium]{bg-color}


### Letterspacing
#### Founders Grotesk Regular
Because the inherent tonal value of Regular is lower than that of Medium, securing a tonal value at sub-headline level close to that of the headline level calls for relatively tighter tracking. For example, H1 uses Medium at -1.5% tracking, while D2, at the same type size, applies an even tighter -2%.
![letterspacing-regular]{bg-color}


### Letterspacing
#### Founders Grotesk Light
In small type the spaces look relatively small, so open the tracking to around 1-1.5%, taking light text on a dark background as the reference. Because the thin weight loses readability quickly when tracked tighter, find the compromise according to which matters more, uniform tonal value or readability.
![letterspacing-light]{bg-color}


### Letterspacing
#### Founders Grotesk Mono Regular
By nature, Mono is highly distinguishable even at small sizes, but its readability as running text is low, so tighten the tracking to around -7%. If many long words make the lines run long, consider switching to the body typeface.
![letterspacing-mono]{bg-color}



### + Alignment {layout=grid-2}
Content in EO brand communication is left aligned by default. Center alignment is allowed only when the text is a single line, as with standalone symbol icons and merch back prints; do not use justified text. When body copy runs in several columns, align the first-line baselines of all columns. Align the symbol left to the image's left edge and the caption right to its right edge. A single left alignment line becomes the reference line of the page: headline · sub-headline · body start from the same line, and the reader starts reading at the same place on every line. Right alignment loses that reference because the start of each line moves, and justified text opens the word spaces and makes the tonal value uneven. This rule applies to every weight.

The exception is informational text (C1 · Mono). A caption beneath an image may be right aligned to the right edge, paired with the symbol left aligned to the left edge, and a caption attached to a simple graphic such as an icon · shape · illustration may be center aligned above or below it. All other Mono text is left aligned like the other levels, and justified text is not used for Mono either.
![alignment-medium]{bg-color} Headline (Medium) — left aligned by default; center · right · justified are not used
![alignment-regular]{bg-color} Sub-headline (Regular) — same rule as the headline
![alignment-light]{bg-color} Body (Light) — same rule as the headline
![alignment-mono]{bg-color} Informational text (Mono) — captions at an image edge may be right aligned and captions of simple icons · shapes may be center aligned. Justified is never used


### + Ragging
A paragraph has a bad rag when its edge feels irregular, when a particular line sticks out, or when a single word is left alone on the last line.

Headlines are short with few lines, so the rag shows plainly. Break lines so that each line holds a unit of meaning, as in "Build / Anyway.", and avoid the staircase shape of alternating long and short lines. In body copy, move words to the next line until the edge is even and the copy reads well.
![ragging]{bg-color}


### Grid Setting
#### + Zoning {layout=grid-2}
Divide the page into a graphic pattern area and a content area. Ideally the graphic pattern area is close to a square on 3:4 · A-series · business card formats, takes around 70% of the page on horizontal wide formats, and around half on vertical roll-ups. Communication pages with little information may also be divided into four, with content alternating with the pattern or gathered to one side. Typography in the content area runs left and top aligned, so when splitting the page side by side, prefer placing the graphic pattern area on the right; when splitting it top and bottom, at the top.

Place the graphic pattern area full bleed, ignoring the margin, and arrange its units following [[graphic-pattern#zoning]]. For the boundary between the two areas, set the [[#compound-grid|Compound Grid]] first, check the right proportion of the areas against its columns · rows, and align the boundary to the nearest line. If it does not fall exactly on a line, adjust it to the midline of a column · row or to a baseline.

The content area is what remains, and margin and grid are set from this area. In a four-way division, use one of the divided content areas as the reference. For pages whose front and back are linked, such as business cards, use the side that carries the main content.


![zoning-ratio]{bg-color} Examples of the proportion between graphic pattern area and content area
![zoning-4-division]{bg-color} Four-way division, with content and graphic pattern areas alternating diagonally or gathered to one side


### Grid Setting
#### + Margin {layout=grid-2}
Set the margin of the content area equal on all four sides, based on 1/24 of the area's long side; we recommend setting the horizontal margins about 10% narrower. The final value settles between 1/22 and 1/25 as the number of baseline cells is matched in [[#compound-grid|Compound Grid]]. On pages read up close the margin is about the same scale as the Line Unit; on pages seen from a distance it can shrink to around 70-80% of the Line Unit.

On a side where typography meets the [[graphic-pattern#pattern-margin|graphic pattern]], leave about 1.5 times the margin. The top edge of typography is a gray edge, because the tops of the letters are uneven, so compensate with more space than at crisp edges such as the left alignment line · the baseline · the left and bottom of the symbol. Text is left aligned, so its right side does not meet the pattern.
![margin-24]{bg-color} Margin — 1/24 of the content area's long side, equal on all four sides, or with the horizontal margins corrected about 10% narrower
![margin-compensation]{bg-color} Margin next to the pattern corrected to 1.5 times; the top of typography is a gray edge, so give it more room than the crisp left alignment line · baseline


### Grid Setting
#### + Compound Grid {layout=grid-2}
The base grid is a baseline grid in whole multiples of the Line Unit. The margin is set first in [[#margin|Margin]] from the content area, and settles between 1/22 and 1/25 as the number of baseline cells N is matched. Then verify that the margin falls within 0.8-1.1 times the Line Unit on pages read up close, and 0.7-0.8 times on pages seen from a distance.

For large pages or layouts with complex components, we recommend the Compound Grid, which combines a modular grid with this baseline grid. It is a modular grid that divides the content area evenly with gutters of one Line Unit, and since the height of a module cell is also a whole multiple of the Line Unit, it is fully compatible with the baseline grid.

- **Compound Grid rows** — The Compound Grid can be applied when the total number of baseline cells satisfies **N = number of rows R × (Line Units per row n + 1) − 1**. For example, 35 cells divide into 6 rows × 5 cells or 4 rows × 8 cells. 47 cells allow 4 · 6 · 8 · 12 rows alike, making it the most flexible. With the gutter between rows widened to 2 cells, 47 cells also divide into 7 rows × 5 cells.
- **Compound Grid columns** — 12 columns × 6 rows are commonly used on 16:9 pages and 6 columns × 6 rows on A-series formats, but set the number freely at the designer's discretion. On A-series or similarly proportioned pages, set it from the page proportion so that the graphic pattern area comes close to a square. The gutter between columns is 1x the Line Unit.
![grid-row]{bg-color} 47 cells — 6 rows × 7 cells · 8 rows × 5 cells · 7 rows × 5 cells (2-cell gutter), row gutters of 1-2 cells
![grid-column]{bg-color} Column grid — on the same 35 cells, 12 columns for 16:9 · 6 columns for A-series, column gutter of 1x the Line Unit


### Typography
#### + Inversion {layout=wide}
Like the [[symbol#inversion|symbol]], EO typography is built primarily for light text, such as Air White · Medium Gray, on dark backgrounds such as Solid Gray · Space Black. When you want dark text on a light background and simply invert the colors, an optical illusion occurs: at the same weight and tracking, the letters look one step thinner and the spaces between them look wider. It is the same phenomenon as in the [[signature#inversion|signature's descriptor]].

In that case, keep the Line Unit · level multiples · weights as they are, scale each level's linespacing to 95% (so the type size becomes 1.05 times), and tighten the tracking by 0.5%. The tonal value then stays almost the same as that of light text on a dark background, and because the space the type occupies is unchanged, the layout stays as it is.

Below is an example of the same presets applied to the seven-level [[#reference-scale|Reference Scale]] and set in light mode.
![inversion]{bg-color}


### + Multilingual {layout=wide}
Use Pretendard for Korean and Noto Sans for Vietnamese. When an existing layout is changed to a multilingual typeface, the Line Unit and level multiples stay the same, so the layout does not move when the language changes; only the type size and linespacing change to suit the typeface.

- Korean Pretendard — T1 of the [[#reference-scale|Reference Scale]] is Regular · 165% · -1.5% · baseline +0.2x, and H3 is Medium · 165% · -2.5% · baseline -0.05x. The rendered type size equals 85% of Founders Grotesk at the same level.
- Vietnamese Noto Sans — T1 is DemiLight · 175% · -1% · baseline +0.05x, and H3 is Regular · 175% · -3% · baseline +0.05x. The rendered type size equals 80% of Founders Grotesk at the same level.

The baseline correction is for matching positions relative to the text box in editorial design tools. In digital environments the browser aligns baselines by itself, so on the web the correction is rarely needed, but where type is shown large, as with display fonts, correct it with a separate margin inside the text box.

These two typefaces are also the alternatives in environments where Founders Grotesk cannot be used (email, system-font restrictions on external platforms and document tools, and so on). In that case, set English in Pretendard first as well, and use Noto Sans where Pretendard cannot be used or does not support the language.
![multilingual]{bg-color}


### Typography
#### + Don'ts {layout=grid-3} {zoom=1.35}
Below are the things not to do with typography in brand communication. To keep consistency across every touchpoint, follow the typesetting rules and recommendations of this chapter. How far individual service · product · content design prioritizes brand communication consistency is at the designer's discretion or follows the EO design team's policy.
![dont-1]{dont bg-color} Do not stretch or distort type
![dont-2]{dont bg-color} Do not set headlines in all caps
![dont-3]{dont bg-color} Do not use Light for headlines or Regular · Medium for body copy
![dont-4]{dont bg-color} Do not use two or more colors in a headline
![dont-5]{dont bg-color} Do not center or right align headlines
![dont-6]{dont bg-color} Do not use two or more weights within one level
![dont-7]{dont bg-color} Do not apply outlines · italics to type
![dont-8]{dont bg-cover} Do not overlay typography on the graphic pattern
![dont-9]{dont bg-color} Do not use Mono for headlines or body copy
![dont-10]{dont bg-color} Do not use typefaces other than those specified
![dont-11]{dont bg-color} Do not place text off the baseline grid


# 04 Color

## Colors

### Primary Color
#### Builder Neon
Builder Neon stands for the window of a hacker house whose lights stay on all night, and for the optimism of the builders making something inside. At night it is a signal that stays lit through a builder's loneliest hours; by day, set against the blue sky of San Francisco, it is the first mark to catch the eye.
![builder-neon] 


### Secondary Colors
#### Day Blue & Bay Green
Day Blue and Bay Green are cool tones drawn from the nature of the Bay Area. Day Blue takes its cue from the crisp air of San Francisco, Bay Green from the greenery of the chaparral hills that run along the coastal ridges. As supporting colors, both make their complement, Builder Neon, appear even more vivid.
![builder-blue-green]

### Color
#### EO Palette {layout=grid-4}
The EO palette consists of Builder Neon · Day Blue · Bay Green and four neutral colors that support them. Solid Gray and Medium Gray carry the the neutral stance of a media brand: use the darker one as a background color and the lighter one for graphic elements. Space Black and Air White are the foundation for backgrounds and text.

Each color is specified in HEX · RGB for screen and in CMYK · Pantone for print. Use the color mode that matches the medium. In print, Air White can be left as unprinted white paper.
[swatch] Builder Neon | #F9EE3A | R249 G238 B58 | C5 M0 Y95 K0 | PANTONE 3945 C
[swatch] Day Blue | #6EC6D2 | R110 G198 B210 | C60 M0 Y10 K0 | PANTONE 298 C
[swatch] Bay Green | #66B88A | R102 G184 B138 | C60 M0 Y50 K0 | PANTONE 2248 C
[swatch] Medium Gray | #8E8E8E | R142 G142 B142 | C2 M0 Y0 K45 or K45 only
[swatch] Solid Gray | #2A2B2B | R42 G43 B43 | C4 M0 Y0 K95 or K95 only
[swatch] Space Black | #000000 | R0 G0 B0 | C60 M60 Y0 K100
[swatch] Air White | #FCFBF5 | R252 G251 B245 | C1 M2 Y2 K0 or raw paper


### Color
#### Usage Ratio

Use Solid Gray or Space Black as the default background; in media that allow photography, the San Francisco sky itself becomes the background. For graphic elements placed on the background, the recommended ratio is Builder Neon 50%, Day Blue · Bay Green 30%, and Medium Gray · Air White 20%. Set text in Air White or Space Black, at around 10% of the overall composition. In text-led media, the share of background rises; in pattern-led media, the share of Builder Neon rises. In contexts where the EO brand is already clearly recognized, such as social channels or series artwork, Day Blue · Bay Green may be used more freely than the recommended ratio allows.

For detailed application by element, see the Color section of each page.

- Logo
  - For color use of the symbol, see [[symbol#color]].
  - For color use of the signature, see [[signature#color]].
  - For color use of the sub symbol, see [[sub-symbol#color]].
- Graphic system
  - For color use of the graphic unit, see [[graphic-unit#color]].
  - For color use of the pattern, see [[graphic-pattern#color]].
![usage]


### Color {layout=grid-2}
#### In Use
The following images show the EO palette applied across a range of designs.
![color-in-use-1] 1. ?
![color-in-use-2] 2. ?
![color-in-use-3] 3. Street banner
![color-in-use-4] 4. Outdoor flag

### Color {layout=grid-3}
#### Don'ts {zoom=1.3}
To keep EO's colors consistent, avoid the following. For the minimum contrast between text and background, refer to the WCAG guidelines.
![dont-1]{dont} Do not use Builder Neon for all body text or for text on light backgrounds
![dont-2]{dont} Do not create gradients
![dont-3]{dont} Do not add colors outside the palette (request them from the EO design team if needed)
![dont-4]{dont} Do not use unapproved color combinations
![dont-5]{dont} Do not use low-contrast combinations such as Day Blue · Bay Green · Medium Gray
![dont-6]{dont} Do not create new tones by changing brightness · saturation · opacity (request them from the EO design team if needed)




# 05 Graphic System

## Graphic Unit

### Graphic Unit
#### + Motif {layout=grid-2}
Like the [[symbol#motif|EO symbol]], the **EO graphic unit** (hereafter, the unit) takes its motif from the three parts of a screw: shaft · thread · head.

- Thread — One turn of the thread symbolizes one cycle of problem solving. The harder the wall it meets, the stronger the resistance and the longer it takes to break through. The tighter the threads, the more densely the builder's time is filled (Build thorough).
- Shaft — The shaft symbolizes the process of building and the builder's journey. The shaft size expresses how strong the core qualities of that process are.
- Head — The head symbolizes one small problem solved, or one builder. Many small screws together can build anything (Build anything). Likewise, a problem one builder cannot solve is eventually solved when many builders face it together (Build together).
![motif-1] {zoom=1.17}
![motif-2]


### + Parameters {layout=grid-3}
The **EO graphic unit** (hereafter, the unit) is the smallest element of the graphic system. The logo's E block, the pattern library and application graphics are all built with the same system. Units are generated from parameters in EO Graphic Builder; for detailed instructions, see the Help menu inside the tool.

- shaft size — The thickness of the shaft rectangle, as a percentage of the unit's total height including the threads on both sides. At around the default of 35%, the shaft size makes it easy to keep visual density ideal even in relatively complex graphic patterns.
- thread top, bottom width — The width of the thread's top and bottom edges. The thread is a trapezoid abstracted from a screw thread: its right side stands vertically at the end of the column, its left side slants, and the lower thread is the upper one rotated 180° about the column center. The difference between the two values sets the thread's slope. Defaults are top 40% · bottom 0% (the percentage taken off the column width).
- thread sides — With double, threads attach to both the top and bottom of the shaft; with single, threads attach to one side only and the shaft rests at the bottom.
- thread amount — The number of threads attached to each of the top and bottom of the shaft.
- thread compression — How much the thread width narrows progressively toward one side. At 0, all threads have equal width; the higher the value, the stronger the compression toward one side. Negative and positive values set the direction of compression; the slope of each thread stays as it is and does not flip.
- thread gutter — The space between the vertical cells in which the threads sit. In EO Graphic Builder it is labeled gutter.

![param-shaft-size] shaft size — shaft thickness 2-95%
![param-thread-width] thread top, bottom width — change in slope
![param-thread-sides] thread sides — double · single
![param-thread-amount] thread amount — number of threads
![param-thread-compression] thread compression — direction · strength of thread compression
![param-gutter] thread gutter — fixed spacing between threads


### Graphic Unit
#### + Color {layout=grid-2} {ratio=16:9} {zoom=1.042}
Color shows who the protagonist of a graphic is, what forms the environment, and where a state changes. Use it as a supporting device that complements the nuance of Vocabulary. For more specific combination rules, see [[graphic-pattern#color]].

**Apply only one color to each unit.**
- Builder Neon — The main color, highest in hierarchy, expressing the nuance of the builder · protagonist · focus · highlighting. It works best when it covers 20-50% of the whole page.
- Air White — A neutral color, high in hierarchy but without identity, expressing the nuance of energy · the counterpart · semi-highlighting. It works best when it covers 10-30% of the whole page.
- Day Blue — Builders of a different character · community · surrounding elements. Emphasizes the nuance of positive energy · optimism drawn from a blue sky.
- Bay Green — Builders of a different character · community · surrounding elements. Emphasizes the nuance of softness · friendliness drawn from the green of California's chaparral hills. (team, teamwork, co-working, diversity, nature)
- Medium Gray — Expresses the nuance of mechanical neutrality: inactivity · the other · indifference · conservatism.
- Space Black — For situations where visual impact comes first. Use it sparingly, only in a fixed combination with a Builder Neon background, to express overwhelming presence.
- Solid Gray is not used as a unit color.
![color-neon-white] [Builder Neon]builder · protagonist · core, [Air White]energy · counterpart · balance
![color-blue-green] [Day Blue]other builders · surrounding elements · optimism, [Bay Green]other builders · surrounding elements · friendliness
![color-gray] [Medium Gray] inactivity · the other · conservatism · the material world
![color-black-on-neon] [Space Black] on [Builder Neon] fixed combination, overwhelming presence


### + Vocabulary
A unit takes on new meaning through its direction, number and density alone. The shaft, for example, is the passage of time and the thread a unit of problem solving, so the more tightly threads gather in a narrow stretch, the harder and longer the time they express. The visual intensity of that stretch naturally grows with it. When a parameter-based shape and the value the brand wants to convey point in the same direction like this, we call it **visual-to-brand mapping**.

Vocabulary is the dictionary of the EO graphic system that collects these mapping rules. It gives comprehensive guidance on which visual properties and colors to combine to express a given value keyword. The rules below are those defined so far, not a complete set; new metaphors can be added at any time.

This section mainly covers keyword expression; for guidance on visual quality, see [[#morphology|Morphology]] and [[graphic-pattern#grammar]]. For docking, the way two units are aligned, see [[#morphology-docking|Docking]].
![vocabulary-overview] {zoom=1.1} {bg-cover}


### Vocabulary
#### Thread {layout=grid-3} {zoom=1.15}
A thread is one turn of a screw thread and stands for one act of problem solving. How tight the threads are within a unit · which way they lean · how long they run express the character of that time. Keywords expressed with thread: adversity · acceleration · lightning · builder.

- Adversity — A time of difficulty, resistance from the environment. Expressed by laying the unit horizontally. Tighter threads express greater difficulty; which end is tighter shows whether the hardest stretch comes at the start or at the end.
- Acceleration — A change in thread density can feel like acceleration, a stretch where momentum builds. When compression tightens in the direction of travel, it reads as acceleration; reversed, as deceleration. Units repeated end to end can also read as a recurring, routine-like flow.
- Lightning — Spark · inspiration · energy. When the shaft is long enough and the thread compression spreads relatively gently, the unit can resemble a bolt of lightning. Use only Builder Neon · Air White for this metaphor.
- Builder — A single builder · person · entity. Expressed by standing the unit vertically. Compression tightens the bottom, and the direction in which the upper threads lean is the direction the figure faces. Use Builder Neon for a unit that represents EO or the protagonist, Air White for a unit with a stake in the story but not the protagonist, Day Blue · Bay Green for peers · friends, and Medium Gray for others · hostile presences.
![thread-adversity] Adversity — threads tightening along the timeline
![thread-acceleration] Acceleration — threads with compression weighted in the direction of travel
![thread-lightning] Lightning — long, thin threads with gentle compression
![thread-builder] Builder — compression weighted at the bottom, as if standing on the ground


### Vocabulary
#### Shaft {layout=grid-3} {zoom=1.15}
The shaft is the axis of the screw and symbolizes the timeline of the building process; the shaft size expresses how strong the core qualities of that process are. Keywords expressed with shaft: growth · diversity · support.

- Growth — Conviction · magnitude of strength. Expressed by three or more shafts thickening step by step.
- Diversity — Differences in character. Expressed by placing several units with different shaft sizes side by side in random order. The larger the shaft size, the shorter the threads, so each unit's impression changes markedly; the nuance is not that thicker is better, but that each is different. Use an even mix of [[graphic-pattern#color|unit colors]].
- Support — The side that bears or receives weight (Backing). With threads on one side only, the shaft on that side becomes the ground and the threads stand on it; the taller the threads and the steeper their slope, the more dramatic the expression.
- Apply Builder Neon to the unit that represents EO or the protagonist.
![shaft-growth] Growth — shafts thickening step by step
![shaft-diversity] Diversity — several units of varying shaft size placed side by side in random order
![shaft-support] Support — expressed through the relationship between two threads with different shaft sizes


### Vocabulary
#### Pair {layout=grid-3} {zoom=1.1}
Connecting two units creates a new relationship. Different contexts arise from whether they combine horizontally or vertically, and whether they face the same or opposite directions. Keywords expressed with pair: journey · momentum · wave · peers · rivals · house.

- Journey — Length of time, a recurring process. Expressed by docking two horizontal units with the same compression direction. It shows one chapter ending and the next beginning; repeated, it becomes a routine · cycle. Apply the same color to a docked unit pair.
- Momentum — The moment acceleration crosses a threshold and changes direction. Expressed by inverting two horizontal units about the center and docking them at the ends where their threads are loosest. Adjust compression so that in both states the eye is drawn to the middle.
- Wave — Pulse · frequency · a spreading signal. Expressed by inverting two lightning units with point or mirror symmetry and joining them at the ends where their threads are loosest.
- Peers — Two figures standing together. Expressed by standing two vertical units side by side, facing the same direction. Apply Builder Neon to the unit representing EO or the protagonist, and another color that suits the peer's character to the peer unit.
- Rivals — Opposition · competition. Expressed by standing two vertical units side by side, facing each other. Apply Builder Neon to the unit representing EO or the protagonist, and Air White · Medium Gray to the rival unit.
- House — Shelter · community · EO House. Expressed by standing two vertical units side by side, facing outward, so their silhouette forms a roof. For EO House, apply Builder Neon to both units, or Builder Neon to the left unit and Day Blue to the right.
![pair-journey] Journey · routine — docked in the same direction
![pair-momentum] Momentum — two states docked after center inversion
![pair-pulse] Wave — two lightning units docked with point · mirror symmetry
![pair-peers] {zoom=1.36} Peers — two vertical units, same direction
![pair-rivals] {zoom=1.36} Rivals — two vertical units, facing each other
![pair-house] {zoom=1.15} House — roof silhouette (EO House)


### Vocabulary
#### Formation {layout=grid-3} {zoom=1.12}
Extending the metaphors so far into larger arrangements expresses the relationships · spaces · worlds · dimensions they belong to. Keywords expressed with Formation: scale · dimension · direction · radiation · crossing.

- Scale — Multiple entities · processes · states. Repeat an existing metaphor. Consider using color even more actively: a single Builder Neon among many Medium Gray units, for example, is the protagonist within them.
- Dimension — Parallel worlds. Blend a pair in geometric progression. If one line is a single timeline, stacked lines become multidimensional space-time or parallel worlds. A single Builder Neon among Medium Gray timelines is the present timeline.
- Direction — Expresses drive · flow. Place mirrored units in parallel along the shaft axis so that the negative space between them takes the shape of arrows, pointing regularly to one side.
- Radiation — Bursting energy · resonance. Mirror the directional pattern above. Consider Builder Neon at the source of the energy.
- Crossing — Simultaneous · instantaneous sync. Stack lightning units in alternating order, placing their vertices · edges with tension.
![formation-scale] Scale — extending the metaphor of the same unit · group
![formation-dimension] Dimension — space-time · parallel worlds
![formation-direction] Direction — drive · flow
![formation-radiation] Radiation — bursting energy · resonance
![formation-crossing] Crossing — simultaneous · instantaneous sync


### + Morphology
Any unit can be made easily with a few parameters, but a well-formed unit comes from proportion and rhythm, not from absolute values.

- Vocabulary covers the meanings and metaphors that units and pairs carry.
- Morphology covers how a word with the same meaning should ideally look: the proportion and rhythm of a single unit.

This section provides a checklist for visually ideal units and recommended parameter ranges. These are not absolute standards; let the designer's aesthetic judgment decide the final parameter values. For rules on combining multiple units, see [[graphic-pattern#grammar]].
![morphology-overview] {zoom=1.1} {bg-cover}


### Morphology {layout=grid-4}
#### Proportion
A defining feature of the EO graphic unit is that its size and aspect ratio can be transformed freely. Not every proportion, however, works visually.

- We recommend units that read as long along the shaft axis. When the shaft turns squat, all the threads bunch together, which does not suit the intended metaphor. As an exception, units used within a complex pattern · at its periphery may take a squat shape.
- Units that are thin and long like a straight line along the shaft axis are not ideal either. The threads stretch along the long shaft until the original metaphor is no longer recognizable, and formally the gutters grow excessive, so avoid them.
![proportion-flat-do]{do} Unit that reads as moderately long along the shaft axis
![proportion-flat-dont]{con} Squat unit widened perpendicular to the axis, its threads bunched together
![proportion-line-do]{do} Unit whose moderately long shaft is balanced like a body
![proportion-line-dont]{con} Unit whose shaft stretches into a thin line, its threads stretched long with it


### Morphology {layout=grid-4}
#### Rhythm
Raising the compression value tightens the threads toward one side and creates rhythm. In general, we recommend an absolute compression value of 1.5-2.5.

- When thread proportion and spacing are constant, the rhythm turns monotonous; the unit looks flat, like stripes, and struggles to create visual interest.
- Only with enough compression do the threads form a rhythm and gain movement. As tight lines converge on the unit's edge, they create visual tension and deliberately bring flow to a still plane.
- With too much compression, threads squeezed to hairline thickness repeat at the tight end and become just as dull. In that case, reduce the thread amount or lower the compression slightly to cut the repetitions. Or lower the thread gutter so the stretch merges into a single gray band, which largely offsets the repetitive feel.
- Short units tend to avoid monotony even with a small thread amount and mild compression, because each thread's shape stands out. Long units, by contrast, reach a good rhythm with a large thread amount and strong compression.
![rhythm-uniform-do]{do} Compression that creates a good rhythm
![rhythm-uniform-dont]{con} Monotonous unit with constant spacing
![rhythm-length-do]{do} Thread amount and compression suited to a long unit
![rhythm-length-dont]{con} Unit made monotonous by mild compression
![rhythm-excess-do]{do} Compression that converges on the edge and creates movement
![rhythm-excess-dont]{dont} Unit with excessive compression, hairlines repeating at one end


### Morphology {layout=grid-4}
#### Density
Seen up close · large, each thread reads as a distinct shape; seen from afar · small, adjacent shapes merge into a gray mass of even density. The edge of the gray mass changes with compression, and its density with the thread gutter and thread slope. The thread gutter is the minimum spacing between threads and decides whether tight threads read as individual lines or merge into a gray mass. For digital assets at typical resolutions, we recommend a thread gutter of about 10-20px.

- Tight stretches almost always look better merged into a gray mass. Rather than exposing threads that repeat evenly at hairline thickness, lower the thread gutter so the stretch merges into a narrow band at the end of the unit. For digital assets at typical resolutions, the thread gutter rarely goes above 30px.
- A Space Black unit shrinks visually on a light background, and the gray mass at the tight end can scatter into individual threads, breaking the original rhythm. When inverting from a light to a dark color (or the reverse), reset the thread gutter and compression.
![density-mass-do]{do} Tight stretch merged into a gray mass by a small thread gutter
![density-mass-dont]{dont} Stretch where a large thread gutter makes each hairline stand out
![density-inversion-do]{zoom=2} {do} Unit with thread gutter and compression reset on inversion
![density-inversion-dont]{zoom=2} {dont} Unit with values left unchanged and only the color inverted


### Morphology {layout=grid-4}
#### Shape
The difference between the widths of the thread's top and bottom edges. It determines the thread's sharpness and the area it occupies, and affects the [[typography#typographic-framework-overview|tonal value]] of tight compression stretches. A thread whose diagonal takes up about 60% of its area is ideal, so we recommend a thread top width of 35-50% and a bottom width of 0-20%.

- A thicker shaft makes the threads shorter and their slope gentler. When adjusting the shaft size, keep in mind that the thread slope moves with it.
- The more units a pattern holds, the more the threads merge into a gray mass rather than reading as individual slopes. Keep thread top, bottom width within the recommended range where possible, and adjust it only to fine-tune tonal value. Close-ups with thread sides set to single are the exception, since there the thread slope becomes the key metaphor.
![shape-do]{do} Thread at top 40% · bottom 10%
![shape-dont]{dont} Thread with top · bottom outside the recommended range


### Morphology {layout=grid-4}
#### Docking
Docking is the way to handle the seam when two units of the same color are joined along the shaft axis to form one long unit. At the joint, the thread spacing must continue the rhythm of both sides, which requires the two units to share the same shaft size and thread gutter. Simply butting them together removes the spacing at the seam and makes the thread rhythm jump.
![docking-do]{do} Docking that carries the rhythm through the seam
![docking-dont]{dont} Two units butted together without docking, the rhythm broken at the seam


### Graphic Unit {layout=grid-3}
#### + Don'ts
A unit's meaning and aesthetics come from the changing density of threads spread across a plane, so when that plane is disturbed, the rhythm created by compression easily collapses with it. Make every change to the unit's geometry within the parameters of EO Graphic Builder, and avoid manual transformation wherever possible.

However, three-dimensional extensions that project the entire plane holding the unit isometrically or in perspective may be attempted on a limited basis, after review by the EO design team.
![unit-dont-1]{dont} Do not rotate the unit at angles other than multiples of 90°
![unit-dont-2]{dont} Do not arbitrarily distort the unit's shape
![unit-dont-3]{dont} Do not apply more than one color to a unit
![unit-dont-4]{dont} Do not use Solid Gray as a unit color; it is reserved for backgrounds
![unit-dont-5]{dont} Do not join two units whose shaft sizes do not match
![unit-con]{con} Projecting the unit onto a three-dimensional plane



## Graphic Pattern

### + Grammar
The EO graphic system is built in three layers, like a language.
- [[graphic-unit#vocabulary|Vocabulary]] is the words. It covers what units and pairs mean: their significance and metaphors.
- [[graphic-unit#morphology|Morphology]] is the form of the word. Even when the meaning stays the same, it covers how a unit should ideally look: the proportion and rhythm of a single unit.
- Grammar is the set of rules that turns words into sentences. It is the layout rules for placing multiple units on one page.

Vocabulary covers what a unit means and Morphology covers how it looks, so the Grammar section deals with layout form rather than meaning. The library in References shows representative examples of these rules in action; designers can reinterpret them to create new patterns.
![grammar] {zoom=1.1} {bg-cover}


### Grammar {layout=grid-2}
#### + Zoning
To build a new layout, first set up the Compound Grid, then use the modular grid as the primary guide to divide the page into the graphic pattern area and the content area, and finally complete the pattern inside the graphic pattern area. For detailed guidance on the Compound Grid, see [[typography#compound-grid|Compound Grid]]. Do not set a margin between the two areas explicitly; treat it as part of the content area's margin.

The graphic pattern area is a rectangular area that corresponds to the Frame in EO Graphic Builder. Stacking units inside it, interlocked like Tetris pieces with no empty space, is a separate system. Unit placement inside the graphic pattern area does not need to align with the typography grid. The two systems, the graphic pattern area and the typography-led content area, create a contrast between strong and soft on a single page. Because typography in the content area runs left and top aligned, prefer placing the graphic pattern area on the right when splitting the page side by side, and at the top when splitting it top and bottom.

When drafting graphics for a new metaphor in the EO Graphic Builder workspace, you set up an independent grid inside the Frame and place graphic units on it in a regular order. This is a separate system, entirely independent of the Compound Grid that this guideline focuses on.
![grid-do-1]{do} Areas divided in ideal proportion
![grid-dont-1]{dont} A graphic pattern area that is too small, with a graphic pattern competing for hierarchy with other elements
![grid-do-2]{do} A graphic pattern area divided along columns and rows
![grid-dont-2]{dont} A layout with the graphic pattern area placed at the left or bottom


### Grammar {layout=grid-2}
#### + Pattern Margin
Set the pattern margin to 0 so the pattern fills 100% of the graphic pattern area on the page. Depending on the nuance of the metaphor, the pattern can extend past the page margin to the edge of the page. Placing a stretch of tight [[graphic-unit#parameters|compression]] in a unit against the edge of the page creates the illusion that the unit enters from, or reaches beyond, the page, adding visual interest. As an exception, a standalone graphic pattern application with no content area can take a margin similar to the pattern gutter.

![margin-crop-do]{do} A graphic pattern that strengthens its metaphor by placing the compressed end of a graphic unit at the edge of the page
![margin-crop-dont]{dont} A graphic pattern in a content layout that does not fill 100% to the margin


### Grammar {layout=grid-2}
#### + Pattern Gutter
The pattern gutter is the space between units within a graphic pattern. Set it based on unit density and the size of the thinnest thread; tighter is generally better. Balance the pattern gutter with the [[graphic-unit#parameters|thread gutter]]. A well-set pattern gutter keeps the eye fully on the visual elements of the graphic pattern and builds visual tension.

- **Set the pattern gutter to 1.5-2 times the thread gutter.** For typical digital assets, the thread gutter stays between 10 and 20px, so a pattern gutter of 20-25px is ideal.
- When needed, set the pattern gutter to 0 so units touch.
- Using the pattern gutter irregularly to overlap units has potential for experimental patterns, but it introduces too many variables; avoid it for now.
![gutter-do]{do} A pattern gutter balanced with the thread gutter
![gutter-dont-1]{dont} A pattern gutter out of balance with the thread gutter
![gutter-dont-2]{dont} Inconsistent pattern gutters within one pattern
![gutter-con]{con} Overlapping units has potential, but avoid it for now



### Grammar {layout=grid-2}
#### + Alignment
There are no specific restrictions on combining horizontal and vertical units, but keeping each unit's form close to the recommendations in [[graphic-unit#morphology|Morphology]] helps create a fluid pattern.

- Once the units are aligned in the graphic pattern area, look closely at the shaft and thread lines that happen to form between intersecting units. Unintended misalignment can undermine the quality of the entire pattern. Fine-tune the [[graphic-unit#parameters|compression]] of vertical units and the shaft size of horizontal units so the shaft lines of horizontal units line up with the thread lines of vertical units. We recommend this as the final step in completing a layout.
![alignment-dont-1]{dont} A pattern with misaligned shaft and thread lines
![alignment-do-1]{do} A pattern with shaft and thread lines deliberately aligned
![alignment-do-2]{do} An application of a pattern with deliberately aligned lines
![alignment-dont-2]{dont} A pattern with noticeably unbalanced lines


### Graphic Pattern {layout=grid-4}
#### + Color
By default, use Builder Neon · Air White · Day Blue · Bay Green · Medium Gray as [[graphic-unit#color|unit colors]], and Solid Gray · Space Black as background colors. When placing several units side by side, either arrange Day Blue · Bay Green · Medium Gray, which are close in lightness, with even weight · position · movement, or use the brighter Builder Neon · Air White as focal points to deliberately control the sense of depth on the page.

Use Builder Neon as a background color, with Space Black units on top, only on pages that must project the brand's presence most strongly and carry little information.

- Unit color
  - **Apply only one color to each unit.**
  - **We recommend no more than three unit colors at once in one graphic pattern;** up to four are allowed only for the fixed combination of Builder Neon · Day Blue · Bay Green · Medium Gray.
  - Medium Gray is a supporting color. Do not use it alone; always combine it with units in other colors.
  - Do not use Solid Gray as a unit color.
- Background color
  - Consider Solid Gray first as a background color: it lowers the contrast with all five unit colors by one step, holding every color together calmly.
  - On Builder Neon · Day Blue · Bay Green · Air White backgrounds, use only Space Black units.
  - Do not use Medium Gray as a background color in digital environments. For merch, only when the physical material's color can be matched to Medium Gray, Builder Neon · Space Black units may be used on it in limited cases, with approval from the EO design team.

The Do · Don't examples below form a reference chart that gathers, on one sheet, the unit colors allowed on each background color. The number of colors actually used in one pattern follows the rules above.
![color-do-1] {do}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Solid Gray]
![color-do-2] {do}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Space Black]
![color-do-3] {do}[Space Black] on [Builder Neon] · [Day Blue] · [Bay Green] · [Air White]
![color-con] {con}[Builder Neon] · [Space Black] on [Medium Gray]
![color-dont-1] {dont}[Space Black] on [Solid Gray] or vice versa
![color-dont-2] {dont}[Medium Gray] alone on [Solid Gray] · [Space Black]
![color-dont-3] {dont}[Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Builder Neon]
![color-dont-4] {dont}[Builder Neon] · [Bay Green] · [Medium Gray] · [Air White] on [Day Blue]
![color-dont-5] {dont}[Builder Neon] · [Day Blue] · [Medium Gray] · [Air White] on [Bay Green]
![color-dont-6] {dont}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] on [Air White]
![color-dont-7] {dont}[Day Blue] · [Bay Green] · [Air White] on [Medium Gray]


### Graphic Pattern {layout=grid-4} {ratio=16:9} {zoom=1.0} {bg-color}
#### + References
A library of 30 patterns built by combining units. Each pattern is named not by a number but by a keyword drawn from the builder's journey, and can be used across every touchpoint: campaigns · merch · social · video and more.

Designers are free to extend the keywords and create new graphics, but adding a pattern to the official library requires approval from the EO design team.
![pattern-01] 01. Path of Builder
![pattern-02] 02. Power
![pattern-03] 03. Resistance
![pattern-04] 04. Builders
![pattern-05] 05. Rivals
![pattern-06] 06. Team
![pattern-07] 07. Backing
![pattern-08] 08. Teamwork
![pattern-09] 09. Co-working
![pattern-10] 10. Rallying
![pattern-11] 11. Conviction
![pattern-12] 12. Resonance
![pattern-13] 13. Advantage
![pattern-14] 14. Disadvantage
![pattern-15] 15. Cycle
![pattern-16] 16. Routine
![pattern-17] 17. Competition
![pattern-18] 18. Collective Intelligence
![pattern-19] 19. Growth
![pattern-20] 20. Diversity
![pattern-21] 21. Momentum
![pattern-22] 22. Problem
![pattern-23] 23. A-ha
![pattern-24] 24. Wow
![pattern-25] 25. Real World
![pattern-26] 26. Singularity
![pattern-27] 27. Multi-dimension
![pattern-28] 28. Adventure
![pattern-29] 29. Nature
![pattern-30] 30. Boom


### Graphic Pattern
#### + Don'ts {layout=grid-3}
The graphic pattern is the most vivid and dense visual element in all of EO's visual expression, so it plays the protagonist, drawing the eye on the page. Give one side of the page (usually the right or top, about 70%) entirely to it as a rectangular area, set the headline left aligned at the edge of the content area on the opposite side, and place the logo in the content area's margin. You can crop a pattern, but crop at a column boundary so the diagonal sections of a thread are not cut midway.

The following are typical cases where the pattern loses its role as protagonist. Stretching or distorting a pattern breaks the proportion of its units, and placing something on a pattern, or a pattern on something, makes the two elements compete for hierarchy. Masking or repeating a pattern breaks down the rhythm created by unit density, and a pattern too complex for its display size turns its threads into an illegible blur.

![pattern-dont-1] {dont} Do not stretch or distort the pattern
![pattern-dont-2] {dont} Do not overlay content such as the symbol or text on the pattern
![pattern-dont-3] {dont} Do not place the pattern over photos or other graphics
![pattern-dont-4] {dont} Do not mask the graphic pattern area into a circle or freeform shape
![pattern-dont-5] {dont} Do not tile the pattern as a background texture
![pattern-dont-6] {dont} Do not use a pattern that is too complex for its display size on the page


### Usage
#### In Use {layout=grid-2}
The following images show the EO graphic pattern applied across a range of designs.
![pattern-in-use-1] 1. Medium-sized poster in a tall vertical format
![pattern-in-use-2] 2. Extra-large billboard in a wide horizontal format
![pattern-in-use-3] 3. Small business card in a wide horizontal format
![pattern-in-use-4] 4. Horizontal social media banner


## Applications

### + Principles
Four rules to follow when placing the [[graphic-pattern#donts|graphic pattern]] on a page.

- **Match density to viewing distance.** On large pages seen from afar, such as billboards, push complexity all the way up to hold the eye through density; keep posters seen up close at medium complexity. This is a general tendency, however: designers use their judgment and put visual quality first.
- **One page can hold several variations.** Place several variations of the same motif in one composition to create rhythm.
- **A pattern fits any proportion.** Divide the page into sub-layouts to carry several messages on one page.
- **Lead the eye with the direction of the threads.** Converge all threads on a single point to draw the eye to the mark or message placed there.
![app-principles]


### Digital {layout=grid-3}
Digital touchpoints such as the web magazine · social feed · video thumbnails. Units extend into motion, with [[graphic-unit#parameters|compression]] changing over time; in thumbnails, crop only part of a unit at a column boundary. The web grid (12 columns, 40px gutter · 44px margin @1728) shares the same system as the unit's column grid.
![app-web] Web Magazine
![app-social] Social Feed
![app-thumbnail] Video Thumbnail


### Print {layout=grid-3}
Printed matter such as posters · hang tags · stickers · pins. The default is Space Black units on an Air White background; use Builder Neon on one side only. Color combinations follow [[graphic-pattern#color]]. Hang tags carry the pattern on the front and size and material information set in Mono on the back.
![app-poster] Poster
![app-hangtag] Hang Tag
![app-sticker] Sticker Pack & Pin


### Merch {layout=grid-3}
A merch line of tees · hoodies · caps. Single-color screen-printed graphics are the default. On the tee, place a small EO symbol on the front chest and a large dedicated graphic of simplified units on the back; on the hoodie, place a blend pattern on the front. Choose the colorway from Space Black · Builder Neon · Day Blue to suit the fabric color that serves as the background.
![app-tee] Oversized Tee
![app-hoodie] Hoodie
![app-cap] 5-panel Cap



# 06 End

## End {toc=none}
::: split
### Thank You {span=6}
Thank you for reading the EO brand guidelines to the end.
This document is not a fixed, final edition but a standard that grows and changes with EO. If you see a better way to do something, let us know anytime.

For anything that needs confirmation from the EO design team, such as descriptors · patterns · color combinations, please get in touch.

### Imagery {span=6}
Some of the photos · illustrations · mockups in these guidelines are examples to explain brand rules, and EO Studio does not hold the primary license to them. Do not reuse the photos · illustrations · example slides in this guide as is in external communications.

When using others' intellectual property, such as images · illustrations · video, in any EO work released externally, always obtain permission from the copyright holder first.


### Contact {span=6}
[[mailto:jemin@eoeoeo.net|jemin@eoeoeo.net]]


### Credits {span=6}
Visual identity guideline designed and written by [[https://diceandfly.studio|DiceAndFly.Studio]]\
Inspired by the Discord brand guidelines ([[https://www.portorocha.com/|Porto Rocha]])
:::


