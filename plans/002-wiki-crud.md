---
id: '002-wiki-crud'
title: '[Phase 1] 위키 문서 CRUD 기능 구현'
status: 'done'
priority: 'high'
labels: ['feature', 'backend', 'frontend']
assignee: ''
branch: 'feat/002-wiki-crud'
phase: 'Phase 1'
created: '2026-04-30'
updated: '2026-05-15'
---

## 설명 (Description)

위키의 핵심 기능인 문서 생성(Create), 읽기(Read), 수정(Update) 기능을 구현합니다.
마크다운 에디터를 통해 문서를 작성하고, 서버 사이드에서 안전하게 렌더링합니다.

## 작업 항목 (Tasks)

- [x] Prisma Client 싱글턴 설정 (`src/lib/prisma.ts`)
- [x] 위키 문서 목록 페이지 (`/wiki`) — Server Component
- [x] 위키 문서 상세 페이지 (`/wiki/[title]`) — Dynamic Route
- [x] 위키 문서 생성/수정 페이지 (`/wiki/new`, `/wiki/[title]/edit`)
- [x] Server Actions를 통한 문서 생성/수정 로직
- [x] 마크다운 렌더링 (XSS 방지 포함)
- [x] `loading.tsx` 스켈레톤 UI 구현

## 수락 조건 (Acceptance Criteria)

- [x] 문서를 생성하고 바로 읽을 수 있어야 함
- [x] 문서 수정 시 기존 내용이 `DocumentHistory`에 백업되어야 함
- [x] Server Component 기반으로 초기 로딩이 빠르게 동작해야 함
- [x] XSS 공격이 불가능해야 함 (Reviewer 보안 검증 통과)

## 참고 자료 (References)

- [data-patterns.md](../.agents/skills/next-best-practices/data-patterns.md)
- [rsc-boundaries.md](../.agents/skills/next-best-practices/rsc-boundaries.md)
- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
