# AI Steering & Agent Memory

이 문서는 멀티 에이전트 시스템이 프로젝트를 진행하면서 누적하는 **기억(Memory)** 및 **진행 상태**를 기록하는 파일입니다.
새로운 작업이 시작될 때 Builder Agent는 반드시 이 문서를 읽어 현재 컨텍스트를 파악해야 합니다.

## 현재 프로젝트 상태 (Current Phase)

- **Phase**: Phase 3 진입 (위키 시스템 고도화 및 안정성 확보)
- **현재 브랜치**: `develop`
- **진행 상황**:
  - ✅ Phase 0: 멀티 에이전트 시스템 구축 완료
  - ✅ Phase 1: 위키 CRUD, 백링크, 마크다운 에디터 툴바 완료 → `develop` 통합
  - ✅ Phase 2 (#005, #011, #012): 프리미엄 UI 리디자인, FOUC 버그 수정 및 인프라(Gemini) 마이그레이션 완료 → `main` 배포 완료
  - 🔜 Phase 3 (#013): 기술적 보안 및 안정성 확보 (XSS 방어, 동시성 제어, Rate Limiting)
  - 🔜 Phase 3 (#014): 위키 핵심 기획 추가 (문서 히스토리, 최근 변경, 관리자 권한)
  - 🔜 Phase 3 (#015): 성능 및 UX 최적화 (본문 검색, 자동 목차)

## 시스템 학습 및 아키텍처 결정 사항 (Learnings & Decisions)

- **2026-04-30**: Vite 대신 Next.js App Router의 자체 빌드 시스템을 사용하여 프론트/백엔드 통합 및 Vercel 배포를 최적화하기로 결정.
- **2026-04-30**: 데이터베이스 접근은 확장성과 TS 호환성이 높은 **Prisma ORM**을 사용하기로 결정.
- **2026-04-30**: `plans/` 폴더에 Plan MD 파일을 작성하면 GitHub Actions가 자동으로 Issue를 생성하고 작업 브랜치를 분기하는 워크플로우를 도입. `.github/ISSUE_TEMPLATE/`(Feature/Bug)과 `PULL_REQUEST_TEMPLATE.md`도 함께 구성.
- **2026-04-30**: **Git Flow 브랜치 전략** 도입. `main`=Vercel Production(운영), `develop`=Vercel Preview(개발). 모든 작업 브랜치는 `develop`을 베이스로 하며, `hotfix/*`만 `main`에서 직접 분기. PR 없이 main/develop에 직접 push 금지.
- **2026-05-07**: DB를 MySQL → **Supabase(PostgreSQL)**로 전환. Vercel 배포 호환성 및 무료 티어 활용.
- **2026-05-07**: ⚠️ **인증 시스템 제거 및 익명 편집 정책 채택**. 나무위키와 동일하게 로그인 없이 누구나 문서 편집 가능. `User` 모델 완전 제거. 편집자는 `editorIp`(서버에서 자동 추출) + `editorName`(선택 입력)으로 식별. `plans/004-auth-system.md` → `cancelled`.
- **2026-05-15**: **CSS 스타일링 및 최적화 정책 정립**. Tailwind CSS를 기본으로 쓰되, 프리미엄 UI 등 복잡한 테마 시스템에는 `globals.css` 기반 Vanilla CSS 변수를 병행함. 성능 저하를 유발하는 전역 트랜지션(`*`, `*::before`, `*::after`) 사용을 금지하고 개별 선택자 단위로 최적화. `!important` 사용을 절대 금지하며 선택자 우선순위(Specificity)를 활용하고, 클래스 네이밍에 BEM(Block Element Modifier) 패턴 도입 (`CLAUDE.md` 5.4 항목 반영).
- **2026-05-15**: **자동화 코드 리뷰 에이전트 교체**. 기존 CodeRabbit에서 Gemini Code Assist로 코드 리뷰 도구를 마이그레이션함. `.coderabbit.yaml`을 삭제하고, `.gemini/config.yaml`과 `.gemini/styleguide.md`를 도입하여 PR 요약 및 리뷰 시 프로젝트별 코딩 컨벤션(RSC, Prisma 등)을 강제하도록 설정.
- **2026-05-15**: **FOUC(Flash of Unstyled Content) 및 하이드레이션 해결 패턴 확립**. Next.js SSR 환경에서 테마 FOUC를 근본적으로 방지하기 위해 `next-themes` 패키지를 도입 (`ThemeProvider`로 앱 래핑 및 `attribute="data-theme"` 적용). 또한, 초기 클라이언트 렌더링 시 발생하는 테마 속성(텍스트/아이콘) 불일치로 인한 하이드레이션 에러를 막기 위해, 마운트 전에는 `visibility: hidden`으로 요소를 숨기면서 서버와 동일한 고정 텍스트를 렌더링하는 방식을 채택함.

## 향후 주의사항 (Watch-outs)

- Next.js App Router 환경이므로 Server Component와 Client Component(`"use client"`)의 명확한 구분이 필요함.
- DB는 **Supabase(PostgreSQL)**를 사용. `prisma/schema.prisma`의 provider가 `postgresql`인지 반드시 확인.
- GitHub Branch Protection Rules를 GitHub 저장소 Settings에서 `main`, `develop` 브랜치에 수동으로 설정해야 함 (PR 필수 + CI 통과 필수).
- ⚠️ **`User` 모델은 존재하지 않음**. `authorId` 대신 `editorIp` + `editorName`을 사용. Server Action에서 IP는 반드시 `headers()` 함수로 서버에서 추출할 것. (클라이언트 입력 절대 불가)
- 익명 편집이므로 **반달리즘(문서 훼손) 대응**이 중요. DocumentHistory를 통한 이전 버전 복원 기능을 반드시 구현해야 함.
- 전역 `globals.css` 작업 시 기본 태그 스타일에 무분별하게 애니메이션을 주입하지 않도록 유의 (FOUC, 렌더링 부하 원인).
