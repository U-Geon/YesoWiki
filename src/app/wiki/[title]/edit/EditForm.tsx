'use client'

import { useFormState } from 'react-dom'

import { updateDocument } from '@/app/wiki/actions'
import MarkdownEditor from '@/components/MarkdownEditor'
import SubmitButton from '@/components/SubmitButton'

interface Props {
  documentId: number
  title: string
  initialContent: string
}

const initialState = { error: '' }

export default function EditForm({ documentId, title, initialContent }: Props) {
  const [state, formAction] = useFormState(updateDocument, initialState)

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <input type="hidden" name="documentId" value={documentId} />

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

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}
      >
        📄 <strong style={{ color: 'var(--text-secondary)' }}>{title}</strong>
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
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label
          htmlFor="content"
          style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}
        >
          내용 (마크다운)
        </label>
        <MarkdownEditor id="content" name="content" required defaultValue={initialContent} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <a
          href={`/wiki/${encodeURIComponent(title)}`}
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
        <SubmitButton text="수정 완료" pendingText="저장 중..." />
      </div>
    </form>
  )
}
