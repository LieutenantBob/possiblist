import { useState, useEffect } from 'react'
import type { Editorial, FactCard } from '../../data/types'
import { SourcesList } from './SourcesList'
import { PaywallGate } from './PaywallGate'
import { EmailCapture } from './EmailCapture'
import { AdSlot } from '../ads/AdSlot'
import { useSubscription } from '../../hooks/useSubscription'

interface ArticleRendererProps {
  editorial: Editorial
  factCard: FactCard
}

export function ArticleRenderer({ editorial, factCard }: ArticleRendererProps) {
  const { isPremium } = useSubscription()
  const { frontmatter, freeContent } = editorial
  const [premiumHtml, setPremiumHtml] = useState<string | null>(null)

  // Fetch premium content server-side only for verified subscribers
  useEffect(() => {
    if (!isPremium) return
    let cancelled = false

    fetch(`/api/articles/${factCard.slug}`, { credentials: 'include' })
      .then(res => res.ok ? res.json() as Promise<{ premiumContent?: string }> : null)
      .then(data => {
        if (!cancelled && data?.premiumContent) {
          setPremiumHtml(markdownToHtml(data.premiumContent))
        }
      })
      .catch(() => { /* Premium fetch failed — show free section only */ })

    return () => { cancelled = true }
  }, [isPremium, factCard.slug])

  const readTime = Math.ceil(
    ((frontmatter.wordCountFree + (isPremium ? frontmatter.wordCountPremium : 0)) / 250)
  )

  return (
    <article className="max-w-[680px] mx-auto px-4 py-8" style={{ backgroundColor: 'var(--chalk)' }}>
      {/* Category badge */}
      <span className="category-badge">{frontmatter.category}</span>

      {/* SEO headline */}
      <p className="font-mono text-xs mt-4 mb-2" style={{ color: 'var(--mist)' }}>
        {frontmatter.seoHeadline}
      </p>

      {/* Literary title */}
      <h1
        className="font-display font-semibold mb-3"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        {frontmatter.title}
      </h1>

      {/* Subtitle */}
      <p
        className="font-italic italic mb-6"
        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: 'var(--mist)', fontWeight: 300 }}
      >
        {frontmatter.subtitle}
      </p>

      {/* Byline */}
      <p className="font-mono text-xs mb-8" style={{ color: 'var(--mist)' }}>
        Verified by Possiblist · {frontmatter.publishedAt} · {readTime} min read
      </p>

      {/* Ad Slot 1 — above fold, below byline */}
      <AdSlot slot="article-top" className="mb-8" />

      {/* Free section with drop cap */}
      <div
        className="article-body prose-possiblist"
        style={{ lineHeight: 1.85, fontSize: '1.05rem' }}
        dangerouslySetInnerHTML={{ __html: markdownToHtml(freeContent) }}
      />

      {/* Email capture */}
      <EmailCapture slug={factCard.slug} className="my-10" />

      {/* Paywall gate or premium content */}
      {isPremium && premiumHtml ? (
        <>
          <div
            className="prose-possiblist"
            style={{ lineHeight: 1.85, fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: premiumHtml }}
          />
          <AdSlot slot="article-mid" className="my-8" />
        </>
      ) : !isPremium ? (
        <PaywallGate teaser={factCard.premiumTeaser} />
      ) : null}

      {/* Sources */}
      <SourcesList sources={factCard.sources} />
    </article>
  )
}

/**
 * Minimal markdown to HTML converter for editorial content.
 * Content is git-committed (not user input), but we sanitize defensively.
 */
function markdownToHtml(md: string): string {
  return md
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => {
      let html = escapeHtml(p.trim())
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
      html = html.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      return `<p>${html}</p>`
    })
    .join('\n')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
