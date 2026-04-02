export interface Env {
  SESSIONS: KVNamespace
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  RESEND_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers for API routes
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      })
    }

    try {
      // API routing
      if (path.startsWith('/api/')) {
        const response = await handleAPI(path, request, env)
        return addCors(response)
      }

      return new Response('Not Found', { status: 404 })
    } catch (error) {
      console.error('Worker error:', error)
      return addCors(
        new Response(
          JSON.stringify({ error: 'Something has gone wrong. This is unusual.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      )
    }
  },
}

async function handleAPI(path: string, request: Request, env: Env): Promise<Response> {
  // Quiz endpoints
  if (path === '/api/quiz/next' && request.method === 'GET') {
    return json({ message: 'Quiz next endpoint' })
  }
  if (path.match(/^\/api\/quiz\/[\w-]+$/) && request.method === 'GET') {
    return json({ message: 'Quiz card endpoint' })
  }
  if (path.match(/^\/api\/quiz\/[\w-]+\/answer$/) && request.method === 'POST') {
    return json({ message: 'Answer endpoint' })
  }

  // Score
  if (path === '/api/score' && request.method === 'GET') {
    return json({ message: 'Score endpoint' })
  }

  // Articles
  if (path.match(/^\/api\/articles\/[\w-]+$/) && request.method === 'GET') {
    return json({ message: 'Article endpoint' })
  }

  // Fact cards
  if (path === '/api/fact-cards' && request.method === 'GET') {
    return json({ message: 'Fact cards endpoint' })
  }

  // Research
  if (path === '/api/research/summary' && request.method === 'GET') {
    return json({ message: 'Research summary endpoint' })
  }

  // Email
  if (path === '/api/email/subscribe' && request.method === 'POST') {
    return json({ message: 'Email subscribe endpoint' })
  }

  // Stripe
  if (path === '/api/stripe/webhook' && request.method === 'POST') {
    return json({ message: 'Stripe webhook endpoint' })
  }
  if (path.match(/^\/api\/stripe\/verify\/[\w-]+$/) && request.method === 'GET') {
    return json({ message: 'Stripe verify endpoint' })
  }

  return new Response('Not Found', { status: 404 })
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function addCors(response: Response): Response {
  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', '*')
  return newResponse
}
