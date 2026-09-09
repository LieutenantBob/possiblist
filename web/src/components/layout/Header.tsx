import { Link } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { session } = useSession()
  const { user, loading } = useAuth()

  const total = session.answers.length
  const correct = session.answers.filter(a => a.correct).length
  const possiblistScore = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <header
      className="w-full px-4 py-4 flex items-center justify-between max-w-3xl mx-auto"
      style={{ borderBottom: '1px solid var(--verdigris-10)' }}
    >
      <Link to="/" className="wordmark text-2xl no-underline" style={{ color: 'var(--deep)' }}>
        Possiblist<span className="wordmark-degree">°</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Possiblist Score — always visible once quiz started */}
        {total > 0 && (
          <Link
            to="/quiz"
            className="font-mono text-xs no-underline"
            style={{ color: 'var(--mist)' }}
          >
            <span style={{ color: 'var(--verdigris)' }}>{possiblistScore}%</span> possiblist
          </Link>
        )}

        {/* User state */}
        {!loading && (
          user ? (
            <Link
              to="/my-possiblist"
              className="no-underline flex items-center gap-2"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-7 h-7 rounded-full"
                  style={{ border: '1.5px solid var(--verdigris-20)' }}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-display font-semibold text-xs"
                  style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="font-mono text-xs no-underline"
              style={{ color: 'var(--verdigris)' }}
            >
              Sign in
            </Link>
          )
        )}
      </div>
    </header>
  )
}
