'use client'

import { useRef, useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

// ─── 타입 ────────────────────────────────────────────────────────────────────

type ViewMode = 'edit' | 'preview' | 'split'

interface ToolbarButton {
  icon: string
  label: string
  action: () => void
}

interface MarkdownEditorProps {
  id?: string
  name: string
  defaultValue?: string
  required?: boolean
  placeholder?: string
  rows?: number
}

// ─── 에디터 유틸 ─────────────────────────────────────────────────────────────

/**
 * textarea의 선택 영역을 prefix/suffix로 감쌉니다.
 * 선택 텍스트가 없으면 placeholder를 삽입하고 커서를 안쪽으로 이동합니다.
 */
function wrapSelection(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
  placeholder = '내용'
): string {
  const { selectionStart, selectionEnd, value } = textarea
  const selected = value.slice(selectionStart, selectionEnd)
  const replacement = selected || placeholder
  const newValue =
    value.slice(0, selectionStart) + prefix + replacement + suffix + value.slice(selectionEnd)

  // 커서를 감싼 텍스트 안쪽으로 이동
  const cursorStart = selectionStart + prefix.length
  const cursorEnd = cursorStart + replacement.length
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(cursorStart, cursorEnd)
  }, 0)

  return newValue
}

/**
 * 현재 줄의 앞에 prefix를 삽입합니다. (제목, 목록 등)
 */
function insertLinePrefix(textarea: HTMLTextAreaElement, prefix: string): string {
  const { selectionStart, value } = textarea
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart)

  setTimeout(() => {
    textarea.focus()
    const newCursor = selectionStart + prefix.length
    textarea.setSelectionRange(newCursor, newCursor)
  }, 0)

  return newValue
}

// ─── 메인 컴포넌트 ───────────────────────────────────────────────────────────

export default function MarkdownEditor({
  id,
  name,
  defaultValue = '',
  required = false,
  placeholder,
  rows = 22,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState(defaultValue)
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  const apply = useCallback((fn: (ta: HTMLTextAreaElement) => string) => {
    const ta = textareaRef.current
    if (!ta) return
    setContent(fn(ta))
  }, [])

  // ─── 툴바 버튼 정의 ───────────────────────────────────────────────────────

  const toolbarGroups: ToolbarButton[][] = [
    // 제목
    [
      { icon: 'H1', label: 'H1', action: () => apply((ta) => insertLinePrefix(ta, '# ')) },
      { icon: 'H2', label: 'H2', action: () => apply((ta) => insertLinePrefix(ta, '## ')) },
      { icon: 'H3', label: 'H3', action: () => apply((ta) => insertLinePrefix(ta, '### ')) },
    ],
    // 텍스트 서식
    [
      { icon: 'B', label: '굵게', action: () => apply((ta) => wrapSelection(ta, '**', '**', '굵게')) },
      { icon: 'I', label: '기울임', action: () => apply((ta) => wrapSelection(ta, '*', '*', '기울임')) },
      { icon: 'S̶', label: '취소선', action: () => apply((ta) => wrapSelection(ta, '~~', '~~', '취소선')) },
      { icon: '<>', label: '인라인 코드', action: () => apply((ta) => wrapSelection(ta, '`', '`', 'code')) },
    ],
    // 목록
    [
      { icon: '≡', label: '순서 없는 목록', action: () => apply((ta) => insertLinePrefix(ta, '- ')) },
      { icon: '1.', label: '순서 있는 목록', action: () => apply((ta) => insertLinePrefix(ta, '1. ')) },
      { icon: '☑', label: '체크리스트', action: () => apply((ta) => insertLinePrefix(ta, '- [ ] ')) },
    ],
    // 기타
    [
      { icon: '🔗', label: '링크', action: () => apply((ta) => wrapSelection(ta, '[', '](URL)', '링크 텍스트')) },
      { icon: '"', label: '인용', action: () => apply((ta) => insertLinePrefix(ta, '> ')) },
      { icon: '—', label: '구분선', action: () => apply((ta) => {
        const ta2 = textareaRef.current!
        const { selectionStart, value } = ta2
        const newValue = value.slice(0, selectionStart) + '\n---\n' + value.slice(selectionStart)
        setTimeout(() => { ta2.focus(); ta2.setSelectionRange(selectionStart + 5, selectionStart + 5) }, 0)
        return newValue
      })},
      { icon: '[[]]', label: '백링크', action: () => apply((ta) => wrapSelection(ta, '[[', ']]', '문서 제목')) },
    ],
  ]

  // ─── 렌더 ─────────────────────────────────────────────────────────────────

  const editorVisible = viewMode === 'edit' || viewMode === 'split'
  const previewVisible = viewMode === 'preview' || viewMode === 'split'

  return (
    <div className="md-editor">
      {/* 상단 헤더: 툴바 + 모드 전환 */}
      <div className="md-editor__header">
        {/* 툴바 버튼들 */}
        <div className="md-toolbar">
          {toolbarGroups.map((group, gi) => (
            <div key={gi} className="md-toolbar__group">
              {group.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  title={btn.label}
                  onClick={btn.action}
                  className="md-toolbar__btn"
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* 뷰 모드 전환 */}
        <div className="md-view-toggle">
          {(['edit', 'split', 'preview'] as ViewMode[]).map((mode) => {
            const labels: Record<ViewMode, string> = { edit: '편집', split: '분할', preview: '미리보기' }
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`md-view-toggle__btn${viewMode === mode ? ' active' : ''}`}
              >
                {labels[mode]}
              </button>
            )
          })}
        </div>
      </div>

      {/* 에디터 본문 */}
      <div className={`md-editor__body md-editor__body--${viewMode}`}>
        {/* 편집 패널 */}
        {editorVisible && (
          <div className="md-editor__pane md-editor__pane--edit">
            <textarea
              ref={textareaRef}
              id={id}
              name={name}
              required={required}
              placeholder={placeholder}
              rows={rows}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="md-textarea"
              spellCheck={false}
            />
          </div>
        )}

        {/* 미리보기 패널 */}
        {previewVisible && (
          <div className="md-editor__pane md-editor__pane--preview">
            {content.trim() ? (
              <div className="wiki-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="md-preview-empty">미리보기할 내용이 없습니다.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
