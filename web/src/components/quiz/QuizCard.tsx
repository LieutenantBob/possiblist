import { useState, useRef } from 'react'
import type { FactCard } from '../../data/types'
import { AnswerOptions } from './AnswerOptions'
import { RevealPanel } from './RevealPanel'

interface QuizCardProps {
  card: FactCard
  onAnswered: (chosenIndex: number, correct: boolean, timeMs: number) => void
  onNext: () => void
  alreadyAnswered?: { chosenIndex: number; correct: boolean }
}

export function QuizCard({ card, onAnswered, onNext, alreadyAnswered }: QuizCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    alreadyAnswered?.chosenIndex ?? null
  )
  const [revealed, setRevealed] = useState(!!alreadyAnswered)
  const startTime = useRef(Date.now())

  function handleSelect(index: number) {
    if (revealed) return
    const timeMs = Date.now() - startTime.current
    const correct = index === card.quiz.correctIndex
    setSelectedIndex(index)
    setRevealed(true)
    onAnswered(index, correct, timeMs)
  }

  return (
    <article className="w-full max-w-2xl mx-auto px-4">
      {/* Category badge */}
      <span className="category-badge">{card.category}</span>

      {/* Teaser */}
      <p
        className="font-italic italic mt-4 mb-6 leading-relaxed"
        style={{ color: 'var(--ink)', fontSize: '1.05rem' }}
      >
        {card.summary.slice(0, 200)}...
      </p>

      {/* Question */}
      <h2
        className="font-body font-semibold mb-6"
        style={{ fontSize: '1.15rem', lineHeight: 1.4, color: 'var(--deep)' }}
      >
        {card.quiz.question}
      </h2>

      {!revealed ? (
        <AnswerOptions
          options={card.quiz.options}
          onSelect={handleSelect}
        />
      ) : (
        <RevealPanel
          card={card}
          correct={selectedIndex === card.quiz.correctIndex}
          onNext={onNext}
        />
      )}
    </article>
  )
}
