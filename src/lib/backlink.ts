/**
 * [[제목]] 형식의 백링크를 마크다운 링크 [제목](/wiki/제목) 으로 변환합니다.
 * XSS 방지를 위해 순수 문자열 치환만 수행하며, 실제 렌더링은 rehype-sanitize를 통과합니다.
 */
export function parseBacklinks(content: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return match
    const encoded = encodeURIComponent(trimmed)
    return `[${trimmed}](/wiki/${encoded})`
  })
}
