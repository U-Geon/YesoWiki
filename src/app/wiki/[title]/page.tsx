import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/prisma'
import { parseBacklinksWithExistence, extractBacklinkTitles } from '@/lib/backlink'
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
    include: {
      incomingLinks: {
        include: { source: { select: { id: true, title: true } } },
        orderBy: { source: { title: 'asc' } },
      },
    },
  })

  if (!doc) notFound()

  // 본문 내 [[링크]] 렌더링을 위해 참조된 문서들의 존재 여부 확인
  const referencedTitles = extractBacklinkTitles(doc.content)
  const existingDocs =
    referencedTitles.length > 0
      ? await db.document.findMany({
          where: { title: { in: referencedTitles } },
          select: { title: true },
        })
      : []
  const existingTitles = new Set(existingDocs.map((d) => d.title))

  const contentWithBacklinks = parseBacklinksWithExistence(doc.content, existingTitles)
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

      {/* 백링크 목록 */}
      {doc.incomingLinks.length > 0 && (
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <h2
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            이 문서를 참조하는 문서 ({doc.incomingLinks.length})
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {doc.incomingLinks.map((link) => (
              <Link
                key={link.id}
                href={`/wiki/${encodeURIComponent(link.source.title)}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  transition: 'border-color 0.15s',
                }}
              >
                {link.source.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
