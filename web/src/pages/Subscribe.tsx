export function Subscribe() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      {/* Headline */}
      <h1
        className="font-display font-semibold text-center mb-8"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        Become a Possiblist<span className="wordmark-degree">°</span>
      </h1>

      {/* Value proposition — Possiblist voice, not feature bullets */}
      <div className="space-y-6 mb-12" style={{ maxWidth: '560px', margin: '0 auto' }}>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          The free version of Possiblist tells you the headline: the world is not as
          bad as you think. The full version tells you why — and it turns out the why
          is where it gets genuinely interesting. There are historical detours that
          involve obstinate doctors, accidental engineers, and statisticians whose bar
          charts caused national scandals.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          There are Bryson-style asides — the kind of fact that makes you put down
          your phone and say it out loud to whoever is nearest. There are nuances
          that the headline figure deliberately conceals, because headlines are
          not designed for honesty; they are designed for attention.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          And there is, at the end of each piece, a genuine question — the kind that
          doesn't have a comfortable answer, because comfortable answers are what got
          us into this mess of confident wrongness in the first place.
        </p>
      </div>

      {/* The line */}
      <p
        className="font-italic italic text-center mb-12"
        style={{ color: 'var(--mist)', fontSize: '1.1rem' }}
      >
        It turns out there is rather more to this than the headline suggests. There usually is.
      </p>

      {/* Pricing cards */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-lg mx-auto">
        {/* Annual — primary */}
        <div
          className="flex-1 p-8 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--cream)',
            border: '2px solid var(--verdigris)',
          }}
        >
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--verdigris)' }}>
            Annual
          </p>
          <p className="font-mono font-light mb-1" style={{ fontSize: '2.5rem', color: 'var(--deep)' }}>
            £39
          </p>
          <p className="font-mono text-xs mb-6" style={{ color: 'var(--mist)' }}>
            per year — approximately 11p per wrong answer
          </p>
          <a
            href="/api/stripe/checkout?plan=annual"
            className="block w-full px-6 py-3 rounded-lg font-body font-semibold no-underline text-center"
            style={{
              backgroundColor: 'var(--verdigris)',
              color: 'var(--parchment)',
              fontSize: '0.95rem',
            }}
          >
            Become a Possiblist →
          </a>
        </div>

        {/* Monthly — secondary */}
        <div
          className="flex-1 p-8 rounded-lg text-center"
          style={{
            backgroundColor: 'var(--chalk)',
            border: '1px solid var(--deep-10)',
          }}
        >
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
            Monthly
          </p>
          <p className="font-mono font-light mb-1" style={{ fontSize: '2.5rem', color: 'var(--deep)' }}>
            £4.99
          </p>
          <p className="font-mono text-xs mb-6" style={{ color: 'var(--mist)' }}>
            per month
          </p>
          <a
            href="/api/stripe/checkout?plan=monthly"
            className="block w-full px-6 py-3 rounded-lg font-body font-semibold no-underline text-center border"
            style={{
              backgroundColor: 'var(--cream)',
              borderColor: 'var(--deep-10)',
              color: 'var(--deep)',
              fontSize: '0.95rem',
            }}
          >
            Become a Possiblist →
          </a>
        </div>
      </div>
    </div>
  )
}
