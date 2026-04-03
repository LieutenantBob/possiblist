interface PricingCardProps {
  plan: 'annual' | 'monthly'
  primary?: boolean
}

export function PricingCard({ plan, primary = false }: PricingCardProps) {
  const isAnnual = plan === 'annual'

  return (
    <div
      className="flex-1 p-8 rounded-lg text-center"
      style={{
        backgroundColor: primary ? 'var(--cream)' : 'var(--chalk)',
        border: primary ? '2px solid var(--verdigris)' : '1px solid var(--deep-10)',
      }}
    >
      <p
        className="font-mono text-xs uppercase tracking-wider mb-2"
        style={{ color: primary ? 'var(--verdigris)' : 'var(--mist)' }}
      >
        {isAnnual ? 'Annual' : 'Monthly'}
      </p>
      <p className="font-mono font-light mb-1" style={{ fontSize: '2.5rem', color: 'var(--deep)' }}>
        {isAnnual ? '£39' : '£4.99'}
      </p>
      <p className="font-mono text-xs mb-6" style={{ color: 'var(--mist)' }}>
        {isAnnual ? 'per year — approximately 11p per wrong answer' : 'per month'}
      </p>
      <a
        href={`/api/stripe/checkout?plan=${plan}`}
        className="block w-full px-6 py-3 rounded-lg font-body font-semibold no-underline text-center"
        style={primary ? {
          backgroundColor: 'var(--verdigris)',
          color: 'var(--parchment)',
          fontSize: '0.95rem',
        } : {
          backgroundColor: 'var(--cream)',
          border: '1px solid var(--deep-10)',
          color: 'var(--deep)',
          fontSize: '0.95rem',
        }}
      >
        Become a Possiblist →
      </a>
    </div>
  )
}
