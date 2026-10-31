# EO Guide: [[xref]] highlighting

VS Code 의 기본 마크다운 문법은 `[text]` 안에 공백이 없을 때만 링크로 칠하므로 `[[#line-unit]]` 은 파랗게,
`[[#line-unit|Line Unit 설명]]` 은 검게 보입니다. 이 폴더는 `[[ … ]]` 전체를 링크 색으로 칠하는 문법 주입 확장입니다.

설치 (한 번): VS Code 명령 팔레트(⇧⌘P) → "Developer: Install Extension from Location..." → 이 폴더(.vscode/eo-xref) 선택 → 창 다시 로드.
제거: 확장 보기에서 "EO Guide: [[xref]] highlighting" 제거.
