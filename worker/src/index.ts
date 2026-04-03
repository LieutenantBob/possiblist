import { handleQuiz } from './quiz'
import { handleSubscription } from './subscription'
import { handleEmail } from './email'
import { handleAuth } from './auth'

export interface Env {
  SESSIONS: KVNamespace
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PRICE_ANNUAL: string
  STRIPE_PRICE_MONTHLY: string
  RESEND_API_KEY: string
  RESEND_AUDIENCE_ID: string
  ALLOWED_ORIGIN: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  APPLE_CLIENT_ID: string
  APPLE_CLIENT_SECRET: string
  APPLE_TEAM_ID: string
  APPLE_KEY_ID: string
  META_CLIENT_ID: string
  META_CLIENT_SECRET: string
}

export interface Session {
  id: string
  isPremium: boolean
  stripeCustomerId?: string
  answers: Array<{
    slug: string
    answeredAt: string
    chosenIndex: number
    correct: boolean
    timeToAnswer: number
  }>
  emailCaptured: boolean
  startedAt: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname
    const origin = env.ALLOWED_ORIGIN || 'https://possiblist.io'

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) })
    }

    try {
      if (!path.startsWith('/api/')) {
        return new Response('Not Found', { status: 404 })
      }

      // Webhook does NOT get CORS — it's server-to-server from Stripe
      if (path === '/api/stripe/webhook' && request.method === 'POST') {
        return handleSubscription.webhook(request, env)
      }

      const sessionId = getSessionId(request)
      const response = await route(path, request, env, sessionId)
      return addCors(response, origin)
    } catch {
      return addCors(json({ error: 'Something has gone wrong. This is unusual.' }, 500), origin)
    }
  },
}

async function route(path: string, request: Request, env: Env, sessionId: string): Promise<Response> {
  const method = request.method

  // Quiz endpoints
  if (path === '/api/quiz/next' && method === 'GET') {
    return handleQuiz.next(env, sessionId)
  }
  const quizSlugMatch = path.match(/^\/api\/quiz\/([\w-]+)$/)
  if (quizSlugMatch && method === 'GET') {
    return handleQuiz.getCard(quizSlugMatch[1])
  }
  const answerMatch = path.match(/^\/api\/quiz\/([\w-]+)\/answer$/)
  if (answerMatch && method === 'POST') {
    return handleQuiz.answer(request, env, sessionId, answerMatch[1])
  }

  // Score
  if (path === '/api/score' && method === 'GET') {
    return handleQuiz.score(env, sessionId)
  }

  // Articles
  const articleMatch = path.match(/^\/api\/articles\/([\w-]+)$/)
  if (articleMatch && method === 'GET') {
    return handleQuiz.article(request, env, articleMatch[1])
  }

  // Fact cards
  if (path === '/api/fact-cards' && method === 'GET') {
    return handleQuiz.allCards()
  }

  // Research
  if (path === '/api/research/summary' && method === 'GET') {
    return handleQuiz.researchSummary()
  }

  // Auth — available to all users
  const oauthStartMatch = path.match(/^\/api\/auth\/(google|apple|meta)$/)
  if (oauthStartMatch && method === 'GET') {
    return handleAuth.oauthStart(env, oauthStartMatch[1])
  }
  const oauthCallbackMatch = path.match(/^\/api\/auth\/(google|apple|meta)\/callback$/)
  if (oauthCallbackMatch && method === 'GET') {
    return handleAuth.oauthCallback(env, oauthCallbackMatch[1], request)
  }
  if (path === '/api/auth/register' && method === 'POST') {
    return handleAuth.register(request, env)
  }
  if (path === '/api/auth/login' && method === 'POST') {
    return handleAuth.login(request, env)
  }
  if (path === '/api/auth/logout' && method === 'POST') {
    return handleAuth.logout(request, env)
  }
  if (path === '/api/auth/me' && method === 'GET') {
    return handleAuth.me(env, request)
  }

  // Email
  if (path === '/api/email/subscribe' && method === 'POST') {
    return handleEmail.subscribe(request, env, sessionId)
  }

  // Stripe
  const verifyMatch = path.match(/^\/api\/stripe\/verify\/([\w-]+)$/)
  if (verifyMatch && method === 'GET') {
    return handleSubscription.verify(env, verifyMatch[1], sessionId)
  }
  if (path === '/api/stripe/checkout' && method === 'GET') {
    const url = new URL(request.url)
    const plan = url.searchParams.get('plan') ?? 'annual'
    return handleSubscription.createCheckout(env, plan, sessionId, request.url)
  }

  return json({ error: 'Not Found' }, 404)
}

function getSessionId(request: Request): string {
  const cookies = request.headers.get('Cookie') ?? ''
  const match = cookies.match(/pl_session=([\w-]+)/)
  return match?.[1] ?? crypto.randomUUID()
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  }
}

function addCors(response: Response, origin: string): Response {
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', origin)
  newResponse.headers.set('Access-Control-Allow-Credentials', 'true')
  return newResponse
}

export async function getSession(env: Env, sessionId: string): Promise<Session> {
  const raw = await env.SESSIONS.get(`session:${sessionId}`)
  if (raw) {
    return JSON.parse(raw)
  }
  return {
    id: sessionId,
    isPremium: false,
    answers: [],
    emailCaptured: false,
    startedAt: new Date().toISOString(),
  }
}

export async function saveSession(env: Env, session: Session): Promise<void> {
  await env.SESSIONS.put(
    `session:${session.id}`,
    JSON.stringify(session),
    { expirationTtl: 60 * 60 * 24 * 365 }
  )
}
