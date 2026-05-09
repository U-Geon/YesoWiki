'use client'

import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

// ─── 타입 ────────────────────────────────────────────────────────────────────

type ViewMode = 'edit' | 'preview' | 'split'

interface SelectionRange {
  start: number
  end: number
}

interface EditorActionResults {
  newValue: string
  selection: SelectionRange
}

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
  placeholder = '내용',
): EditorActionResults {
  const { selectionStart, selectionEnd, value } = textarea
  const selected = value.slice(selectionStart, selectionEnd)
  const replacement = selected || placeholder
  const newValue =
    value.slice(0, selectionStart) + prefix + replacement + suffix + value.slice(selectionEnd)

  // 커서를 감싼 텍스트 안쪽으로 이동
  const cursorStart = selectionStart + prefix.length
  const cursorEnd = cursorStart + replacement.length

  return {
    newValue,
    selection: { start: cursorStart, end: cursorEnd },
  }
}

/**
 * 현재 줄의 앞에 prefix를 삽입합니다. (제목, 목록 등)
 */
function insertLinePrefix(textarea: HTMLTextAreaElement, prefix: string): EditorActionResults {
  const { selectionStart, value } = textarea
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  const newCursor = selectionStart + prefix.length

  return {
    newValue,
    selection: { start: newCursor, end: newCursor },
  }
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
  const [pendingSelection, setPendingSelection] = useState<SelectionRange | null>(null)

  // DOM 업데이트 후 커서 위치 적용
  useLayoutEffect(() => {
    if (pendingSelection && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(pendingSelection.start, pendingSelection.end)
      setPendingSelection(null)
    }
  }, [pendingSelection])

  // 화면 크기에 따른 초기 뷰 모드 설정 및 리사이즈 감지
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        // 모바일에서는 스플릿 뷰 대신 단일 뷰(편집)로 초기화 (기존 모드가 split인 경우에만)
        setViewMode((prev) => (prev === 'split' ? 'edit' : prev))
      } else {
        // 데스크탑에서는 스플릿 뷰로 전환 (기존 모드가 edit/preview인 경우에만)
        setViewMode((prev) => (prev !== 'split' ? 'split' : prev))
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const apply = useCallback((fn: (ta: HTMLTextAreaElement) => EditorActionResults) => {
    const ta = textareaRef.current
    if (!ta) return
    const { newValue, selection } = fn(ta)
    setContent(newValue)
    setPendingSelection(selection)
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
        const { selectionStart, value } = ta
        const newValue = value.slice(0, selectionStart) + '\n---\n' + value.slice(selectionStart)
        const newCursor = selectionStart + 5
        return {
          newValue,
          selection: { start: newCursor, end: newCursor }
        }
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
                  aria-label={btn.label}
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
                aria-pressed={viewMode === mode}
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
