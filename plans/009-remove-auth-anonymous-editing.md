---
id: '009-remove-auth-anonymous-editing'
title: '[Phase 0] 인증 시스템 제거 및 익명 편집 정책 도입'
status: 'done'
priority: 'high'
labels: ['architecture', 'breaking-change']
assignee: ''
branch: 'chore/009-anonymous-editing'
phase: 'Phase 0'
created: '2026-05-07'
updated: '2026-05-15'
---

## 설명 (Description)

기존의 사용자 인증(로그인) 기반 편집 정책을 **완전 익명 편집 정책**으로 변경합니다.
실제 나무위키처럼 로그인 없이 접속한 누구나 문서를 생성/수정할 수 있어야 합니다.
편집자는 IP 주소 또는 자유 입력 닉네임으로 식별합니다.

## 작업 항목 (Tasks)

- [x] `docs/REQUIREMENTS.md` — §2.3 인증 요구사항을 익명 편집 정책으로 변경
- [x] `prisma/schema.prisma` — `User` 모델 제거, `Document`/`DocumentHistory`의 `authorId` → `editorIp` + `editorName`
- [x] `docs/ERD.md` — 변경된 스키마에 맞게 ERD 갱신
- [x] `docs/FEATURE_SPEC.md` — 인증 관련 로직 제거, 보안 체크리스트 갱신
- [x] `plans/004-auth-system.md` — 상태를 `cancelled`로 변경
- [x] `.agents/memory/steering.md` — 아키텍처 결정 기록

## 수락 조건 (Acceptance Criteria)

- [x] `User` 모델이 완전히 제거되어야 함
- [x] 문서 생성/수정 시 편집자의 IP와 선택적 닉네임이 저장되어야 함
- [x] 모든 관련 문서(ERD, FEATURE_SPEC, REQUIREMENTS)가 일관되게 갱신되어야 함 (SSOT 위반 없음)
