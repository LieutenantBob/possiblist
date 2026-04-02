import { Link } from 'react-router-dom'

interface PaywallGateProps {
  teaser: string
}

export function PaywallGate({ teaser }: PaywallGateProps) {
  return (
    <div
      className="my-10 p-8 rounded-lg text-center"
      style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
      role="region"
      aria-label="Premium content"
    >
      {/* Teaser */}
      <p
        className="font-italic italic mb-6 leading-relaxed text-left"
        style={{ color: 'var(--ink)', fontSize: '1rem' }}
      >
        {teaser}
      </p>

      {/* The line */}
      <p
        className="font-italic italic mb-8"
        style={{ color: 'var(--mist)', fontSize: '0.9rem' }}
      >
        It turns out there is rather more to this than the headline suggests. There usually is.
      </p>

      {/* CTA */}
      <Link
        to="/subscribe"
        className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline transition-opacity"
        style={{
          backgroundColor: 'var(--verdigris)',
          color: 'var(--parchment)',
          fontSize: '1rem',
        }}
      >
        Become a Possiblist →
      </Link>
    </div>
  )
}
