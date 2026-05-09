---
id: '001-project-init'
title: '[Phase 0] 프로젝트 초기화 및 멀티 에이전트 시스템 구축'
status: 'done'
priority: 'critical'
labels: ['infra', 'setup']
assignee: ''
branch: 'feat/001-project-init'
phase: 'Phase 0'
created: '2026-04-30'
updated: '2026-04-30'
---

## 설명 (Description)

YesoWiki 프로젝트의 기반이 되는 Next.js 프로젝트를 초기화하고, 멀티 에이전트 개발 시스템(`.agents/` 디렉토리)을 구축합니다.

## 작업 항목 (Tasks)

- [x] Next.js (App Router) + TypeScript + Tailwind CSS 프로젝트 생성
- [x] Prisma ORM 스키마 설정 (User, Document, DocumentHistory)
- [x] `.agents/roles/` 에이전트 페르소나 정의
- [x] `.agents/memory/steering.md` 에이전트 메모리 초기화
- [x] `.agents/skills/` Vercel next-best-practices, next-cache-components 설치
- [x] `docs/REQUIREMENTS.md` 요구사항 정의서 작성
- [x] `CLAUDE.md` 공통 지침 문서 작성
- [x] `plans/` 폴더 및 GitHub Actions 자동화 워크플로우 구축

## 수락 조건 (Acceptance Criteria)

- [x] 프로젝트 루트에 `package.json`, `tsconfig.json`, `prisma/schema.prisma`가 존재
- [x] `.agents/` 디렉토리에 roles, memory, skills가 구조화되어 존재
- [x] `CLAUDE.md`가 모든 에이전트 시스템의 진입점으로 동작
- [x] `.github/workflows/sync-plans.yml`이 정상 구성

## 참고 자료 (References)

- [CLAUDE.md](../CLAUDE.md)
- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
