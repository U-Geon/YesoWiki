---
id: '015-performance-and-ux'
title: '[Phase 3] 성능 및 UX 최적화 (검색 고도화, 자동 목차)'
status: 'backlog'
priority: 'medium'
labels: ['performance', 'ux', 'phase3']
assignee: ''
branch: ''
phase: 'Phase 3'
created: '2026-05-19'
updated: '2026-05-19'
---

## 설명 (Description)

문서가 많아지고 내용이 방대해졌을 때 발생할 수 있는 검색 성능 저하와 가독성 문제를 해결합니다.

## 작업 항목 (Tasks)

- [ ] **본문 풀텍스트 검색(Full-text Search) 고도화**
  - 기존의 `LIKE %keyword%` 쿼리에서 벗어나, PostgreSQL의 `pg_trgm` 모듈 활용 또는 Prisma의 `fullTextSearch` Preview 기능 활성화
  - 검색 결과 페이지의 성능 개선 및 인덱싱 적용
- [ ] **자동 목차 (Table of Contents, TOC) 렌더링**
  - 마크다운 파서에서 본문 내의 헤딩(`#`, `##`, `###`)을 추출
  - 문서 최상단 혹은 우측 플로팅 영역에 목차 생성
  - 각 헤딩 요소에 `id` 앵커 자동 부여 및 스크롤 이동 연동

## 수락 조건 (Acceptance Criteria)

- [ ] 수천 건의 문서 데이터 환경에서도 본문 검색이 지연 없이 처리되어야 함
- [ ] 마크다운 헤딩이 존재하는 문서는 자동으로 클릭 가능한 목차가 생성 및 표시되어야 함
- [ ] 목차 아이템 클릭 시 페이지 내 해당 섹션으로 부드럽게 스크롤되어야 함

## 참고 자료 (References)

- Prisma Full Text Search (PostgreSQL) 문서
- `rehype-slug` 및 `rehype-autolink-headings` 라이브러리 검토
