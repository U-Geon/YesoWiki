---
id: '005-premium-ui'
title: '[Phase 2] 프리미엄 UI/UX 디자인 적용'
status: 'done'
priority: 'medium'
labels: ['feature', 'frontend', 'design']
assignee: ''
branch: 'feat/005-premium-ui'
phase: 'Phase 2'
created: '2026-04-30'
updated: '2026-05-15'
---

## 설명 (Description)

나무위키 수준의 기능성에 프리미엄 모던 디자인을 입힙니다.
다크모드, 부드러운 애니메이션, 반응형 레이아웃을 적용하여 사용자 경험을 극대화합니다.

## 작업 항목 (Tasks)

- [x] 디자인 시스템 정립 (CSS 변수 기반 색상 팔레트, 타이포그래피, 그림자 토큰)
- [x] 다크모드 / 라이트모드 토글 구현 (ThemeProvider + localStorage 영속성)
- [x] 반응형 헤더 (Header.tsx — 모바일 햄버거 메뉴, 테마 토글)
- [x] 홈 랜딩 페이지 리디자인 (히어로, 통계, 최근 문서, 기능 카드)
- [x] 문서 목록/상세/생성/편집 페이지 프리미엄 UI 적용
- [x] 반응형 디자인 (모바일 최적화)
- [x] 문서 읽기 뷰의 타이포그래피 및 백링크 섹션 최적화
- [x] CSS !important 제거 및 선택자 우선순위 정리
- [x] 히어로 그라디언트 색상 CSS 변수화 (라이트 테마 대비 개선)

## 수락 조건 (Acceptance Criteria)

- [x] 다크모드와 라이트모드 전환이 자연스러워야 함 (FOUC는 #011에서 추가 수정 예정)
- [x] 모바일(375px)에서 데스크탑(1920px)까지 레이아웃이 깨지지 않아야 함
- [x] 첫인상에서 "프리미엄" 느낌을 줄 수 있는 디자인이어야 함

## 참고 자료 (References)

- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
