import type { Metadata } from 'next'
import { db } from '@/lib/prisma'

export const metadata: Metadata = { title: '문서 목록' }

export default async function WikiListPage() {
  const rawDocuments = await db.document.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, updatedAt: true, editorName: true, editorIp: true },
  })

  const documents = rawDocuments.map(({ editorIp, ...doc }) => ({
    ...doc,
    editorAlias: doc.editorName ?? (editorIp ? editorIp.slice(0, 8) + '...' : '익명')
  }))

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#c7d0ff',
              margin: 0,
            }}
          >
            문서 목록
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            총 {documents.length}개의 문서
          </p>
        </div>
        <a
          href="/wiki/new"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          + 새 문서
        </a>
      </div>

      {documents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 0',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <p>아직 문서가 없어요. 첫 번째 문서를 작성해보세요!</p>
          <a
            href="/wiki/new"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: 'var(--accent-hover)',
              textDecoration: 'none',
            }}
          >
            문서 작성하러 가기 →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {documents.map((doc) => {
            const editor = doc.editorAlias
            const updatedAt = new Date(doc.updatedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            return (
              <a
                key={doc.id}
                href={`/wiki/${encodeURIComponent(doc.title)}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                  }}
                >
                  {doc.title}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
                  {editor} · {updatedAt}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
