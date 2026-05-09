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

/**
 * [[제목]] 형식의 백링크를 존재하는 문서 / 존재하지 않는 문서로 나누어 변환합니다.
 * - 존재하는 문서: 일반 링크
 * - 존재하지 않는 문서: "red link" (새 문서 만들기 안내)
 *
 * @param content 마크다운 원문
 * @param existingTitles DB에 실제로 존재하는 문서 제목의 집합 (Set)
 */
export function parseBacklinksWithExistence(
  content: string,
  existingTitles: Set<string>
): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return match
    const encoded = encodeURIComponent(trimmed)

    if (existingTitles.has(trimmed)) {
      // 존재하는 문서: 일반 링크
      return `[${trimmed}](/wiki/${encoded})`
    } else {
      // 존재하지 않는 문서: red-link 클래스를 포함한 링크
      // rehype-sanitize는 href를 허용하므로, 클래스 속성 대신 마크다운 표준 링크로 처리하고
      // 제목 툴팁으로 미존재 상태를 알립니다. 실제 스타일은 globals.css에서 처리합니다.
      return `[${trimmed}](/wiki/new?title=${encoded} "존재하지 않는 문서입니다. 클릭하면 새 문서를 작성할 수 있습니다.")`
    }
  })
}

/**
 * 마크다운 문서 내의 [[제목]] 패턴에서 참조된 문서 제목들을 추출합니다.
 * 문서 저장 시 DocumentLink 테이블을 갱신하는 데 사용합니다.
 */
export function extractBacklinkTitles(content: string): string[] {
  const titles: string[] = []
  const regex = /\[\[([^\]]+)\]\]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    const trimmed = match[1].trim()
    if (trimmed) titles.push(trimmed)
  }
  return Array.from(new Set(titles)) // 중복 제거
}
