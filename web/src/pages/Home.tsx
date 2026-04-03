import { useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { QuizCard } from '../components/quiz/QuizCard'
import { useSession } from '../hooks/useSession'
import { getAllFactCards } from '../data/loader'

export function Home() {
  const { slug } = useParams()
  const { session, recordAnswer, hasAnswered, getAnswer } = useSession()
  const allCards = useMemo(() => getAllFactCards(), [])

  const [quizStarted, setQuizStarted] = useState(() => {
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

  // --- Hero + Quiz (first visit) ---
  if (!quizStarted) {
    return (
      <div>
        <HeroSection />

        {/* The quiz starts immediately — no second CTA needed */}
        <div
          className="py-10 md:py-14"
          style={{ borderTop: '2px solid var(--verdigris-10)' }}
        >
          <div className="max-w-2xl mx-auto px-4 mb-2">
            <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
              Question 1 of {allCards.length}
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

  // --- Quiz Feed (returning / in-progress) ---
  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-italic italic" style={{ color: 'var(--mist)' }}>Quiet for now.</p>
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

      {/* Tagline — sharper, differentiating */}
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

      {/* The hook — one paragraph, all voice, the emotional reason to care */}
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

      {/* The movement pitch — one line, not a paragraph */}
      <p
        className="text-center font-body mb-10"
        style={{ color: 'var(--ink)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}
      >
        The loud get organised. The calm, until now, have not.
        <br />
        <span style={{ color: 'var(--verdigris)' }}>This is where that changes.</span>
      </p>

      {/* CTA — scroll hint, not a button. The quiz IS below. */}
      <div className="text-center mb-8">
        <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
          ↓ How wrong are you?
        </p>
      </div>

      {/* Rosling quote — earns trust */}
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
