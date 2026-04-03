import { describe, it, expect } from 'vitest'
import { getAllFactCards, getFactCard } from '../../data/loader'

describe('Content loader', () => {
  describe('getAllFactCards', () => {
    it('returns an array of 21 cards', () => {
      const cards = getAllFactCards()
      expect(cards).toHaveLength(21)
    })

    it('each card has required fields: slug, category, quiz, reality, sources', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        expect(card.slug).toBeDefined()
        expect(card.slug).not.toBe('')
        expect(card.category).toBeDefined()
        expect(card.category).not.toBe('')
        expect(card.quiz).toBeDefined()
        expect(card.reality).toBeDefined()
        expect(card.sources).toBeDefined()
        expect(Array.isArray(card.sources)).toBe(true)
      }
    })

    it('each card has a teaser field that is not empty', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        expect(card.teaser).toBeDefined()
        expect(card.teaser.length).toBeGreaterThan(0)
      }
    })

    it('each card quiz has exactly 4 options', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        expect(card.quiz.options).toHaveLength(4)
      }
    })

    it('each card quiz correctIndex is between 0 and 3', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        expect(card.quiz.correctIndex).toBeGreaterThanOrEqual(0)
        expect(card.quiz.correctIndex).toBeLessThanOrEqual(3)
      }
    })

    it('each card has an actionCard with learn, fund, act tiers', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        expect(card.actionCard).toBeDefined()
        expect(card.actionCard!.learn).toBeDefined()
        expect(card.actionCard!.fund).toBeDefined()
        expect(card.actionCard!.act).toBeDefined()
      }
    })

    it('no card teaser contains the answer (reality.figure)', () => {
      const cards = getAllFactCards()
      for (const card of cards) {
        const figure = card.reality.figure.replace(/[~≈]/g, '').trim()
        expect(card.teaser).not.toContain(figure)
      }
    })
  })

  describe('getFactCard', () => {
    it('returns the correct card for extreme-poverty-declining', () => {
      const card = getFactCard('extreme-poverty-declining')
      expect(card).toBeDefined()
      expect(card!.slug).toBe('extreme-poverty-declining')
      expect(card!.category).toBe('poverty')
    })

    it('returns undefined for a nonexistent slug', () => {
      const card = getFactCard('nonexistent')
      expect(card).toBeUndefined()
    })
  })
})
