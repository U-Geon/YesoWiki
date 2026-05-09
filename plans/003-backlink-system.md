---
id: '003-backlink-system'
title: '[Phase 1] 백링크(Backlink) 시스템 구현'
status: 'backlog'
priority: 'medium'
labels: ['feature', 'backend']
assignee: ''
branch: 'feat/003-backlink-system'
phase: 'Phase 1'
created: '2026-04-30'
updated: '2026-04-30'
---

## 설명 (Description)

위키 문서 내에서 `[[다른 문서 제목]]` 구문을 사용하면 해당 문서로 연결되는 하이퍼링크가 자동 생성되고, 역참조(Backlink)를 추적할 수 있는 시스템을 구축합니다.

## 작업 항목 (Tasks)

- [ ] `[[문서명]]` 정규식 파서 구현 (`src/lib/wiki-parser.ts`)
- [ ] Prisma 스키마에 `DocumentLink` 모델 추가 (문서 간 연결 관계)
- [ ] 문서 저장 시 자동으로 링크를 파싱하여 DB에 반영
- [ ] 문서 상세 페이지 하단에 "이 문서를 참조하는 문서" 목록 표시

## 수락 조건 (Acceptance Criteria)

- [ ] `[[존재하는 문서]]` 입력 시 클릭 가능한 링크로 렌더링
- [ ] `[[존재하지 않는 문서]]` 입력 시 "새 문서 만들기" 링크로 렌더링 (빨간 링크)
- [ ] 문서 하단에 Backlink 목록이 정확히 표시

## 참고 자료 (References)

- [REQUIREMENTS.md](../docs/REQUIREMENTS.md)
