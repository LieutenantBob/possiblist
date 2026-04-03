import { useState } from 'react'
import { getRandomCatchphrase } from '../../data/catchphrases'

export function CatchphraseBar() {
  const [phrase] = useState(getRandomCatchphrase)

  return (
    <div
      className="w-full py-6 text-center"
      style={{ borderTop: '1px solid var(--verdigris-10)' }}
    >
      <p
        className="font-italic italic max-w-xl mx-auto px-4"
        style={{ color: 'var(--verdigris)', fontSize: '0.95rem', lineHeight: 1.6 }}
      >
        {phrase}
      </p>
    </div>
  )
}
