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
EO is media for builders. We rally builders (Rallying), stand on conviction (Conviction), and have their backs (Backing). Recording the founder's journey as it is, and making sure that story reaches the next builder: that is what EO does.

These guidelines explain the basic elements of the EO identity system: logo · typography · color · graphic system. Their purpose is to make the brand's content and services look and read as one EO, whether in San Francisco · Seoul · Vietnam.

Build Anyway.

The EO Brand Team



## Legal Brand Guidelines {toc=none}

### Legal Brand Guidelines
EO · the EO monogram · the block symbol · "Build Anyway" · "Entrepreneur Onwards" and any other trademark owned by EO Studio (the **"EO Logo"**), together with the brand's distinctive aesthetic features such as the symbol · graphic units · patterns · the EO look and feel (the "Brand Assets"), are the exclusive property of EO Studio. Except as permitted here, you must have prior permission from EO Studio before using the EO Logo or Brand Assets.

::: split
### Do's
- Always follow these Brand Guidelines when using the EO Logo and Brand Assets.
- You may use the EO Logo to let people know that you appeared in EO content or took part in an EO program. It must not, however, give the impression that EO endorses or sponsors the product or service.
- When quoting EO videos and articles, credit the source clearly as "EO" and provide a link to the original.
- Use the EO Logo and Brand Assets only as provided in the original files, and only within the approved color pairings.


### Don'ts
- Do not incorporate the EO Logo, or any logo confusingly similar to it, into the name of a company · product · service · event · community, a URL, a social media account, or a trademark.
- Do not modify or recombine the EO symbol · graphic units · patterns into graphics of your own.
- Do not re-edit or re-upload EO videos · articles · thumbnails without EO's permission.
- Do not copy or imitate the look and feel of the EO website · magazine · social channels (layout · color combinations · typefaces · graphic system).
- Do not use the EO Logo alongside political or religious messaging · adult content · discriminatory content.
- Do not use the EO Logo or Brand Assets on merchandise without permission.
:::



# 02 Logo

## Symbol

### Logo
#### + Overview 
The EO logo is the umbrella term for everything covered in this chapter: the EO symbol · EO signature · service signatures · EO sub symbol. This page explains how to apply the EO symbol across situations · formats · communications, from small sign-offs to large display executions.
![hero] {zoom=1.05}


### Symbol
A graphic metaphor whose screw motif makes it identifiable, and a monogram holding the two letters E and O. This form of the logo is referred to below as the **EO symbol**.

The EO symbol is the most iconic and effective way to signal the media brand EO.
![symbol] {zoom=1.065}


### Symbol
#### + Motif
The **EO symbol** is designed on the motif of the three elements of a screw: the shaft · the thread · the head.

- **thread** — one turn of thread symbolizes a cycle of problem solving.
- **shaft** — the shaft symbolizes the process of building and the builder's journey, and expresses the courage to move forward (Build anyway).
- **head** — the head symbolizes one small act of problem solving, or one builder.
![motif] {zoom=1.05}


### Symbol
#### + Geometry {layout=wide}
The EO symbol is a monogram made of two blocks. The E block, depicting the facade of a screw, consists of a shaft and three threads, the base geometry of the graphic unit. The O block is an octagonal screw head pierced by a cross socket; set side by side, the two blocks stand for "Entrepreneur Onwards".
![geometry]


### Symbol
#### + Clearspace 
Clearspace is the minimum safeguard that protects the symbol when it sits next to other visual elements such as typography · graphic units · images · the edge of the canvas. Taking the vertical height of one E block as H, always keep a minimum margin of at least H/2 on every side between the symbol and any adjacent element.
![clearspace] {zoom=1.05}


### Symbol
#### + Scalability
The EO symbol is designed and tested to work across a range of sizes.

- The **optimal range** is a height of 40-100px (approx. 8-20mm) on a 16-inch Mac display viewed from 500mm. Converted to viewing distance, that is 1/60-1/25 of the distance; in other media, size the symbol by this ratio. The optical correction of the thread angles is also tuned to this range.
- The **recommended maximum size** is a height of 70px (approx. 15mm, 1/33 of the viewing distance). In a typical layout, we recommend not exceeding this size.
- The **minimum size** is a height of 20px on screen (approx. 4mm, 1/125 of the viewing distance) and 4mm in print. Below this the threads of the E block fill in, so ask the EO design team to check.
- The **maximum size** is a height of 125px (approx. 25mm, 1/20 of the viewing distance). Any larger and the symbol reads as a surface rather than a graphic, so when you need a greater presence, use a graphic pattern instead of the symbol.
![scalability] {zoom=1.05}


### + Usage
#### Placement
The EO symbol is made of bold yet simple shapes. In a typical layout, we therefore recommend using it as a sign-off in one of the four corners of the content area. The symbol's presence should take a step back so that the main content can lead in a video thumbnail that has to earn the click, and the graphic pattern can lead in a poster that has to catch the eye.

When used as a sign-off, place the symbol in the corner farthest from the hero of the layout, a person or a graphic pattern, with appropriate distance from the surrounding visual elements. This keeps symbol placement simple and consistent while securing enough flexibility to accommodate the dynamic graphic system.
![usage-placement]


### Usage {layout=grid-2}
#### Do's & Don'ts
When using the symbol for display purposes, **avoid raising its visual hierarchy simply by making it bigger.** Secure enough empty space around the symbol's position so that it keeps its impact at an appropriate size. It is best when the symbol's actual footprint is around 10-20% of the whole empty area, and the surrounding empty space is at least 2-3 times the symbol's width.
![usage-do-1]{do} Size the symbol at around 10-20% of the empty area it is placed in
![usage-do-2]{do} Leave generous space around the symbol so it has enough presence even at a moderate size
![usage-dont-1]{dont} Don't fill the empty space with the symbol
![usage-dont-2]{dont} Don't place the symbol where there is not enough space around it


### Symbol
#### + Color{layout=grid-3} {zoom=1.6}
The EO symbol has six basic color pairings. **The symbol must always be rendered in a single color**; when you are unsure about the background color, use one of the following.
![color-1] 1. Space Black on Builder Neon
![color-2] 2. Air White on Space Black
![color-3] 3. Air White on Solid Gray
![color-4] 4. Space Black on Air White
![color-5] 5. Builder Neon on Space Black
![color-6] 6. Builder Neon on Solid Gray


### Symbol
#### + Inversion 
The EO symbol is built primarily as a light symbol in light colors such as Builder Neon · Air White on a dark background such as Space Black · Solid Gray. When you want a dark symbol on a light background, simply inverting the colors creates an optical illusion: the symbol's shape looks smaller and its gaps look wider.

In this case, offset the outline of the light symbol outward by H/100, then scale each of the two blocks up proportionally by H/30 in all four directions. Then reduce the gap between the two expanded blocks from the original (4/30)H to (3/30)H to complete the dark symbol. This converts a light symbol anywhere on the size spectrum into a dark symbol of the same level.

Also, because clearspace on a light background creates the illusion of looking larger, center the dark symbol as is within the clearspace area of the light symbol of the same level.
![inversion] {zoom=1.05}


### + Over Imagery {layout=grid-2}
#### Do's & Don'ts {zoom=1.05}
The EO symbol must always read clearly over photography, so overlay the Air White symbol on images that provide sufficient contrast. If an image is too bright or has areas that are excessively white, the symbol risks sinking into the composition; in that case, overlay a gradient or a black box at around 30% opacity before applying the symbol.

The photo composition must be simple enough for the symbol to stand out. Images that are overly complex or have the key subject dead center become confusing once the symbol is placed on them. Keep this in mind when choosing images, or adjust the image position to suit its relationship with the logo.

The guidance in this section focuses on overlays on still images rather than video sequences, where the composition keeps changing.
![imagery-do-1]{do} {bg-cover} Place the symbol where it contrasts sufficiently with the background
![imagery-do-2]{do} {bg-cover} When you must use a photo with uneven brightness, overlay a gradient at around 30% opacity to secure contrast
![imagery-dont-1]{dont} {bg-cover} Don't place the symbol over the main silhouette of the person or object the photo illuminates
![imagery-dont-2]{dont} {bg-cover} Don't place the symbol where it lacks contrast with the photo


### + Partner Lockup
#### Horizontal
The following image is an example of the basic horizontal lockup of the EO symbol with partner brands' and collaborators' logos.

The elements must be optically adjusted so that they appear the same size; once each logo is sized, add space between them along with a vertical dividing line · collaboration mark. The space between the EO symbol and the partner logo is based on the width of one E block (W): 1.5 W with a dividing line, 2 W with a collaboration mark, and the two logos must always be optically centered on the vertical axis.
![lockup-h] {zoom=1.05}


### Partner Lockup
#### Vertical
The following image is an example of the basic vertical lockup of the EO symbol with partner brands' and collaborators' logos.

The elements must be optically adjusted so that they appear the same size. Once each logo is sized, add a horizontal dividing line between them. The space between the EO symbol and the partner logo equals 1.5 times the height of the EO symbol (H), and the two logos must always be optically centered on the horizontal axis.
![lockup-v] {zoom=1.05}


### Partner Lockup
#### Optical Adjustment
A partner brand's logo may not look perfectly balanced when aligned with the EO symbol. Because the EO symbol is wide and heavy, a thin or tall partner logo looks smaller even at a mathematically equal height.

In such cases, optically scale the partner logo up or down to create a more equal hierarchy.
![lockup-optical] {zoom=1.05}


### + App & Social Icons
#### Alignment
When the EO symbol is placed as is in the center of an app icon or profile image, the smaller it is seen, the more its center of gravity appears to lean slightly to the left. When applying the symbol within a narrow frame, correct it to the right by n px according to the following rule.

**n = H × (4 − 0.06 × S) %**

H is the symbol's height in the working file (px), and S is the height at which the symbol is actually drawn on screen or in the end user's view (mm). When n is positive, correct to the right; when n is negative, no correction is made. The formula is an approximation derived from the appropriate correction values measured at each symbol size under typical desktop working conditions; the tested range is a visible symbol height S of 4mm-50mm (viewing distance 500mm), with a maximum error of ±0.02mm.

When applying the symbol to a surface larger than a desktop monitor, set the range by the end user's typical viewing distance and apply the formula above with the average size of the key range in mind.
![icon-alignment] {zoom=1.05}


### App & Social Icons
#### In Use
The following image is an example of the EO symbol used as an app icon.
![icon-in-use] {bg-cover} 


### Symbol {layout=grid-3} {zoom=1.6}
#### + Don'ts
To keep the EO symbol consistent and impactful, it must not be reinterpreted, modified, or embellished. This page shows examples of modifications to avoid. When the company name needs to appear, use the EO signature instead of the symbol. When a sub-brand needs to be identified, create a service signature in consultation with the EO design team.
![dont-1]{dont} Don't stretch or distort the symbol
![dont-2]{dont} Don't rotate the symbol
![dont-3]{dont} Don't outline the symbol
![dont-4]{dont} Don't use a black outline on a light background
![dont-5]{dont} Don't use a state where the E's thread count, the O's angle, or the block spacing has changed (such as a logo animation capture)
![dont-6]{dont} Don't apply visual effects such as glows, shadows, or gradients to the symbol
![dont-7]{dont} Don't apply a size so large that it takes up most of the space it is placed in
![dont-8]{dont} {bg-cover} Don't create graphics by joining or simply repeating the symbol
![dont-9]{dont} Don't add arbitrary context around the symbol without the EO design team's permission


## Signature

### Signature
#### + Overview
The **signature** is a combination logo that groups the EO symbol with the text of the company or service name, horizontally or vertically. This page explains how to apply the EO signature across situations · formats · communications.

The combination logo of the symbol and the text "EO Studio" is referred to below as the **company signature**, and the combination logo of the symbol and each service name as the **service signature**.

Where the company comes to the front, such as contracts · proposals · official documents · job postings · website footers, prefer the company signature; in brand communication for each service, prefer that service's signature. Everywhere else the media brand EO needs to be signaled, such as videos · thumbnails · social posts · posters · content sign-offs, prefer the EO symbol.
![overview] {zoom=1.05}


### Signature
#### + Descriptor {layout=grid-2} {zoom=1.05}
The text part of the signature, excluding the symbol, is called the **descriptor**. Whatever the word, company name · service name · domain, it follows the specification below as is. The height (H) and width (W) of one E block of the symbol are the basis for every size setting.

- **Vertical** — the descriptor is set in Founders Grotesk Regular at a type size of 0.46H with 0 tracking. Place the top of the cap box H/5 below the bottom edge of the symbol, center it on the symbol, then correct it to the left by H/100. This is because the E block of the EO symbol has a higher gray level, so the visual center sits to the left.
- **Horizontal** — the descriptor is set in Founders Grotesk Regular at a type size of 1.3H with 0 tracking, and only the space characters between words get a separate -6% tracking. Place the left edge of the cap box W/2 from the right edge of the symbol, and raise the baseline H/10 above the bottom edge of the symbol.
- When the first or last letter of the descriptor is a glyph with a curved side, such as S · o, keep the text left-aligned on its baseline and temporarily swap the letter for a capital H (or lowercase h) to set the boundary of the cap box. For example, "Studio" takes its left boundary from "Htudio" and its right boundary from "Studih".

Creating a new descriptor or changing an existing one always requires confirmation from the EO design team. Temporary names such as campaign or event names are not used as descriptors.
![descriptor-v] Vertical — set in Founders Grotesk Regular at 0.46H, tracking 0. Place the top of the cap box H/5 below the bottom edge of the symbol, center it on the symbol, then shift it left by H/100, because the E block of the EO symbol has the higher gray level and its visual center sits to the left.
![descriptor-h] Horizontal — set in Founders Grotesk Regular at 1.3H, tracking 0, with -6% tracking applied only to the space characters between words. Place the left edge of the cap box W/2 from the right edge of the symbol, and raise the baseline H/10 above the bottom edge of the symbol. 


### Signature
#### + Clearspace {layout=grid-2}
The signature also needs margin on the same principle as the EO symbol, but the reference unit depends on the format.
- **Vertical** — Taking the vertical height of one E block as H, keep a minimum margin of at least H/2 on every side around the whole signature.
- **Horizontal** — Taking the cap height of the descriptor's capital E as the unit, keep a minimum margin of at least one cap height on every side around the whole signature.
![clearspace-v] {zoom=1.05} Vertical — taking the vertical height of one E block as H, keep a minimum clearspace of at least H/2 on all four sides around the whole signature.
![clearspace-h] {zoom=1.6} Horizontal — taking the cap height of the descriptor's capital E as the reference, keep a minimum clearspace of at least one cap height on all four sides around the whole signature.


### Signature
#### + Scalability 
The sizes on this page are written, as on the Symbol page, as the symbol height when a 16-inch Mac display (approx. 5px/mm) is viewed from 500mm. In other media, convert using the ratio in parentheses (symbol height relative to viewing distance).

The smaller the signature is seen, the more the symbol and descriptor read as one mass; the larger, the more each letter of the descriptor stands out. The form therefore depends on the visible size, and the boundary is a symbol height of 10mm (50px, 1/50).

- **At 4-10mm (20-50px), use only the horizontal signature.** The horizontal form keeps the symbol and descriptor evenly visible even at small sizes. Above 6mm (30px, 1/80), the space between the words of "EO Studio" becomes noticeable and it can appear to split into three masses: symbol · EO · Studio. Within the 6-10mm size range, consider the "Studio" version as an alternative.
- **At 10mm (50px, 1/50) and above, use only the vertical signature.** From this size the vertical form's descriptor (cap height approx. 2.4mm) reads crisply. The recommended maximum is a symbol height of 15mm (70px, 1/33), and the maximum is a symbol height of 25mm (125px, 1/20).
- As with the symbol's minimum size limit, the signature is not used below 4mm (20px, 1/125) either.
![scalability] {zoom=1.05}


### + Company Signature
#### Vertical

Company signature-V is the vertical combination placing "EO Studio" centered beneath the EO symbol. For its construction, see the vertical specification in [[#descriptor|Descriptor]].

Unless there is a specific reason, do not re-set the text of company signature-V; use the original files provided.
![company-v] {zoom=1.05}


### Company Signature
#### Horizontal
Company signature-H is the horizontal combination placing "EO Studio" to the right of the EO symbol. For its construction, see the horizontal specification in [[#descriptor|Descriptor]].

For anyone who has encountered EO at least once, the EO symbol may already read as "EO", so consider marking only "Studio" in the descriptor when using the horizontal form.

Unless there is a specific reason, do not re-set the text of company signature-H; use the original files provided.
![company-h] {zoom=1.6}


### + Service Signature
#### Vertical {layout=grid-4} {zoom=2.05}
Examples of the vertical service signatures. All are built to the same descriptor specification; check that they read as one family even though the names differ.
![service-v-studio] 1. EO Studio · company
![service-v-magazine] 2. EO Magazine · web magazine
![service-v-planet] 3. EO Planet · community
![service-v-newsletter] 4. EO Newsletter · newsletter


### Service Signature
#### Horizontal {layout=grid-4} {zoom=3}
Examples of the horizontal service signatures. All are built to the same descriptor specification; check that they read as one family even though the names differ.
![service-h-studio] 1. EO Studio · company
![service-h-magazine] 2. EO Magazine · web magazine
![service-h-planet] 3. EO Planet · community
![service-h-newsletter] 4. EO Newsletter · newsletter


### + Usage {layout=grid-2}
#### Symbol or Signature
The signature and the EO symbol are used according to who is speaking. Where the company EO Studio or a service the company runs is the subject, use the signature; for content of the media EO, use the EO symbol. Use only one of the two in a single piece.

Because the signature carries text, it needs a more generous size than the EO symbol. In spaces too small for the text to read crisply (symbol height under [20px] digital, [4mm] print), use the EO symbol alone instead of the signature.

If the call is difficult, first check whether that piece really needs the company name EO Studio. If not, the EO symbol is enough; if it is still unclear, ask the EO design team.
![usage-do-1]{do} Use the signature on official documents that represent the company's position
![usage-dont-1]{dont} Don't use the signature for content sign-offs
![usage-do-2]{do} Use the EO symbol for content sign-offs
![usage-dont-2]{dont} Don't use the signature and the EO symbol together in one piece


### Signature
#### + Color {layout=grid-2}
The signature uses four of the EO symbol's six color pairings. **The symbol and the letters are always unified in the same color**.
![color-1] {zoom=1.05} 1. Air White on Space Black
![color-2] {zoom=1.05} 2. Air White on Solid Gray
![color-3] {zoom=1.6} 3. Space Black on Air White
![color-4] {zoom=1.6} 4. Space Black on Builder Neon


### Signature
#### + Inversion {layout=grid-2}
Like the symbol, the signature is built primarily as a light signature in bright colors such as Builder Neon · Air White on dark backgrounds such as Space Black · Solid Gray. When you want a dark signature on a light background and simply invert the colors, the symbol looks thin and spread apart, and the descriptor's letters look one step lighter even at the same weight.

- **Vertical** — convert the light symbol by the [[symbol#inversion]] rule and center it on both x · y where the light symbol was. Align the descriptor as is to the top edge of the light signature's descriptor cap box and center the text. Keep the weight Regular and invert only the color, then set the type size to 0.48H · tracking to -1% and give an outward outline offset of H/200 to finish.
- **Horizontal** — take the left edges of the light signature's symbol and descriptor cap box as the x-alignment reference lines for each element. Convert the light symbol by the [[symbol#inversion]] rule, align it on x to the symbol's reference line, and center it on y where the light symbol was. Left-align the descriptor to its reference line and leave the baseline in its original position. Keep the weight Regular and invert only the color, then set the type size to 1.35H · tracking to -1% and give an outward outline offset of H/200 to finish.

This keeps the gray level balance between symbol and descriptor the same as the light signature, even on a light background. Clearspace likewise uses the area of the light signature of the same level as is, centered on x · y.
![inversion-v] {zoom=1.05}
![inversion-h] {zoom=1.05}


### Partner Lockup
#### Horizontal
The EO signature can be locked up with partner brands' and collaborators' logos. The images in this section are examples of the basic lockup construction.

The elements must be optically adjusted so that they appear the same size. Once each logo is sized, you can add space and a dividing line · collaboration mark between them. The space between the EO symbol and the partner logo is based on the width of one E block (W): 1.5 W with a dividing line, 2 W with a collaboration mark.
![partner-h] {zoom=1.05}


### + Partner Lockup
#### Vertical
The EO signature can also be locked up vertically with partner brands' and collaborators' logos. On the right is an example of the basic vertical lockup construction.

The elements must be optically adjusted so that they appear the same size. Once each logo is sized, you can add space and a dividing line between them. Make the space between the two logos 1.5 times the height of the EO signature (H), and place the dividing line horizontally at its center.

Make sure the logos are always optically centered.
![partner-v] {zoom=1.05}




### Signature {layout=grid-3}
#### + Don'ts
The signature is a single combination with a fixed relationship between symbol and descriptor. Do not change or re-create its components separately.
![dont-1]{dont} Don't use the vertical signature at a size so small that the descriptor is hard to read
![dont-2]{dont} {zoom=2.3} Don't use the horizontal signature at a size larger than a symbol height of 10mm (50px, 1/50)
![dont-3]{dont} {zoom=1.6} Don't set EO Studio in a different typeface
![dont-4]{dont} {zoom=1.6} Don't modify the descriptor in any way other than as directed in these guidelines
![dont-5]{dont} {zoom=1.6} Don't break the descriptor across multiple lines
![dont-6]{dont} {zoom=1.5} Don't use the EO Studio letters on their own like a logo
![dont-7]{dont} {zoom=2.4} Don't combine the sub symbol with the letters
![dont-8]{dont} {zoom=1.6} Don't color the symbol and the letters differently
![dont-9]{dont} {zoom=1.6} Don't stretch or distort the signature
![dont-10]{dont} {zoom=1.6} Don't apply glows · shadows · gradients
![dont-11]{dont} {zoom=1.6} Don't place it over a busy image where legibility suffers



## Sub Symbol

### + Sub Symbol
The form that uses only the E block taken from the EO symbol is referred to below as the **sub symbol**. Use it only in very small square spaces where the whole EO symbol is hard to recognize, such as favicons · pin badges. Places whose size varies by medium, such as app icons · social media avatars, use the EO symbol by default; whether to switch to the sub symbol is judged by the designer from the size actually seen, and reviewed by the EO design team.

The sub symbol cannot fully replace the EO symbol, so always use the EO symbol wherever there is enough room. Because the E block shares its geometry with the graphic unit, it connects naturally with the whole graphic system even at small sizes.
![overview] {zoom=1.05}


### Sub Symbol
#### + Clearspace
The sub symbol also needs margin on the same basis as the EO symbol. Taking the vertical height of one E block as H, keep a margin of at least [H/2] on every side, and apply the same value on the side where the thread protrudes.
![clearspace] {zoom=1.05}


### Sub Symbol
#### + Color {layout=grid-2} {zoom=1.05}
The sub symbol uses only the two combinations Builder Neon on Space Black · Space Black on Builder Neon. Always render it in a single color.
![color-1] 1. Builder Neon on Space Black
![color-2] 2. Space Black on Builder Neon


### Favicon
#### In Use
Examples of the EO sub symbol in actual use.
![favicon-in-use] {zoom=1.2}


### Sub Symbol {layout=grid-3}
#### + Don'ts {zoom=1.6}
The sub symbol is part of the EO symbol, so it follows the same principles as the EO symbol. Do not change its form or decorate it, and do not use it outside its designated purpose.
![dont-1]{dont} Don't stretch or distort the sub symbol
![dont-2]{dont} Don't rotate the sub symbol
![dont-3]{dont} Don't flip the sub symbol horizontally
![dont-4]{dont} Don't outline the sub symbol
![dont-5]{dont} Don't adjust the clearspace arbitrarily
![dont-6]{dont} {zoom=1.08} Don't use the sub symbol as a standalone identity in place of the EO symbol



# 03 Typography

## Typography

<!-- 2026-11-09 translated from the Korean rewrite (Line Unit framework). Structure · tokens · attributes mirror guide.ko.md. -->

### + Brand Typeface
#### Founders Grotesk
EO's typeface is the Founders Grotesk family.

Founders Grotesk reinterprets the early-20th-century grotesques of Miller & Richard and Caslon. Its simple geometry, narrow apertures and tight letterspacing make it read like solid blocks at large sizes. It is clear without ornament, and the monospaced member of the same family evokes the builder's motifs of engineering and spec sheets.

Each weight has a fixed role. Medium for display and headlines, Regular for sub-headlines, Light for body copy, and Mono Regular for informational text. For the detailed criteria, see [[#reference-scale|Reference Scale]].
![brand-typefaces]{bg-color}


### Character Set
#### Founders Grotesk Medium
The image shows most of the characters of Founders Grotesk Medium. Medium is the default weight for display and headlines. The typeface supports Latin Extended characters, including Vietnamese tone marks. For scripts it does not support, such as Hangul, use the typefaces in [[#multilingual]].
![charset-medium]{bg-color}


### Character Set
#### Founders Grotesk Regular
The image shows most of the characters of Founders Grotesk Regular. Regular is the default weight for sub-headlines (D2 · H2 · H3), bridging the hierarchy between the Medium of headlines and the Light of body copy. In brand communication with short body copy, such as posters and banners, it also takes the body role at the level directly below the display headline.
![charset-regular]{bg-color}


### Character Set
#### Founders Grotesk Light
The image shows most of the characters of Founders Grotesk Light. Light is the default weight for body copy. At large sizes its thin strokes look as if they float, so it is not used for display or headlines.
![charset-light]{bg-color}


### Character Set
#### Founders Grotesk Mono
The image shows most of the characters of Founders Grotesk Mono Regular. Because a monospaced typeface readily recalls builder motifs such as engineering and spec sheets, it can be used as a supporting device that enriches a layout. Use it for tags · dates · reading time · color specs · caption numbers, and not for headlines or body copy.
![charset-mono]{bg-color}


### + Typographic Framework {layout=grid-2}
#### Overview {zoom=1.1}
EO typography is **a baseline grid framework measured and scaled from the space type occupies**, not from type settings. Once the Line Unit (the base line spacing, that is, the absolute height between lines) is set, each level's line spacing is set as a multiple (x) of it, and the font size follows automatically by dividing the line spacing by the linespacing ratio (line spacing ÷ font size).

- Separating the setting of hierarchy from the matching of gray level (tonal value) gives an easier point of entry when a typography system has to be built from scratch for each project.
- When [[#multilingual|switching to a multilingual environment]], the space occupied stays the same even if the typeface or font size changes, so layout variation is minimized and only the gray level needs individual adjustment to keep the look and feel consistent.
- [[#inversion|Switching between dark and light mode]] has the same advantage.
- In an AI-assisted design workflow, the two levels of decision, the AI's efficient layout construction and the designer's eye, can be separated. The broad hierarchy that follows the content logic is left to the AI, and the visual finish is completed by refining the separately held linespacing ratio and similar values.

Read this chapter in the order the framework is carried out. If you need values you can use straight away, see the presets in [[#reference-scale|Reference Scale]]. If you are building anew, set the Line Unit by [[#line-unit|Line Unit]] and set up the typography through the five steps of [[#setting-up|Setting Up]]. For the detailed criteria of each step, see [[#levelling-and-sizing|Levelling & Sizing]] · [[#linespacing-founders-grotesk-medium|Linespacing]] · [[#letterspacing-founders-grotesk-medium|Letterspacing]]; for layout, [[#grid-setting-zoning|Zoning]] · [[#grid-setting-margin|Margin]] · [[#grid-setting-compound-grid|Compound Grid]]; for other languages and alternative typefaces, [[#multilingual|Multilingual]].
![framework-1]{bg-cover} **Line Unit** — the base line spacing of the page. The unit that sets every distance in the layout.
![framework-2]{bg-cover} **Level** — a tier of text divided by role. Each has four parameters: multiple (x) · weight · linespacing ratio · tracking
![framework-3]{bg-cover} **Linespacing ratio** — line spacing relative to font size. 140% means the line spacing is 1.4 times the font size
![framework-4]{bg-cover} **Gray level** — the brightness of a block of text seen from a distance. The criterion for balance between levels


### Typographic Framework
#### + Line Unit {zoom=1.3}
The Line Unit is the base unit of the page. The line spacing of every level is set as a multiple of the Line Unit, and the actual font size is the line spacing divided by the linespacing ratio (%). Below, the Line Unit is abbreviated as x: values written in x are multiples of the Line Unit, and values written in % are all linespacing ratios. For example, 2.5x means that the line spacing of that level is set at 2.5 times the Line Unit.

As a rule, the Line Unit is set from **the content, or the component of it, that is used most often and carries the most weight on the page**.

- In content layouts, the line spacing of the body level usually becomes the Line Unit.
- In visual communication without significant body copy (posters · banners · key visuals), set the Line Unit at 1x or 0.5x the height of the symbol.
- The recommended Line Unit for web and editorial environments is 28px. Adjust it at the designer's discretion for the size of the page and the reader's viewing distance.

Once the Line Unit is set, subtract the top and bottom margins from the full height of the content area, set a baseline grid in whole multiples of the Line Unit, and reuse it across content in the same series. For details on grid and margin, see [[#grid-setting-margin|Margin]] and [[#grid-setting-compound-grid|Compound Grid]].
![line-unit]{bg-color}


### Typographic Framework
#### + Reference Scale {layout=wide}
A seven-level preset based on Line Unit 1x = 28px. The first letter of a level name is the role of its content: D for display, H for headline, T for text, C for caption. This web guideline is set in four of these levels, H1 · H3 · T1 · C1; refer to the unused ones when creating new levels. Each level has multiple (x) · weight · linespacing ratio · tracking as its details, and the size in parentheses is the font size rendered on screen at 1x = 28px.

- **D1** — 6x / Medium / 80% / -2.5%. One or two words, such as a tagline or core keyword, on a poster or key visual
- **H1** — 2.5x / Medium / 100% / -1.5% (70px). Main headline · page title
- **D2** — 2.5x / Regular / 100% / -2% (70px). Display at headline level, campaign slogan · sub copy · quotation
- **H2** — 2x / Regular / 115% / -1% (49px). Sub-headline
- **H3** — 1.25x / Regular / 125% / -0.5% [Solid Gray] · 0 [Space Black] (28px). Section head · subhead
- **T1** — 1x / Light / 140% / +1% [Solid Gray] · +1.5% [Space Black] (20px). Body > brand communication first
- **T2** - 1x / Light / 150% / +1.5% [Solid Gray] · +2% [Space Black] (18.67px). Body > readability first
- **C1** — 0.5x / Mono Regular / 111% / -7% (12.6px). Caption · label · tag · spec · date · button

The recommended weight for each level follows these criteria. Medium for display and headlines (D1 · H1), Regular for sub-display and sub-headlines (D2 · H2 · H3), Light for body copy (T1), Mono Regular for informational text (C1). Founders Grotesk Semibold is used only in a limited way, at the designer's discretion, for optical correction when Medium-level display text is inverted onto a light background and shown small. Keyword emphasis within body copy does not change weight and uses the Builder Neon color with an underline.

Set level multiples in steps of 1x · 0.5x · 0.25x, and refine linespacing ratio and tracking so that the gray level carries consistently between adjacent levels. For the adjusted values for Korean and Vietnamese, see [[#multilingual|Multilingual]].

Founders Grotesk has narrow apertures and tight letterspacing, so at body level it is set in the Light weight with a wide linespacing ratio and slightly opened tracking. The presets are designed with visual communication in mind: for content whose text to be read at once runs to a few paragraphs, T1 is recommended, and T2 where the readability of body copy matters most.

All the presets above assume Air White content on a Solid Gray background. When Air White content is used on a Space Black background, apply 0.5% wider tracking to the relatively small levels H3 · T1 · T2.
![reference-scale]{bg-color}


### Typographic Framework
#### + Setting Up {layout=grid-3}
How to set up typography in a new medium or format. Rather than following the written order to the letter, it is closer to a process of converging on the best state while tuning steps 3 and 4 against each other.

1. Decide the number of typography levels. Divide the levels to be used according to the amount of information to be shown on the page. For details, see [[#levelling-and-sizing|Levelling & Sizing]].
2. Set the Line Unit and set a baseline grid in the content area of the layout. As a rule, size the Line Unit from the content, or the component of it, that carries the most weight or occupies the most of the page. For details on the Line Unit, see [[#line-unit|Line Unit]]; for grid setting, [[#grid-setting-margin|Margin]] · [[#grid-setting-compound-grid|Compound Grid]].
3. Place the content on the grid and set the hierarchy with each level's multiple. Set the multiples in steps of 1x · 0.5x · 0.25x. For details, see [[#levelling-and-sizing|Levelling & Sizing]]. Starting from the values in [[#reference-scale|Reference Scale]] and adjusting them to the medium also works well.
4. Refine weight · linespacing ratio · tracking · color · line breaks for each level and match the gray level. Gray level is the brightness of a block of text seen from a distance; it is right when every level looks like the same text enlarged or reduced, at the same brightness. Place the levels side by side and squint, or zoom the screen out, and the differences show. As a rule, set the linespacing ratio lower the larger the type and higher the smaller the type. For details, see [[#linespacing-founders-grotesk-medium|Linespacing]].
5. Repeat steps 3 and 4 until the levels reach a balance in which they look consistently enlarged or reduced according to the hierarchy.
![setting-up-1]{bg-color} 1. Decide the number of levels
![setting-up-2]{bg-cover} 2. Set the Line Unit and set a baseline grid in the content area.
![setting-up-3]{bg-color} 3. Place the content on the grid and set the hierarchy with each level's multiple
![setting-up-4]{bg-color} 4. Match linespacing ratio and gray level
![setting-up-5]{bg-color} 5. Repeat steps 3 and 4 to complete the layout


### Typographic Framework
#### + Levelling & Sizing {layout=wide}
Levels are divided by the role of the content. The one or two words that represent the page are display (D), the point where reading starts is headline (H), the text read down the page is text (T), and the information supporting the text is caption (C). Numbers within a role run in order of size.

- **Number of levels** — headline and body, or headline · body · caption. Dividing levels by role is the default, but too many levels make consistent typography steeply harder, so first consider whether information of similar role and priority can be merged into one level.
- **Contrast between levels** — the look and feel of typography is largely decided by the degree of contrast between adjacent levels. Going from body (1x) to headline, and from headline to display, the step should be two times or more (2-3x) for the roles to be told apart at a glance. Within a role that handles detailed content (H2 → H3), a multiple of about 1.5 is appropriate. Divide all multiples in steps of 1x · 0.5x · 0.25x so that they fit the baseline grid.
- **Symbol and levels** — treat the symbol like a level. Setting 1x or 0.5x of the symbol height as the Line Unit ties the symbol and the typography to the same unit. The size of the symbol follows [[symbol#scalability]].

As a rule, the larger the level, the heavier the weight and the tighter the linespacing ratio and tracking. In practice, though, levelling is less a linear procedure in table-of-contents order than a process of tuning [[#linespacing-founders-grotesk-medium|Linespacing]] · [[#letterspacing-founders-grotesk-medium|Letterspacing]] · weight against each other at the same time. For the preset values, see [[#reference-scale|Reference Scale]].
![levelling-sizing]{bg-color}


### + Linespacing
#### Founders Grotesk Medium
The linespacing ratio is the height of the space one line of type occupies divided by the font size (%), using % as its unit like general office software. In the same space, a lower linespacing ratio makes the type larger. It corresponds to Line height % in Figma, line-height in CSS and Auto Leading in InDesign. The linespacing ratio can vary with format and type of communication; for the presets by level, see [[#reference-scale|Reference Scale]].

Headlines and display have a linespacing ratio of 100% or less, that is, a line spacing equal to or tighter than the font size. The goal is for the lines to read as one block, and the lower limit is the point just before ascenders and descenders touch. Avoid extremely wide or tight linespacing ratios, and where possible consider revising part of the copy instead.
![linespacing-medium]{bg-color}


### Linespacing
#### Founders Grotesk Regular
The linespacing ratio of sub-headlines (H2 · H3) sits between headline and body (115-120%). They often run to 2-4 lines, so apply a wider line spacing than headlines to raise readability somewhat. D2, the Regular at headline size, follows the same line spacing rule as headlines.

Sub-headlines often sit directly above body copy, so also check that their line spacing does not fall out of step with the body's baseline grid.
![linespacing-regular]{bg-color}


### Linespacing
#### Founders Grotesk Light
Body copy makes a reading rhythm with line spacing wider than the font size. The longer a line, the slightly wider the line spacing must be so the eye does not lose the next line. Too wide, though, and the lines drift apart, the paragraph scatters and the visual finish suffers. Within the range that secures readability without strain, tighten the line spacing little by little until a consistent gray plane forms.

In content-centered layouts, the line spacing of the body copy becomes the [[#line-unit|Line Unit]]. Changing the body's Line Unit stretches or shrinks the whole digital layout vertically at the same ratio.
![linespacing-light]{bg-color}


### Linespacing
#### Founders Grotesk Mono Regular
Captions · labels · tags · specs (C1) are short, one or two lines, with small type. The Mono has wide letters and a large x-height, so with as much line spacing as body copy the lines look as if they float; set it at a tighter ratio than body copy.

The line spacing of C1 is half the Line Unit. Two lines of caption equal the height of one line of body copy, so informational text also sits on the same baseline grid.
![linespacing-mono]{bg-color}


### + Letterspacing
#### Founders Grotesk Medium
In large type the spaces between letters look larger too, so tighten the tracking. The reference point is where the letters sit together like one block but the strokes barely avoid touching (some horizontally open glyphs may touch each other). Too tight, and combinations of consecutive vertical strokes read as one mass; any wider, and words scatter into letters and the headline loses its weight.
![letterspacing-medium]{bg-color}


### Letterspacing
#### Founders Grotesk Regular
Because the inherent gray level of the Regular is lower than that of the Medium, securing a gray level at sub-headline level close to that of the headline level calls for relatively tighter tracking. For example, H1 uses Medium at -1.5% tracking, while D2, at the same font size, applies an even tighter -2%.
![letterspacing-regular]{bg-color}


### Letterspacing
#### Founders Grotesk Light
In small type the spaces look relatively small, so open the tracking to around 1-1.5%, taking light-colored content on a dark background as the reference. Because the thin weight loses readability quickly when tracked tighter, find the compromise according to which matters more, uniform gray level or readability.
![letterspacing-light]{bg-color}


### Letterspacing
#### Founders Grotesk Mono Regular
By nature the Mono is highly distinguishable even at small sizes, but its readability as running text is low, so tighten the tracking to around -7%. If many long words make the lines run long, consider switching to the body typeface.
![letterspacing-mono]{bg-color}



### + Alignment {layout=grid-2}
Content in EO brand communication is left-aligned by default. Centered alignment is allowed only when the text is a single line, as with standalone symbol icons and merch back prints, and justified alignment is not used. When body copy runs in several columns, align the first-line baselines of all columns. Align the symbol and the caption to the left and right edges of an image respectively. A single left alignment line becomes the reference line of the page: headline · sub-headline · body start from the same line, and the reader starts reading at the same place on every line. Right alignment loses that reference because the start of each line moves, and justified alignment opens the word spaces and makes the gray level uneven. This criterion is the same regardless of weight.

The exception is informational text (C1 · Mono). A caption beneath an image may be right-aligned to the right edge, paired with the symbol left-aligned to the left edge, and a caption attached to a simple graphic such as an icon · shape · illustration may be centered beneath it. This is the same case as centering a single line of text under a standalone symbol icon. All other Mono text is left-aligned like the other levels, and justified alignment is not used for Mono either.
![alignment-medium]{bg-color} Headline (Medium) — left alignment is the default; centered · right · justified are not used
![alignment-regular]{bg-color} Sub-headline (Regular) — same rule as the headline
![alignment-light]{bg-color} Body (Light) — same rule as the headline
![alignment-mono]{bg-color} Informational text (Mono) — captions at an image edge may be right-aligned and captions under simple icons · shapes may be centered; only justified is not used


### + Ragging
A paragraph or headline is said to be badly ragged when its edge feels irregular, when a particular line sticks out, or when a single word is left alone on the last line. EO headlines are short with few lines, so the rag is fully exposed. Break lines so that each line holds a unit of meaning, as in "Build / Anyway.", and avoid the staircase shape of alternating long and short lines. In body copy, move words to the next line until the edge is even and the copy reads well.
![ragging]{bg-color}


### + Grid Setting
#### Zoning {layout=grid-2}
The page is divided into a graphic pattern area and a content area. Ideally the graphic pattern area is close to a square on 3:4 · A-series · business card formats, around 70 % of the page on wide landscape formats, and around half on vertical roll-ups. Communication pages with little information may also be divided into four, alternating content and pattern, or gathered to one side.

Place the pattern area full-bleed, ignoring the margin, and place its units following [[graphic-pattern#grammar#grid-setting]]. Settle the proportion first, then set the [[#grid-setting-compound-grid|Compound Grid]] and snap the boundary between the two areas to one of its column or row lines.

The content area is what remains, and margin and grid are set from this area. A four-way division is based on one of the divided content areas. For pieces whose front and back are linked, such as business cards, use the side that carries the main content.


![zoning-ratio]{bg-color} Examples of the proportion between graphic pattern area and content area
![zoning-4-division]{bg-color} Four-way division — content and pattern areas alternating diagonally or gathered to one side


### Grid Setting
#### Margin {layout=grid-2}
The margin of the content area is set equal on all four sides, based on 1/24 of the area's long side. The final value settles between 1/22 and 1/25 while the number of baseline cells is matched in the [[#grid-setting-compound-grid|Compound Grid]]. On pages read up close the margin is roughly the same scale as the Line Unit; on pages seen from a distance it can shrink to around 70-80% of the Line Unit.

On the side where typography meets the graphic pattern, leave about 1.5 times the margin. The top edge of typography is a soft, gray edge, because the tops of the letters are uneven, so give it more clearance than hard edges such as the left alignment line · the baseline · the left and bottom of the symbol. Text is left-aligned, so its right side never meets the pattern.
![margin-24]{bg-color} Margin — 1/24 of the content area's long side, equal on all four sides, or with the horizontal margins corrected about 10% tighter
![margin-compensation]{bg-color} Margin next to the pattern is corrected to 1.5 times; the top of typography is a gray edge, so give it more room than the hard left alignment line · baseline


### Grid Setting
#### Compound Grid {layout=grid-2}
The basic grid is a baseline grid in whole multiples of the Line Unit. The margin is set first in [[#grid-setting-margin|Margin]] from the content area, and settles between 1/22 and 1/25 while the number of baseline cells N is matched. At that point, check that the ratio of margin to Line Unit falls in the range margin = 0.8-1.1 times the Line Unit on pages read up close, and 0.7-0.8 times on pages seen from a distance.

For large pages or layouts with complex components, a compound grid that combines a modular grid with this is recommended. It is a modular grid that divides the content area evenly with gutters one Line Unit wide, and since the height of a module cell is also a whole multiple of the Line Unit, it is fully compatible with the baseline grid.

- **Compound grid rows** — the compound grid can be applied when the total number of baseline cells satisfies **N = number of rows R × (Line Units per row n + 1) − 1**. For example, 35 cells divide into 6 rows × 5 cells or 4 rows × 8 cells. 47 cells allow 4 · 6 · 8 · 12 rows alike and are the most flexible. Widening the gutter between rows to 2 cells, 47 cells also divide into 7 rows × 5 cells.
- **Compound grid columns** — 12 × 6 columns are commonly used on 16:9 screens and 4 × 8 · 6 × 8 columns on A-series formats, but the number is left to the designer's discretion. On A-series and similar proportions, set it from the page proportion so that the graphic pattern area comes close to a square. The gutter between columns is 1 Line Unit.
![grid-row]{bg-color} 47 cells — 6 rows × 7 cells · 8 rows × 5 cells · 7 rows × 5 cells (2-cell gutter); gutters between rows are 1-2 cells
![grid-column]{bg-color} Column grid — on the same 35 cells, 12 columns for 16:9 · 6 columns for A-series; column gutter is 1 Line Unit


### Typography
#### + Inversion {layout=wide}
Like the symbol, EO typography is built primarily as light-colored text, such as Air White · Medium Gray, on dark backgrounds such as Solid Gray · Space Black. When you want dark text on a light background and simply invert the colors, an optical illusion occurs: at the same weight and tracking, the letters look one step thinner and the spaces between them look wider. It is the same phenomenon as the [[signature#inversion|signature's descriptor]].

In that case, keep the Line Unit · level multiples · weights as they are, apply 95% to each level's linespacing ratio (so the font size becomes 105%), and tighten the tracking by 0.5%. The gray level then stays almost the same as the light text even on a light background, and because the space the type occupies is unchanged, the layout stays as it is.

Below is an example of the same presets applied to the seven-level [[#reference-scale|Reference Scale]] and set in light mode.
![inversion]{bg-color}


### + Multilingual {layout=wide}
Korean is set in Pretendard and Vietnamese in Noto Sans. When an existing layout is changed to a multilingual typeface, the Line Unit and level multiples stay the same, so the layout does not move when the language changes; only the font size and linespacing ratio change to suit the typeface.

- Korean Pretendard — T1 of the [[#reference-scale|Reference Scale]] is Regular · 165% · -1.5% · baseline +0.2x, and H3 is Medium · 165% · -2.5% · baseline -0.05x. The rendered font size equals 85% of Founders Grotesk at the same level.
- Vietnamese Noto Sans — T1 is DemiLight · 175% · -1.5% · baseline +0.05x, and H3 is Regular · 175% · -3% · baseline +0.05x. The rendered font size equals 80% of Founders Grotesk at the same level.

The baseline correction is for matching positions relative to the text box in editorial design applications. In digital environments the browser aligns baselines by itself, so on the web the correction is rarely needed, but where type is shown large, as with display fonts, it is better to correct with a separate margin inside the text box.

These two typefaces are also the alternatives in environments where Founders Grotesk cannot be used (email, system-font restrictions on external platforms and document tools, and so on). In that case set English in Pretendard first as well, and use Noto Sans for languages Pretendard cannot be used for or does not support.
![multilingual]{bg-color}


### Typography
#### + Don'ts {layout=grid-3} {zoom=1.35}
Below are the things not to do with typography in brand communication. To keep consistency across every touchpoint, follow the typesetting rules and recommendations of this chapter. How far brand communication consistency takes priority in individual service · product · content design is at the designer's discretion or follows the EO design team's policy.
![dont-1]{dont bg-color} Don't stretch or distort the type
![dont-2]{dont bg-color} Don't set headlines in all caps
![dont-3]{dont bg-color} Don't use Light for headlines or Regular · Medium for body copy
![dont-4]{dont bg-color} Don't apply two or more colors to a headline
![dont-5]{dont bg-color} Don't center or right-align headlines
![dont-6]{dont bg-color} Don't use two or more weights within one level
![dont-7]{dont bg-color} Don't apply outlines · shadows · italics to type
![dont-8]{dont bg-cover} Don't overlap typography on the graphic pattern
![dont-9]{dont bg-color} Don't use the Mono for headlines or body copy
![dont-10]{dont bg-color} Don't use typefaces other than those specified
![dont-11]{dont bg-color} Don't place text off the baseline grid


# 04 Color

## Colors

### Primary Color
#### Builder Neon
Builder Neon symbolizes the window of a hacker house whose lights never go out all night, and the optimism of the builder making something inside. By night it is the signal that stays lit even in the builder's loneliest hours; by day it is the first mark to catch the eye against San Francisco's blue sky.
![builder-neon]


### Secondary Colors
#### Day Blue & Bay Green
Day Blue and Bay Green are cool-toned colors taken from the nature of the Bay Area. Day Blue is inspired by the crisp air of San Francisco, and Bay Green by the greenery of the chaparral hills that run along the coastal ridges. The two colors are used as supporting elements that make their complement, Builder Neon, even more vivid.
![builder-blue-green]

### Color
#### EO Palette {layout=grid-4}
The EO palette consists of Builder Neon, Day Blue, Bay Green, and four achromatic colors that support them. Solid Gray and Medium Gray carry the neutrality of media: the dark one is used for background colors, the light one for graphic elements. Space Black and Air White are the basis of grounds and text.

Each color is provided as HEX · RGB for screen and CMYK · Pantone for print, so use the color mode suited to the medium. In print, Air White can be replaced by white paper stock instead of ink.
[swatch] Builder Neon | #F9EE3A | R249 G238 B58 | C5 M0 Y95 K0 | PANTONE 3945 C
[swatch] Day Blue | #6EC6D2 | R110 G198 B210 | C60 M0 Y10 K0 | PANTONE 298 C
[swatch] Bay Green | #66B88A | R102 G184 B138 | C60 M0 Y50 K0 | PANTONE 2248 C
[swatch] Medium Gray | #8E8E8E | R142 G142 B142 | C2 M0 Y0 K45 or K45 only
[swatch] Solid Gray | #2A2B2B | R42 G43 B43 | C4 M0 Y0 K95 or K95 only
[swatch] Space Black | #000000 | R0 G0 B0 | C60 M60 Y0 K100
[swatch] Air White | #FCFBF5 | R252 G251 B245 | C1 M2 Y2 K0 or raw paper


### Color
#### Usage Ratio

The background defaults to Solid Gray or Space Black, and in media that can use photography, the San Francisco sky itself becomes the background. The recommended ratio for the graphic elements placed on the background is Builder Neon 50%, Day Blue · Bay Green 30%, Medium Gray · Air White 20%. Text is Air White or Space Black and takes up around 10% of the whole composition. In text-centered media the share of the background grows; in pattern-centered media the share of Builder Neon grows. In contexts sufficiently recognized as the EO brand, such as social channels or series artwork, Day Blue · Bay Green can be used more widely than the recommended ratio.

For detailed application criteria per asset, see the color section of each page.

- Logo
  - For symbol color usage, see [[symbol#color]].
  - For signature color usage, see [[signature#color]].
  - For sub symbol color usage, see [[sub-symbol#color]].
- Graphic system
  - For graphic unit color usage, see [[graphic-unit#color]].
  - For pattern color usage, see [[graphic-pattern#color]].
![usage]


### Color {layout=grid-4}
#### In Use
The following images show the EO palette applied across a range of designs.

### Color {layout=grid-3}
#### Don'ts {zoom=1.3}
To keep EO's colors consistent, avoid the following. For minimum contrast between text and background, refer to the WCAG criteria.
![dont-1]{dont} Don't use Builder Neon for body text as a whole or for text on light grounds
![dont-2]{dont} Don't create gradients
![dont-3]{dont} Don't add colors outside the palette (ask the EO design team if needed)
![dont-4]{dont} Don't use unapproved color combinations
![dont-5]{dont} Don't use low-contrast combinations such as Day Blue · Bay Green · Solid Gray
![dont-6]{dont} Don't create new tones by changing brightness · saturation · opacity (ask the EO design team if needed)



# 05 Graphic System

## Graphic Unit

### Graphic Unit
#### + Motif  {layout=grid}
The **EO graphic unit** (hereafter the unit) is designed on the motif of the three elements of a screw: the shaft · the thread · the head.

- **thread** — one turn of thread symbolizes a cycle of problem solving. The harder the wall you run into, the stronger the resistance and the longer it takes to drill through. The denser the thread, the more densely the builder's time has been filled (Build thorough).
- **shaft** — the shaft symbolizes the process of building and the builder's journey. shaft size expresses how strong the core attribute of that process is.
- **head** — the head symbolizes one small act of problem solving, or one builder. Even small screws, gathered in numbers, can build anything (Build anything). Likewise, a problem one builder cannot solve is eventually solved when many builders face it together (Build together).
![motif-1] {zoom=1.17}
![motif-2]


### + Parameters {layout=grid-3}
The **EO graphic unit** (hereafter the unit) is the smallest element of the graphic system; the E block of the logo · the pattern library · application graphics are all produced with the same system. Units are generated from parameters in the EO Graphic Builder; for detailed usage, refer to the Help menu inside the builder.

- **shaft size** — the thickness of the shaft rectangle, as a % of the unit's total height including the threads on both sides. At the default of around 35%, visual density is easy to keep ideal even in relatively complex graphic patterns.
- **thread top / bottom width** — the widths of the top and bottom edges of a thread. A thread is a trapezoid abstracted from a screw thread: its right side stands vertical at the end of the column, its left side slopes, and the lower thread is the upper one rotated 180° about the center of the column. The difference between the two widths sets the slope of the thread. Defaults are top 40% · bottom 0%.
- **thread sides** — double attaches threads above and below the shaft; single attaches threads only on top, with the shaft resting on the bottom.
- **thread amount** — the number of threads attached to each side of the shaft, above and below.
- **thread compression** — how much the thread width narrows progressively toward one side. At 0 all threads have equal width; the larger the value, the stronger the compression toward one side. Negative/positive values set the direction of compression, and the slope of individual threads stays as is without being flipped.
- **thread gutter** — the gap between the vertical cells in which threads sit. Labelled gutter in the builder.

![param-shaft-size] shaft size — thickness of the shaft, 2-95%
![param-thread-width] thread top / bottom width — change of slope
![param-thread-sides] thread sides  — double · single
![param-thread-amount] thread amount — number of threads
![param-thread-compression] thread compression — direction · strength of thread compression
![param-gutter] thread gutter — fixed gap between threads


### Graphic Unit
#### + Color {layout=grid-2} {ratio=16:9} {zoom=1.042}
Color expresses who is the hero in the graphic, what is the environment, and where a state changes, and is used as a supporting means that complements the nuance of Vocabulary. For more specific combination rules, see [[graphic-pattern#color]].

Only one color is ever applied to a unit.
- Builder Neon — the main color with the highest hierarchy, expressing the nuance of builder · hero · focus · highlighting. Most ideal when its area is around 10-40% of the whole canvas.
- Air White — a neutral color with high hierarchy but no identity, expressing the nuance of energy · the counterpart · semi-highlighting. Most ideal when its area is around 10-40% of the whole canvas.
- Day Blue — a builder of a different character · community · surrounding elements. Emphasizes the nuance of positive energy · optimism that comes from a blue sky.
- Bay Green — a builder of a different character · community · surrounding elements. Emphasizes the nuance of softness · friendliness that comes from the greenery of California's chaparral hills. (team, teamwork, co-working, diversity, nature)
- Medium Gray — expresses the nuance of mechanical neutrality: inactive · the other · indifference · conservatism.
- Space Black — used in limited cases where visual impact comes first, in a fixed combination on a Builder Neon ground, expressing dominance.
- Solid Gray is not used as a unit color.
![color-neon-white] [Builder Neon] Builder · hero · core / [Air White] Energy · counterpart · balance
![color-blue-green] [Day Blue] Other builders · surrounding elements · optimism / [Bay Green] Other builders · surrounding elements · friendliness
![color-gray] [Medium Gray] Inactive · the other · conservatism · the material world
![color-black-on-neon] [Space Black] on [Builder Neon] fixed combination, dominance


### + Vocabulary
A unit takes on new meaning through its orientation · count · density alone. For instance, the shaft is the flow of time and the thread is a unit of problem solving, so the more densely threads gather in a narrow stretch, the harder and longer the time they can express. Naturally the visual intensity of that part grows with it; when the parameter-driven form and the value the brand wants to convey point in the same direction like this, we define it as **mapping between visual and branding**.

Vocabulary is the lexicon of the EO graphic system that collects these mapping rules, and gives comprehensive guidance on which visual attributes and colors to combine to express a given value keyword. Note that what follows is only the rules organized so far, not all of them; new metaphors can be added at any time.

This section mainly explains keyword expression; for guidance on graphic visibility, see [[graphic-unit#morphology]] and [[graphic-pattern#grammar]]. For docking, the way two units are aligned, see [[graphic-unit#morphology#docking]].
![vocabulary-overview]


### Vocabulary
#### Thread {layout=grid-3} {zoom=1.15}
A thread is one turn of a screw thread and means one act of problem solving. Within a unit, how dense the threads are · which side they lean toward · how long they run expresses the character of that time. Keywords expressed with thread are Adversity · Acceleration · Lightning · Builder.

- **Adversity** — a time of difficulty, the resistance of the environment. Expressed by laying the unit horizontally. The denser the thread, the greater the difficulty; which side is denser expresses whether the crisis is at the start or the end.
- **Acceleration** — a change in thread density can sometimes feel like acceleration, a stretch where force builds. When compression densifies in the direction of travel it is acceleration; the reverse can be deceleration. Repeating units joined end to end can also look like a flow that recurs like a routine.
- **Lightning** — spark · inspiration · energy. When the shaft is long enough and the thread compression spreads relatively gently, it can give the impression of a bolt of lightning. Only Builder Neon and Air White are used for this metaphor.
- **Builder** — one builder · a person · an individual. Expressed by standing the unit vertically. compression makes the bottom dense, and the direction the top thread leans becomes the direction it faces. Use Builder Neon for the unit representing EO or the hero, Air White for a unit that is involved but not the hero, Day Blue · Bay Green for peers · friends, and Medium Gray for others · hostile presences.
![thread-adversity] Adversity — thread densifying along the timeline
![thread-acceleration] Acceleration — thread with compression leaning in the direction of travel
![thread-lightning] Lightning — long, thin thread with gentle compression
![thread-builder] Builder — compression weighted at the bottom, as if standing on the ground


### Vocabulary
#### Shaft {layout=grid-3} {zoom=1.15}
The shaft is the axis of the screw and symbolizes the timeline of the building process; shaft size expresses how strong the core attribute of that process is. Keywords expressed with shaft are Growth · Diversity · Backing.

- **Growth** — conviction · magnitude of force. Expressed by three or more shafts thickening step by step.
- **Diversity** — difference of character. Expressed by placing several units with different shaft sizes side by side in random order. The larger the shaft size, the shorter the thread width too, so the unit's impression changes greatly; the nuance is not that thicker is better but that each is different. Use the various unit colors evenly.
- **Backing** — the side that supports (Backing) or receives the weight. Put threads on one side only and that side's shaft becomes the floor with the threads standing on it; the taller the threads and the steeper their slope, the more dramatic the expression.
- Apply Builder Neon to the unit representing EO or the hero.
![shaft-growth] Growth — shaft thickening step by step
![shaft-diversity] Diversity — several units, each with a different shaft size, side by side in random order
![shaft-support] Backing — expressed through the relationship between two threads of different shaft size


### Vocabulary
#### Pair {layout=grid-3} {zoom=1.1}
Connecting two units creates a new relationship. Whether they combine horizontally · vertically, and whether they face the same · opposite directions, expresses a different context. Keywords expressed with pair are Journey · Momentum · Pulse · Peers · Rivals · House.

- **Journey** — the length of time, a recurring process. Expressed by matching the compression direction of two horizontal units and docking them. It expresses one chapter ending and the next continuing; repeated, it becomes a routine · cycle. Apply the same color to a docked unit pair.
- **Momentum** — the moment acceleration crosses a threshold and direction changes. Expressed by point-reflecting two horizontal units and docking them. Meeting as `<>` is the moment force gathers; meeting as `><` is the moment it bursts out. In both states, adjust compression so the eye gathers at the center.
- **Pulse** — pulse · frequency · a signal spreading out. Expressed by reflecting two lightning units in point or mirror symmetry and joining them at their wide-thread ends.
- **Peers** — two figures standing together. Expressed by standing two vertical units side by side facing the same direction. Apply Builder Neon to the unit representing EO or the hero, and a different color that fittingly expresses its character to the peer unit.
- **Rivals** — opposition · competition. Expressed by standing two vertical units side by side facing each other. Apply Builder Neon to the unit representing EO or the hero, and Air White · Medium Gray to the rival unit.
- **House** — shelter · community · EO House. Expressed by standing two vertical units side by side facing outward, making the silhouette into a roof. To express EO House, apply Builder Neon to both units, or Builder Neon to the left unit and Day Blue to the right.
![pair-journey] Journey · routine — docked in the same direction
![pair-momentum] Momentum — two states docked after point reflection
![pair-pulse] Pulse — two lightning units docked in point symmetry · mirror symmetry
![pair-peers] {zoom=1.36} Peers — two vertical, same direction
![pair-rivals] {zoom=1.36} Rivals — two vertical, facing each other
![pair-house] {zoom=1.15} House — roof silhouette (EO House)


### Vocabulary
#### Formation {layout=grid-3} {zoom=1.12}
The metaphors so far can be arrayed and extended in quantity to express the relationship · space · world · dimension a metaphor belongs to. Keywords expressed with formation are Scale · Dimension · Direction · Radiation · Crossing.

- **Scale** — multiple individuals · processes · states. Refers to repeating an existing metaphor. Consider using color even more actively; for instance, one Builder Neon among many Medium Gray is the hero among them.
- **Dimension** — parallel worlds. Refers to blending pairs in geometric progression. If one row is one timeline, stacking rows makes multidimensional spacetime or parallel worlds. One Builder Neon among Medium Gray timelines is the present timeline.
- **Direction** — expresses momentum · flow. Refers to the way that, when mirrored units are placed in parallel along the shaft axis, the negative space between the units takes the shape of arrows pointing regularly to one side.
- **Radiation** — erupting energy · resonance. Refers to mirror-reflecting the direction pattern above. Consider using Builder Neon at the source of the energy.
- **Crossing** — simultaneous · instantaneous sync. Refers to stacking lightning units in alternating order while placing vertices · boundaries with tension.
![formation-scale] Scale — extending the metaphor of the same unit · group
![formation-dimension] Dimension — spacetime · parallel worlds
![formation-direction] Direction — momentum · flow
![formation-radiation] Radiation — erupting energy · resonance
![formation-crossing] Crossing — simultaneous · instantaneous sync


### + Morphology
Any unit can be made simply with a few parameters, but a good-looking unit comes from proportion and rhythm, not absolute values.

- [[graphic-unit#vocabulary|Vocabulary]] covers the meaning and metaphor that units and pairs carry.
- [[graphic-unit#morphology|Morphology]] covers how a word with the same meaning should look to be ideal: the proportion and rhythm of a single unit.

This section provides a checklist for a visually ideal unit and recommended parameter ranges. These are not absolute criteria, however, so decide the final parameter values by the designer's aesthetic sense. For the combination rules of multiple units, see [[graphic-pattern#grammar]].
![morphology-overview]


### Morphology {layout=grid-4}
#### Proportion
A feature of the EO graphic unit is that its size and aspect ratio can be transformed freely. But not every proportion of unit is visually appropriate.

- Units that read long along the shaft axis are recommended. When the shaft flattens, all the threads clump together, which is not ideal for expressing the intended metaphor. As an exception, units used as part · periphery of a complex pattern may take a flat form.
- Units thin and long like a straight line along the shaft axis are not ideal either. In this case the threads stretch along the long shaft and deform until they can no longer be recognized as the established metaphor.
![proportion-flat-do]{do} A unit that reads moderately long along the shaft axis
![proportion-flat-dont]{dont} A flat unit widened perpendicular to the axis, with the threads clumped together
![proportion-line-do]{do} A balanced unit whose shaft of moderate length acts as a body
![proportion-line-dont]{con} A unit whose shaft stretches like a thin line and whose threads stretch long with it


### Morphology {layout=grid-4}
#### Rhythm
Raising the compression value makes the threads denser toward one side and creates rhythm. In general, keep the absolute value of compression around 1.5-2.5.

- When the proportion and spacing of the threads are uniform, the rhythm turns monotonous, the unit gives a flat impression like stripes, and it becomes hard to arouse visual interest.
- compression must be sufficient for the threads to compose a rhythm and create motion. Dense lines converging on the unit's boundary create a flow for the eye and can deliberately give tension to a static plane.
- When compression is excessive, threads compressed to hairline thickness repeat on the dense side and give an equally dull impression. In that case, reduce thread amount or lower compression a little to reduce the number of repetitions. Alternatively, lower thread gutter so that stretch clumps into a single mass, which offsets the repetitive feel.
- Short units tend to show each thread's form distinctly and feel less monotonous even with a small thread amount and weak compression. Long units, on the other hand, compose a fitting rhythm better with a large thread amount and strong compression.
![rhythm-uniform-do]{do} compression that creates a fitting rhythm
![rhythm-uniform-dont]{con} A monotonous unit with uniform spacing
![rhythm-length-do]{do} thread amount and compression suited to a long unit
![rhythm-length-dont]{con} A unit that gives a monotonous impression because compression is applied weakly
![rhythm-excess-do]{do} compression converging on the boundary and creating motion
![rhythm-excess-dont]{dont} A unit with excessive compression and repeated hairlines at one end


### Morphology {layout=grid-4}
#### Density
Seen close up or large, each thread reads as its own mass, but seen from afar or small, adjacent forms merge into a gray plane of uniform density. The boundary of this gray plane changes with compression, and its density with thread gutter and the slope of the threads. thread gutter is the minimum gap between threads and decisively affects whether dense threads read as individual lines or merge into a gray plane. For digital assets at typical resolution, a thread gutter of around 10-20px is recommended.

- It is almost always better for the dense stretch to merge into a gray plane. Rather than letting threads thinned uniformly to hairline thickness stick out, lower thread gutter so that stretch clumps into a narrow band at the end of the unit. In digital assets at typical resolution, thread gutter is rarely raised above 30px.
- thread gutter largely sets the density of the gray plane, but the slope of the threads also affects it subtly. When adjusting the slope of the threads on the thick side, watch for changes in the gray plane on the dense side.
- A Space Black unit shrinks on a light background, and the gray plane on the dense side can scatter into individual threads and break the established rhythm. When inverting from light to dark colors (and the reverse is the same), reset thread gutter and compression.
![density-mass-do]{do} A dense stretch merged into a gray plane with a small thread gutter
![density-mass-dont]{dont} A stretch with a large thread gutter, each hairline sticking out
![density-inversion-do]{do} A unit whose thread gutter and compression were reset on inversion
![density-inversion-dont]{dont} A unit with only the colors inverted and the values left as they were


### Morphology {layout=grid-4}
#### Shape
The difference between the widths of a thread's top and bottom edges. It determines the sharpness and footprint of the thread and affects the gray level of the densely compressed stretch. A thread whose diagonal takes up about 60% of its area is ideal, so thread top width of 35-50% and bottom width of 0-20% are recommended.

- As the shaft thickens, the threads shorten and their slope flattens. When adjusting shaft size, keep in mind that the slope moves with it.
- The more units a pattern has, the more the threads read as a gray plane · mass rather than as individual slopes. Adjust thread top/bottom width only within the recommended range, and only when the gray level needs fine-tuning. Close-up treatments with thread sides set to single are the exception, since there the slope of the thread is the key metaphor.
![shape-do]{do} A thread with top 40% · bottom 10%
![shape-dont]{dont} A thread with top · bottom outside the recommended range


### Morphology {layout=grid-4}
#### Docking
When two units of the same color are joined along the shaft axis to form what looks like one long unit, the way the seam is handled is called docking. The thread spacing at the meeting point must continue the rhythm of both sides, which requires the two units to have the same shaft size and thread gutter. Simply butting them together loses the gap at the seam, and the thread rhythm jumps.
![docking-do]{do} docking whose rhythm continues across the seam
![docking-dont]{dont} Two units butted together without docking, their rhythm broken at the seam


### Graphic Unit {layout=grid-3}
#### + Don'ts
The meaning and aesthetics of a unit come from the change in thread density spread across a plane, so when that plane is disturbed, the rhythm compression creates easily collapses with it. Every transformation of unit geometry must happen within the parameters of the Graphic Builder; avoid manual transformation wherever possible.

As an exception, a three-dimensional extension that projects the whole plane the unit sits on into isometric or perspective may be attempted in limited cases after review by the EO design team.
![unit-dont-1]{dont} Don't rotate a unit by angles other than multiples of 90°
![unit-dont-2]{dont} Don't distort a unit's form arbitrarily
![unit-dont-3]{dont} Don't apply two or more colors to one unit
![unit-dont-4]{dont} Don't use Solid Gray as a unit color; it is for backgrounds only
![unit-dont-5]{dont} Don't connect two units whose shaft sizes do not match
![unit-con]{con} Projecting units onto a three-dimensional plane



## Graphic Pattern

### + Grammar
The EO graphic system is woven in three layers, like a language.
- [[graphic-unit#vocabulary|Vocabulary]] is the words. It covers what units and pairs mean: meaning and metaphor.
- [[graphic-unit#morphology|Morphology]] is the form of those words. It covers how a unit should look to be ideal even when the meaning is the same: the proportion and rhythm of a single unit.
- [[graphic-pattern#grammar|Grammar]] is the grammar that builds sentences from words: the layout rules for placing multiple units on one canvas.

Vocabulary handles a unit's meaning and Morphology its appearance, so the Grammar section deals with layout form rather than meaning. The library in [[graphic-pattern#references]] is a set of representative examples with these rules applied, and designers can reinterpret them to create new patterns.
![grammar]


### Grammar {layout=grid-4}
#### Grid Setting
The proportion and boundary that divide the page into the graphic pattern area and the content area follow [[typography#grid-setting#zoning]]. The order is: build the Compound Grid first, divide the areas on that modular grid, then complete the pattern grid inside the pattern area. No separate gap is placed between the two areas; it is counted as part of the content area's margin.

The pattern grid is an independent grid that operates only inside the graphic pattern area. The frame grid set in the EO Graphic Builder corresponds to the pattern grid. It need not align with the typographic baseline grid or the Line Unit; the two systems harmonize on a page through the contrast of strong and weak. What characterizes a pattern grid layout is units interlocking inside a rectangular frame with no empty space.

The recommended workflow is to first combine units in the builder · graphic tool workspace into a draft graphic with a new metaphor, then set the pattern grid to fit that result and refine by aligning the units. Rather than fixing the grid first and filling it, pattern exploration leads the grid.
![grid-do-1]{do} Area division at ideal proportions
![grid-dont-1]{dont} A layout whose graphic area is too small, weakening visibility
![grid-do-2]{do} Units snapped to the columns and rows of the pattern grid
![grid-dont-2]{dont} Units placed without regard to the pattern grid


### Grammar {layout=grid-4}
#### Pattern Gutter
pattern gutter is the gap between units within a graphic pattern. It is set from the density of the units and the size of the thinnest thread, and a tight gutter is usually ideal. For typical digital assets, 0-20px, with 15px recommended.

- pattern gutter is balanced against thread gutter. Stacking units with an appropriate pattern gutter creates visual tension and draws interest.
- Units must never overlap. They are one of three: separated by a pattern gutter, connected by docking, or fully touching.
![gutter-balance-do]{do} pattern gutter balanced against thread gutter
![gutter-balance-dont]{dont} pattern gutter out of step with thread gutter
![gutter-overlap-do]{do} Units separated · docked · touching
![gutter-overlap-dont]{dont} Units overlapping each other


### Grammar {layout=grid-2}
#### Pattern Margin
Set pattern margin to 0 so the pattern fills 100% of the layout's graphic pattern area. Depending on the nuance of the metaphor, it can extend past the layout's margin to the edge of the page · output medium. Butting a unit's densely compressed stretch against the edge of the page creates the illusion of entering from outside the page or reaching out beyond it, which creates visual interest.

![margin-crop-do]{do} A pattern filling 100% of the content area
![margin-crop-dont]{do} A pattern extended to the edge of the output medium according to the metaphor


### Grammar {layout=grid-4}
#### Alignment
There are no particular restrictions on combining horizontal and vertical units, but having each unit's form follow the Morphology recommendations as far as possible helps create a graceful pattern.

- In general, units should align to the pattern margin 0 lines on all four sides, but depending on the metaphor you can mix: some on the pattern margin 0 line, some extending to the page edge.
- Once units are aligned on the pattern grid, look closely at the shaft and thread lines that happen to form between intersecting units. Unintended misalignment can hurt the finish of the whole pattern. Fine-tune the compression of the vertical units and the shaft size of the horizontal units so that the shaft lines of horizontal units and the thread lines of vertical units coincide. This is recommended as the last step in completing a layout.
![alignment-do-1]{do} Units aligned to the pattern margin 0 line
![alignment-do-2]{do} Units mixing alignment methods by intent
![alignment-do-3]{do} An intersection where shaft line and thread line meet
![alignment-dont]{dont} An intersection with misaligned lines


### Graphic Pattern {layout=grid-4}
#### + Color
The default is to use Builder Neon · Air White  · Day Blue · Bay Green · Medium Gray as unit colors and Solid Gray · Space Black as background colors. When placing several units side by side, either arrange Day Blue · Bay Green · Medium Gray, whose values are similar, with even weight · position · motion, or use the high-value Builder Neon · Air White as the visual focus to deliberately control the depth of the canvas.

Only on pages that must assert the brand's presence most strongly while carrying little information is Builder Neon used as the background color, with Space Black units on top.

- Unit color
  - Only one color is ever applied to a unit.
  - **At most 3 unit colors are recommended in one graphic at the same time**; up to four may be used only in the fixed combination Builder Neon · Day Blue · Bay Green · Medium Gray.
  - Medium Gray is a supporting color, so never use it alone; always combine it with units of other colors.
  - Solid Gray is not used as a unit color.
- Background color
  - Consider Solid Gray first as a background color: it lowers contrast with the five unit colors by one step, so all the colors bind together calmly.
  - When Builder Neon · Day Blue · Bay Green · Air White are used as background colors, only Space Black units may be placed on them.
  - Solid Gray is used strictly as a background color and never as a unit color.
  - Medium Gray is not used as a background color in digital environments. Only in merch production, where the color of the physical material can be matched to Medium Gray, may Builder Neon · Space Black units be placed on it in limited cases with the EO design team's permission.
![color-do-1] {do}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Solid Gray]
![color-do-2] {do}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Space Black]
![color-do-3] {do}[Space Black] on [Builder Neon] · [Day Blue] · [Bay Green]
![color-do-4] {do}[Space Black] on [Air White]
![color-dont-1] {dont}[Space Black] on [Solid Gray] or vice versa
![color-dont-2] {dont}[Medium Gray] alone on [Solid Gray] · [Space Black]
![color-dont-3] {dont}[Day Blue] · [Bay Green] · [Medium Gray] · [Air White] on [Builder Neon]
![color-dont-4] {dont}[Builder Neon] · [Bay Green] · [Medium Gray] · [Air White] on [Day Blue]
![color-dont-5] {dont}[Builder Neon] · [Day Blue] · [Medium Gray] · [Air White] on [Bay Green]
![color-dont-6] {dont}[Builder Neon] · [Day Blue] · [Bay Green] · [Medium Gray] on [Air White]
![color-dont-7] {dont}[Day Blue] · [Bay Green] · [Air White] on [Medium Gray]
![color-con] {con}[Builder Neon] · [Space Black] on [Medium Gray]


### Graphic Pattern {layout=grid-4} {ratio=16:9} {zoom=1.03}
#### + References
A library of 30 patterns made by combining units. Each pattern is named not by a number but by one keyword taken from the builder's journey, and is reused across every touchpoint: campaigns · merch · social · video. When a new pattern is needed, choosing from the library comes first; additions go through the EO design team's approval.
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


### + Usage
#### Do's & Don'ts {layout=grid-2}
The graphic pattern is the most vivid and dense visual element in all of EO's visual expression, so on the page it must play the role of the subject that draws the eye. Give the pattern an entire half of the layout (usually the top or the right) and set the headline left-aligned at the edge of the content area on the other side. Do not overlap text on the pattern, and place the logo in the margin outside it. Patterns may be cropped, but crop on column boundaries so that no diagonal stretch of a thread is cut through the middle.
![pattern-do-1] {do} When using a graphic pattern, fill a large rectangular area of 50-70% of the page to raise its visibility
![pattern-do-2] {do} Use a graphic pattern of suitable complexity for the size at which the page is actually seen
![pattern-dont-1] {dont} Don't overlay content on the graphic pattern
![pattern-dont-2] {dont} Don't let the diagonal part of a thread be cropped

### Usage
#### In Use {layout=grid-2}
Examples of the EO graphic pattern in actual use.
![pattern-in-use-1] A medium-sized poster in a tall portrait ratio
![pattern-in-use-2] A wide, extra-large billboard in a long landscape ratio
![pattern-in-use-3] A small business card in a landscape ratio
![pattern-in-use-4] Social media artwork in a square ratio


## Applications

### + Principles
Four things to keep when putting a pattern on a page.

- **Match density to viewing distance.** Large surfaces seen from afar, like billboards, push complexity all the way up and hold the eye with density; posters seen up close stay at medium complexity.
- **One page can hold several variations.** Place several variations of the same motif in one composition to create rhythm.
- **Patterns fit any aspect ratio.** Dividing the page into sub-layouts lets one frame carry several messages.
- **Lead the eye with the direction of the thread.** Place all threads so they converge on one point, and the eye goes to the mark or message there.
![app-principles]


### Digital {layout=grid-3}
Digital touchpoints such as the web magazine · social feeds · video thumbnails. Units extend into motion, with compression changing over time; thumbnails use only part of a unit, cropped on column boundaries. The web grid (12 columns, grid gutter 40, grid margin 44 @1728) shares the same system as the unit's column grid.
![app-web] Web Magazine
![app-social] Social Feed
![app-thumbnail] Video Thumbnail


### Print {layout=grid-3}
Printed matter such as posters · hang tags · stickers · pins. The default is Space Black units on an Air White ground, with Builder Neon used on one surface only. Hang tags carry a pattern on the front and size and material information in Mono on the back.
![app-poster] Poster
![app-hangtag] Hang Tag
![app-sticker] Sticker Pack & Pin


### Merch {layout=grid-3}
A merch line of tees · hoodies · caps. Single-color silkscreen graphics are the default. Tees carry a small EO symbol on the front chest and a large dedicated graphic of simply arranged units on the back; hoodies carry a blended pattern on the front. The colorway is one of Space Black · Builder Neon · Day Blue, chosen to suit the fabric color of the ground.
![app-tee] Oversized Tee
![app-hoodie] Hoodie
![app-cap] 5-panel Cap



# 06 End

## End {toc=none}
::: split
### Thank You {span=6}
Thank you for reading the EO Brand Guidelines to the end.
This document is not a declared final version but a standard that grows and changes with EO. If you see somewhere a better way is possible, let us know anytime.

If anything needs confirmation from the EO design team, such as descriptors · patterns · color combinations, please get in touch.

### Imagery {span=6}
Some of the photos · illustrations · mockups used in these guidelines are examples for explaining brand rules, and EO Studio does not directly hold the primary license to them. Do not use the photos · illustrations · example figures in the guide as they are in external communication.

When using others' intellectual property such as images · illustrations · video in EO productions that go outside, always obtain the copyright holder's permission first.


### Contact {span=6}
[[mailto:jemin@eoeoeo.net|jemin@eoeoeo.net]]


### Credits {span=6}
Visual identity guideline designed and written by [[https://diceandfly.studio|DiceAndFly.Studio]]\
Inspired by the Discord brand guidelines ([[https://www.portorocha.com/|Porto Rocha]])
:::

