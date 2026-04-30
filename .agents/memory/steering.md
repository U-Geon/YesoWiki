# AI Steering & Agent Memory

이 문서는 멀티 에이전트 시스템이 프로젝트를 진행하면서 누적하는 **기억(Memory)** 및 **진행 상태**를 기록하는 파일입니다.
새로운 작업이 시작될 때 Builder Agent는 반드시 이 문서를 읽어 현재 컨텍스트를 파악해야 합니다.

## 현재 프로젝트 상태 (Current Phase)

- **Phase**: Phase 0 완료 → Phase 1 (CRUD 구현) 진입 준비
- **현재 브랜치**: `develop` (Git Flow 기준 개발 베이스 브랜치)
- **진행 상황**:
  - 멀티 에이전트 시스템용 MD 기반 환경 설정 완료 (`CLAUDE.md`, `.agents/` 디렉토리 구성)
  - 기술 스택 확정 (Next.js 14, Tailwind CSS, pnpm, MySQL, Prisma)
  - GitHub Issue 연동 자동화 워크플로우 구축 (`plans/` + `.github/workflows/` + Issue/PR 템플릿)
  - `chore/001-multi-agent-system-setup` 브랜치 push 완료
  - `develop` 브랜치 생성 및 원격 등록 완료

## 시스템 학습 및 아키텍처 결정 사항 (Learnings & Decisions)

- **2026-04-30**: Vite 대신 Next.js App Router의 자체 빌드 시스템을 사용하여 프론트/백엔드 통합 및 Vercel 배포를 최적화하기로 결정.
- **2026-04-30**: CSS 스타일링은 초기 논의를 거쳐 **Tailwind CSS**를 도입하기로 확정함.
- **2026-04-30**: 데이터베이스 접근은 확장성과 TS 호환성이 높은 **Prisma ORM**을 사용하기로 결정.
- **2026-04-30**: `plans/` 폴더에 Plan MD 파일을 작성하면 GitHub Actions가 자동으로 Issue를 생성하고 작업 브랜치를 분기하는 워크플로우를 도입. `.github/ISSUE_TEMPLATE/`(Feature/Bug)과 `PULL_REQUEST_TEMPLATE.md`도 함께 구성.
- **2026-04-30**: **Git Flow 브랜치 전략** 도입. `main`=Vercel Production(운영), `develop`=Vercel Preview(개발). 모든 작업 브랜치는 `develop`을 베이스로 하며, `hotfix/*`만 `main`에서 직접 분기. PR 없이 main/develop에 직접 push 금지.

## 향후 주의사항 (Watch-outs)

- Next.js App Router 환경이므로 Server Component와 Client Component(`"use client"`)의 명확한 구분이 필요함.
- MySQL 설정 시 로컬 개발 환경과 Vercel 배포 환경(예: PlanetScale, Supabase 등 호환 DB)을 모두 고려한 환경변수(`DATABASE_URL`) 구조를 가져가야 함.
- GitHub Branch Protection Rules를 GitHub 저장소 Settings에서 `main`, `develop` 브랜치에 수동으로 설정해야 함 (PR 필수 + CI 통과 필수).
- Phase 1 시작 시 반드시 `develop`을 베이스로 `feat/002-wiki-crud` 브랜치를 분기해야 함.
