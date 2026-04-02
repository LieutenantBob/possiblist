import { useState, type FormEvent } from 'react'
import { useSession } from '../../hooks/useSession'

interface EmailCaptureProps {
  slug: string
  className?: string
}

export function EmailCapture({ slug, className = '' }: EmailCaptureProps) {
  const { session, markEmailCaptured } = useSession()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  if (session.emailCaptured) {
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: slug }),
      })
      if (res.ok) {
        setStatus('success')
        markEmailCaptured()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`text-center py-6 ${className}`}>
        <p className="font-italic italic" style={{ color: 'var(--verdigris)' }}>
          You're in. Five surprising facts, every week.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`py-6 px-6 rounded-lg ${className}`}
      style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
    >
      <p className="font-body font-semibold mb-1" style={{ color: 'var(--deep)', fontSize: '0.95rem' }}>
        Get 5 surprising facts per week. No noise.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 mt-3">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2 rounded-md border font-mono text-sm"
          style={{
            borderColor: 'var(--deep-10)',
            backgroundColor: 'var(--chalk)',
            color: 'var(--deep)',
          }}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-5 py-2 rounded-md font-mono text-sm cursor-pointer border-none"
          style={{
            backgroundColor: 'var(--verdigris)',
            color: 'var(--parchment)',
          }}
        >
          {status === 'submitting' ? '...' : 'Subscribe free'}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-mono text-xs mt-2" style={{ color: 'var(--sienna)' }}>
          Something has gone wrong. This is unusual.
        </p>
      )}
    </div>
  )
}
