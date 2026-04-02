import { Link } from 'react-router-dom'
import { useSession } from '../../hooks/useSession'

export function Header() {
  const { session } = useSession()
  const wrongCount = session.answers.filter(a => !a.correct).length

  return (
    <header className="w-full px-4 py-4 flex items-center justify-between max-w-3xl mx-auto">
      <Link to="/" className="wordmark text-2xl no-underline" style={{ color: 'var(--deep)' }}>
        Possiblist<span className="wordmark-degree">°</span>
      </Link>
      {session.answers.length > 0 && (
        <Link
          to="/score"
          className="font-mono text-xs no-underline"
          style={{ color: 'var(--mist)' }}
        >
          Wrong {wrongCount} {wrongCount === 1 ? 'time' : 'times'}. Good.
        </Link>
      )}
    </header>
  )
}
