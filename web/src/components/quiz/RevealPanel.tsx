import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { FactCard } from '../../data/types'
import { RevealChart } from './RevealChart'
import { useShare } from '../../hooks/useShare'
import { useSession } from '../../hooks/useSession'

interface RevealPanelProps {
  card: FactCard
  correct: boolean
  onNext: () => void
}

export function RevealPanel({ card, correct, onNext }: RevealPanelProps) {
  const { share } = useShare()
  const { session } = useSession()

  const shareText = correct ? card.shareText.correct : card.shareText.wrong

  function handleShare() {
    share({
      title: `Possiblist — ${card.quiz.question}`,
      text: shareText,
      url: `https://possiblist.net/q/${card.slug}`,
    })
  }

  // Show email capture after 2nd answer if not already captured
  const showEmailCapture = !session.emailCaptured && session.answers.length >= 2

  return (
    <div aria-live="polite" className="space-y-6">
      {/* Result badge */}
      <div
        className="inline-block px-4 py-2 rounded-md font-mono text-sm font-normal"
        style={{
          backgroundColor: correct ? 'var(--verdigris-10)' : 'var(--sienna-10)',
          color: correct ? 'var(--verdigris)' : 'var(--sienna)',
        }}
      >
        {correct ? "One of the few." : "You're in good company."}
      </div>

      {/* The real figure */}
      <div>
        <p
          className="font-mono font-light"
          style={{ fontSize: '2.5rem', color: 'var(--verdigris)', lineHeight: 1.2 }}
        >
          {card.reality.figure}
        </p>
        <p className="font-italic italic mt-1" style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>
          {card.reality.trendLabel}
        </p>
      </div>

      {/* Chart */}
      <RevealChart data={card.reality.chartData} />

      {/* Survey stat */}
      <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
        {card.quiz.surveyResult.percentWrong}% of people get this wrong
        <span className="ml-2 opacity-60">— {card.quiz.surveyResult.source}</span>
      </p>

      {/* Nuance box */}
      <div className="nuance-box">
        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
          {card.nuance}
        </p>
      </div>

      {/* === Email capture — right at the emotional peak === */}
      {showEmailCapture && <RevealEmailCapture correct={correct} slug={card.slug} />}

      {/* The aside — a tangential observation */}
      <blockquote
        className="font-italic italic text-sm leading-relaxed pl-4"
        style={{ color: 'var(--mist)', borderLeft: '2px solid var(--deep-10)' }}
      >
        {card.aside}
      </blockquote>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          to={`/article/${card.editorialSlug}`}
          className="flex-1 text-center px-6 py-3 rounded-lg font-body font-semibold no-underline transition-opacity"
          style={{
            backgroundColor: 'var(--verdigris)',
            color: 'var(--parchment)',
            fontSize: '0.95rem',
          }}
        >
          Read the full story →
        </Link>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 rounded-lg font-body font-semibold border cursor-pointer transition-opacity"
          style={{
            backgroundColor: 'var(--cream)',
            borderColor: 'var(--deep-10)',
            color: 'var(--deep)',
            fontSize: '0.95rem',
          }}
        >
          Next question →
        </button>
      </div>
      <button
        onClick={handleShare}
        className="w-full sm:w-auto text-center font-mono text-xs cursor-pointer bg-transparent border-none"
        style={{ color: 'var(--mist)' }}
      >
        Share
      </button>
    </div>
  )
}

// --- Inline Email Capture (post-reveal) ---

function RevealEmailCapture({ correct, slug }: { correct: boolean; slug: string }) {
  const { markEmailCaptured } = useSession()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: `quiz-reveal:${slug}` }),
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
      <div
        className="py-5 px-6 rounded-lg text-center"
        style={{ backgroundColor: 'var(--verdigris-10)', border: '1px solid var(--verdigris-20)' }}
      >
        <p className="font-italic italic" style={{ color: 'var(--verdigris)', fontSize: '0.95rem' }}>
          You're in. One surprise per week, every Monday.
        </p>
      </div>
    )
  }

  return (
    <div
      className="py-5 px-6 rounded-lg"
      style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--verdigris-20)' }}
    >
      <p className="font-body font-semibold mb-1" style={{ color: 'var(--deep)', fontSize: '0.95rem' }}>
        {correct
          ? "You knew that. Most people don't. Want more?"
          : "Surprised? There are 20 more where that came from."
        }
      </p>
      <p className="font-body text-xs mb-3" style={{ color: 'var(--mist)' }}>
        One email per week. One number that will change how you see the world. Free, forever. No spam — we are possibilists, not marketers.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2.5 rounded-md border font-mono text-sm"
          style={{
            borderColor: 'var(--verdigris-20)',
            backgroundColor: 'var(--chalk)',
            color: 'var(--deep)',
          }}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-5 py-2.5 rounded-md font-mono text-sm cursor-pointer border-none whitespace-nowrap"
          style={{
            backgroundColor: 'var(--verdigris)',
            color: 'var(--parchment)',
          }}
        >
          {status === 'submitting' ? '...' : 'Join free'}
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
