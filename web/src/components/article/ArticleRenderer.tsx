import { useState, useEffect } from 'react'
import type { Editorial, FactCard } from '../../data/types'
import { SourcesList } from './SourcesList'
import { PaywallGate } from './PaywallGate'
import { EmailCapture } from './EmailCapture'
import { AdSlot } from '../ads/AdSlot'
import { ActionCard } from './ActionCard'
import { useSubscription } from '../../hooks/useSubscription'

interface ArticleRendererProps {
  editorial: Editorial
  factCard: FactCard
}

// Articles that are fully free — no paywall, available to everyone
const FREE_ARTICLES = ['extreme-poverty-declining', 'ai-worldview-misconceptions']

export function ArticleRenderer({ editorial, factCard }: ArticleRendererProps) {
  const { isPremium } = useSubscription()
  const isFreeArticle = FREE_ARTICLES.includes(factCard.slug)
  const effectivePremium = isPremium || isFreeArticle
  const { frontmatter, freeContent, premiumContent: bundledPremium } = editorial
  const [premiumHtml, setPremiumHtml] = useState<string | null>(
    // Use bundled premium content if available (free articles include it in the bundle)
    bundledPremium ? markdownToHtml(bundledPremium) : null
  )

  // Fetch premium content server-side for paid subscribers (not needed for bundled free articles)
  useEffect(() => {
    if (!effectivePremium || premiumHtml) return
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
  }, [effectivePremium, factCard.slug, premiumHtml])

  const readTime = Math.ceil(
    ((frontmatter.wordCountFree + (effectivePremium ? frontmatter.wordCountPremium : 0)) / 250)
  )

  return (
    <article className="max-w-[680px] mx-auto px-4 py-8" style={{ backgroundColor: 'var(--parchment)' }}>
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

      {/* Free article badge */}
      {isFreeArticle && !isPremium && (
        <div
          className="inline-block px-3 py-1.5 rounded-md font-mono text-[0.65rem] uppercase tracking-wider mb-6"
          style={{ backgroundColor: 'var(--verdigris-10)', color: 'var(--verdigris)' }}
        >
          Free story — open to everyone
        </div>
      )}

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
      {effectivePremium && premiumHtml ? (
        <>
          <div
            className="prose-possiblist"
            style={{ lineHeight: 1.85, fontSize: '1.05rem' }}
            dangerouslySetInnerHTML={{ __html: premiumHtml }}
          />
          <AdSlot slot="article-mid" className="my-8" />
        </>
      ) : !effectivePremium ? (
        <PaywallGate teaser={factCard.premiumTeaser} />
      ) : null}

      {/* Sources */}
      <SourcesList sources={factCard.sources} />

      {/* Action Card — free articles and premium */}
      {effectivePremium && factCard.actionCard && (
        <ActionCard actionCard={factCard.actionCard} slug={factCard.slug} />
      )}

      {/* Membership nudge on free articles */}
      {isFreeArticle && !isPremium && (
        <div
          className="mt-12 pt-8 text-center"
          style={{ borderTop: '1px solid var(--verdigris-10)' }}
        >
          <p className="font-italic italic mb-2" style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>
            This story was free. There are 19 more behind the curtain.
          </p>
          <p className="font-body text-sm mb-6" style={{ color: 'var(--ink)' }}>
            Full stories, the organisations behind the data, and a 20% match on every donation.
          </p>
          <a
            href="/subscribe"
            className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
            style={{ backgroundColor: 'var(--verdigris)', color: 'var(--parchment)', fontSize: '0.95rem' }}
          >
            Become a Possiblist →
          </a>
        </div>
      )}
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
      const trimmed = p.trim()

      // Headings
      const h2Match = trimmed.match(/^## (.+)$/)
      if (h2Match) {
        return `<h2 style="font-family: var(--font-display); font-weight: 600; font-size: 1.6rem; color: var(--deep); margin: 2.5rem 0 1rem; line-height: 1.2;">${escapeHtml(h2Match[1])}</h2>`
      }
      const h3Match = trimmed.match(/^### (.+)$/)
      if (h3Match) {
        return `<h3 style="font-family: var(--font-body); font-weight: 600; font-size: 1.15rem; color: var(--deep); margin: 2rem 0 0.75rem;">${escapeHtml(h3Match[1])}</h3>`
      }

      // Regular paragraph with inline formatting
      let html = escapeHtml(trimmed)
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
      html = html.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--verdigris);">$1</a>'
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
