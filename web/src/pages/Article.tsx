import { useParams, Link } from 'react-router-dom'
import { getFactCard, getEditorial } from '../data/loader'
import { ArticleRenderer } from '../components/article/ArticleRenderer'
import { SEOHead } from '../components/article/SEOHead'

export function Article() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return <NotFound />

  const factCard = getFactCard(slug)
  const editorial = getEditorial(slug)

  if (!factCard || !editorial) return <NotFound />

  return (
    <>
      <SEOHead factCard={factCard} editorial={editorial} />

      {/* Back to quiz — top */}
      <div className="max-w-[680px] mx-auto px-4 pt-6">
        <Link to="/" className="font-mono text-xs no-underline" style={{ color: 'var(--mist)' }}>
          ← Back to quiz
        </Link>
      </div>

      <ArticleRenderer editorial={editorial} factCard={factCard} />

      {/* Back to quiz — bottom */}
      <div className="max-w-[680px] mx-auto px-4 pb-12">
        <Link to="/" className="font-mono text-xs no-underline" style={{ color: 'var(--mist)' }}>
          ← Back to quiz
        </Link>
      </div>
    </>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="font-italic italic" style={{ color: 'var(--mist)' }}>
        Something has gone wrong. This is unusual.
      </p>
      <Link to="/" className="font-mono text-xs" style={{ color: 'var(--verdigris)' }}>
        ← Back to quiz
      </Link>
    </div>
  )
}
