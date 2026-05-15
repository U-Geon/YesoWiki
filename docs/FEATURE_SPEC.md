# API 및 기능 명세서 (Feature Specification)

> Coder Agent가 코드를 작성하기 전 반드시 이 문서를 읽어야 합니다.
> 각 기능의 **라우트 구조, 데이터 흐름, 엣지케이스**를 정의합니다.

---

## 1. 라우트 구조 (Route Architecture)

Next.js App Router 기준입니다.

```
src/app/
├── wiki/
│   ├── page.tsx                    # GET  /wiki         - 문서 목록
│   ├── loading.tsx                 # /wiki 스켈레톤 UI
│   ├── actions.ts                  # createDocument / updateDocument Server Actions
│   ├── new/
│   │   ├── page.tsx                # GET  /wiki/new     - 문서 생성 페이지 (Server Component)
│   │   ├── loading.tsx             # /wiki/new 스켈레톤 UI
│   │   └── NewWikiForm.tsx         # 문서 생성 폼 (Client Component)
│   └── [title]/
│       ├── page.tsx                # GET  /wiki/[title] - 문서 상세
│       ├── not-found.tsx           # 문서 없을 때 404 UI
│       ├── edit/
│       │   ├── page.tsx            # GET  /wiki/[title]/edit - 문서 수정 페이지 (Server Component)
│       │   └── EditForm.tsx        # 문서 수정 폼 (Client Component)
│       └── history/
│           └── page.tsx            # GET  /wiki/[title]/history - 수정 이력 (미구현)
├── layout.tsx                      # 루트 레이아웃 (ThemeProvider, Header 포함)
├── globals.css                     # 전역 스타일 (CSS 변수 기반 다크/라이트 테마)
└── page.tsx                        # GET  /             - 메인(랜딩) 페이지
```

---

## 2. 기능별 상세 명세

### 2.1. 메인 랜딩 페이지 (`GET /`)

| 항목          | 내용                                                       |
| ------------- | ---------------------------------------------------------- |
| 컴포넌트 타입 | Server Component (async)                                   |
| 데이터 소스   | Prisma 직접 조회 (`Promise.all`로 count + recentDocs 병렬) |
| 표시 항목     | 히어로 섹션, 총 문서 수 통계, 최근 수정 5개 문서, 기능 카드 |

---

### 2.2. 문서 목록 (`GET /wiki`)

| 항목          | 내용                                      |
| ------------- | ----------------------------------------- |
| 컴포넌트 타입 | Server Component (async)                  |
| 데이터 소스   | Prisma 직접 조회 (`db.document.findMany`) |
| 정렬          | `updatedAt DESC` (최근 수정순)            |
| 표시 항목     | 제목, 작성자(익명 처리), 최근 수정일      |

**데이터 흐름**

```
/wiki 접속
  → Server Component에서 Prisma 직접 쿼리
  → editorIp 앞 8자리만 노출 (개인정보 보호)
  → 문서 목록 렌더링 (카드 레이아웃)
  → Suspense + loading.tsx로 스켈레톤 UI 처리
```

---

### 2.3. 문서 상세 (`GET /wiki/[title]`)

| 항목               | 내용                                                 |
| ------------------ | ---------------------------------------------------- |
| 컴포넌트 타입      | Server Component (async)                             |
| URL 파라미터       | `title`: 문서 제목 (URL 디코딩 필요)                 |
| 존재하지 않는 문서 | `notFound()` 호출 → `not-found.tsx` 렌더링           |
| 마크다운 렌더링    | `react-markdown` + `rehype-sanitize` (XSS 방지 필수) |
| 백링크 표시        | `incomingLinks`를 포함 조회하여 참조 문서 목록 렌더링 |

**백링크 처리**

```
마크다운 내 [[제목]] 패턴 감지 (src/lib/backlink.ts)
  → 참조된 제목 목록 추출
  → DB에서 존재 여부 확인 (Promise.all 병렬 처리)
  → 존재: <a href="/wiki/제목">제목</a>
  → 미존재: 빨간 링크 스타일 적용 (생성 유도)
```

**엣지케이스**

- `title`에 한글, 공백 포함 가능 → `encodeURIComponent` / `decodeURIComponent` 처리
- 존재하지 않는 문서 접근 시 → 문서 생성 페이지로 유도하는 `not-found.tsx`

---

### 2.4. 문서 생성 (`POST` via Server Action)

| 항목               | 내용                                                  |
| ------------------ | ----------------------------------------------------- |
| 진입점             | `/wiki/new` 페이지의 `<form action={createDocument}>` |
| Server Action 위치 | `src/app/wiki/actions.ts`                             |
| 유효성 검사        | `title` 필수, 공백만 불가, 중복 제목 불가             |
| 성공 시            | `redirect('/wiki/[생성된 title]')`                    |
| 실패 시            | 에러 메시지 반환 (React 18 `useFormState` 활용)       |

**Server Action 로직**

```
createDocument(prevState, formData)
  1. title, content, editorName(선택) 추출 및 trim
  2. 유효성 검사 (빈 값, 중복 title)
  3. editorIp를 요청 헤더에서 추출:
     - x-real-ip 우선
     - 없으면 x-forwarded-for의 가장 우측 값(rightmost)
  4. db.document.create({ data: { title, content, editorIp, editorName } })
  5. [[백링크]] 파싱 후 DocumentLink 레코드 upsert
  6. revalidatePath('/wiki')
  7. redirect(`/wiki/${encodeURIComponent(title)}`)
```

---

### 2.5. 문서 수정 (`PUT` via Server Action)

| 항목               | 내용                                                     |
| ------------------ | -------------------------------------------------------- |
| 진입점             | `/wiki/[title]/edit` 페이지                              |
| Server Action 위치 | `src/app/wiki/actions.ts`                                |
| 히스토리 저장      | **수정 전** 현재 content를 `DocumentHistory`에 먼저 백업 |
| 성공 시            | `redirect('/wiki/[title]')`                              |

**Server Action 로직 (트랜잭션 필수)**

```
updateDocument(prevState, formData)
  1. rawDocumentId 추출 → null/빈값/음수/소수 검증 후 Number 변환
  2. newContent, editorName(선택) 추출
  3. editorIp를 요청 헤더에서 추출 (x-real-ip 우선, x-forwarded-for rightmost 폴백)
  4. Prisma 트랜잭션 (try-catch로 에러 핸들링):
     a. DocumentHistory.create (기존 content + 기존 editorIp/editorName 백업)
     b. Document.update (새 content, editorIp, editorName으로 교체)
  5. [[백링크]] 파싱 후 DocumentLink 갱신 (기존 레코드 삭제 → 재삽입)
  6. revalidatePath('/wiki')
  7. revalidatePath(`/wiki/${title}`)
  8. redirect(`/wiki/${title}`)
```

> [!WARNING]
> 트랜잭션(`prisma.$transaction`)을 반드시 사용해야 합니다.
> 히스토리 저장 실패 시 문서 수정도 롤백되어야 합니다.

---

### 2.6. 문서 수정 이력 (`GET /wiki/[title]/history`)

| 항목          | 내용                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------- |
| 컴포넌트 타입 | Server Component                                                                         |
| 상태          | **미구현** (404 반환)                                                                    |
| 데이터 소스   | `db.documentHistory.findMany({ where: { documentId }, orderBy: { createdAt: 'desc' } })` |
| 표시 항목     | 수정 일시, 편집자 IP/닉네임, 내용 미리보기(앞 100자)                                     |

---

## 3. 공통 컴포넌트 명세

| 컴포넌트           | 경로                                     | 타입       | 역할                                          |
| ------------------ | ---------------------------------------- | ---------- | --------------------------------------------- |
| `Header`           | `src/components/Header.tsx`              | Client     | 반응형 헤더 (네비게이션, 테마 토글, 햄버거 메뉴) |
| `ThemeProvider`    | `src/components/ThemeProvider.tsx`       | Client     | SSR-safe 다크/라이트 모드 컨텍스트 관리         |
| `MarkdownEditor`   | `src/components/MarkdownEditor.tsx`      | Client     | 마크다운 작성 에디터 (툴바 + split/tab 뷰)     |
| `MarkdownRenderer` | `src/components/MarkdownRenderer.tsx`    | **Server** | react-markdown + XSS sanitize 래퍼              |
| `SubmitButton`     | `src/components/SubmitButton.tsx`        | Client     | 폼 제출 버튼 (`useFormStatus` 활용)            |
| `NewWikiForm`      | `src/app/wiki/new/NewWikiForm.tsx`       | Client     | 새 문서 작성 폼 (`useFormState`)               |
| `EditForm`         | `src/app/wiki/[title]/edit/EditForm.tsx` | Client     | 문서 수정 폼 (`useFormState`)                  |
| `BacklinkParser`   | `src/lib/backlink.ts`                    | 유틸       | `[[제목]]` → `<a>` 변환 로직                   |

---

## 4. 테마 시스템 (Theme System)

| 항목          | 내용                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| 구현 방식     | `[data-theme='dark'|'light']` HTML 속성 + CSS 변수                          |
| 상태 관리     | `ThemeProvider` (React Context + `localStorage` 영속성)                     |
| SSR 대응      | `suppressHydrationWarning` 적용 (서버는 `dark`, 클라이언트에서 즉시 교체)   |
| 기본 테마     | `dark`                                                                      |
| 토글 위치     | `Header` 컴포넌트 내 버튼                                                   |
| CSS 변수 위치 | `src/app/globals.css` (`:root` = dark 기본값, `[data-theme='light']` = 오버라이드) |

> [!IMPORTANT]
> FOUC(Flash of Unstyled Content) 버그가 존재합니다. (#011 이슈 참고)
> 라이트모드 선택 후 페이지 이동 시 잠깐 다크모드로 표시되는 현상입니다.
> 해결 방향: `<head>` 인라인 블로킹 스크립트로 `localStorage` 값을 즉시 적용.

---

## 5. 보안 체크리스트 (Reviewer 필수 확인)

- [x] 모든 사용자 입력(`title`, `content`, `editorName`)은 서버에서 trim + 유효성 검사 수행
- [x] 마크다운 렌더링 시 `rehype-sanitize` 적용 (스크립트 태그, 이벤트 핸들러 제거)
- [x] `editorIp`는 클라이언트가 아닌 **서버의 `headers()` 함수**에서 추출 (`x-real-ip` 우선, `x-forwarded-for` rightmost 폴백)
- [x] Prisma 쿼리는 모두 파라미터화된 쿼리 사용 (ORM 기본 동작, SQL Injection 방지)
- [x] `Document.title` 중복 시 Prisma `P2002` 에러를 catch하여 사용자 친화적 메시지 반환
- [x] 반달리즘(문서 훼손) 대응: DocumentHistory를 통한 이전 버전 복원 기능이 동작해야 함
- [x] `documentId` 검증: null/빈값/음수/소수점 모두 차단
- [x] DB 에러 서버 로깅 후 클라이언트에는 정제된 에러 메시지만 반환
- [x] 클라이언트 응답에 raw `editorIp` 미포함 (서버에서 `editorAlias`로 변환 후 전달)
- [x] CSS `!important` 금지 — 선택자 우선순위(Specificity)로 해결 (`CLAUDE.md` 5.4 항목)
