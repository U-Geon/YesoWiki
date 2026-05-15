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
    <form action={formAction} className="wiki-form">
      <input type="hidden" name="documentId" value={documentId} />

      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-doc-badge">
        📄 <strong>{title}</strong>
      </div>

      <div className="form-field">
        <label htmlFor="editorName" className="form-label">
          닉네임 <span className="form-optional">(선택)</span>
        </label>
        <input
          id="editorName"
          name="editorName"
          type="text"
          placeholder="익명으로 남기려면 비워두세요"
          maxLength={30}
          className="form-input"
        />
      </div>

      <div className="form-field">
        <label htmlFor="content" className="form-label">
          내용 (마크다운)
        </label>
        <MarkdownEditor id="content" name="content" required defaultValue={initialContent} />
      </div>

      <div className="form-actions">
        <a href={`/wiki/${encodeURIComponent(title)}`} className="btn-ghost">
          취소
        </a>
        <SubmitButton text="수정 완료" pendingText="저장 중..." />
      </div>
    </form>
  )
}
