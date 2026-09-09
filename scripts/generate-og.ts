/**
 * OG Image Generator for Possiblist
 *
 * Generates 1200x630 SVG OG images for each fact card + a default homepage image.
 * Matches the Possiblist design system: parchment background, Cormorant SC headings,
 * JetBrains Mono data, verdigris accents.
 *
 * Usage: npx tsx scripts/generate-og.ts
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { Resvg } from '@resvg/resvg-js'

const CONTENT_DIR = join(__dirname, '..', 'content', 'fact-cards')
const OUTPUT_DIR = join(__dirname, '..', 'web', 'public', 'og')

interface FactCard {
  slug: string
  category: string
  headline: string
  quiz: { question: string; surveyResult: { percentWrong: number } }
  reality: { figure: string; trendLabel: string }
  metaDescription: string
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim())
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current.trim())
  return lines
}

function generateCardSvg(card: FactCard): string {
  const questionLines = wrapText(card.quiz.question, 45)
  const questionY = 240
  const lineHeight = 52

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@600&amp;family=JetBrains+Mono:wght@300;400&amp;family=Source+Serif+4:wght@400');
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#F2EBD9"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="4" fill="#3D7A6E" opacity="0.3"/>

  <!-- Wordmark -->
  <text x="60" y="68" font-family="'Cormorant SC', serif" font-size="28" font-weight="600" fill="#1C1917">Possiblist</text>
  <text x="222" y="68" font-family="'Cormorant SC', serif" font-size="28" font-weight="600" fill="#3D7A6E">°</text>

  <!-- Category badge -->
  <text x="60" y="160" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="400" fill="#3D7A6E" letter-spacing="1.5" text-transform="uppercase">${escapeXml(card.category.toUpperCase())}</text>

  <!-- Question -->
${questionLines.map((line, i) => `  <text x="60" y="${questionY + i * lineHeight}" font-family="'Cormorant SC', serif" font-size="42" font-weight="600" fill="#1C1917">${escapeXml(line)}</text>`).join('\n')}

  <!-- Real figure -->
  <text x="60" y="${Math.max(questionY + questionLines.length * lineHeight + 60, 420)}" font-family="'JetBrains Mono', monospace" font-size="56" font-weight="300" fill="#3D7A6E">${escapeXml(card.reality.figure)}</text>

  <!-- Trend label -->
  <text x="60" y="${Math.max(questionY + questionLines.length * lineHeight + 100, 460)}" font-family="'Source Serif 4', serif" font-size="18" fill="#8A8178" font-style="italic">${escapeXml(card.reality.trendLabel)}</text>

  <!-- Survey stat -->
  <text x="1140" y="590" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="400" fill="#8A8178" text-anchor="end">${card.quiz.surveyResult.percentWrong}% of people get this wrong</text>

  <!-- Domain -->
  <text x="60" y="590" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="300" fill="#3D7A6E" opacity="0.6">possiblist.net</text>
</svg>`
}

function generateDefaultSvg(): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@600&amp;family=Cormorant+Garamond:ital,wght@1,300&amp;family=JetBrains+Mono:wght@300;400');
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#F2EBD9"/>

  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="4" fill="#3D7A6E" opacity="0.3"/>

  <!-- Wordmark — centred, large -->
  <text x="600" y="240" font-family="'Cormorant SC', serif" font-size="96" font-weight="600" fill="#1C1917" text-anchor="middle">Possiblist</text>
  <text x="807" y="240" font-family="'Cormorant SC', serif" font-size="96" font-weight="600" fill="#3D7A6E">°</text>

  <!-- Tagline -->
  <text x="600" y="310" font-family="'Cormorant Garamond', serif" font-size="26" font-weight="300" fill="#8A8178" text-anchor="middle" font-style="italic">A movement for people who would rather be accurate than loud.</text>

  <!-- Hook line -->
  <text x="600" y="400" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="400" fill="#3D7A6E" text-anchor="middle">21 questions. Most people get most of them wrong.</text>

  <!-- Domain -->
  <text x="600" y="560" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="300" fill="#3D7A6E" text-anchor="middle" opacity="0.6">possiblist.net</text>
</svg>`
}

async function svgToPng(svg: string): Promise<Buffer> {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: true },
  })
  const rendered = resvg.render()
  return rendered.asPng()
}

async function generateOGImages() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  // Generate default homepage OG image
  const defaultSvg = generateDefaultSvg()
  await writeFile(join(OUTPUT_DIR, 'default.svg'), defaultSvg, 'utf-8')
  await writeFile(join(OUTPUT_DIR, 'default.png'), await svgToPng(defaultSvg))
  console.log('Generated: default.svg + default.png')

  // Generate per-card OG images
  const files = await readdir(CONTENT_DIR)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  for (const file of jsonFiles) {
    const raw = await readFile(join(CONTENT_DIR, file), 'utf-8')
    const card: FactCard = JSON.parse(raw)
    const svg = generateCardSvg(card)
    await writeFile(join(OUTPUT_DIR, `${card.slug}.svg`), svg, 'utf-8')
    await writeFile(join(OUTPUT_DIR, `${card.slug}.png`), await svgToPng(svg))
    console.log(`Generated: ${card.slug}.svg + .png`)
  }

  console.log(`\nGenerated ${(jsonFiles.length + 1) * 2} OG images (SVG + PNG) in ${OUTPUT_DIR}`)
}

generateOGImages().catch(console.error)
