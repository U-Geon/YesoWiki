'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  const toggle = () => setTheme(isDark ? 'light' : 'dark')
  
  // 하이드레이션 에러를 방지하기 위해 마운트 전에는 서버와 동일한 고정값을 렌더링합니다.
  // 동시에 visibility: hidden으로 숨겨두어 시각적인 깜빡임(☀️ -> 🌙)을 방지합니다.
  const themeIcon = mounted ? (isDark ? '☀️' : '🌙') : '☀️'
  const themeLabel = mounted ? (isDark ? '라이트 모드로 전환' : '다크 모드로 전환') : '다크 모드로 전환'
  const themeTitle = mounted ? (isDark ? '라이트 모드' : '다크 모드') : '다크 모드'
  const toggleStyle = mounted ? undefined : { visibility: 'hidden' as const }

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* 로고 */}
        <Link href="/" className="site-logo">
          <span className="logo-icon">📖</span>
          <span className="logo-text">예소위키</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="header-nav" aria-label="주요 메뉴">
          <Link href="/wiki" className="nav-link">
            문서 목록
          </Link>
          <Link href="/wiki/new" className="btn-primary btn-sm">
            + 새 문서
          </Link>

          {/* 다크모드 토글 */}
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={themeLabel}
            title={themeTitle}
            style={toggleStyle}
          >
            {themeIcon}
          </button>
        </nav>

        {/* 모바일 햄버거 */}
        <div className="header-mobile-actions">
          <button
            className="theme-toggle"
            onClick={toggle}
            aria-label={themeLabel}
            style={toggleStyle}
          >
            {themeIcon}
          </button>
          <button
            className="hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="메뉴 열기/닫기"
          >
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <nav className="mobile-menu" aria-label="모바일 메뉴">
          <Link href="/wiki" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            문서 목록
          </Link>
          <Link href="/wiki/new" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>
            + 새 문서
          </Link>
        </nav>
      )}
    </header>
  )
}
