import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export function SubscribeSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    if (!sessionId || !/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(sessionId)) {
      setStatus('error')
      return
    }

    fetch(`/api/stripe/verify/${sessionId}`, { credentials: 'include' })
      .then(res => {
        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      })
      .catch(() => setStatus('error'))
  }, [sessionId])

  if (status === 'verifying') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-italic italic" style={{ color: 'var(--mist)' }}>
          Verifying your subscription...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-italic italic" style={{ color: 'var(--sienna)' }}>
          Something has gone wrong. This is unusual.
        </p>
        <Link to="/subscribe" className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>
          Try again →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1
        className="font-display font-semibold mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--deep)' }}
      >
        Welcome, Possiblist<span className="wordmark-degree">°</span>
      </h1>
      <p className="font-italic italic mb-8" style={{ color: 'var(--mist)', fontSize: '1.1rem' }}>
        You now have access to the full story behind every number.
        The historical detours, the Bryson asides, the genuine questions at the end.
      </p>
      <Link
        to="/"
        className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
        style={{
          backgroundColor: 'var(--verdigris)',
          color: 'var(--parchment)',
          fontSize: '1rem',
        }}
      >
        Continue the quiz →
      </Link>
    </div>
  )
}
