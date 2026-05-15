import type { Metadata } from 'next'
import Script from 'next/script'

import Header from '@/components/Header'
import { ThemeProvider } from '@/components/ThemeProvider'

import './globals.css'

export const metadata: Metadata = {
  title: { default: '예소위키', template: '%s | 예소위키' },
  description: '친구들끼리 만드는 우리만의 위키 백과사전',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* FOUC 방지: 페이지 렌더 전에 localStorage 테마를 즉시 적용하는 블로킹 스크립트 */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          })();
        `}</Script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 60px)' }}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

