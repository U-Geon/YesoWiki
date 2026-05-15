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
  } catch {
    // metadata generation fallback
  }
  return { title: decodedTitle }
}

export default async function WikiDetailPage({ params }: Props) {
  const { title } = params
  let decodedTitle = ''
  try {
    decodedTitle = decodeURIComponent(title)
  } catch {
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
    <div className="page-container page-container--wide">
      {/* 문서 헤더 */}
      <div className="doc-header">
        <div className="doc-header__info">
          <h1 className="doc-header__title">{doc.title}</h1>
          <p className="doc-header__meta">마지막 수정: {editor} · {updatedAt}</p>
        </div>
        <div className="doc-header__actions">
          <a
            href={`/wiki/${encodeURIComponent(doc.title)}/history`}
            className="btn-ghost btn-sm"
          >
            수정 이력
          </a>
          <a href={`/wiki/${encodeURIComponent(doc.title)}/edit`} className="btn-primary btn-sm">
            편집
          </a>
        </div>
      </div>

      {/* 마크다운 본문 */}
      <MarkdownRenderer content={contentWithBacklinks} />

      {/* 백링크 목록 */}
      {doc.incomingLinks.length > 0 && (
        <div className="backlinks">
          <h2 className="backlinks__heading">
            이 문서를 참조하는 문서 ({doc.incomingLinks.length})
          </h2>
          <div className="backlinks__list">
            {doc.incomingLinks.map((link) => (
              <Link
                key={link.id}
                href={`/wiki/${encodeURIComponent(link.source.title)}`}
                className="backlink-chip"
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
