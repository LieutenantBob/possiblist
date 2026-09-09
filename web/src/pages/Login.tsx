import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const error = searchParams.get('error')

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [formError, setFormError] = useState(error ?? '')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)

    const result = mode === 'login'
      ? await login(email, password)
      : await register(email, password, name)

    setSubmitting(false)

    if (result.success) {
      navigate('/my-possiblist')
    } else {
      setFormError(result.error ?? 'Something has gone wrong. This is unusual.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 md:py-20">
      <h1
        className="font-display font-semibold text-center mb-2"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--deep)' }}
      >
        {mode === 'login' ? 'Welcome back' : 'Join Possiblist'}
        <span className="wordmark-degree">°</span>
      </h1>
      <p className="font-italic italic text-center mb-8" style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>
        {mode === 'login'
          ? 'Your wrong answers are waiting.'
          : 'Save your progress. Track your wrongness. Move the numbers.'}
      </p>

      {/* Social login buttons */}
      <div className="space-y-3 mb-8">
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-lg border no-underline font-body text-sm"
          style={{ backgroundColor: 'var(--chalk)', borderColor: 'var(--deep-10)', color: 'var(--deep)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </a>
        <a
          href="/api/auth/apple"
          className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-lg border no-underline font-body text-sm"
          style={{ backgroundColor: 'var(--deep)', borderColor: 'var(--deep)', color: 'var(--parchment)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M14.94 9.88c-.02-2.17 1.77-3.21 1.85-3.26-1.01-1.47-2.58-1.67-3.14-1.7-1.33-.14-2.61.79-3.29.79-.68 0-1.72-.77-2.83-.75-1.45.02-2.8.85-3.55 2.15-1.52 2.63-.39 6.52 1.09 8.66.72 1.05 1.59 2.22 2.72 2.18 1.09-.04 1.5-.71 2.82-.71 1.31 0 1.69.71 2.84.68 1.18-.02 1.93-1.06 2.64-2.11.84-1.21 1.18-2.39 1.2-2.45-.03-.01-2.3-.88-2.32-3.5zM12.75 3.3c.6-.73 1-1.74.89-2.75-.86.04-1.9.58-2.52 1.3-.55.64-1.03 1.66-.9 2.64.96.07 1.94-.49 2.53-1.19z"/></svg>
          Continue with Apple
        </a>
        <a
          href="/api/auth/meta"
          className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-lg border no-underline font-body text-sm"
          style={{ backgroundColor: 'var(--chalk)', borderColor: 'var(--deep-10)', color: 'var(--deep)' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="#1877F2"><path d="M18 9a9 9 0 10-10.41 8.9v-6.29h-2.3V9h2.3V7.02c0-2.27 1.35-3.52 3.42-3.52.99 0 2.02.18 2.02.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.41V9h2.51l-.4 2.6h-2.11v6.3A9 9 0 0018 9z"/></svg>
          Continue with Facebook
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--deep-10)' }} />
        <span className="font-mono text-[0.6rem] uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
          or with email
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--deep-10)' }} />
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-lg border font-body text-sm"
            style={{ borderColor: 'var(--deep-10)', backgroundColor: 'var(--chalk)', color: 'var(--deep)' }}
            aria-label="Name"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-lg border font-body text-sm"
          style={{ borderColor: 'var(--deep-10)', backgroundColor: 'var(--chalk)', color: 'var(--deep)' }}
          aria-label="Email"
        />
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={mode === 'register' ? 'Password (8+ characters)' : 'Password'}
          minLength={mode === 'register' ? 8 : undefined}
          className="w-full px-4 py-3 rounded-lg border font-body text-sm"
          style={{ borderColor: 'var(--deep-10)', backgroundColor: 'var(--chalk)', color: 'var(--deep)' }}
          aria-label="Password"
        />

        {formError && (
          <p className="font-mono text-xs" style={{ color: 'var(--sienna)' }}>
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-5 py-3 rounded-lg font-body font-semibold cursor-pointer border-none"
          style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '0.95rem' }}
        >
          {submitting ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      {/* Toggle mode */}
      <p className="text-center mt-6 font-body text-sm" style={{ color: 'var(--mist)' }}>
        {mode === 'login' ? (
          <>
            New here?{' '}
            <button
              onClick={() => { setMode('register'); setFormError('') }}
              className="bg-transparent border-none cursor-pointer underline font-body text-sm p-0"
              style={{ color: 'var(--verdigris)' }}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              onClick={() => { setMode('login'); setFormError('') }}
              className="bg-transparent border-none cursor-pointer underline font-body text-sm p-0"
              style={{ color: 'var(--verdigris)' }}
            >
              Sign in
            </button>
          </>
        )}
      </p>

      {/* Back to quiz */}
      <div className="text-center mt-8">
        <Link to="/quiz" className="font-mono text-xs" style={{ color: 'var(--mist)' }}>
          ← Continue without an account
        </Link>
      </div>
    </div>
  )
}
