import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: '예소위키', template: '%s | 예소위키' },
  description: '친구들끼리 만드는 우리만의 위키 백과사전',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <header
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '0 1.5rem',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <a
              href="/"
              style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--accent-hover)',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              📖 예소위키
            </a>
            <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a
                href="/wiki"
                className="nav-link"
              >
                문서 목록
              </a>
              <a
                href="/wiki/new"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '6px',
                  fontWeight: 500,
                  transition: 'background 0.15s',
                }}
              >
                + 새 문서
              </a>
            </nav>
          </div>
        </header>
        <main style={{ minHeight: 'calc(100vh - 56px)' }}>{children}</main>
      </body>
    </html>
  )
}
