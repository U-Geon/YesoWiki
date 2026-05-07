'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/prisma'

// ─── 문서 생성 ────────────────────────────────────────────────────────────────

export async function createDocument(prevState: any, formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  const content = (formData.get('content') as string)?.trim()
  const editorName = (formData.get('editorName') as string)?.trim() || null

  // 유효성 검사
  if (!title) return { error: '문서 제목은 필수입니다.' }
  if (!content) return { error: '문서 내용은 필수입니다.' }

  // 서버에서 IP 추출 (클라이언트 위조 불가)
  const headersList = await headers()
  const editorIp =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'

  try {
    await db.document.create({
      data: { title, content, editorIp, editorName },
    })
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

export async function updateDocument(prevState: any, formData: FormData) {
  const documentId = Number(formData.get('documentId'))
  const newContent = (formData.get('content') as string)?.trim()
  const editorName = (formData.get('editorName') as string)?.trim() || null

  if (!newContent) return { error: '문서 내용은 필수입니다.' }
  if (isNaN(documentId)) return { error: '잘못된 요청입니다.' }

  const headersList = await headers()
  const editorIp =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'

  const existing = await db.document.findUnique({ where: { id: documentId } })
  if (!existing) return { error: '문서를 찾을 수 없습니다.' }

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

  revalidatePath(`/wiki/${encodeURIComponent(existing.title)}`)
  redirect(`/wiki/${encodeURIComponent(existing.title)}`)
}
