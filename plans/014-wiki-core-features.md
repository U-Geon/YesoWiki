---
id: '014-wiki-core-features'
title: '[Phase 3] 위키 핵심 기획 추가 (문서 히스토리, 최근 변경, 리다이렉트)'
status: 'backlog'
priority: 'critical'
labels: ['feature', 'wiki-core', 'phase3']
assignee: ''
branch: ''
phase: 'Phase 3'
created: '2026-05-19'
updated: '2026-05-19'
---

## 설명 (Description)

일반적인 위키의 필수 기능들을 구현하여 시스템의 완성도를 높입니다. 특히 익명 시스템 특성상 반달리즘에 대응하기 위한 문서 역사 기록과 롤백 기능이 가장 시급합니다.

## 작업 항목 (Tasks)

- [ ] **문서 역사(History) 및 롤백 기능 구현**
  - Prisma 스키마에 `DocumentHistory` 모델 추가 (문서 ID, 텍스트 원본, 수정자 정보, 수정 일시, 리비전 등 저장)
  - 문서 편집 시 `Document` 업데이트와 함께 `DocumentHistory` 레코드 생성
  - 이전 리비전 조회 화면 및 롤백(특정 리비전으로 덮어쓰기) 기능 추가
- [ ] **최근 변경 내역 (Recent Changes) 페이지 신설**
  - `/wiki/recent` 페이지를 생성하여 최근 수정된 문서 목록과 수정 시간, 에디터 정보를 최신순으로 제공
- [ ] **리다이렉트 (Redirect) 처리 로직**
  - 마크다운 파서 및 서버 로직에서 `#redirect [대상문서]` 패턴을 감지하여 자동으로 해당 페이지로 이동 처리
- [ ] **최소한의 관리자(Admin) 권한 모드 기획/구현**
  - 서버 환경 변수(`ADMIN_PASSWORD`) 기반의 로그인 세션/쿠키 발급
  - 관리자 전용 '문서 보호(Lock/Read-only)' 플래그 기능 도입

## 수락 조건 (Acceptance Criteria)

- [ ] 문서가 수정될 때마다 이전 버전이 데이터베이스에 안전하게 기록되어야 함
- [ ] 문서 이력 페이지에서 특정 버전으로 롤백이 가능해야 함
- [ ] 누구나 `/wiki/recent` 에서 실시간으로 최근 변경된 문서 현황을 조회할 수 있어야 함
- [ ] `#redirect 대상` 입력 시 접근 시 대상 페이지로 자동 렌더링(서버사이드 리다이렉트)되어야 함

## 참고 자료 (References)

- `prisma/schema.prisma`
- 나무위키 최근 변경 및 이력 보기 UI 참고
