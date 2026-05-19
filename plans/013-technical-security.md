---
id: '013-technical-security'
title: '[Phase 3] 기술적 보안 및 안정성 확보 (XSS, 동시성 제어, Rate Limiting)'
status: 'done'
priority: 'high'
labels: ['security', 'backend', 'phase3']
assignee: ''
branch: ''
phase: 'Phase 3'
created: '2026-05-19'
updated: '2026-05-19'
branch: 'fix/013-technical-security'
---

## 설명 (Description)

본격적인 라이브 서비스를 위해 위키 시스템이 갖추어야 할 필수적인 기술적 보안 및 안정성을 확보합니다. 익명 기반 편집이 가능하므로 악의적인 스크립트 삽입이나 서버 과부하를 막는 방어 로직이 필요합니다.

## 작업 항목 (Tasks)

- [x] **XSS 및 HTML 인젝션 방어 강화**
  - `rehype-sanitize` 설정을 커스텀하여 `href` 속성에 `javascript:` 스키마 차단
  - `img`, `iframe` 등 악용 가능한 태그와 속성의 화이트리스트 엄격화
- [x] **동시성 제어 (Optimistic Concurrency Control)**
  - 편집 충돌 방지를 위해 폼 제출 시 기존 문서의 `updatedAt`을 숨김 필드로 전송
  - DB 업데이트 전 `updatedAt`이 일치하는지 확인하여 불일치 시 "다른 사용자가 먼저 수정했습니다" 에러 반환 (Lost Update 방지)
- [x] **도배 및 서버 과부하 방지 (Rate Limiting)**
  - 본문 크기(예: 최대 10만 자) 및 제목 길이 하드 리밋(Server Validation) 적용
  - IP별 시간당 편집 횟수 제한 로직 설계 검토 (Next.js 미들웨어나 별도 Rate Limit 라이브러리 사용 검토)

## 수락 조건 (Acceptance Criteria)

- [x] 악의적인 스크립트(`<script>`, `javascript:`)가 포함된 마크다운을 저장해도 렌더링 시 무력화되어야 함
- [x] 두 브라우저를 띄워놓고 같은 문서를 동시에 편집할 때, 늦게 저장한 쪽은 충돌 경고와 함께 저장이 차단되어야 함
- [x] 제한 크기를 초과하는 텍스트 저장 시 적절한 에러 메시지와 함께 차단되어야 함

## 참고 자료 (References)

- Next.js Server Actions 보안 가이드
- Prisma Optimistic Concurrency 패턴
