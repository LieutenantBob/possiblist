import { Link } from 'react-router-dom'

const ALLOCATION = [
  { label: 'New Research', pct: 25, color: 'var(--verdigris)', description: 'AI Worldview Benchmark updates, new questions, Gapminder survey partnerships' },
  { label: 'Content', pct: 20, color: 'var(--verdigris)', description: 'Fact-checking pipeline, editorial production, multilingual expansion' },
  { label: 'Matched Giving', pct: 20, color: 'var(--gold)', description: 'For every £1 you donate through an action card, we add 20p' },
  { label: 'Possiblist Grants', pct: 15, color: 'var(--gold)', description: 'Member-proposed, member-voted micro-projects that move a number' },
  { label: 'Platform', pct: 15, color: 'var(--mist)', description: 'Engineering, hosting, accessibility, security' },
  { label: 'Operations', pct: 5, color: 'var(--mist)', description: 'Legal, accounting, governance' },
]

export function Subscribe() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      {/* Headline */}
      <h1
        className="font-display font-semibold text-center mb-3"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        Become a Possiblist<span className="wordmark-degree">°</span>
      </h1>

      <p
        className="font-italic italic text-center mb-12"
        style={{ color: 'var(--mist)', fontSize: '1rem' }}
      >
        Not a subscription. A membership in a movement.
      </p>

      {/* --- Section 1: What you get --- */}
      <div className="space-y-6 mb-14" style={{ maxWidth: '560px', margin: '0 auto' }}>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          The free version of Possiblist tells you the headline: the world is not as
          bad as you think. The full version tells you why — and it turns out the why
          is where it gets genuinely interesting. There are historical detours that
          involve obstinate doctors, accidental engineers, and statisticians whose bar
          charts caused national scandals.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          There are asides — the kind of fact that makes you put down
          your phone and say it out loud to whoever is nearest. There are nuances
          that the headline figure deliberately conceals, because headlines are
          not designed for honesty; they are designed for attention.
        </p>
        <p className="font-body leading-relaxed" style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>
          And at the end of each piece, the lever: the specific organisation whose
          work shows up in the chart you just read, the smallest useful thing you
          can do today, and a 20% match on any donation you make through Possiblist.
          Your £30 becomes £36. Not because we are generous — because your subscription
          funds a giving multiplier, and that is what a movement does with money.
        </p>
      </div>

      {/* The line */}
      <p
        className="font-italic italic text-center mb-14"
        style={{ color: 'var(--mist)', fontSize: '1.05rem' }}
      >
        It turns out there is rather more to this than the headline suggests. There usually is.
      </p>

      {/* --- Section 2: What your money funds --- */}
      <div className="mb-14">
        <h2
          className="font-display font-semibold text-center mb-2"
          style={{ fontSize: '1.5rem', color: 'var(--deep)' }}
        >
          Where Your £39 Goes
        </h2>
        <p className="font-italic italic text-center mb-8" style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>
          We publish this because possibilists demand data about everything — including us.
        </p>

        {/* Allocation bars */}
        <div className="space-y-4 max-w-md mx-auto">
          {ALLOCATION.map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
                  {item.label}
                </span>
                <span className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
                  {item.pct}%
                </span>
              </div>
              <div
                className="h-2 rounded-full mb-1"
                style={{ backgroundColor: 'var(--deep-05)' }}
              >
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="font-body text-xs" style={{ color: 'var(--mist)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section 3: Matched Giving callout --- */}
      <div
        className="p-8 rounded-lg mb-14 max-w-md mx-auto"
        style={{ backgroundColor: 'var(--cream)', border: '2px solid var(--verdigris-20)' }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-3" style={{ color: 'var(--gold)' }}>
          Matched Giving
        </p>
        <p className="font-body leading-relaxed mb-3" style={{ fontSize: '1rem', color: 'var(--ink)' }}>
          Every article ends with an action card — the specific organisation whose work
          produced the chart you just read. When you donate through Possiblist,
          the Foundation adds 20p for every £1.
        </p>
        <p className="font-body text-sm" style={{ color: 'var(--mist)' }}>
          You always see the direct link too. We never hide the organisation behind our
          routing. Both paths reach the same place. The Possiblist path just lets us
          count what we've done collectively — because a movement that can't measure
          its own impact has not been paying attention.
        </p>
      </div>

      {/* --- Section 4: Possiblist Grants callout --- */}
      <div
        className="p-8 rounded-lg mb-14 max-w-md mx-auto"
        style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-05)' }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-3" style={{ color: 'var(--gold)' }}>
          Possiblist Grants
        </p>
        <p className="font-body leading-relaxed mb-3" style={{ fontSize: '1rem', color: 'var(--ink)' }}>
          Fifteen per cent of every subscription funds micro-grants: £500–£5,000
          for projects that move a specific number. Proposed by members. Voted on
          by members. Funded by the Foundation.
        </p>
        <p className="font-italic italic text-sm" style={{ color: 'var(--mist)' }}>
          Not the grandest gesture. The smallest useful thing — the one that,
          according to the evidence, will actually work.
        </p>
      </div>

      {/* --- Section 5: What you get (summary, not bullets) --- */}
      <div className="mb-14 max-w-md mx-auto">
        <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-4 text-center" style={{ color: 'var(--mist)' }}>
          Your membership includes
        </p>
        <div className="space-y-3">
          {[
            'The full story behind every number — historical detours, surprising asides, genuine questions',
            'Where This Number Moves — the organisations, the data, and the lever',
            '20% match on every donation through Possiblist action cards',
            'Voting rights on Possiblist Grants',
            'Your Possiblist Scorecard and shareable score',
            'Early access to new cards',
            'Fewer, better-placed ads (not zero — we are honest about how things are funded)',
          ].map(item => (
            <div key={item} className="flex items-start gap-3">
              <span className="font-mono text-xs mt-0.5" style={{ color: 'var(--verdigris)' }}>·</span>
              <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Milestone Roadmap --- */}
      <div className="mb-14 max-w-lg mx-auto">
        <h2
          className="font-display font-semibold text-center mb-2"
          style={{ fontSize: '1.5rem', color: 'var(--deep)' }}
        >
          What We Build Together
        </h2>
        <p className="font-italic italic text-center mb-8" style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>
          New features unlock as the movement grows. Not because we are withholding them
          — because some things only work when enough people are in the room.
        </p>

        <div className="space-y-0">
          {[
            {
              members: 'Now',
              unlocked: true,
              title: 'The Foundation',
              features: 'Full articles, action cards, matched giving, Possiblist Score, AI benchmark',
            },
            {
              members: '1,000',
              unlocked: false,
              title: 'The Forum',
              features: 'Moderated discussion under each article — Letters to the Editor, not Reddit. Your first chance to hear what other possibilists think.',
            },
            {
              members: '2,500',
              unlocked: false,
              title: 'Possiblist Grants',
              features: 'Member-proposed, member-voted micro-projects. £500–£5,000 for the smallest useful thing that will move a specific number.',
            },
            {
              members: '5,000',
              unlocked: false,
              title: 'Possiblist Positions',
              features: 'Collectively drafted, evidence-based position statements. Individual judgement, collective voice. "5,000 Possibilists believe, based on these data sources, that..."',
            },
            {
              members: '10,000',
              unlocked: false,
              title: 'The Possiblist Index',
              features: 'An annual publication: The State of Being Wrong. Which misconceptions improved this year? Which got worse? Citeable by media, referenced by policymakers.',
            },
            {
              members: '25,000',
              unlocked: false,
              title: 'Local Chapters',
              features: 'Possiblist London. Possiblist Berlin. Possiblist Nairobi. Monthly meetups: one quiz, one discussion, one action. Not activism — intellectual community with practical output.',
            },
          ].map((milestone, i) => (
            <div key={milestone.members} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[0.55rem] flex-shrink-0"
                  style={{
                    backgroundColor: milestone.unlocked ? 'var(--verdigris)' : 'var(--deep-05)',
                    color: milestone.unlocked ? 'var(--parchment)' : 'var(--mist)',
                    border: milestone.unlocked ? 'none' : '1px solid var(--deep-10)',
                  }}
                >
                  {milestone.unlocked ? '✓' : milestone.members}
                </div>
                {i < 5 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{ backgroundColor: 'var(--deep-10)', minHeight: '24px' }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className="font-body font-semibold text-sm"
                    style={{ color: milestone.unlocked ? 'var(--verdigris)' : 'var(--deep)' }}
                  >
                    {milestone.title}
                  </p>
                  {!milestone.unlocked && (
                    <span
                      className="font-mono text-[0.55rem] uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--deep-05)', color: 'var(--mist)' }}
                    >
                      {milestone.members} members
                    </span>
                  )}
                </div>
                <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--mist)' }}>
                  {milestone.features}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          className="font-italic italic text-center mt-6 text-sm"
          style={{ color: 'var(--mist)' }}
        >
          The price stays the same. What the movement can do grows with every member who joins — slowly at first, then with the quiet inevitability of a well-sourced footnote.
        </p>
      </div>

      {/* --- Pricing --- */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-lg mx-auto mb-14">
        {/* Annual */}
        <div
          className="flex-1 p-8 rounded-lg text-center"
          style={{ backgroundColor: 'var(--cream)', border: '2px solid var(--verdigris)' }}
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
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '0.95rem' }}
          >
            Become a Possiblist →
          </a>
        </div>

        {/* Monthly */}
        <div
          className="flex-1 p-8 rounded-lg text-center"
          style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-10)' }}
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
            style={{ backgroundColor: 'var(--cream)', borderColor: 'var(--deep-10)', color: 'var(--deep)', fontSize: '0.95rem' }}
          >
            Become a Possiblist →
          </a>
        </div>
      </div>

      {/* --- Transparency pledge --- */}
      <div className="text-center max-w-md mx-auto">
        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
          Every year we publish exactly where every pound went — every grant made,
          every match paid, every number that moved and every one that didn't.
          Because a movement that asks you to trust the data should be willing
          to show you its own.
        </p>
        <Link
          to="/about"
          className="inline-block mt-4 font-mono text-xs no-underline"
          style={{ color: 'var(--verdigris)' }}
        >
          Read more about Possiblist →
        </Link>
      </div>
    </div>
  )
}
