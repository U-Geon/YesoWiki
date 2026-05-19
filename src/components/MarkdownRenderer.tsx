// MarkdownRenderer is server-safe

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

interface MarkdownRendererProps {
  content: string
}

/**
 * rehype-sanitize 커스텀 스키마
 *
 * defaultSchema 를 기반으로 다음 보안 규칙을 강화합니다:
 *  - `javascript:` 스키마를 허용하지 않습니다 (href/src 에 적용)
 *  - `iframe`, `script`, `object`, `embed` 태그를 허용하지 않습니다
 *  - 이미지는 http/https URL 만 허용합니다
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // href 에서 javascript: 차단 — http(s):// 와 /(상대경로), #(앵커) 만 허용
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      [
        'href',
        /^https?:\/\//,
        /^\//,
        /^#/,
        /^mailto:/,
      ],
    ],
    // img src 에서 데이터 URI 및 javascript: 차단
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['src', /^https?:\/\//],
      'alt',
      'title',
    ],
  },
  // 위험한 태그 제거 (defaultSchema 에서도 없지만 명시적으로 차단)
  tagNames: (defaultSchema.tagNames ?? []).filter(
    (tag) => !['script', 'iframe', 'object', 'embed', 'form', 'input'].includes(tag),
  ),
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="wiki-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
