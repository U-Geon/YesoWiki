import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import Header from '@/components/Header'

import './globals.css'

export const metadata: Metadata = {
  title: { default: '예소위키', template: '%s | 예소위키' },
  description: '친구들끼리 만드는 우리만의 위키 백과사전',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
          <Header />
          <main style={{ minHeight: 'calc(100vh - 60px)' }}>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
