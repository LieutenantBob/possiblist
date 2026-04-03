import type { ActionCard as ActionCardType } from '../../data/types'

interface ActionCardProps {
  actionCard: ActionCardType
  slug: string
}

export function ActionCard({ actionCard }: ActionCardProps) {
  const { learn, fund, act } = actionCard

  return (
    <section
      className="mt-12 pt-8"
      style={{ borderTop: '2px solid var(--verdigris-20)' }}
      aria-label="Where this number moves"
    >
      <h3
        className="font-display font-semibold mb-2"
        style={{ fontSize: '1.4rem', color: 'var(--deep)' }}
      >
        Where This Number Moves
      </h3>
      <p className="font-italic italic mb-8" style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
        The figure above did not arrive by accident. These are the specific places where it moves.
      </p>

      <div className="space-y-6">
        {/* Learn */}
        <div
          className="p-5 rounded-lg"
          style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-05)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
            >
              Learn
            </span>
            <span className="font-mono text-[0.6rem]" style={{ color: 'var(--mist)' }}>
              {learn.time}
            </span>
          </div>
          <a
            href={learn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body font-semibold underline block mb-1"
            style={{ color: 'var(--verdigris)', fontSize: '0.95rem' }}
          >
            {learn.title}
          </a>
          <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
            {learn.description}
          </p>
        </div>

        {/* Fund */}
        <div
          className="p-5 rounded-lg"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
            >
              Fund
            </span>
            {fund.rating && (
              <span className="font-mono text-[0.6rem]" style={{ color: 'var(--gold)' }}>
                {fund.rating}
              </span>
            )}
          </div>
          <p className="font-body font-semibold mb-1" style={{ color: 'var(--deep)', fontSize: '0.95rem' }}>
            {fund.org}
          </p>
          <p className="font-body text-sm mb-3" style={{ color: 'var(--ink)' }}>
            {fund.description}
          </p>
          <p className="font-mono text-xs mb-4" style={{ color: 'var(--verdigris)' }}>
            {fund.impact}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={fund.url}
              className="flex-1 text-center px-5 py-2.5 rounded-lg font-body font-semibold no-underline text-sm"
              style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)' }}
            >
              Give via Possiblist
            </a>
            <a
              href={fund.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-5 py-2.5 rounded-lg font-body font-semibold no-underline text-sm border"
              style={{ backgroundColor: 'var(--chalk)', borderColor: 'var(--deep-10)', color: 'var(--deep)' }}
            >
              Give directly to {fund.org} →
            </a>
          </div>
          <p className="font-mono text-[0.6rem] mt-3" style={{ color: 'var(--mist)' }}>
            Both links reach the same organisation. The Possiblist link lets us track aggregate impact.
          </p>
        </div>

        {/* Act */}
        <div
          className="p-5 rounded-lg"
          style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-05)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
            >
              Act
            </span>
            <span className="font-mono text-[0.6rem]" style={{ color: 'var(--mist)' }}>
              {act.time}
            </span>
          </div>
          <p className="font-body font-semibold mb-1" style={{ color: 'var(--deep)', fontSize: '0.95rem' }}>
            {act.action}
          </p>
          <p className="font-body text-sm" style={{ color: 'var(--ink)' }}>
            {act.description}
          </p>
          {act.url && (
            <a
              href={act.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 font-mono text-xs underline"
              style={{ color: 'var(--verdigris)' }}
            >
              Start here →
            </a>
          )}
        </div>
      </div>

      {/* Movement message */}
      <p
        className="font-italic italic text-center mt-8"
        style={{ color: 'var(--mist)', fontSize: '0.85rem' }}
      >
        This will not solve the problem. It will move the number. That is what possibilists do.
      </p>
    </section>
  )
}
