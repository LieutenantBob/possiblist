import type { FactCard, Editorial, EditorialFrontmatter } from './types'

// Direct imports of all fact cards — Vite cannot glob outside project root,
// so we import each card explicitly. These are bundled at build time.
import extremePoverty from '../../../content/fact-cards/extreme-poverty-declining.json'
import childMortality from '../../../content/fact-cards/child-mortality-falling.json'
import lifeExpectancy from '../../../content/fact-cards/life-expectancy-soaring.json'
import girlsEducation from '../../../content/fact-cards/girls-education-advancing.json'
import nuclearSafety from '../../../content/fact-cards/nuclear-safety-vs-coal.json'
import aiWorldview from '../../../content/fact-cards/ai-worldview-misconceptions.json'
import vaccination from '../../../content/fact-cards/vaccination-coverage-global.json'
import renewable from '../../../content/fact-cards/renewable-energy-rising.json'
import wherepeople from '../../../content/fact-cards/where-most-people-live.json'
import terrorism from '../../../content/fact-cards/terrorism-deaths-peaked.json'
import teenBirth from '../../../content/fact-cards/teen-birth-rates-falling.json'
import literacy from '../../../content/fact-cards/global-literacy-miracle.json'
import airTravel from '../../../content/fact-cards/air-travel-safety.json'
import maternal from '../../../content/fact-cards/maternal-mortality-falling.json'
import middleClass from '../../../content/fact-cards/middle-class-explosion.json'
import wildlife from '../../../content/fact-cards/wildlife-decline.json'
import solar from '../../../content/fact-cards/solar-cost-collapse.json'
import womenLeading from '../../../content/fact-cards/women-leading-countries.json'
import violence from '../../../content/fact-cards/violence-long-run-decline.json'
import hunger from '../../../content/fact-cards/global-hunger-trend.json'
import ozone from '../../../content/fact-cards/ozone-layer-recovering.json'

const ALL_FACT_CARDS: FactCard[] = [
  extremePoverty, childMortality, lifeExpectancy, girlsEducation, nuclearSafety,
  vaccination, renewable, wherepeople, terrorism, teenBirth,
  literacy, airTravel, maternal, middleClass, wildlife,
  solar, womenLeading, violence, hunger, ozone,
  aiWorldview,
] as FactCard[]

// Import all editorials as raw strings at build time
const editorialModules: Record<string, string> = import.meta.glob(
  '@content/editorials/*.md',
  { eager: true, query: '?raw', import: 'default' }
) as Record<string, string>

export function getAllFactCards(): FactCard[] {
  return ALL_FACT_CARDS
}

export function getFactCard(slug: string): FactCard | undefined {
  return ALL_FACT_CARDS.find(card => card.slug === slug)
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
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }
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
