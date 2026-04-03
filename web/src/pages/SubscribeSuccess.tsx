import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getFactCard } from '../data/loader'

export function SubscribeSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const { session } = useSession()

  // Find their most recent wrong answer for the first-action prompt
  const lastWrong = [...session.answers].reverse().find(a => !a.correct)
  const lastWrongCard = lastWrong ? getFactCard(lastWrong.slug) : null

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
          Confirming your membership...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-italic italic" style={{ color: 'var(--sienna)' }}>
          The verification did not go as planned. This is, we promise, unusual.
        </p>
        <Link to="/subscribe" className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>
          Try again →
        </Link>
      </div>
    )
  }

  const wrongCount = session.answers.filter(a => !a.correct).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
      {/* Welcome */}
      <h1
        className="font-display font-semibold text-center mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--deep)' }}
      >
        Welcome, Possiblist<span className="wordmark-degree">°</span>
      </h1>

      <p
        className="font-italic italic text-center mb-10"
        style={{ color: 'var(--mist)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}
      >
        You have joined a movement of people who would rather be accurate than loud.
        The numbers are glad to have you.
      </p>

      {/* What just happened */}
      <div
        className="p-8 rounded-lg mb-10 max-w-md mx-auto"
        style={{ backgroundColor: 'var(--cream)', border: '2px solid var(--verdigris-20)' }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-4" style={{ color: 'var(--verdigris)' }}>
          Your membership is active
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>·</span>
            <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
              Every article now opens fully — the historical detours, the asides, the genuine questions
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>·</span>
            <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
              Your donations through action cards are now matched at 20%
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>·</span>
            <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
              You can vote on Possiblist Grants — member-proposed projects that move a number
            </p>
          </div>
        </div>
      </div>

      {/* First action — personalised */}
      <div className="text-center space-y-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
          Your first move
        </p>

        {lastWrongCard ? (
          <>
            <p className="font-body text-sm" style={{ color: 'var(--ink)', maxWidth: '400px', margin: '0 auto' }}>
              You got {wrongCount} {wrongCount === 1 ? 'question' : 'questions'} wrong.
              Here is the full story behind your most recent one:
            </p>
            <Link
              to={`/article/${lastWrongCard.slug}`}
              className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
              style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1rem' }}
            >
              Read: {lastWrongCard.headline.slice(0, 50)}... →
            </Link>
          </>
        ) : (
          <>
            <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
              The quiz is waiting. Your wrong answers are about to get considerably more interesting.
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
              style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1rem' }}
            >
              Start the quiz →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
