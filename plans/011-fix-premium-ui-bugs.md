---
id: '011-fix-premium-ui-bugs'
title: '[Bug] 프리미엄 UI 버그 수정 - 취소 버튼 패딩 및 라이트모드 반짝임(FOUC)'
status: 'in-progress'
priority: 'high'
labels: ['bug', 'frontend', 'ux']
assignee: ''
branch: 'fix/011-premium-ui-bugs'
phase: 'Phase 2'
created: '2026-05-11'
updated: '2026-05-15'
---

## 설명 (Description)

`feat/005-premium-ui`에서 도입된 프리미엄 UI에서 두 가지 버그가 발견되었습니다.

## 버그 목록

### 1. 취소 버튼 패딩 미적용

- **위치**: 문서 생성(`/wiki/new`) 및 문서 편집(`/wiki/[title]/edit`) 페이지
- **증상**: 취소 버튼에 `.btn-ghost` 클래스가 적용되어 있으나, `padding` 값이 제대로 반영되지 않아 버튼 크기가 너무 작게 표시됨
- **원인 추정**: `.btn-ghost` 클래스에 `padding` 속성이 누락되었거나, 다른 CSS 규칙에 의해 덮어씌워지고 있음

### 2. 라이트모드 전환 시 반짝임 현상 (FOUC)

- **위치**: 모든 페이지 (페이지 간 이동 시)
- **증상**: 라이트모드를 선택한 상태에서 다른 페이지로 이동하면 잠깐 다크모드로 보였다가 라이트모드로 전환되는 반짝임(Flash of Unstyled Content)이 발생
- **원인 추정**: SSR 시점에서 `<html data-theme="dark">`로 고정 렌더링되고, 클라이언트 `useEffect`에서 `localStorage`의 테마를 읽어 `data-theme`을 변경하기까지 시간 차이가 발생
- **해결 방향**: `<head>` 또는 `<body>` 직전에 인라인 블로킹 스크립트를 삽입하여 `localStorage`에서 테마를 읽고 즉시 `data-theme`을 설정하는 방식으로 FOUC 방지

## 수락 조건 (Acceptance Criteria)

- [ ] 취소 버튼이 적절한 크기와 패딩으로 표시되어야 함
- [ ] 라이트모드 선택 후 다른 페이지로 이동해도 반짝임 없이 라이트모드가 유지되어야 함
- [ ] `pnpm build` 에러 없이 통과

## 참고 자료 (References)

- 관련 기능: `plans/005-premium-ui.md`
- 테마 관련 코드: `src/components/ThemeProvider.tsx`, `src/app/layout.tsx`
- 버튼 스타일: `src/app/globals.css` (`.btn-ghost`)
