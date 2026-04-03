import { describe, it, expect } from 'vitest'
import { getAllFactCards, getFactCard } from '../../data/loader'

const EXPECTED_SLUGS = [
  'extreme-poverty-declining',
  'child-mortality-falling',
  'life-expectancy-soaring',
  'girls-education-advancing',
  'nuclear-safety-vs-coal',
  'ai-worldview-misconceptions',
  'vaccination-coverage-global',
  'renewable-energy-rising',
  'where-most-people-live',
  'terrorism-deaths-peaked',
  'teen-birth-rates-falling',
  'global-literacy-miracle',
  'air-travel-safety',
  'maternal-mortality-falling',
  'middle-class-explosion',
  'wildlife-decline',
  'solar-cost-collapse',
  'women-leading-countries',
  'violence-long-run-decline',
  'global-hunger-trend',
  'ozone-layer-recovering',
]

const VALID_CATEGORIES = [
  'poverty',
  'health',
  'education',
  'energy',
  'demographics',
  'security',
  'transport',
  'economics',
  'environment',
  'technology',
  'governance',
]

describe('Content integrity', () => {
  const cards = getAllFactCards()

  it('all 21 expected slugs exist as fact cards', () => {
    for (const slug of EXPECTED_SLUGS) {
      const card = getFactCard(slug)
      expect(card, `Missing fact card: ${slug}`).toBeDefined()
    }
  })

  it('all fact card JSON files parse without errors', () => {
    expect(cards).toHaveLength(21)
    for (const card of cards) {
      expect(card.slug).toBeTruthy()
    }
  })

  it('every fact card has at least 2 sources', () => {
    for (const card of cards) {
      expect(
        card.sources.length,
        `${card.slug} has fewer than 2 sources`
      ).toBeGreaterThanOrEqual(2)
    }
  })

  it('every source has a valid URL starting with https://', () => {
    for (const card of cards) {
      for (const source of card.sources) {
        expect(
          source.url,
          `${card.slug} source "${source.name}" has invalid URL: ${source.url}`
        ).toMatch(/^https:\/\//)
      }
    }
  })

  it('every quiz has a surveyResult with percentWrong > 0', () => {
    for (const card of cards) {
      expect(
        card.quiz.surveyResult,
        `${card.slug} missing surveyResult`
      ).toBeDefined()
      expect(
        card.quiz.surveyResult.percentWrong,
        `${card.slug} percentWrong is not > 0`
      ).toBeGreaterThan(0)
    }
  })

  it('every reality has chartData with at least 3 data points', () => {
    for (const card of cards) {
      expect(
        card.reality.chartData.length,
        `${card.slug} has fewer than 3 chartData points`
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('every chartData point has year and value as numbers', () => {
    for (const card of cards) {
      for (const point of card.reality.chartData) {
        expect(typeof point.year, `${card.slug} chartData year is not a number`).toBe('number')
        expect(typeof point.value, `${card.slug} chartData value is not a number`).toBe('number')
      }
    }
  })

  it('category is one of the allowed values', () => {
    for (const card of cards) {
      expect(
        VALID_CATEGORIES,
        `${card.slug} has invalid category: ${card.category}`
      ).toContain(card.category)
    }
  })

  it('shareText.wrong and shareText.correct are non-empty strings', () => {
    for (const card of cards) {
      expect(card.shareText.wrong.length, `${card.slug} shareText.wrong is empty`).toBeGreaterThan(0)
      expect(card.shareText.correct.length, `${card.slug} shareText.correct is empty`).toBeGreaterThan(0)
    }
  })
})
