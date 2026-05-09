---
id: '002-wiki-crud'
title: '[Phase 1] 위키 문서 CRUD 기능 구현'
status: 'open'
priority: 'high'
labels: ['feature', 'backend', 'frontend']
assignee: ''
branch: 'feat/002-wiki-crud'
phase: 'Phase 1'
created: '2026-04-30'
updated: '2026-04-30'
---

## 설명 (Description)

위키의 핵심 기능인 문서 생성(Create), 읽기(Read), 수정(Update) 기능을 구현합니다.
마크다운 에디터를 통해 문서를 작성하고, 서버 사이드에서 안전하게 렌더링합니다.

## 작업 항목 (Tasks)

- [ ] Prisma Client 싱글턴 설정 (`src/lib/prisma.ts`)
- [ ] 위키 문서 목록 페이지 (`/wiki`) — Server Component
- [ ] 위키 문서 상세 페이지 (`/wiki/[title]`) — Dynamic Route
- [ ] 위키 문서 생성/수정 페이지 (`/wiki/new`, `/wiki/[title]/edit`)
- [ ] Server Actions를 통한 문서 생성/수정 로직
- [ ] 마크다운 렌더링 (XSS 방지 포함)
- [ ] `loading.tsx` 스켈레톤 UI 구현

## 수락 조건 (Acceptance Criteria)

- [ ] 문서를 생성하고 바로 읽을 수 있어야 함
- [ ] 문서 수정 시 기존 내용이 `DocumentHistory`에 백업되어야 함
- [ ] Server Component 기반으로 초기 로딩이 빠르게 동작해야 함
- [ ] XSS 공격이 불가능해야 함 (Reviewer 보안 검증 통과)

## 참고 자료 (References)

- [data-patterns.md](../.agents/skills/next-best-practices/data-patterns.md)
- [rsc-boundaries.md](../.agents/skills/next-best-practices/rsc-boundaries.md)
- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
