import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSession } from '../hooks/useSession'
import { useShare } from '../hooks/useShare'
import { getFactCard } from '../data/loader'
import { useMemo } from 'react'

export function MyPossiblist() {
  const { user, loading, logout } = useAuth()
  const { session } = useSession()
  const { share } = useShare()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const answers = session.answers
    const total = answers.length
    const wrong = answers.filter(a => !a.correct).length
    const articlesRead = new Set(answers.map(a => a.slug)).size

    // Category breakdown
    const categories = new Map<string, { total: number; wrong: number }>()
    for (const answer of answers) {
      const card = getFactCard(answer.slug)
      if (!card) continue
      const existing = categories.get(card.category) ?? { total: 0, wrong: 0 }
      categories.set(card.category, {
        total: existing.total + 1,
        wrong: existing.wrong + (answer.correct ? 0 : 1),
      })
    }

    return { total, wrong, articlesRead, categories }
  }, [session.answers])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-italic italic" style={{ color: 'var(--mist)' }}>Loading...</p>
      </div>
    )
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Profile header — authenticated */}
      {user ? (
        <div className="flex items-center gap-4 mb-10">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-14 h-14 rounded-full"
              style={{ border: '2px solid var(--verdigris-20)' }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-display font-semibold text-xl"
              style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-display font-semibold" style={{ fontSize: '1.5rem', color: 'var(--deep)' }}>
              {user.name}
            </h1>
            <p className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
              Possiblist since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              {user.isPremium && (
                <span style={{ color: 'var(--gold)' }}> · Premium</span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <h1 className="font-display font-semibold mb-2" style={{ fontSize: '1.5rem', color: 'var(--deep)' }}>
            My Possiblist<span className="wordmark-degree">°</span>
          </h1>
          <p className="font-italic italic text-sm" style={{ color: 'var(--mist)' }}>
            Your scorecard on this device. Sign in to save across devices.
          </p>
        </div>
      )}

      {/* Possiblist Score — the shareable number */}
      {stats.total > 0 && (
        <div className="text-center mb-10">
          <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
            Your Possiblist Score
          </p>
          <p
            className="font-mono font-light"
            style={{ fontSize: '4rem', color: 'var(--verdigris)', lineHeight: 1 }}
          >
            {Math.round((stats.total > 0 ? (stats.total - stats.wrong) / stats.total : 0) * 100)}%
          </p>
          <p className="font-italic italic mt-2 mb-6" style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
            {stats.total - stats.wrong} right out of {stats.total} — {stats.wrong > 0
              ? `wrong ${stats.wrong} times, wiser ${stats.wrong} times`
              : 'suspiciously accurate'}
          </p>
          <button
            onClick={() => {
              const score = Math.round(((stats.total - stats.wrong) / stats.total) * 100)
              share({
                title: 'My Possiblist Score',
                text: `I'm a ${score}% Possiblist. Wrong ${stats.wrong} times out of ${stats.total} — but wiser each time. How wrong are you? possiblist.io`,
                url: 'https://possiblist.io',
              })
            }}
            className="px-6 py-2.5 rounded-lg font-mono text-xs cursor-pointer border"
            style={{ backgroundColor: 'var(--chalk)', borderColor: 'var(--deep-10)', color: 'var(--deep)' }}
          >
            Share your score
          </button>
        </div>
      )}

      {/* Scorecard */}
      <div
        className="p-8 rounded-lg mb-8"
        style={{ backgroundColor: 'var(--cream)', border: '2px solid var(--verdigris-20)' }}
      >
        <h2 className="font-display font-semibold mb-6" style={{ fontSize: '1.3rem', color: 'var(--deep)' }}>
          Your Possiblist Scorecard
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="font-mono font-light" style={{ fontSize: '2rem', color: 'var(--verdigris)' }}>
              {stats.total}
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
              Answered
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono font-light" style={{ fontSize: '2rem', color: 'var(--sienna)' }}>
              {stats.wrong}
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
              Wrong
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono font-light" style={{ fontSize: '2rem', color: 'var(--verdigris)' }}>
              {stats.articlesRead}
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
              Stories
            </p>
          </div>
        </div>

        {/* Category breakdown */}
        {stats.categories.size > 0 && (
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-3" style={{ color: 'var(--mist)' }}>
              By category
            </p>
            <div className="space-y-2">
              {Array.from(stats.categories.entries()).map(([cat, data]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase" style={{ color: 'var(--ink)' }}>{cat}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(data.total / stats.total) * 120}px`,
                        backgroundColor: data.wrong > 0 ? 'var(--sienna)' : 'var(--verdigris)',
                        opacity: 0.4,
                      }}
                    />
                    <span className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
                      {data.wrong}/{data.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="font-italic italic mt-6 text-sm" style={{ color: 'var(--mist)' }}>
          {stats.total === 0
            ? 'Quiet for now. Take the quiz to start.'
            : `Wrong ${stats.wrong} times. Learning in progress.`}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/"
          className="p-5 rounded-lg no-underline text-center"
          style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-05)', color: 'var(--deep)' }}
        >
          <p className="font-body font-semibold text-sm">Continue the quiz</p>
          <p className="font-mono text-[0.6rem] mt-1" style={{ color: 'var(--mist)' }}>
            {21 - stats.articlesRead} questions remaining
          </p>
        </Link>
        <Link
          to="/research"
          className="p-5 rounded-lg no-underline text-center"
          style={{ backgroundColor: 'var(--chalk)', border: '1px solid var(--deep-05)', color: 'var(--deep)' }}
        >
          <p className="font-body font-semibold text-sm">AI Benchmark</p>
          <p className="font-mono text-[0.6rem] mt-1" style={{ color: 'var(--mist)' }}>
            See how AI compares to you
          </p>
        </Link>
      </div>

      {/* Premium CTA if not premium */}
      {(!user || !user.isPremium) && (
        <div
          className="p-8 rounded-lg text-center mb-8"
          style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
        >
          <p className="font-italic italic mb-4" style={{ color: 'var(--ink)', fontSize: '1rem' }}>
            Your scorecard tracks what you've learned. Premium shows you where the numbers move — and how to move them.
          </p>
          <Link
            to="/subscribe"
            className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '0.95rem' }}
          >
            Become a Possiblist →
          </Link>
        </div>
      )}

      {/* Account info — authenticated users */}
      {user ? (
        <div className="pt-8" style={{ borderTop: '1px solid var(--deep-05)' }}>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider mb-3" style={{ color: 'var(--mist)' }}>
            Account
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body text-sm" style={{ color: 'var(--ink)' }}>Email</span>
              <span className="font-mono text-sm" style={{ color: 'var(--mist)' }}>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-body text-sm" style={{ color: 'var(--ink)' }}>Sign-in method</span>
              <span className="font-mono text-sm capitalize" style={{ color: 'var(--mist)' }}>{user.provider}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 font-mono text-xs cursor-pointer bg-transparent border-none p-0 underline"
            style={{ color: 'var(--mist)' }}
          >
          Sign out
        </button>
      </div>
      ) : (
        <div className="pt-8 text-center" style={{ borderTop: '1px solid var(--deep-05)' }}>
          <p className="font-italic italic mb-4 text-sm" style={{ color: 'var(--mist)' }}>
            This scorecard lives on this device only. Sign in to keep it across devices.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 rounded-lg font-mono text-xs no-underline border"
            style={{ borderColor: 'var(--deep-10)', color: 'var(--deep)' }}
          >
            Sign in or create account
          </Link>
        </div>
      )}
    </div>
  )
}
