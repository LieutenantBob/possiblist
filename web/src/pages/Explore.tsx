import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllFactCards } from '../data/loader'
import { useSession } from '../hooks/useSession'

export function Explore() {
  const allCards = useMemo(() => getAllFactCards(), [])
  const { session, hasAnswered, getAnswer } = useSession()

  const answered = session.answers.length
  const correct = session.answers.filter(a => a.correct).length
  const total = allCards.length

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      {/* Header */}
      <h1
        className="font-display font-semibold mb-3"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        All Questions
      </h1>
      <p className="font-italic italic mb-8" style={{ color: 'var(--mist)', fontSize: '1rem' }}>
        {total} questions. {answered > 0
          ? `You have answered ${answered}. ${correct} correct.`
          : 'How wrong are you?'
        }
      </p>

      {/* Progress bar */}
      {answered > 0 && (
        <div className="mb-10">
          <div
            className="h-1.5 rounded-full w-full"
            style={{ backgroundColor: 'var(--deep-05)' }}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((answered / total) * 100)}%`,
                backgroundColor: 'var(--verdigris)',
              }}
            />
          </div>
          <p className="font-mono text-[0.6rem] mt-2 text-right" style={{ color: 'var(--mist)' }}>
            {answered} / {total}
          </p>
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allCards.map((card, index) => {
          const answer = getAnswer(card.slug)
          const isAnswered = hasAnswered(card.slug)

          return (
            <Link
              key={card.slug}
              to={isAnswered ? `/article/${card.editorialSlug}` : `/q/${card.slug}`}
              className="block p-5 rounded-lg no-underline transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--cream)',
                border: `1px solid ${isAnswered
                  ? (answer?.correct ? 'var(--verdigris-20)' : 'var(--sienna-10)')
                  : 'var(--deep-05)'
                }`,
              }}
            >
              {/* Top row: category + status */}
              <div className="flex items-center justify-between mb-3">
                <span className="category-badge">{card.category}</span>
                {isAnswered ? (
                  <span
                    className="font-mono text-[0.6rem] px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: answer?.correct ? 'var(--verdigris-10)' : 'var(--sienna-10)',
                      color: answer?.correct ? 'var(--verdigris)' : 'var(--sienna)',
                    }}
                  >
                    {answer?.correct ? 'Correct' : 'Wrong'}
                  </span>
                ) : (
                  <span
                    className="font-mono text-[0.6rem] px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'var(--deep-05)', color: 'var(--mist)' }}
                  >
                    {index + 1} / {total}
                  </span>
                )}
              </div>

              {/* Question */}
              <p
                className="font-body font-semibold leading-snug mb-2"
                style={{ fontSize: '0.95rem', color: 'var(--deep)' }}
              >
                {card.quiz.question}
              </p>

              {/* Survey stat */}
              <p className="font-mono text-[0.6rem]" style={{ color: 'var(--mist)' }}>
                {card.quiz.surveyResult.percentWrong}% of people get this wrong
              </p>

              {/* CTA hint */}
              <p
                className="font-mono text-[0.6rem] mt-3"
                style={{ color: isAnswered ? 'var(--verdigris)' : 'var(--mist)' }}
              >
                {isAnswered ? 'Read the full story →' : 'Take this question →'}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Bottom CTA */}
      {answered < total && (
        <div className="text-center mt-12">
          <Link
            to="/quiz"
            className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '1rem' }}
          >
            {answered > 0 ? 'Continue the quiz →' : 'Start the quiz →'}
          </Link>
        </div>
      )}
    </div>
  )
}
