import { useState, useRef, useMemo, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { getAllFactCards } from '../data/loader'
import type { FactCard } from '../data/types'

export function Home() {
  const { session, recordAnswer, hasAnswered } = useSession()
  const allCards = useMemo(() => getAllFactCards(), [])
  const answered = session.answers.length
  const total = allCards.length

  // Pick the first card (extreme poverty) for the homepage taste
  const tasteCard = allCards[0]
  const alreadyTasted = hasAnswered(tasteCard.slug)

  return (
    <div>
      <HeroSection />

      {/* --- Embedded first question (Duolingo pattern) --- */}
      {!alreadyTasted ? (
        <TasteQuestion
          card={tasteCard}
          onAnswered={(chosenIndex, correct, timeMs) => {
            recordAnswer({
              slug: tasteCard.slug,
              chosenIndex,
              correct,
              timeToAnswer: timeMs,
            })
          }}
        />
      ) : (
        /* Already tasted — show smart CTA */
        <div
          className="py-10 md:py-14 text-center"
          style={{ borderTop: '2px solid var(--verdigris-10)' }}
        >
          <Link
            to="/quiz"
            className="inline-block px-10 py-4 rounded-lg font-body font-semibold no-underline"
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1.1rem' }}
          >
            Continue the quiz →
          </Link>
          <p className="font-mono text-xs mt-3" style={{ color: 'var(--mist)' }}>
            {answered} of {total} answered.{' '}
            <span style={{ color: 'var(--verdigris)' }}>Learning in progress.</span>
          </p>
        </div>
      )}

      {/* --- Credibility bar --- */}
      <CredibilityBar />

      {/* --- Dual CTA --- */}
      <div
        className="py-10 md:py-14"
        style={{ borderTop: '1px solid var(--deep-05)' }}
      >
        <div className="max-w-lg mx-auto px-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quiz"
            className="flex-1 text-center px-8 py-4 rounded-lg font-body font-semibold no-underline"
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1rem' }}
          >
            {answered > 0 ? `Continue the quiz (${answered}/${total})` : 'How wrong are you?'} →
          </Link>
          <Link
            to="/manifesto"
            className="flex-1 text-center px-8 py-4 rounded-lg font-body font-semibold no-underline border"
            style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--deep-10)', color: 'var(--deep)', fontSize: '1rem' }}
          >
            What is a possiblist? →
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- Hero Section ---

function HeroSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 pt-12 md:pt-20 pb-12 md:pb-16">
      {/* Wordmark */}
      <h1
        className="wordmark text-center mb-6"
        style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'var(--deep)', lineHeight: 1.05 }}
      >
        Possiblist<span className="wordmark-degree">°</span>
      </h1>

      {/* Tagline */}
      <p
        className="font-italic italic text-center"
        style={{
          color: 'var(--mist)',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 300,
          maxWidth: '500px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6,
        }}
      >
        A movement for people who would rather be accurate than loud.
      </p>

      {/* The hook */}
      <div className="max-w-xl mx-auto mb-10">
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          Most people are wrong about the state of the world. Not a little wrong.
          Wrong in the specific, spectacular way that suggests the entire species
          has been reading a different newspaper — one that is on fire, published
          in a language they cannot read, and reporting on a planet they have never
          actually visited. Below are twenty-one questions. Most people get most of
          them wrong. Being wrong, it turns out, is the beginning of being less wrong
          — and that is rather more interesting than being right ever was.
        </p>
      </div>

      {/* The movement pitch */}
      <p
        className="text-center font-body mb-10"
        style={{ color: 'var(--ink)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}
      >
        The loud get organised. The calm, until now, have not.
        <br />
        <span style={{ color: 'var(--verdigris)' }}>This is where that changes.</span>
      </p>

      {/* Rosling quote */}
      <blockquote
        className="max-w-md mx-auto text-center font-italic italic"
        style={{ color: 'var(--mist)', fontSize: '0.85rem', lineHeight: 1.7 }}
      >
        "I'm not an optimist. I'm a very serious possiblist."
        <footer className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider not-italic">
          — Hans Rosling
        </footer>
      </blockquote>
    </section>
  )
}

// --- Taste Question (embedded on homepage) ---

interface TasteQuestionProps {
  card: FactCard
  onAnswered: (chosenIndex: number, correct: boolean, timeMs: number) => void
}

function TasteQuestion({ card, onAnswered }: TasteQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const startTime = useRef(Date.now())

  function handleSelect(index: number) {
    if (revealed) return
    const timeMs = Date.now() - startTime.current
    const correct = index === card.quiz.correctIndex
    setSelectedIndex(index)
    setRevealed(true)
    onAnswered(index, correct, timeMs)
  }

  const correct = selectedIndex === card.quiz.correctIndex

  return (
    <div
      className="py-10 md:py-14"
      style={{ borderTop: '2px solid var(--verdigris-10)' }}
    >
      <div className="max-w-2xl mx-auto px-4">
        {!revealed ? (
          <>
            {/* Pre-answer: question + options */}
            <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-4" style={{ color: 'var(--verdigris)' }}>
              Try one
            </p>
            <h2
              className="font-body font-semibold mb-6"
              style={{ fontSize: '1.15rem', lineHeight: 1.4, color: 'var(--deep)' }}
            >
              {card.quiz.question}
            </h2>
            <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
              {card.quiz.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  className="w-full text-left px-5 py-4 rounded-lg border transition-colors duration-150 cursor-pointer font-body"
                  style={{
                    backgroundColor: 'var(--cream)',
                    borderColor: 'var(--deep-10)',
                    color: 'var(--deep)',
                    minHeight: '52px',
                    fontSize: '1.05rem',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="font-mono text-xs mt-4" style={{ color: 'var(--mist)' }}>
              {card.quiz.surveyResult.percentWrong}% of people get this wrong — {card.quiz.surveyResult.source}
            </p>
          </>
        ) : (
          <>
            {/* Post-answer: reveal + CTA to continue */}
            <div
              className="inline-block px-4 py-2 rounded-md font-mono text-sm mb-4"
              style={{
                backgroundColor: correct ? 'var(--verdigris-10)' : 'var(--sienna-10)',
                color: correct ? 'var(--verdigris)' : 'var(--sienna)',
              }}
            >
              {correct ? "One of the few." : "You're in good company."}
            </div>

            <p
              className="font-mono font-light mb-2"
              style={{ fontSize: '2.5rem', color: 'var(--verdigris)', lineHeight: 1.2 }}
            >
              {card.reality.figure}
            </p>
            <p className="font-italic italic mb-4" style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>
              {card.reality.trendLabel}
            </p>

            <div className="nuance-box mb-6">
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
                {card.nuance}
              </p>
            </div>

            {/* Email capture — right at the surprise moment */}
            <HomepageEmailCapture correct={correct} />

            <p className="font-mono text-xs mb-8" style={{ color: 'var(--mist)' }}>
              {card.quiz.surveyResult.percentWrong}% of people get this wrong.{' '}
              There are 20 more questions.
            </p>

            <Link
              to="/quiz"
              className="inline-block px-10 py-4 rounded-lg font-body font-semibold no-underline"
              style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1.1rem' }}
            >
              How wrong are you? →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

// --- Credibility Bar ---

function CredibilityBar() {
  return (
    <div className="py-8" style={{ backgroundColor: 'var(--chalk)' }}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-3" style={{ color: 'var(--mist)' }}>
          Every answer verified against
        </p>
        <p className="font-mono text-xs" style={{ color: 'var(--verdigris)', letterSpacing: '0.05em' }}>
          World Bank &nbsp;·&nbsp; United Nations &nbsp;·&nbsp; WHO &nbsp;·&nbsp; Our World in Data &nbsp;·&nbsp; Gapminder
        </p>
      </div>
    </div>
  )
}

// --- Homepage Email Capture (shown after taste question reveal) ---

function HomepageEmailCapture({ correct }: { correct: boolean }) {
  const { session, markEmailCaptured } = useSession()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  if (session.emailCaptured) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage-reveal' }),
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
        className="py-5 px-6 rounded-lg text-center mb-6"
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
      className="py-5 px-6 rounded-lg mb-6"
      style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--verdigris-20)' }}
    >
      <p className="font-body font-semibold mb-1" style={{ color: 'var(--deep)', fontSize: '0.95rem' }}>
        {correct
          ? "You knew that. Most people don't. Want more like this?"
          : "Didn't see that coming? Neither did 74% of people."
        }
      </p>
      <p className="font-body text-xs mb-3" style={{ color: 'var(--mist)' }}>
        One email per week. One number that changes how you see the world. Free, forever.
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
