import type { Metadata } from 'next'
import Link from 'next/link'

import { db } from '@/lib/prisma'

export const metadata: Metadata = { title: '문서 목록' }

export default async function WikiListPage() {
  const rawDocuments = await db.document.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true, editorName: true, editorIp: true },
  })

  const documents = rawDocuments.map(({ editorIp, ...doc }) => ({
    ...doc,
    editorAlias: doc.editorName ?? (editorIp ? editorIp.slice(0, 8) + '...' : '익명'),
  }))

  return (
    <div className="page-container">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div>
          <h1 className="page-title">문서 목록</h1>
          <p className="page-subtitle">총 {documents.length}개의 문서</p>
        </div>
        <Link href="/wiki/new" className="btn-primary">
          + 새 문서
        </Link>
      </div>

      {/* 문서 없음 */}
      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <p className="empty-text">아직 문서가 없어요. 첫 번째 문서를 작성해보세요!</p>
          <Link href="/wiki/new" className="btn-primary">
            + 새 문서 작성
          </Link>
        </div>
      ) : (
        <div className="doc-list">
          {documents.map((doc) => {
            const updatedAt = new Date(doc.updatedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            return (
              <Link
                key={doc.id}
                href={`/wiki/${encodeURIComponent(doc.title)}`}
                className="doc-card"
              >
                <span className="doc-card__icon">📄</span>
                <span className="doc-card__title">{doc.title}</span>
                <span className="doc-card__meta">
                  {doc.editorAlias} · {updatedAt}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
