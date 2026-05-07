# ERD (Entity Relationship Diagram)

> 이 문서는 YesoWiki의 데이터 모델을 정의합니다.
> **SSOT 원칙에 따라 `prisma/schema.prisma`가 실제 DB 진실 공급원(Source of Truth)이며, 이 ERD는 그 시각적 설명 문서입니다.**
> 스키마 변경 시 반드시 이 문서도 함께 업데이트해야 합니다.

## 엔티티 관계 다이어그램

```mermaid
erDiagram
    Document {
        Int      id          PK  "자동 증가"
        String   title       UK  "문서 제목 (유니크, URL slug 역할)"
        Text     content         "마크다운 원문"
        String   editorIp        "최종 편집자 IP (nullable)"
        String   editorName      "최종 편집자 닉네임 (nullable)"
        DateTime createdAt       "최초 생성일"
        DateTime updatedAt       "최근 수정일"
    }

    DocumentHistory {
        Int      id          PK  "자동 증가"
        Int      documentId  FK  "대상 문서 Document.id"
        Text     content         "수정 시점의 마크다운 스냅샷"
        String   editorIp        "수정자 IP (nullable)"
        String   editorName      "수정자 닉네임 (nullable)"
        DateTime createdAt       "스냅샷 생성일 (수정 일시)"
    }

    Document ||--o{ DocumentHistory : "버전 보존"
```

## 주요 설계 결정 사항

| 항목 | 결정 | 이유 |
|------|------|------|
| `User` 모델 | **제거** | 나무위키와 동일하게 로그인 없이 익명 편집 정책 채택 |
| `editorIp` / `editorName` | nullable String | IP는 서버에서 자동 기록, 닉네임은 사용자가 선택적으로 입력 |
| `Document.title` | `@unique` 제약 | 문서 제목이 URL이자 식별자. `[[백링크]]`도 제목 기준으로 동작 |
| `DocumentHistory.content` | 전체 본문 스냅샷 | diff가 아닌 원본 전체를 저장하여 임의 시점 복원 및 반달리즘 복구 가능 |
| `onDelete: Cascade` | DocumentHistory | 문서 삭제 시 히스토리도 함께 제거 |
| 소프트 삭제 | 미구현 (향후 확장) | 현재는 히스토리만 보존. 필요 시 `deletedAt DateTime?` 컬럼 추가 예정 |

## 향후 확장 예정 모델

향후 기능 확장 시 추가될 수 있는 모델입니다. (미구현)

```mermaid
erDiagram
    Backlink {
        Int id          PK
        Int sourceId    FK  "출처 문서"
        Int targetId    FK  "대상 문서"
    }

    Document ||--o{ Backlink : "참조함"
    Document ||--o{ Backlink : "참조됨"
```
