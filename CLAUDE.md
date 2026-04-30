# YesoWiki 멀티 에이전트 시스템 공통 지침 (CLAUDE.md)

이 프로젝트는 단일 AI가 **멀티 에이전트 시스템** 페르소나를 채택하여 개발을 진행합니다.
항상 다음의 역할(Role)과 기술 스택(Tech Stack)을 인지하고 작업해야 합니다.

## 1. 멀티 에이전트 아키텍처

멀티 에이전트 시스템에 대한 상세 정의는 `.agents/` 디렉토리에 명세되어 있습니다.

- **Roles (`.agents/roles/`)**:
  - `builder.md`: 계획 및 설계
  - `analyzer.md`: 심도 있는 분석 위임
  - `coder.md`: 실제 코드 구현
  - `reviewer.md`: 검증 및 피드백 루프
  - `documentation_writer.md`: 문서화 및 학습
- **Memory (`.agents/memory/`)**:
  - `steering.md`: 프로젝트의 현재 진행 상태와 누적된 학습 사항을 기록합니다. 작업 시작 전 반드시 확인하세요.
- **Plans (`plans/`)**:
  - GitHub Issue와 연동되는 작업 계획 파일입니다. Builder Agent가 기획 시 Plan MD를 생성하면, GitHub Actions가 자동으로 Issue와 브랜치를 생성합니다.
  - Plan 생성 규칙은 `.agents/skills/issue-workflow.md`를 참조하세요.
- **Skills (`.agents/skills/`)**:
  - 에이전트들이 코딩/설계 시 참조해야 할 도메인 특화 지식 및 규칙입니다.

## 2. YesoWiki 기술 스택 (Tech Stack)

- **프레임워크**: Next.js (App Router 기반, Frontend & Backend 통합)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **패키지 매니저**: pnpm
- **데이터베이스**: MySQL
- **ORM**: Prisma
- **배포 환경**: Vercel

## 3. 커밋 컨벤션 (Commit Convention)

[Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다.

### 커밋 메시지 형식
```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

### 타입 (Type)
| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat(wiki): 문서 생성 API 구현` |
| `fix` | 버그 수정 | `fix(auth): 로그인 토큰 만료 처리` |
| `docs` | 문서 변경 (코드 변경 없음) | `docs: REQUIREMENTS.md 업데이트` |
| `style` | 코드 포맷팅 (기능 변화 없음) | `style: ESLint 경고 수정` |
| `refactor` | 리팩토링 (기능 변화 없음) | `refactor(lib): prisma 클라이언트 싱글턴화` |
| `test` | 테스트 추가/수정 | `test(wiki): CRUD 통합 테스트 추가` |
| `chore` | 빌드, 설정, 도구 변경 | `chore: pnpm 의존성 업데이트` |

### 규칙
- `<scope>`는 선택 사항이며, 변경 대상 모듈/기능 영역을 나타냅니다 (예: `wiki`, `auth`, `ui`).
- `<description>`은 한글 또는 영문으로 작성하되, **명령형**으로 씁니다 (예: "추가", "수정", "제거").
- 본문(body)은 **왜(Why)** 변경했는지를 설명합니다. 무엇(What)은 코드가 말해줍니다.

## 4. 브랜치 전략 및 이슈 컨벤션 (Git Flow & Issue Convention)

> 상세 이슈 규칙은 `.agents/skills/issue-workflow.md`를 참조하세요.

### 4.1. Git Flow 브랜치 전략

이 프로젝트는 **Git Flow** 전략을 채택합니다.

```
main ──────────────────────────────────────── (운영 서버 / Vercel Production)
  ↑ Merge (PR + 승인 필수)
develop ────────────────────────────────────── (개발 서버 / Vercel Preview)
  ↑ Merge (PR)       ↑ Merge (PR)
feat/xxx          fix/xxx        chore/xxx ...
```

| 브랜치 | 역할 | 배포 환경 | 직접 Push |
|--------|------|-----------|----------|
| `main` | 최종 릴리즈, 운영 버전 | Vercel **Production** | ❌ 금지 |
| `develop` | 기능 통합 및 QA | Vercel **Preview** | ❌ 금지 |
| `feat/*` | 새 기능 개발 | 로컬 | ✅ 허용 |
| `fix/*` | 버그 수정 | 로컬 | ✅ 허용 |
| `hotfix/*` | 운영 긴급 수정 | 로컬 | ✅ 허용 |
| `chore/*` | 설정/인프라/문서 | 로컬 | ✅ 허용 |

### 4.2. 병합 규칙 (Merge Rules)

- **`feat/*` → `develop`**: PR 생성 → CI 통과 → 머지 (Squash Merge 권장)
- **`develop` → `main`**: PR 생성 → CI 통과 → 릴리즈 준비 완료 시 머지
- **`hotfix/*` → `main` + `develop`**: 운영 장애 발생 시에만 허용. 머지 후 반드시 `develop`에도 반영.

> [!IMPORTANT]
> `main`과 `develop`은 GitHub Branch Protection Rule로 보호합니다.
> 직접 push는 불가하며, 반드시 PR을 통해 병합해야 합니다.

### 4.3. 작업 브랜치 명명
```
<type>/<plan-id>-<kebab-case-설명>
```
| 타입 | 용도 | 베이스 브랜치 | 예시 |
|------|------|-------------|------|
| `feat/` | 새 기능 | `develop` | `feat/002-wiki-crud` |
| `fix/` | 버그 수정 | `develop` | `fix/010-xss-bug` |
| `hotfix/` | 운영 긴급 패치 | `main` | `hotfix/critical-auth-error` |
| `chore/` | 인프라/설정 | `develop` | `chore/011-ci-pipeline` |
| `docs/` | 문서 작업 | `develop` | `docs/012-api-reference` |

### 4.4. 이슈 및 Plan 컨벤션

**이슈 제목 형식**
```
[Phase N] <기능 설명>
```
예: `[Phase 1] 위키 문서 CRUD 기능 구현`

**Plan 파일명 형식**
```
{순번 3자리}-{kebab-case 설명}.md
```
예: `002-wiki-crud.md`

## 5. 코드 컨벤션 (Code Convention)

### 5.1. 아키텍처 원칙
1. **SSOT 원칙**: 중복된 상태나 타입 정의를 지양하고, Prisma 스키마와 TypeScript 타입을 단일 진실 공급원으로 활용합니다.
2. **명확한 디렉토리 분리**: UI 컴포넌트(`src/components`), 비즈니스 로직 및 유틸(`src/lib`), 라우트 엔드포인트(`src/app`)를 명확히 분리합니다.
3. **리뷰 루프 필수**: 코드를 작성(Coder)한 후에는 반드시 보안 및 확장성 측면에서 자가 검토(Reviewer)를 거친 후 결과를 반영합니다.
4. **점진적 구현**: 한 번에 너무 많은 것을 구현하지 않고, Phase(단계)별로 나누어 구현 및 테스트를 진행합니다.

### 5.2. TypeScript / React 스타일
- **파일명**: 컴포넌트는 `PascalCase.tsx`, 유틸/라이브러리는 `kebab-case.ts`.
- **컴포넌트**: `function` 선언문(Named Function Declaration)으로 작성합니다. `export default function WikiPage() {}`.
- **타입**: `interface`를 기본으로 사용하고, union/intersection이 필요한 경우에만 `type`을 사용합니다.
- **import 순서**: (1) React/Next.js → (2) 외부 라이브러리 → (3) 내부 모듈(`@/`) → (4) 상대 경로. 그룹 사이에 빈 줄을 넣습니다.

### 5.3. Next.js App Router 규칙
- 모든 컴포넌트는 기본적으로 **Server Component**입니다. `"use client"`는 반드시 필요한 최하단(Leaf) 컴포넌트에만 사용합니다.
- 데이터 변이(Mutation)는 API Route가 아닌 **Server Actions**를 우선 사용합니다.
- 각 라우트 세그먼트에 `loading.tsx`와 `error.tsx`를 배치하여 UX를 보장합니다.
