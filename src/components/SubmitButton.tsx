'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  text: string
  pendingText: string
}

export default function SubmitButton({ text, pendingText }: Props) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className={`btn-primary${pending ? ' btn--pending' : ''}`}>
      {pending ? pendingText : text}
    </button>
  )
}
