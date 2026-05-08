'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--red)', marginBottom: '1rem', fontWeight: 600 }}>문제가 발생했습니다</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        문서 작성 페이지를 불러오는 중 예상치 못한 오류가 발생했습니다.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => reset()}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          다시 시도
        </button>
        <Link
          href="/wiki"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
