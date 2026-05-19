'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/prisma'
import { extractBacklinkTitles } from '@/lib/backlink'

export interface PrevState {
  error?: string
}

export interface ActionResult {
  error?: string
}

// ─── 상수 ────────────────────────────────────────────────────────────────────

const MAX_TITLE_LENGTH = 100      // 문서 제목 최대 글자 수
const MAX_CONTENT_LENGTH = 100_000 // 문서 본문 최대 글자 수 (10만 자)
const MAX_EDITOR_NAME_LENGTH = 30  // 닉네임 최대 글자 수

// ─── 문서 생성 ────────────────────────────────────────────────────────────────

export async function createDocument(
  prevState: PrevState,
  formData: FormData,
): Promise<ActionResult> {
  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const editorName = (formData.get('editorName') as string)?.trim() || null

  // ── 서버 사이드 유효성 검사 ──────────────────────────
  if (!title) return { error: '문서 제목은 필수입니다.' }
  if (title.length > MAX_TITLE_LENGTH)
    return { error: `문서 제목은 ${MAX_TITLE_LENGTH}자 이하여야 합니다.` }
  if (!content) return { error: '문서 내용은 필수입니다.' }
  if (content.length > MAX_CONTENT_LENGTH)
    return { error: `문서 내용은 ${MAX_CONTENT_LENGTH.toLocaleString()}자 이하여야 합니다.` }
  if (editorName && editorName.length > MAX_EDITOR_NAME_LENGTH)
    return { error: `닉네임은 ${MAX_EDITOR_NAME_LENGTH}자 이하여야 합니다.` }

  // 서버에서 IP 추출 (x-real-ip 우선, 그 다음 x-forwarded-for의 가장 우측 값)
  const headersList = await headers()
  const editorIp =
    headersList.get('x-real-ip') ??
    headersList.get('x-forwarded-for')?.split(',').pop()?.trim() ??
    'unknown'

  try {
    const created = await db.document.create({
      data: { title, content, editorIp, editorName },
    })
    // [[제목]] 구문에서 참조 관계를 추출하여 DocumentLink 동기화
    await syncDocumentLinks(created.id, content)
  } catch (e: unknown) {
    const err = e as { code?: string }
    if (err.code === 'P2002') {
      return { error: `'${title}' 문서가 이미 존재합니다.` }
    }
    return { error: '문서 생성 중 오류가 발생했습니다.' }
  }

  revalidatePath('/wiki')
  redirect(`/wiki/${encodeURIComponent(title)}`)
}

// ─── 문서 수정 ────────────────────────────────────────────────────────────────

export async function updateDocument(
  prevState: PrevState,
  formData: FormData,
): Promise<ActionResult> {
  const rawDocumentId = formData.get('documentId')
  if (!rawDocumentId || rawDocumentId === '') {
    return { error: '잘못된 요청입니다.' }
  }

  const documentId = Number(rawDocumentId)
  if (!Number.isInteger(documentId) || documentId <= 0) {
    return { error: '잘못된 요청입니다.' }
  }

  const newContent = (formData.get('content') as string)?.trim()
  const editorName = (formData.get('editorName') as string)?.trim() || null

  // ── 서버 사이드 유효성 검사 ──────────────────────────
  if (!newContent) return { error: '문서 내용은 필수입니다.' }
  if (newContent.length > MAX_CONTENT_LENGTH)
    return { error: `문서 내용은 ${MAX_CONTENT_LENGTH.toLocaleString()}자 이하여야 합니다.` }
  if (editorName && editorName.length > MAX_EDITOR_NAME_LENGTH)
    return { error: `닉네임은 ${MAX_EDITOR_NAME_LENGTH}자 이하여야 합니다.` }

  // ── Optimistic Concurrency Control ──────────────────
  // 클라이언트가 폼을 열었을 때의 updatedAt 을 함께 전송합니다.
  // 서버의 현재 updatedAt 과 다르면 그 사이에 다른 사용자가 수정한 것이므로 차단합니다.
  const rawUpdatedAt = formData.get('updatedAt') as string | null
  const clientUpdatedAt = rawUpdatedAt ? new Date(rawUpdatedAt) : null

  const headersList = await headers()
  const editorIp =
    headersList.get('x-real-ip') ??
    headersList.get('x-forwarded-for')?.split(',').pop()?.trim() ??
    'unknown'

  let existingTitle = ''
  try {
    const existing = await db.document.findUnique({ where: { id: documentId } })
    if (!existing) return { error: '문서를 찾을 수 없습니다.' }

    existingTitle = existing.title

    // OCC 충돌 감지: 클라이언트가 보낸 updatedAt 과 DB 의 updatedAt 이 다르면 차단
    if (clientUpdatedAt && existing.updatedAt.getTime() !== clientUpdatedAt.getTime()) {
      return {
        error:
          '다른 사용자가 이미 이 문서를 수정했습니다. 페이지를 새로고침한 후 다시 시도해 주세요.',
      }
    }

    // 트랜잭션: 히스토리 백업 → 본문 업데이트 (원자적 실행)
    await db.$transaction([
      db.documentHistory.create({
        data: {
          documentId: existing.id,
          content: existing.content,
          editorIp: existing.editorIp,
          editorName: existing.editorName,
        },
      }),
      db.document.update({
        where: { id: documentId },
        data: { content: newContent, editorIp, editorName },
      }),
    ])
    // 수정된 내용 기준으로 DocumentLink 재동기화
    await syncDocumentLinks(documentId, newContent)
  } catch (error) {
    console.error('Failed to update document:', error)
    return { error: '문서 수정 중 오류가 발생했습니다.' }
  }

  revalidatePath('/wiki')
  revalidatePath(`/wiki/${encodeURIComponent(existingTitle)}`)
  redirect(`/wiki/${encodeURIComponent(existingTitle)}`)
}

// ─── DocumentLink 동기화 ──────────────────────────────────────────────────────

/**
 * 문서 내의 [[제목]] 구문을 파싱하여 DocumentLink 테이블을 최신 상태로 동기화합니다.
 * 기존 링크를 모두 삭제 후 현재 내용 기준으로 재삽입하는 방식으로 동작합니다.
 */
async function syncDocumentLinks(sourceId: number, content: string): Promise<void> {
  const referencedTitles = extractBacklinkTitles(content)

  // 현재 내용에서 참조하는 문서들을 DB에서 조회
  const targetDocs =
    referencedTitles.length > 0
      ? await db.document.findMany({
          where: { title: { in: referencedTitles } },
          select: { id: true },
        })
      : []

  // 기존 outgoing 링크 삭제 후 새 링크 삽입 (원자적 실행)
  await db.$transaction([
    db.documentLink.deleteMany({ where: { sourceId } }),
    ...(targetDocs.length > 0
      ? [
          db.documentLink.createMany({
            data: targetDocs.map((t) => ({ sourceId, targetId: t.id })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ])
}
