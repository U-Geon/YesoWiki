import type { Metadata } from 'next'
import { db } from '@/lib/prisma'

export const metadata: Metadata = {
  title: '예소위키 — 우리만의 위키 백과사전',
}

export default async function HomePage() {
  const docCount = await db.document.count()

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📖</div>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#c7d0ff',
          marginBottom: '1rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}
      >
        예소위키
      </h1>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          lineHeight: 1.8,
        }}
      >
        친구들끼리 만드는 우리만의 위키 백과사전.
        <br />
        누구나 자유롭게 문서를 작성하고 수정할 수 있어요.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '4rem',
        }}
      >
        <a
          href="/wiki"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            padding: '0.75rem 1.75rem',
            borderRadius: '10px',
            fontWeight: 500,
            fontSize: '1rem',
            transition: 'border-color 0.15s',
          }}
        >
          문서 목록 보기 →
        </a>
        <a
          href="/wiki/new"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.75rem 1.75rem',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '1rem',
          }}
        >
          + 새 문서 작성
        </a>
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'inline-block',
        }}
      >
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          현재{' '}
          <strong style={{ color: 'var(--accent-hover)', fontSize: '1.3rem' }}>
            {docCount}
          </strong>
          개의 문서가 있어요
        </span>
      </div>
    </div>
  )
}
