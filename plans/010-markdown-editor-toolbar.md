---
id: "010-markdown-editor-toolbar"
title: "[Phase 2] 마크다운 에디터 툴바 및 실시간 미리보기 구현"
status: "backlog"
priority: "high"
labels: ["feature", "frontend", "ux"]
assignee: ""
branch: "feat/010-markdown-editor-toolbar"
phase: "Phase 2"
created: "2026-05-09"
updated: "2026-05-09"
---

## 설명 (Description)

마크다운 문법에 익숙하지 않은 사용자도 쉽게 문서를 편집할 수 있도록, 서식 버튼이 포함된 **툴바(Toolbar)**와 작성 중인 마크다운이 실시간으로 렌더링되는 **스플릿 뷰(Split View) 미리보기** 기능을 구현합니다.

## 작업 항목 (Tasks)

### 1. 마크다운 에디터 툴바 (`MarkdownToolbar`)

- [ ] 에디터 상단에 서식 버튼 바 UI 구현 (`src/components/MarkdownToolbar.tsx`)
- [ ] 지원 서식 버튼:
  - **텍스트 서식**: Bold(`**`), Italic(`*`), Strikethrough(`~~`), Code(`` ` ``), Code Block(` ``` `)
  - **제목**: H1(`#`), H2(`##`), H3(`###`)
  - **목록**: 순서 없는 목록(`-`), 순서 있는 목록(`1.`), 체크리스트(`- [ ]`)
  - **기타**: 링크(`[텍스트](URL)`), 이미지(`![alt](URL)`), 인용(`>`), 구분선(`---`), 백링크(`[[문서명]]`)
- [ ] 텍스트 선택 후 버튼 클릭 시 해당 구문으로 감싸기 (Wrap Selection) 동작
- [ ] 텍스트 미선택 시 커서 위치에 구문 삽입 + 커서를 내부로 이동

### 2. 스플릿 뷰 미리보기

- [ ] 에디터 영역을 좌우 분할하여 왼쪽에 편집기, 오른쪽에 실시간 렌더링 미리보기 표시
- [ ] 토글 버튼으로 `편집 전용` / `미리보기 전용` / `스플릿 뷰` 3가지 모드 전환
- [ ] 미리보기에는 기존 `MarkdownRenderer` 컴포넌트를 재사용
- [ ] 편집기 스크롤 시 미리보기도 대략적으로 동기화 (선택 사항)

### 3. 기존 폼 통합

- [ ] `NewWikiForm.tsx`에 새 에디터 컴포넌트 적용
- [ ] `EditForm.tsx`에 새 에디터 컴포넌트 적용
- [ ] 모바일 환경에서는 스플릿 뷰 대신 탭 전환(편집 ↔ 미리보기) UI 제공

## 수락 조건 (Acceptance Criteria)

- [ ] 툴바의 Bold 버튼 클릭 시 선택 텍스트가 `**선택텍스트**`로 변환
- [ ] 텍스트 미선택 상태에서 H2 버튼 클릭 시 `##`가 커서 위치에 삽입
- [ ] 스플릿 뷰에서 왼쪽에 마크다운을 입력하면 오른쪽에 실시간으로 렌더링 결과가 표시
- [ ] 모바일(768px 이하)에서 탭 전환 방식으로 자연스럽게 동작
- [ ] 기존 `NewWikiForm`, `EditForm`이 새 에디터로 교체되어 정상 동작
- [ ] `pnpm build` 에러 없이 통과

## 참고 자료 (References)

- [FEATURE_SPEC.md — 공통 컴포넌트 명세](../docs/FEATURE_SPEC.md)
- 기존 `MarkdownRenderer` 컴포넌트 (`src/components/MarkdownRenderer.tsx`)
- 기존 폼 컴포넌트: `NewWikiForm.tsx`, `EditForm.tsx`
