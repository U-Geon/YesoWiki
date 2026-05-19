import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import EditForm from './EditForm'

interface Props {
  params: { title: string }
}

export default async function EditPage({ params }: Props) {
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a
          href={`/wiki/${encodeURIComponent(doc.title)}`}
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}
        >
          ← 문서로 돌아가기
        </a>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#c7d0ff',
            marginTop: '0.75rem',
            marginBottom: 0,
          }}
        >
          문서 수정
        </h1>
      </div>

      <EditForm documentId={doc.id} title={doc.title} initialContent={doc.content} updatedAt={doc.updatedAt.toISOString()} />
    </div>
  )
}
