import Link from 'next/link'
import NewWikiForm from './NewWikiForm'

export default function NewWikiPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/wiki"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}
        >
          ← 목록으로
        </Link>
        <h1
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#c7d0ff',
            marginTop: '0.75rem',
            marginBottom: 0,
          }}
        >
          새 문서 작성
        </h1>
      </div>

      <NewWikiForm />
    </div>
  )
}
