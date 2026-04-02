import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { useSubscription } from '../hooks/useSubscription'
import { getFactCard } from '../data/loader'
import { useShare } from '../hooks/useShare'

export function Score() {
  const { session } = useSession()
  const { isPremium } = useSubscription()
  const { share } = useShare()

  const stats = useMemo(() => {
    const answers = session.answers
    const total = answers.length
    const wrong = answers.filter(a => !a.correct).length

    // Category breakdown
    const categoryMap = new Map<string, { total: number; wrong: number }>()
    for (const answer of answers) {
      const card = getFactCard(answer.slug)
      if (!card) continue
      const cat = card.category
      const existing = categoryMap.get(cat) ?? { total: 0, wrong: 0 }
      categoryMap.set(cat, {
        total: existing.total + 1,
        wrong: existing.wrong + (answer.correct ? 0 : 1),
      })
    }

    // Worst category
    let worstCategory = ''
    let worstRate = 0
    for (const [cat, data] of categoryMap) {
      const rate = data.wrong / data.total
      if (rate > worstRate) {
        worstRate = rate
        worstCategory = cat
      }
    }

    // Best wrong answer — most surprising
    const wrongAnswers = answers.filter(a => !a.correct)
    const bestWrong = wrongAnswers.length > 0
      ? wrongAnswers[wrongAnswers.length - 1]
      : null

    return { total, wrong, categoryMap, worstCategory, bestWrong }
  }, [session.answers])

  function handleShare() {
    share({
      title: 'My Possiblist Score',
      text: `I answered ${stats.total} questions on Possiblist. Wrong ${stats.wrong} times. My worst subject: ${stats.worstCategory}. possiblist.io/score`,
      url: 'https://possiblist.io/score',
    })
  }

  if (stats.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-italic italic" style={{ color: 'var(--mist)' }}>
          Quiet for now.
        </p>
        <Link to="/" className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>
          Take the quiz →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display font-semibold mb-8" style={{ fontSize: '2rem', color: 'var(--deep)' }}>
        Your Score
      </h1>

      {/* Summary */}
      <div className="mb-10">
        <p className="font-mono font-light mb-1" style={{ fontSize: '2.5rem', color: 'var(--deep)' }}>
          Wrong {stats.wrong} {stats.wrong === 1 ? 'time' : 'times'}.
        </p>
        <p className="font-italic italic" style={{ color: 'var(--mist)', fontSize: '1rem' }}>
          Learning in progress.
        </p>
      </div>

      {/* Total */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
          Questions answered
        </p>
        <p className="font-mono font-light" style={{ fontSize: '2rem', color: 'var(--verdigris)' }}>
          {stats.total}
        </p>
      </div>

      {/* Category breakdown */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--mist)' }}>
          By category
        </p>
        <div className="space-y-2">
          {Array.from(stats.categoryMap.entries()).map(([cat, data]) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                {cat}
              </span>
              <span className="font-mono text-sm" style={{ color: data.wrong > 0 ? 'var(--sienna)' : 'var(--verdigris)' }}>
                {data.wrong}/{data.total} wrong
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Worst subject */}
      {stats.worstCategory && (
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
            Worst subject
          </p>
          <p className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--sienna)' }}>
            {stats.worstCategory}
          </p>
        </div>
      )}

      {/* Best wrong answer */}
      {stats.bestWrong && (
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
            Your most recent wrong answer
          </p>
          <Link
            to={`/article/${stats.bestWrong.slug}`}
            className="font-body underline"
            style={{ color: 'var(--verdigris)', fontSize: '1rem' }}
          >
            Read why you were wrong →
          </Link>
        </div>
      )}

      {/* Share */}
      <button
        onClick={handleShare}
        className="px-6 py-3 rounded-lg font-mono text-sm cursor-pointer border w-full sm:w-auto"
        style={{
          backgroundColor: 'var(--cream)',
          borderColor: 'var(--deep-10)',
          color: 'var(--deep)',
        }}
      >
        Share your score
      </button>

      {/* Possiblist gate CTA */}
      {!isPremium && (
        <div
          className="mt-12 p-8 rounded-lg text-center"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
        >
          <p className="font-italic italic mb-4" style={{ color: 'var(--ink)', fontSize: '1rem' }}>
            There is rather more to each of these stories than the quiz reveals.
          </p>
          <Link
            to="/subscribe"
            className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
            style={{
              backgroundColor: 'var(--verdigris)',
              color: 'var(--parchment)',
              fontSize: '0.95rem',
            }}
          >
            Become a Possiblist →
          </Link>
        </div>
      )}
    </div>
  )
}
