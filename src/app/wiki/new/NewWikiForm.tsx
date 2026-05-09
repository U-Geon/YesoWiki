'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'

import { createDocument } from '@/app/wiki/actions'
import MarkdownEditor from '@/components/MarkdownEditor'
import SubmitButton from '@/components/SubmitButton'

const initialState = { error: '' }

export default function NewWikiForm() {
  const [state, formAction] = useFormState(createDocument, initialState)

  return (
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
        <MarkdownEditor
          id="content"
          name="content"
          required
          placeholder={`# 문서 제목\n\n내용을 마크다운으로 작성하세요.\n\n[[다른 문서]]처럼 백링크도 사용할 수 있어요!`}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Link
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
        </Link>
        <SubmitButton text="문서 저장" pendingText="저장 중..." />
      </div>
    </form>
  )
}
