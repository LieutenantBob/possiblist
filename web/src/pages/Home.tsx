import { useState, useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QuizCard } from '../components/quiz/QuizCard'
import { useSession } from '../hooks/useSession'
import { getAllFactCards } from '../data/loader'

export function Home() {
  const { slug } = useParams()
  const { session, recordAnswer, hasAnswered, getAnswer } = useSession()
  const allCards = useMemo(() => getAllFactCards(), [])

  const [quizStarted, setQuizStarted] = useState(() => {
    // If user has answers or a slug is specified, skip the hero
    return session.answers.length > 0 || !!slug
  })

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (slug) {
      const idx = allCards.findIndex(c => c.slug === slug)
      if (idx >= 0) return idx
    }
    const unansweredIdx = allCards.findIndex(c => !hasAnswered(c.slug))
    return unansweredIdx >= 0 ? unansweredIdx : 0
  })

  const currentCard = allCards[currentIndex]

  const handleAnswered = useCallback((chosenIndex: number, correct: boolean, timeMs: number) => {
    if (!currentCard) return
    recordAnswer({
      slug: currentCard.slug,
      chosenIndex,
      correct,
      timeToAnswer: timeMs,
    })
  }, [currentCard, recordAnswer])

  const handleNext = useCallback(() => {
    const nextIdx = allCards.findIndex((c, i) => i > currentIndex && !hasAnswered(c.slug))
    if (nextIdx >= 0) {
      setCurrentIndex(nextIdx)
    } else {
      const wrapIdx = allCards.findIndex(c => !hasAnswered(c.slug))
      if (wrapIdx >= 0) {
        setCurrentIndex(wrapIdx)
      } else {
        setCurrentIndex((currentIndex + 1) % allCards.length)
      }
    }
  }, [allCards, currentIndex, hasAnswered])

  // --- Hero Section (shown before first quiz interaction) ---
  if (!quizStarted) {
    return (
      <div>
        <HeroSection onStart={() => setQuizStarted(true)} />
        {/* Preview: show first quiz card below the hero */}
        <div className="py-8 md:py-12">
          <div className="max-w-2xl mx-auto px-4 mb-6">
            <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
              1 / {allCards.length}
            </p>
          </div>
          {currentCard && (
            <QuizCard
              key={currentCard.slug}
              card={currentCard}
              onAnswered={(ci, correct, t) => {
                setQuizStarted(true)
                handleAnswered(ci, correct, t)
              }}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    )
  }

  // --- Quiz Feed (main experience) ---
  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-italic italic" style={{ color: 'var(--mist)' }}>
          Quiet for now.
        </p>
      </div>
    )
  }

  const existing = getAnswer(currentCard.slug)
  const alreadyAnswered = existing
    ? { chosenIndex: existing.chosenIndex, correct: existing.correct }
    : undefined

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
          {currentIndex + 1} / {allCards.length}
        </p>
      </div>

      <QuizCard
        key={currentCard.slug}
        card={currentCard}
        onAnswered={handleAnswered}
        onNext={handleNext}
        alreadyAnswered={alreadyAnswered}
      />

      {session.answers.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 mt-12 pt-6" style={{ borderTop: '1px solid var(--deep-05)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
            Wrong {session.answers.filter(a => !a.correct).length} times. Learning in progress.
          </p>
        </div>
      )}
    </div>
  )
}

// --- Hero Section Component ---

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="max-w-3xl mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-24">
      {/* Wordmark — large */}
      <h1
        className="wordmark text-center mb-6"
        style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'var(--deep)', lineHeight: 1.05 }}
      >
        Possiblist<span className="wordmark-degree">°</span>
      </h1>

      {/* Tagline */}
      <p
        className="font-italic italic text-center mb-12"
        style={{ color: 'var(--mist)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 300, maxWidth: '540px', margin: '0 auto 3rem' }}
      >
        What you believe about the world vs. what is actually true.
        The gap is larger than you think. And more interesting.
      </p>

      {/* Manifesto excerpt — three key paragraphs */}
      <div className="max-w-xl mx-auto space-y-5 mb-12">
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          Most people are wrong about the state of the world. Not a little wrong.
          Wrong in the specific, spectacular way that suggests the entire species
          has been reading a different newspaper — one that is on fire, published
          in a language they cannot read, and reporting on a planet they have
          never actually visited.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          A possiblist starts with the data. Holds good news and bad news
          simultaneously. Celebrates progress without ignoring problems.
          Demands evidence before outrage. And acts where the numbers show
          action actually matters — not where it merely feels satisfying.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          This is not optimism. It is not pessimism. It is the third thing
          — the one that starts with what is measurably true and proceeds
          from there.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <button
          onClick={onStart}
          className="px-10 py-4 rounded-lg font-body font-semibold cursor-pointer border-none"
          style={{
            backgroundColor: 'var(--verdigris)',
            color: 'var(--parchment)',
            fontSize: '1.1rem',
          }}
        >
          How wrong are you? →
        </button>
        <p className="font-mono text-[0.65rem]" style={{ color: 'var(--mist)' }}>
          21 questions. No account required. Your worldview may not survive.
        </p>
      </div>

      {/* Manifesto link */}
      <div className="text-center mt-10">
        <Link
          to="/manifesto"
          className="font-italic italic text-sm no-underline"
          style={{ color: 'var(--verdigris)' }}
        >
          Read the full manifesto →
        </Link>
      </div>

      {/* Social proof / stats strip */}
      <div
        className="flex flex-wrap justify-center gap-8 mt-14 pt-8"
        style={{ borderTop: '1px solid var(--deep-05)' }}
      >
        <div className="text-center">
          <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--verdigris)' }}>21</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>Questions</p>
        </div>
        <div className="text-center">
          <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--sienna)' }}>74%</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>Get it wrong</p>
        </div>
        <div className="text-center">
          <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--verdigris)' }}>21</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>Organisations</p>
        </div>
      </div>

      {/* Hans Rosling quote */}
      <blockquote
        className="max-w-lg mx-auto mt-12 text-center font-italic italic"
        style={{ color: 'var(--mist)', fontSize: '0.9rem', lineHeight: 1.7 }}
      >
        "I'm not an optimist. I'm a very serious possiblist."
        <footer className="mt-2 font-mono text-[0.6rem] uppercase tracking-wider not-italic">
          — Hans Rosling (1948–2017)
        </footer>
      </blockquote>
    </section>
  )
}
