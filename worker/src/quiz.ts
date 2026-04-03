import { json, getSession, saveSession } from './index'
import type { Env } from './index'

const KNOWN_SLUGS = new Set([
  'extreme-poverty-declining',
  'child-mortality-falling',
  'life-expectancy-soaring',
  'girls-education-advancing',
  'nuclear-safety-vs-coal',
  'ai-worldview-misconceptions',
])

export const handleQuiz = {
  async next(env: Env, sessionId: string): Promise<Response> {
    const session = await getSession(env, sessionId)
    const answeredSlugs = new Set(session.answers.map(a => a.slug))

    return json({
      answeredCount: session.answers.length,
      answeredSlugs: Array.from(answeredSlugs),
    })
  },

  getCard(slug: string): Response {
    if (!KNOWN_SLUGS.has(slug)) {
      return json({ error: 'Unknown card' }, 404)
    }
    return json({
      slug,
      message: 'Fact card data is bundled in the frontend in v1. Use /api/fact-cards for the full list.',
    })
  },

  async answer(request: Request, env: Env, sessionId: string, slug: string): Promise<Response> {
    if (!KNOWN_SLUGS.has(slug)) {
      return json({ error: 'Unknown card' }, 404)
    }

    let body: { chosenIndex: number; timeToAnswer?: number; correct?: boolean }
    try {
      body = await request.json() as typeof body
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }

    if (typeof body.chosenIndex !== 'number' || !Number.isInteger(body.chosenIndex) ||
        body.chosenIndex < 0 || body.chosenIndex > 3) {
      return json({ error: 'Invalid answer index' }, 400)
    }

    const timeToAnswer = typeof body.timeToAnswer === 'number'
      ? Math.max(0, Math.min(body.timeToAnswer, 300000))
      : 0

    const session = await getSession(env, sessionId)

    if (session.answers.some(a => a.slug === slug)) {
      return json({ error: 'Already answered', slug }, 409)
    }

    const answer = {
      slug,
      answeredAt: new Date().toISOString(),
      chosenIndex: body.chosenIndex,
      correct: typeof body.correct === 'boolean' ? body.correct : false,
      timeToAnswer,
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
      'Set-Cookie': `pl_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}; Secure`,
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

  async article(request: Request, env: Env, slug: string): Promise<Response> {
    if (!KNOWN_SLUGS.has(slug)) {
      return json({ error: 'Unknown article' }, 404)
    }

    // Validate premium status via KV lookup, not just cookie presence
    const cookies = request.headers.get('Cookie') ?? ''
    const match = cookies.match(/pl_premium=([\w-]+)/)
    const customerId = match?.[1]
    let isPremium = false

    if (customerId) {
      const raw = await env.SESSIONS.get(`premium:${customerId}`)
      if (raw) {
        try {
          const record = JSON.parse(raw) as { active: boolean }
          isPremium = record.active === true
        } catch {
          // Invalid KV data — treat as not premium
        }
      }
    }

    return json({
      slug,
      isPremium,
      message: isPremium
        ? 'Full article access granted'
        : 'Free section only. Subscribe for full access.',
    })
  },

  allCards(): Response {
    return json({
      cards: Array.from(KNOWN_SLUGS),
    })
  },

  researchSummary(): Response {
    return json({
      message: 'Research summary is bundled in the frontend in v1.',
      endpoint: '/research',
    })
  },
}
