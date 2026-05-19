'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { createDocument } from '@/app/wiki/actions'
import MarkdownEditor from '@/components/MarkdownEditor'
import SubmitButton from '@/components/SubmitButton'

const initialState = { error: '' }

export default function NewWikiForm() {
  const [state, formAction] = useActionState(createDocument, initialState)

  return (
    <form action={formAction} className="wiki-form">
      {state?.error && <div className="form-error">{state.error}</div>}

      <div className="form-field">
        <label htmlFor="title" className="form-label">
          문서 제목 <span className="form-required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="예: 류건, 예소, 거제 여행"
          className="form-input"
        />
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
          내용 (마크다운) <span className="form-required">*</span>
        </label>
        <MarkdownEditor
          id="content"
          name="content"
          required
          placeholder={`# 문서 제목\n\n내용을 마크다운으로 작성하세요.\n\n[[다른 문서]]처럼 백링크도 사용할 수 있어요!`}
        />
      </div>

      <div className="form-actions">
        <Link href="/wiki" className="btn-ghost">
          취소
        </Link>
        <SubmitButton text="문서 저장" pendingText="저장 중..." />
      </div>
    </form>
  )
}
