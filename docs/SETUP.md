# 개발 환경 세팅 가이드 (Development Setup)

> 새로운 팀원 또는 새 머신에서 프로젝트를 처음 시작할 때 이 문서를 따라 환경을 구성합니다.

---

## 1. 사전 요구사항 (Prerequisites)

| 도구 | 최소 버전 | 확인 명령 |
|------|----------|----------|
| Node.js | v20 이상 | `node -v` |
| pnpm | v9 이상 | `pnpm -v` |
| Git | v2.40 이상 | `git --version` |

> pnpm이 없다면: `npm install -g pnpm`

---

## 2. 초기 세팅 순서

```bash
# 1. 저장소 클론
git clone https://github.com/U-Geon/YesoWiki.git
cd YesoWiki

# 2. develop 브랜치로 이동 (개발 기준 브랜치)
git checkout develop

# 3. 의존성 설치 (postinstall에서 prisma generate 자동 실행)
pnpm install

# 4. 환경변수 파일 생성
cp .env.example .env
# .env를 열어 DATABASE_URL을 실제 DB 접속 정보로 수정
```

---

## 3. 데이터베이스 설정

### 3.1. 로컬 개발 (MySQL)

```bash
# .env 파일에 로컬 MySQL 접속 정보 입력
DATABASE_URL="mysql://root:password@localhost:3306/yesowiki"

# DB 스키마 동기화 (개발 환경에서는 db push 사용)
pnpm prisma db push

# Prisma Studio로 데이터 확인 (선택)
pnpm prisma studio
```

### 3.2. 클라우드 DB (Supabase - PostgreSQL, 권장)

Vercel 배포 환경에서는 로컬 MySQL 대신 **Supabase(PostgreSQL)** 사용을 권장합니다.

> [!IMPORTANT]
> Supabase를 사용할 경우 `prisma/schema.prisma`의 `provider`를 `"mysql"` → `"postgresql"`로 변경해야 합니다.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```bash
# Supabase Connection String을 .env에 입력 후
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 스키마 동기화
pnpm prisma db push
```

---

## 4. 개발 서버 실행

```bash
pnpm dev
# → http://localhost:3000 에서 확인
```

---

## 5. 브랜치 전략 & 작업 시작 방법

### 새로운 기능 작업 시

```bash
# 반드시 develop을 최신 상태로 pull한 뒤 작업 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feat/[plan-id]-[기능명]
# 예: git checkout -b feat/002-wiki-crud
```

### 커밋 메시지 규칙

```
feat(wiki): 위키 문서 생성 Server Action 구현
fix(auth): 로그인 리다이렉트 버그 수정
chore(ci): Vercel 빌드 스크립트 최적화
```

> 상세 규칙은 `CLAUDE.md` §3을 참조하세요.

---

## 6. 유용한 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 로컬 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 (Prisma generate 포함) |
| `pnpm lint` | ESLint 검사 |
| `pnpm tsc --noEmit` | TypeScript 타입 검사 |
| `pnpm prisma studio` | DB 데이터 GUI 확인 |
| `pnpm prisma db push` | 스키마 변경사항 DB에 반영 |
| `pnpm prisma generate` | Prisma Client 수동 재생성 |

---

## 7. 주요 디렉토리 구조

```
YesoWiki/
├── src/
│   ├── app/                 # Next.js App Router (페이지 및 API)
│   │   ├── wiki/            # 위키 관련 라우트
│   │   └── layout.tsx       # 루트 레이아웃
│   ├── components/          # 재사용 UI 컴포넌트
│   └── lib/                 # 비즈니스 로직, 유틸리티
│       └── prisma.ts        # Prisma Client 싱글턴
├── prisma/
│   └── schema.prisma        # DB 스키마 (SSOT)
├── docs/                    # 프로젝트 문서
│   ├── REQUIREMENTS.md      # 요구사항 정의서
│   ├── ERD.md               # 데이터 모델 다이어그램
│   ├── FEATURE_SPEC.md      # 기능 및 API 명세서
│   └── SETUP.md             # 이 문서
├── plans/                   # 작업 계획 (→ GitHub Issue 자동 연동)
├── .agents/                 # 멀티 에이전트 시스템
└── CLAUDE.md                # AI 에이전트 공통 지침 (헌법)
```

---

## 8. 트러블슈팅 (Troubleshooting)

### `@prisma/client is not found` 에러

```bash
pnpm prisma generate
```

### TypeScript 에러 - `Cannot find module 'next'`

```bash
pnpm install
```

### Prisma 스키마와 DB 상태 불일치

```bash
pnpm prisma db push --force-reset  # ⚠️ 데이터 초기화 주의
```
