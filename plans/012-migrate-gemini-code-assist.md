---
id: '012-migrate-gemini-code-assist'
title: '[Infra] 코드 리뷰 에이전트 마이그레이션 (CodeRabbit -> Gemini Code Assist)'
status: 'done'
priority: 'medium'
labels: ['infra', 'ci-cd', 'ai']
assignee: ''
branch: 'feat/012-migrate-gemini-code-assist'
phase: 'Phase 2'
created: '2026-05-15'
updated: '2026-05-15'
---

## 설명 (Description)

기존에 사용하던 CodeRabbit 코드 리뷰 에이전트를 Gemini Code Assist로 변경합니다.
이를 위해 기존 CodeRabbit 설정 파일을 제거하고, Gemini Code Assist에 맞는 환경 설정 파일을 생성합니다.

## 작업 항목 (Tasks)

- [x] `.coderabbit.yaml` 파일 삭제
- [x] Gemini Code Assist 환경설정 파일 생성 및 구성
- [x] 관련 CI/CD 파이프라인이나 설정 가이드라인 최신화 (필요시)

## 수락 조건 (Acceptance Criteria)

- [x] CodeRabbit 설정이 프로젝트에서 완전히 제거되어야 함
- [x] Gemini Code Assist가 프로젝트를 올바르게 분석할 수 있도록 설정 파일이 구성되어야 함
- [x] 에이전트 문서(`steering.md`, 기능 명세 등)에 마이그레이션 내역이 반영되어야 함

## 참고 자료 (References)

- 기존 파일: `.coderabbit.yaml`
