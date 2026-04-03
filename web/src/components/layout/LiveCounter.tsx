/**
 * Possiblist live counter — shows movement statistics.
 * In v1, these are seeded numbers that will be replaced by real API data.
 * The counter is honest: if the numbers are small, we show them small.
 */
export function LiveCounter({ variant = 'inline' }: { variant?: 'inline' | 'block' }) {
  // TODO: Replace with real API call to /api/stats in v2
  // For launch, show honest starting numbers
  const stats = {
    members: 0,
    wrongAnswers: 0,
    donated: 0,
  }

  // Don't show if no real numbers yet — honesty is the brand
  const hasData = stats.members > 0

  if (!hasData) {
    return null
  }

  if (variant === 'inline') {
    return (
      <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
        {stats.members.toLocaleString()} possibilists · {stats.wrongAnswers.toLocaleString()} wrong answers · £{stats.donated.toLocaleString()} given
      </p>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      <div className="text-center">
        <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--verdigris)' }}>
          {stats.members.toLocaleString()}
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
          Possibilists
        </p>
      </div>
      <div className="text-center">
        <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--sienna)' }}>
          {stats.wrongAnswers.toLocaleString()}
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
          Wrong answers
        </p>
      </div>
      <div className="text-center">
        <p className="font-mono font-light" style={{ fontSize: '1.5rem', color: 'var(--verdigris)' }}>
          £{stats.donated.toLocaleString()}
        </p>
        <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
          Given via matched donations
        </p>
      </div>
    </div>
  )
}
