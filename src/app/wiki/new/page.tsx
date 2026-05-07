'use client'

import { useFormState } from 'react-dom'
import { createDocument } from '@/app/wiki/actions'
import SubmitButton from '@/components/SubmitButton'

const initialState = { error: '' }

export default function NewWikiPage() {
  const [state, formAction] = useFormState(createDocument, initialState)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <a
          href="/wiki"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
          }}
        >
          ← 목록으로
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
          새 문서 작성
        </h1>
      </div>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {state?.error && (
          <div
            style={{
              background: '#2d1515',
              border: '1px solid #6b2323',
              color: 'var(--red)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
            }}
          >
            {state.error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="title"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            문서 제목 <span style={{ color: 'var(--red)' }}>*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="예: 류건, 예소, 거제 여행"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="editorName"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            닉네임 <span style={{ color: 'var(--text-muted)' }}>(선택)</span>
          </label>
          <input
            id="editorName"
            name="editorName"
            type="text"
            placeholder="익명으로 남기려면 비워두세요"
            maxLength={30}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label
            htmlFor="content"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}
          >
            내용 (마크다운) <span style={{ color: 'var(--red)' }}>*</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={20}
            placeholder={`# 문서 제목\n\n내용을 마크다운으로 작성하세요.\n\n[[다른 문서]]처럼 백링크도 사용할 수 있어요!`}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontFamily: "'Courier New', monospace",
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <a
            href="/wiki"
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              fontSize: '0.9rem',
            }}
          >
            취소
          </a>
          <SubmitButton text="문서 저장" pendingText="저장 중..." />
        </div>
      </form>
    </div>
  )
}
