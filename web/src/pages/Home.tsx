import { useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { QuizCard } from '../components/quiz/QuizCard'
import { useSession } from '../hooks/useSession'
import { getAllFactCards } from '../data/loader'

export function Home() {
  const { slug } = useParams()
  const { session, recordAnswer, hasAnswered, getAnswer } = useSession()
  const allCards = useMemo(() => getAllFactCards(), [])

  // Determine which card to show
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (slug) {
      const idx = allCards.findIndex(c => c.slug === slug)
      if (idx >= 0) return idx
    }
    // Find first unanswered card
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
    // Find next unanswered card after current
    const nextIdx = allCards.findIndex((c, i) => i > currentIndex && !hasAnswered(c.slug))
    if (nextIdx >= 0) {
      setCurrentIndex(nextIdx)
    } else {
      // Wrap around to first unanswered
      const wrapIdx = allCards.findIndex(c => !hasAnswered(c.slug))
      if (wrapIdx >= 0) {
        setCurrentIndex(wrapIdx)
      } else {
        // All answered — cycle through
        setCurrentIndex((currentIndex + 1) % allCards.length)
      }
    }
  }, [allCards, currentIndex, hasAnswered])

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
      {/* Progress indicator */}
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

      {/* Session score summary at bottom */}
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
