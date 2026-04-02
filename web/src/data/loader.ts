import type { FactCard, Editorial, EditorialFrontmatter } from './types'

// Import all fact cards at build time
const factCardModules = import.meta.glob<FactCard>(
  '../../content/fact-cards/*.json',
  { eager: true, import: 'default' }
)

// Import all editorials at build time
const editorialModules = import.meta.glob<string>(
  '../../content/editorials/*.md',
  { eager: true, as: 'raw' }
)

export function getAllFactCards(): FactCard[] {
  return Object.values(factCardModules)
}

export function getFactCard(slug: string): FactCard | undefined {
  return getAllFactCards().find(card => card.slug === slug)
}

function parseEditorialFrontmatter(raw: string): { frontmatter: EditorialFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    throw new Error('Invalid editorial format: missing frontmatter')
  }

  const frontmatterLines = match[1].split('\n')
  const frontmatter: Record<string, string | number> = {}

  for (const line of frontmatterLines) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    let value: string | number = line.slice(colonIdx + 1).trim()
    // Strip quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
    // Parse numbers
    if (/^\d+$/.test(String(value))) {
      value = parseInt(String(value), 10)
    }
    frontmatter[key] = value
  }

  return {
    frontmatter: frontmatter as unknown as EditorialFrontmatter,
    body: match[2],
  }
}

export function getEditorial(slug: string): Editorial | undefined {
  const key = Object.keys(editorialModules).find(k => k.includes(`/${slug}.md`))
  if (!key) return undefined

  const raw = editorialModules[key]
  const { frontmatter, body } = parseEditorialFrontmatter(raw)

  const parts = body.split('<!-- PAYWALL -->')
  // Premium content is NOT included in the client bundle.
  // It must be fetched via authenticated API for premium subscribers.
  return {
    frontmatter,
    freeContent: parts[0]?.trim() ?? '',
    premiumContent: '',
  }
}

export function getAllEditorials(): Editorial[] {
  return Object.keys(editorialModules).map(key => {
    const raw = editorialModules[key]
    const { frontmatter, body } = parseEditorialFrontmatter(raw)
    const parts = body.split('<!-- PAYWALL -->')
    return {
      frontmatter,
      freeContent: parts[0]?.trim() ?? '',
      premiumContent: '',
    }
  })
}
