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
1차 수정 이후 **새로고침 시 FOUC 재발** 문제가 확인되어, `next-themes` 라이브러리를 도입하여 근본적으로 해결합니다.

## 버그 목록

### 1. 취소 버튼 패딩 미적용 ✅ 수정 완료

- **위치**: 문서 생성(`/wiki/new`) 및 문서 편집(`/wiki/[title]/edit`) 페이지
- **증상**: 취소 버튼에 `.btn-ghost` 클래스가 적용되어 있으나, `padding` 값이 제대로 반영되지 않아 버튼 크기가 너무 작게 표시됨
- **수정**: `.btn-ghost`에 `padding: 0.45rem 1rem` 추가

### 2. 라이트모드 전환 시 반짝임 현상 (FOUC)

- **위치**: 모든 페이지 (페이지 간 이동 및 **새로고침** 시)
- **1차 시도**: `layout.tsx`에 `<Script strategy="beforeInteractive">` 인라인 블로킹 스크립트 삽입
- **1차 시도 한계**: 페이지 이동 시에는 해결되었으나, **새로고침 시 여전히 FOUC 재발**
- **최종 해결 방향**: `next-themes` 라이브러리 도입
  - SSR-safe FOUC 방지를 내장으로 지원
  - 커스텀 `ThemeProvider`, `useTheme`, 인라인 스크립트 모두 제거
  - `data-theme` 속성 기반 기존 CSS 변수 시스템과 호환되도록 `attribute="data-theme"` 설정

## 작업 항목 (Tasks)

- [x] `.btn-ghost` 패딩 추가
- [x] 1차 FOUC 수정 (블로킹 스크립트)
- [ ] `next-themes` 패키지 설치
- [ ] `layout.tsx` — 커스텀 인라인 스크립트 제거, `next-themes`의 `ThemeProvider` 적용
- [ ] `src/components/ThemeProvider.tsx` — 파일 삭제 (next-themes로 대체)
- [ ] `src/components/Header.tsx` — `useTheme` 훅을 `next-themes`에서 import하도록 변경

## 수락 조건 (Acceptance Criteria)

- [x] 취소 버튼이 적절한 크기와 패딩으로 표시되어야 함
- [ ] 라이트모드 선택 후 **새로고침**해도 반짝임 없이 라이트모드가 유지되어야 함
- [ ] 라이트모드 선택 후 다른 페이지로 이동해도 반짝임 없이 라이트모드가 유지되어야 함
- [ ] `pnpm build` 에러 없이 통과

## 참고 자료 (References)

- 관련 기능: `plans/005-premium-ui.md`
- 테마 관련 코드: `src/components/ThemeProvider.tsx`, `src/app/layout.tsx`
- 버튼 스타일: `src/app/globals.css` (`.btn-ghost`)
- [next-themes 공식 문서](https://github.com/pacocoursey/next-themes)

