import type { Metadata } from 'next'
import Link from 'next/link'

import { db } from '@/lib/prisma'

export const metadata: Metadata = {
  title: '예소위키 — 우리만의 위키 백과사전',
  description: '친구들끼리 만드는 우리만의 위키 백과사전. 누구나 자유롭게 문서를 작성하고 수정할 수 있어요.',
}

export default async function HomePage() {
  const [docCount, recentDocs] = await Promise.all([
    db.document.count(),
    db.document.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { title: true, updatedAt: true, editorName: true },
    }),
  ])

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">✨ 우리만의 위키</div>
          <h1 className="hero-title">
            <span className="hero-title-main">예소위키</span>
          </h1>
          <p className="hero-desc">
            친구들끼리 만드는 우리만의 위키 백과사전.
            <br />
            누구나 자유롭게 문서를 작성하고 수정할 수 있어요.
          </p>

          <div className="hero-actions">
            <Link href="/wiki/new" className="btn-primary btn-hero">
              + 새 문서 작성
            </Link>
            <Link href="/wiki" className="btn-ghost btn-hero">
              문서 목록 보기 →
            </Link>
          </div>

          {/* 통계 카드 */}
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">{docCount}</span>
              <span className="stat-label">개의 문서</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-number">∞</span>
              <span className="stat-label">무한한 지식</span>
            </div>
          </div>
        </div>
      </section>

      {/* 최근 문서 섹션 */}
      {recentDocs.length > 0 && (
        <section className="recent-section">
          <div className="recent-inner">
            <h2 className="section-title">최근 수정된 문서</h2>
            <div className="recent-list">
              {recentDocs.map((doc) => {
                const updatedAt = new Date(doc.updatedAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })
                return (
                  <Link
                    key={doc.title}
                    href={`/wiki/${encodeURIComponent(doc.title)}`}
                    className="recent-item"
                  >
                    <span className="recent-icon">📄</span>
                    <span className="recent-title">{doc.title}</span>
                    <span className="recent-meta">
                      {doc.editorName ?? '익명'} · {updatedAt}
                    </span>
                  </Link>
                )
              })}
            </div>
            <Link href="/wiki" className="view-all-link">
              모든 문서 보기 →
            </Link>
          </div>
        </section>
      )}

      {/* 피처 카드 */}
      <section className="features-section">
        <div className="features-inner">
          <div className="feature-card">
            <span className="feature-icon">📝</span>
            <h3 className="feature-title">마크다운 에디터</h3>
            <p className="feature-desc">실시간 미리보기와 서식 버튼으로 쉽고 빠르게 작성하세요.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔗</span>
            <h3 className="feature-title">백링크 시스템</h3>
            <p className="feature-desc">
              [[문서명]] 구문으로 문서를 연결하고 역참조를 자동으로 추적합니다.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📖</span>
            <h3 className="feature-title">자유로운 편집</h3>
            <p className="feature-desc">누구나 익명으로 작성하고 수정할 수 있는 열린 위키입니다.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
