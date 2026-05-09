---
id: '008-coderabbit-setup'
title: '[Phase 0] CodeRabbit AI 코드 리뷰 설정'
status: 'in-progress'
priority: 'medium'
labels: ['infrastructure', 'ci-cd']
assignee: ''
branch: 'chore/008-coderabbit-setup'
phase: 'Phase 0'
created: '2026-05-07'
updated: '2026-05-07'
---

## 설명 (Description)

PR에서 AI 기반의 자동 코드 리뷰가 이루어지도록 CodeRabbit 설정 파일을 추가합니다.
CLAUDE.md에 정의된 컨벤션(커밋, 브랜치, 코드 스타일)을 CodeRabbit이 인지하도록
path-instructions와 review instructions를 맞춤 설정합니다.

## 작업 항목 (Tasks)

- [ ] `.coderabbit.yaml` 파일 작성 (리뷰 언어, 프로필, path-instructions 등)
- [ ] Next.js App Router 패턴 및 CLAUDE.md 컨벤션 리뷰 지침 등록
- [ ] `plans/`, `docs/`, `.agents/` 등 문서 경로 리뷰 필터 설정

## 수락 조건 (Acceptance Criteria)

- [ ] PR 생성 시 CodeRabbit이 한국어로 리뷰 코멘트를 남겨야 함
- [ ] `src/` 코드 변경 시 Next.js RSC 경계, SSOT 원칙 등을 CodeRabbit이 검증해야 함
- [ ] `plans/`, `docs/`, `.agents/` 변경 시 코드 리뷰를 건너뜀

## 참고 자료 (References)

- [CodeRabbit 공식 문서](https://docs.coderabbit.ai/reference/configuration)
- [CLAUDE.md](../CLAUDE.md)
