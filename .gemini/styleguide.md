# YesoWiki Gemini Code Assist Styleguide

이 문서는 Gemini Code Assist가 PR 코드 리뷰를 수행할 때 참고하는 주요 규칙과 가이드라인입니다.

## 1. Next.js App Router (src/**)

이 프로젝트는 Next.js 14 App Router를 사용합니다. 다음 규칙을 엄격하게 검증하세요:

*   **RSC 경계 (Server/Client Component)**
    *   모든 컴포넌트는 기본적으로 Server Component입니다.
    *   `"use client"`는 반드시 필요한 최하단(Leaf) 컴포넌트에만 허용합니다.
    *   `async` Client Component는 절대 허용하지 않습니다.
*   **데이터 패턴**
    *   데이터 읽기(Read)는 Server Component에서 Prisma를 직접 호출합니다. API Route 불필요.
    *   데이터 변이(Mutation)는 Server Actions(`"use server"`)를 사용합니다. REST API 지양.
    *   비동기 Server Action 이후에는 반드시 `revalidatePath()` 또는 `revalidateTag()`를 호출해야 합니다.
*   **보안**
    *   사용자 입력(title, content 등)은 서버에서 반드시 trim + 유효성 검사를 수행해야 합니다.
    *   마크다운 렌더링 시 `rehype-sanitize`가 적용되었는지 확인합니다. (XSS 방지 필수)
*   **SSOT 원칙**
    *   `prisma/schema.prisma`가 데이터 진실 공급원입니다.
    *   타입을 중복 정의하지 말고 Prisma 자동 생성 타입을 활용합니다.

## 2. Prisma 스키마 (prisma/schema.prisma)

Prisma 스키마 변경은 데이터 마이그레이션을 동반할 수 있습니다. 다음을 검증하세요:

*   새 모델/필드 추가 시 기존 데이터와의 호환성을 확인합니다.
*   `@unique` 제약이 변경된 경우 데이터 손실 가능성을 검토합니다.
*   관계(Relation) 변경 시 cascade delete 동작을 명시적으로 확인합니다.
*   `docs/ERD.md`도 함께 업데이트되었는지 확인합니다. (SSOT 원칙)

## 3. GitHub Actions (.github/workflows/**)

GitHub Actions 워크플로우 변경 시 다음을 확인합니다:

*   `GITHUB_TOKEN` 이외의 시크릿은 `.env`에 노출되지 않았는지 확인합니다.
*   `actions/*`의 버전이 고정(예: `@v4`)되어 있는지 확인합니다. `@latest` 사용 금지.
*   `pnpm` 사용 시 `setup-node` + `pnpm install`의 캐시 설정이 있는지 확인합니다.

## 4. 컴포넌트 (src/components/**)

*   파일명은 `PascalCase`를 사용합니다 (예: `WikiEditor.tsx`).
*   props 타입은 `interface`로 정의합니다. `type`은 union/intersection에만 사용합니다.
*   import 순서: React/Next.js → 외부 라이브러리 → 내부(@/) → 상대경로.

## 5. 라이브러리/유틸 (src/lib/**)

*   파일명은 `kebab-case`를 사용합니다 (예: `prisma-client.ts`).
*   Prisma Client는 싱글턴 패턴을 사용합니다. (`src/lib/prisma.ts`)
*   비즈니스 로직 유틸 함수는 순수 함수(Pure Function)로 작성합니다.
