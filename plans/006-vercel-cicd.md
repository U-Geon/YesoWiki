---
id: "006-vercel-cicd"
title: "[Phase 0] Vercel CI/CD 파이프라인 및 배포 최적화 설정"
status: "in-progress"
priority: "high"
labels: ["infrastructure", "vercel", "ci-cd"]
assignee: ""
branch: "chore/006-vercel-cicd"
phase: "Phase 0"
created: "2026-04-30"
updated: "2026-04-30"
---

## 설명 (Description)

Vercel 환경에서 Next.js와 Prisma가 원활하게 빌드되고 배포될 수 있도록 CI/CD 파이프라인을 최적화합니다.
또한, Git Flow 전략에 맞추어 `main` 브랜치(Production)와 `develop` 브랜치(Preview)의 배포를 관리합니다.

## 작업 항목 (Tasks)

- [ ] `package.json`의 빌드 스크립트 수정 (`prisma generate` 추가)
- [ ] `vercel.json` 구성 (빌드 캐시 및 브랜치 설정 제어)
- [ ] Vercel 배포 시 필요한 환경변수 및 가이드 작성

## 수락 조건 (Acceptance Criteria)

- [ ] Vercel 배포 시 Prisma Client 에러(`@prisma/client` not found 등)가 발생하지 않아야 함
- [ ] PR이나 커밋 내용이 문서(`docs/`, `*.md`)만 변경된 경우 Vercel 빌드를 건너뛰어(Skip) 빌드 시간을 절약해야 함

## 참고 자료 (References)

- [self-hosting.md](../.agents/skills/next-best-practices/self-hosting.md)
