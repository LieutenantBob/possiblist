import { useEffect } from 'react'
import type { FactCard, Editorial } from '../../data/types'

interface SEOHeadProps {
  factCard: FactCard
  editorial: Editorial
}

export function SEOHead({ factCard, editorial }: SEOHeadProps) {
  useEffect(() => {
    const title = `${editorial.frontmatter.seoHeadline} | Possiblist`
    document.title = title

    setMeta('description', factCard.metaDescription)
    setMeta('og:title', title, 'property')
    setMeta('og:description', factCard.metaDescription, 'property')
    setMeta('og:image', `https://possiblist.io/og/${factCard.slug}.png`, 'property')
    setMeta('og:type', 'article', 'property')

    // JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: editorial.frontmatter.seoHeadline,
      datePublished: editorial.frontmatter.publishedAt,
      author: { '@type': 'Organization', name: 'Possiblist' },
      image: `https://possiblist.io/og/${factCard.slug}.png`,
      description: factCard.metaDescription,
    }

    let script = document.querySelector('script[data-possiblist-jsonld]') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-possiblist-jsonld', '')
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)

    return () => {
      document.title = 'Possiblist° — What you believe vs. what is true'
    }
  }, [factCard, editorial])

  return null
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.content = content
}
