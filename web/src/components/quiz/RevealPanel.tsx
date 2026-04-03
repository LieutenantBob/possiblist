import { Link } from 'react-router-dom'
import type { FactCard } from '../../data/types'
import { RevealChart } from './RevealChart'
import { useShare } from '../../hooks/useShare'

interface RevealPanelProps {
  card: FactCard
  correct: boolean
  onNext: () => void
}

export function RevealPanel({ card, correct, onNext }: RevealPanelProps) {
  const { share } = useShare()

  const shareText = correct ? card.shareText.correct : card.shareText.wrong

  function handleShare() {
    share({
      title: `Possiblist — ${card.quiz.question}`,
      text: shareText,
      url: `https://possiblist.io/q/${card.slug}`,
    })
  }

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

      {/* Bryson aside */}
      <blockquote
        className="font-italic italic text-sm leading-relaxed pl-4"
        style={{ color: 'var(--mist)', borderLeft: '2px solid var(--deep-10)' }}
      >
        {card.brysonAside}
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
