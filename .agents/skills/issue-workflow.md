# Skill: 이슈 및 브랜치 워크플로우 (Issue & Branch Workflow)

Builder Agent가 새로운 기능이나 작업을 기획할 때 준수해야 하는 이슈 관리 절차입니다.

## 1. Plan 파일 생성 규칙

Builder Agent는 계획 수립 시 반드시 `plans/` 디렉토리에 Plan MD 파일을 생성해야 합니다.

### 파일명 규칙
```
{순번 3자리}-{kebab-case 설명}.md
```
예: `006-search-feature.md`, `007-document-tags.md`

### 필수 프론트매터 (Frontmatter)
```yaml
---
id: "006-search-feature"
title: "[Phase N] 기능 설명"
status: "backlog"           # backlog → open → in-progress → review → done
priority: "medium"
labels: ["feature"]
branch: "feat/006-search-feature"
phase: "Phase N"
created: "YYYY-MM-DD"
---
```

## 2. 브랜치 명명 규칙

| 이슈 유형 | 브랜치 접두어 | 예시 |
|-----------|-------------|------|
| 새 기능   | `feat/`     | `feat/002-wiki-crud` |
| 버그 수정 | `fix/`      | `fix/010-xss-vulnerability` |
| 인프라/설정 | `chore/`  | `chore/011-ci-pipeline` |
| 문서      | `docs/`     | `docs/012-api-reference` |

## 3. 상태 전이 (Status Flow)

```
backlog → open → in-progress → review → done
```

- **backlog**: Builder가 기획만 완료, 아직 착수 전
- **open**: 작업 착수 승인됨, GitHub Issue 자동 생성 대상
- **in-progress**: Coder가 해당 브랜치에서 작업 중
- **review**: Reviewer Agent 검증 중 (PR 생성됨)
- **done**: 머지 완료, Issue 자동 닫힘

## 4. 자동화 파이프라인

`plans/*.md` 파일이 `main` 브랜치에 push되면:
1. GitHub Actions(`.github/workflows/sync-plans.yml`)가 프론트매터를 파싱합니다.
2. 동일 제목의 Issue가 없으면 **자동 생성**합니다.
3. 이미 있으면 내용을 **자동 업데이트**합니다.
4. `branch` 필드에 지정된 브랜치를 `main`에서 **자동 분기**합니다.
5. `status: "done"`이 되면 Issue를 **자동 닫습니다**.

## 5. GitHub 템플릿 연동

- **Issue 템플릿** (`.github/ISSUE_TEMPLATE/`):
  - `feature_request.md`: 기능 요청 시 사용
  - `bug_report.md`: 버그 리포트 시 사용
- **PR 템플릿** (`.github/PULL_REQUEST_TEMPLATE.md`):
  - 연관 이슈 번호, 관련 Plan 파일, Reviewer 체크리스트 포함
