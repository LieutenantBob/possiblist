import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full px-4 py-12 mt-16" style={{ borderTop: '1px solid var(--deep-05)' }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Navigation */}
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center md:justify-start">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/manifesto', label: 'Manifesto' },
            { to: '/research', label: 'Research' },
            { to: '/subscribe', label: 'Subscribe' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[0.65rem] uppercase tracking-wider no-underline"
              style={{ color: 'var(--mist)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acknowledgement */}
        <p
          className="font-italic text-center max-w-md text-[0.78rem] italic leading-relaxed"
          style={{ color: 'var(--mist)' }}
        >
          Inspired by the work of Hans Rosling (1948–2017),
          Ola Rosling, and Anna Rosling Rönnlund,
          whose{' '}
          <a
            href="https://gapminder.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--mist)' }}
          >
            Gapminder Foundation
          </a>{' '}
          proved that a fact-based worldview is both possible and delightful.
        </p>

        {/* Copyright */}
        <p className="font-mono text-[0.65rem]" style={{ color: 'var(--mist)' }}>
          © Possiblist {year}
        </p>
      </div>
    </footer>
  )
}
