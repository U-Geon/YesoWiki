# YesoWiki 📖

**YesoWiki**는 친구들끼리 서로의 정보를 등록하고 꾸밀 수 있는 "나무위키" 스타일의 프라이빗 위키 서비스입니다.
단순한 정보 저장을 넘어, 사용자 간의 문서를 연결하고(Backlink) 히스토리를 관리할 수 있는 모던 웹 애플리케이션입니다.

## 🚀 Tech Stack

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Package Manager | pnpm |
| Deployment | Vercel |

## 🤖 AI Multi-Agent Architecture

이 프로젝트는 AI 기반의 **멀티 에이전트 개발 아키텍처**를 채택하여 개발됩니다.
자세한 구조는 `CLAUDE.md`와 `.agents/` 디렉토리를 참고하세요.

| 에이전트 | 역할 |
|---------|------|
| Builder | 요구사항 분석 및 Plan 작성 → GitHub Issue/브랜치 자동 생성 |
| Analyzer | 복잡한 비즈니스 로직 심층 분석 |
| Coder | Vercel Best Practices 기반 코드 구현 |
| Reviewer | 보안, 컨벤션, SSOT 검증 + 피드백 루프 |
| Doc Writer | 문서화 및 `steering.md` 지속 학습 |

## 🛠 Getting Started

### 1. 저장소 클론 및 패키지 설치

```bash
git clone https://github.com/U-Geon/YesoWiki.git
cd YesoWiki
pnpm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 아래 두 가지 값을 Supabase 대시보드에서 복사하여 입력합니다.

| 변수 | 설명 | Supabase 위치 |
|------|------|---------------|
| `DATABASE_URL` | 앱 구동용 — Transaction Pooler (포트 `6543`) | Project Settings → Database → Connection string |
| `DIRECT_URL` | DB 마이그레이션용 — Direct Connection (포트 `5432`) | 위와 동일, "Use connection pooling" 해제 시 노출 |

> [!IMPORTANT]
> 두 값 모두 `postgres.[프로젝트ID]` 형식의 사용자 이름을 포함해야 합니다.

### 3. 데이터베이스 스키마 동기화

```bash
pnpm prisma db push
```

### 4. 로컬 개발 서버 실행

```bash
pnpm dev
```

### 5. CI/CD — GitHub Secrets 등록 (배포 시 필수)

CI 빌드 및 Vercel 프로덕션 배포가 정상 작동하려면 **GitHub Repository Secrets**에 다음 두 값을 반드시 등록해야 합니다.

> **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret 이름 | 값 |
|------------|----|
| `DATABASE_URL` | `.env`의 `DATABASE_URL` 값 (Pooler, 포트 `6543`) |
| `DIRECT_URL` | `.env`의 `DIRECT_URL` 값 (Direct, 포트 `5432`) |

> [!WARNING]
> `DIRECT_URL`이 누락되면 CI 빌드 시 `PrismaConfigEnvError: Cannot resolve environment variable: DIRECT_URL` 에러가 발생합니다.

## 📁 프로젝트 구조

```
YesoWiki/
├── CLAUDE.md              # AI 에이전트 공통 지침 (컨벤션 포함)
├── .agents/               # 멀티 에이전트 시스템
│   ├── roles/             # 에이전트 페르소나 정의
│   ├── memory/            # 장기 기억 (steering.md)
│   └── skills/            # 기술 가이드 (Vercel 공식 등)
├── plans/                 # 작업 계획 (→ GitHub Issue 자동 동기화)
├── docs/                  # 프로젝트 문서 (요구사항 등)
├── .github/               # CI/CD 워크플로우 및 템플릿
├── prisma/                # DB 스키마 (SSOT)
└── src/app/               # Next.js App Router (코드 본체)
```

## 📝 Contributing

- 커밋, 브랜치, 코드 컨벤션은 [`CLAUDE.md`](./CLAUDE.md)의 §3~§5를 참고하세요.
- 이슈 및 PR은 `.github/` 폴더의 템플릿을 따라주세요.
