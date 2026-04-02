import { json, getSession, saveSession } from './index'
import type { Env } from './index'

// In v1, content is bundled at build time on the frontend.
// The Worker serves the same JSON for API consumers and validates answers.
// In production, these would be loaded from KV or R2.

export const handleQuiz = {
  async next(env: Env, sessionId: string): Promise<Response> {
    const session = await getSession(env, sessionId)
    const answeredSlugs = new Set(session.answers.map(a => a.slug))

    // Return first unanswered card slug
    // In v1, the frontend handles card ordering; this just tells the API consumer
    return json({
      answeredCount: session.answers.length,
      answeredSlugs: Array.from(answeredSlugs),
    })
  },

  getCard(slug: string): Response {
    // In v1, fact cards are static JSON bundled in the frontend.
    // This endpoint exists for API consumers and mobile clients.
    return json({
      slug,
      message: 'Fact card data is bundled in the frontend in v1. Use /api/fact-cards for the full list.',
    })
  },

  async answer(request: Request, env: Env, sessionId: string, slug: string): Promise<Response> {
    const body = await request.json() as { chosenIndex: number; timeToAnswer: number }

    if (typeof body.chosenIndex !== 'number' || body.chosenIndex < 0 || body.chosenIndex > 3) {
      return json({ error: 'Invalid answer index' }, 400)
    }

    const session = await getSession(env, sessionId)

    // Check if already answered
    if (session.answers.some(a => a.slug === slug)) {
      return json({ error: 'Already answered', slug }, 409)
    }

    const answer = {
      slug,
      answeredAt: new Date().toISOString(),
      chosenIndex: body.chosenIndex,
      correct: false, // Frontend determines correctness from fact card data
      timeToAnswer: body.timeToAnswer ?? 0,
    }

    const updatedSession = {
      ...session,
      answers: [...session.answers, answer],
    }

    await saveSession(env, updatedSession)

    return json({
      recorded: true,
      slug,
      totalAnswered: updatedSession.answers.length,
    }, 200, {
      'Set-Cookie': `pl_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`,
    })
  },

  async score(env: Env, sessionId: string): Promise<Response> {
    const session = await getSession(env, sessionId)
    const total = session.answers.length
    const wrong = session.answers.filter(a => !a.correct).length

    return json({
      total,
      wrong,
      correct: total - wrong,
      answers: session.answers,
      isPremium: session.isPremium,
    })
  },

  article(request: Request, env: Env, slug: string): Response {
    // In v1, articles are bundled in the frontend.
    // This endpoint checks premium status for API consumers.
    const cookies = request.headers.get('Cookie') ?? ''
    const isPremium = cookies.includes('pl_premium=')

    return json({
      slug,
      isPremium,
      message: isPremium
        ? 'Full article access granted'
        : 'Free section only. Subscribe for full access.',
    })
  },

  allCards(): Response {
    // In v1, returns a list of available card slugs
    return json({
      cards: [
        'extreme-poverty-declining',
        'child-mortality-falling',
        'life-expectancy-soaring',
        'girls-education-advancing',
        'nuclear-safety-vs-coal',
        'ai-worldview-misconceptions',
      ],
    })
  },

  researchSummary(): Response {
    // In v1, research data is bundled in the frontend
    return json({
      message: 'Research summary is bundled in the frontend in v1.',
      endpoint: '/research',
    })
  },
}
