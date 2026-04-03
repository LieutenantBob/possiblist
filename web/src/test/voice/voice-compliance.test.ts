import { describe, it, expect } from 'vitest'
import { getAllFactCards } from '../../data/loader'

describe('Voice compliance', () => {
  const cards = getAllFactCards()

  it('no teaser contains "the answer is" or reveals the correct option text', () => {
    for (const card of cards) {
      const teaserLower = card.teaser.toLowerCase()
      expect(
        teaserLower,
        `${card.slug} teaser contains "the answer is"`
      ).not.toContain('the answer is')

      const correctOption = card.quiz.options[card.quiz.correctIndex]
      expect(
        card.teaser,
        `${card.slug} teaser reveals correct option text: "${correctOption}"`
      ).not.toContain(correctOption)
    }
  })

  it('no headline is longer than 120 characters', () => {
    for (const card of cards) {
      expect(
        card.headline.length,
        `${card.slug} headline is ${card.headline.length} chars (max 120)`
      ).toBeLessThanOrEqual(120)
    }
  })

  it('every brysonAside is between 50 and 400 characters', () => {
    for (const card of cards) {
      expect(
        card.brysonAside.length,
        `${card.slug} brysonAside is ${card.brysonAside.length} chars (expected 50-400)`
      ).toBeGreaterThanOrEqual(50)
      expect(
        card.brysonAside.length,
        `${card.slug} brysonAside is ${card.brysonAside.length} chars (expected 50-400)`
      ).toBeLessThanOrEqual(400)
    }
  })

  it('every premiumTeaser is between 100 and 600 characters', () => {
    for (const card of cards) {
      expect(
        card.premiumTeaser.length,
        `${card.slug} premiumTeaser is ${card.premiumTeaser.length} chars (expected 100-600)`
      ).toBeGreaterThanOrEqual(100)
      expect(
        card.premiumTeaser.length,
        `${card.slug} premiumTeaser is ${card.premiumTeaser.length} chars (expected 100-600)`
      ).toBeLessThanOrEqual(600)
    }
  })

  it('no premiumTeaser starts with "The premium"', () => {
    for (const card of cards) {
      expect(
        card.premiumTeaser.startsWith('The premium'),
        `${card.slug} premiumTeaser starts with generic "The premium" framing`
      ).toBe(false)
    }
  })

  it('no shareText contains the word "smug"', () => {
    for (const card of cards) {
      expect(
        card.shareText.wrong.toLowerCase(),
        `${card.slug} shareText.wrong contains "smug"`
      ).not.toContain('smug')
      expect(
        card.shareText.correct.toLowerCase(),
        `${card.slug} shareText.correct contains "smug"`
      ).not.toContain('smug')
    }
  })

  it('every emailDigestLine is between 30 and 150 characters', () => {
    for (const card of cards) {
      expect(
        card.emailDigestLine.length,
        `${card.slug} emailDigestLine is ${card.emailDigestLine.length} chars (expected 30-150)`
      ).toBeGreaterThanOrEqual(30)
      expect(
        card.emailDigestLine.length,
        `${card.slug} emailDigestLine is ${card.emailDigestLine.length} chars (expected 30-150)`
      ).toBeLessThanOrEqual(150)
    }
  })

  it('every nuance field is non-empty and at least 100 characters', () => {
    for (const card of cards) {
      expect(
        card.nuance,
        `${card.slug} nuance is empty`
      ).toBeTruthy()
      expect(
        card.nuance.length,
        `${card.slug} nuance is ${card.nuance.length} chars (min 100)`
      ).toBeGreaterThanOrEqual(100)
    }
  })
})
