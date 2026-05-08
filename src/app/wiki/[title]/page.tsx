import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { parseBacklinks } from '@/lib/backlink'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Props {
  params: { title: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = params
  let decodedTitle = title
  try {
    decodedTitle = decodeURIComponent(title)
  } catch (error) {
    // metadata generation fallback
  }
  return { title: decodedTitle }
}

export default async function WikiDetailPage({ params }: Props) {
  const { title } = params
  let decodedTitle = ''
  try {
    decodedTitle = decodeURIComponent(title)
  } catch (error) {
    notFound()
  }

  const doc = await db.document.findUnique({
    where: { title: decodedTitle },
  })

  if (!doc) notFound()

  const contentWithBacklinks = parseBacklinks(doc.content)
  const editor = doc.editorName ?? '익명'
  const updatedAt = new Date(doc.updatedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* 문서 헤더 */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#c7d0ff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {doc.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            마지막 수정: {editor} · {updatedAt}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={`/wiki/${encodeURIComponent(doc.title)}/history`}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
            }}
          >
            수정 이력
          </a>
          <a
            href={`/wiki/${encodeURIComponent(doc.title)}/edit`}
            style={{
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            편집
          </a>
        </div>
      </div>

      {/* 마크다운 본문 */}
      <MarkdownRenderer content={contentWithBacklinks} />
    </div>
  )
}
