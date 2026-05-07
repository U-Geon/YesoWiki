'use client'

import { useFormStatus } from 'react-dom'

interface Props {
  text: string
  pendingText: string
}

export default function SubmitButton({ text, pendingText }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: pending ? 'var(--bg-elevated)' : 'var(--accent)',
        color: '#fff',
        border: 'none',
        padding: '0.6rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {pending ? pendingText : text}
    </button>
  )
}
