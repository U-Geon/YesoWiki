---
id: '007-documentation'
title: '[Phase 0] 프로젝트 문서화 - ERD, 기능 명세서, 개발 환경 가이드 추가'
status: 'done'
priority: 'medium'
labels: ['documentation']
assignee: ''
branch: 'chore/007-documentation'
phase: 'Phase 0'
created: '2026-05-07'
updated: '2026-05-15'
---

## 설명 (Description)

에이전트 기반 개발을 위해 코딩 전 참조할 수 있는 핵심 문서들을 `docs/` 폴더에 추가합니다.
현재 `REQUIREMENTS.md`만 존재하지만, ERD와 기능 명세서, 개발 환경 가이드가 없어 Coder Agent가 참조할 레퍼런스가 부족합니다.

## 작업 항목 (Tasks)

- [x] `docs/ERD.md` — Mermaid 기반 데이터 모델 다이어그램 및 설계 결정 사항
- [x] `docs/FEATURE_SPEC.md` — 라우트 구조, Server Action 흐름, 컴포넌트 명세, 보안 체크리스트
- [x] `docs/SETUP.md` — 로컬 개발 환경 세팅 가이드 (DB 설정, 브랜치 전략, 스크립트 정리)
- [x] `docs/REQUIREMENTS.md` — Supabase 채택 반영 및 문서 색인(Docs Index) 추가

## 수락 조건 (Acceptance Criteria)

- [x] `docs/` 디렉토리에 4개 문서가 모두 존재해야 함
- [x] ERD.md의 Mermaid 다이어그램이 GitHub에서 정상 렌더링되어야 함
- [x] FEATURE_SPEC.md가 `prisma/schema.prisma`의 현재 모델과 일치해야 함 (SSOT 검증)

## 참고 자료 (References)

- [schema.prisma](../prisma/schema.prisma)
- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
