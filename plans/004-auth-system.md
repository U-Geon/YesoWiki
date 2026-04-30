---
id: "004-auth-system"
title: "[Phase 2] 사용자 인증 시스템 구현"
status: "backlog"
priority: "medium"
labels: ["feature", "security", "backend"]
assignee: ""
branch: "feat/004-auth-system"
phase: "Phase 2"
created: "2026-04-30"
updated: "2026-04-30"
---

## 설명 (Description)

친구들만 접근할 수 있도록 프라이빗 인증 시스템을 구현합니다.
NextAuth.js를 활용하여 소셜 로그인(Google/GitHub) 또는 이메일 기반 로그인을 지원합니다.

## 작업 항목 (Tasks)

- [ ] NextAuth.js 설치 및 설정
- [ ] 로그인/회원가입 페이지 UI
- [ ] 미인증 사용자 접근 차단 미들웨어
- [ ] Prisma User 모델과 NextAuth 연동

## 수락 조건 (Acceptance Criteria)

- [ ] 로그인하지 않은 사용자는 위키 문서에 접근할 수 없어야 함
- [ ] 로그인한 사용자의 이름이 문서 수정 이력에 기록되어야 함

## 참고 자료 (References)

- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
