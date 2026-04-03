/**
 * OG Image Generator for Possiblist
 *
 * Generates 1200x630 OG images for each fact card using Satori.
 * In v1, this is a build-time script. Run before deploy.
 *
 * Usage: npx ts-node scripts/generate-og.ts
 *
 * OG Image spec:
 * - Background: var(--parchment) #F2EBD9
 * - "Possiblist°" wordmark top-left, Cormorant SC, small, verdigris ° mark
 * - Article literary title, Cormorant SC large, var(--deep), centred
 * - Key figure, JetBrains Mono, var(--verdigris), large, below title
 * - No chart
 *
 * Note: Satori requires font files. In production, download the Google Fonts
 * TTF files and reference them here. For v1 build, we generate placeholder PNGs.
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const CONTENT_DIR = join(__dirname, '..', 'content', 'fact-cards')
const OUTPUT_DIR = join(__dirname, '..', 'web', 'public', 'og')

interface FactCard {
  slug: string
  headline: string
  reality: { figure: string }
}

async function generateOGImages() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const files = await readdir(CONTENT_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  for (const file of jsonFiles) {
    const raw = await readFile(join(CONTENT_DIR, file), 'utf-8')
    const card: FactCard = JSON.parse(raw)

    // In v1, generate a simple SVG placeholder.
    // In production, use Satori + resvg-js for proper rendering.
    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F2EBD9"/>
  <text x="60" y="60" font-family="serif" font-size="24" fill="#1C1917">Possiblist</text>
  <text x="221" y="60" font-family="serif" font-size="24" fill="#3D7A6E">°</text>
  <text x="600" y="280" font-family="serif" font-size="42" fill="#1C1917" text-anchor="middle" width="1080">
    ${escapeXml(card.headline.slice(0, 80))}
  </text>
  <text x="600" y="400" font-family="monospace" font-size="64" fill="#3D7A6E" text-anchor="middle">
    ${escapeXml(card.reality.figure)}
  </text>
</svg>`

    await writeFile(join(OUTPUT_DIR, `${card.slug}.svg`), svg, 'utf-8')
    console.log(`Generated OG image: ${card.slug}.svg`)
  }

  console.log(`\nGenerated ${jsonFiles.length} OG images in ${OUTPUT_DIR}`)
  console.log('Note: These are SVG placeholders. Use Satori for production PNG generation.')
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

generateOGImages().catch(console.error)
