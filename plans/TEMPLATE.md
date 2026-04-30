---
# Plan 이슈 템플릿 (TEMPLATE)
# Builder Agent가 새로운 작업을 기획할 때 이 파일을 복사하여 Plan을 정의합니다.
# main 브랜치에 push 시 GitHub Actions가 자동으로 Issue와 브랜치를 생성합니다.

id: ""                    # 파일명과 동일 (예: "006-search-feature")
title: ""                 # GitHub Issue 제목 (예: "[Phase N] 기능 설명")
status: "backlog"         # backlog | open | in-progress | review | done
priority: "medium"        # low | medium | high | critical
labels: []                # GitHub 라벨 (예: ["feature", "frontend"])
assignee: ""              # GitHub 사용자명 (비워두면 미할당)
branch: ""                # 작업 브랜치명 (예: "feat/006-search-feature")
phase: ""                 # 프로젝트 Phase (예: "Phase 1")
created: ""               # 생성일 (YYYY-MM-DD)
updated: ""               # 최종 수정일
---

## 설명 (Description)

<!-- 이 이슈가 해결하려는 문제나 구현할 기능을 설명합니다. -->

## 작업 항목 (Tasks)

- [ ] 작업 1
- [ ] 작업 2

## 수락 조건 (Acceptance Criteria)

<!-- Reviewer Agent가 이 이슈의 완료를 판단하는 기준입니다. -->

- [ ] 조건 1
- [ ] 조건 2

## 참고 자료 (References)

<!-- 관련 docs/, .agents/skills/ 파일, 또는 외부 링크 -->
