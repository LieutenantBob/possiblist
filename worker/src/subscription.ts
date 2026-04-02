import { json } from './index'
import type { Env } from './index'

export const handleSubscription = {
  async createCheckout(env: Env, plan: string, sessionId: string, requestUrl: string): Promise<Response> {
    if (plan !== 'annual' && plan !== 'monthly') {
      return json({ error: 'Invalid plan. Use "annual" or "monthly".' }, 400)
    }

    if (!env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 503)
    }

    const origin = new URL(requestUrl).origin

    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'subscription',
          'line_items[0][price]': env.STRIPE_PRICE_ANNUAL && plan === 'annual'
            ? env.STRIPE_PRICE_ANNUAL
            : env.STRIPE_PRICE_MONTHLY && plan === 'monthly'
              ? env.STRIPE_PRICE_MONTHLY
              : plan === 'monthly' ? 'possiblist-monthly' : 'possiblist-annual',
          'line_items[0][quantity]': '1',
          'client_reference_id': sessionId,
          'success_url': `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': `${origin}/subscribe`,
        }).toString(),
      })

      if (!response.ok) {
        const err = await response.json() as { error?: { message?: string } }
        return json({ error: err.error?.message ?? 'Stripe error' }, 502)
      }

      const session = await response.json() as { url: string; id: string }

      if (session.url) {
        return Response.redirect(session.url, 303)
      }

      return json({ error: 'Failed to create checkout session' }, 500)
    } catch {
      return json({ error: 'Stripe checkout failed' }, 500)
    }
  },

  async verify(env: Env, stripeSessionId: string, requestSessionId: string): Promise<Response> {
    if (!env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 503)
    }

    try {
      const response = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${stripeSessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          },
        }
      )

      if (!response.ok) {
        return json({ error: 'Invalid session' }, 400)
      }

      const stripeSession = await response.json() as {
        payment_status: string
        customer: string
        client_reference_id: string | null
      }

      if (stripeSession.payment_status !== 'paid') {
        return json({ error: 'Payment not completed' }, 402)
      }

      // Validate that the checkout was initiated by this session
      if (stripeSession.client_reference_id && stripeSession.client_reference_id !== requestSessionId) {
        return json({ error: 'Session mismatch' }, 403)
      }

      // Store premium status in KV
      await env.SESSIONS.put(
        `premium:${stripeSession.customer}`,
        JSON.stringify({ active: true, verifiedAt: new Date().toISOString() }),
        { expirationTtl: 60 * 60 * 24 * 400 }
      )

      return json(
        { success: true, message: 'Welcome, Possiblist.' },
        200,
        {
          'Set-Cookie': `pl_premium=${stripeSession.customer}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}; Secure`,
        }
      )
    } catch {
      return json({ error: 'Verification failed' }, 500)
    }
  },

  async webhook(request: Request, env: Env): Promise<Response> {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      return json({ error: 'Webhook not configured' }, 503)
    }

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return json({ error: 'Missing signature' }, 400)
    }

    const body = await request.text()

    // Verify Stripe webhook signature using HMAC-SHA256
    const isValid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET)
    if (!isValid) {
      return json({ error: 'Invalid signature' }, 401)
    }

    try {
      const event = JSON.parse(body) as {
        type: string
        data: {
          object: {
            customer: string
            status: string
          }
        }
      }

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object
          if (subscription.status === 'active') {
            await env.SESSIONS.put(
              `premium:${subscription.customer}`,
              JSON.stringify({ active: true, updatedAt: new Date().toISOString() }),
              { expirationTtl: 60 * 60 * 24 * 400 }
            )
          }
          break
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object
          await env.SESSIONS.put(
            `premium:${subscription.customer}`,
            JSON.stringify({ active: false, cancelledAt: new Date().toISOString() }),
            { expirationTtl: 60 * 60 * 24 * 30 }
          )
          break
        }
      }

      return json({ received: true })
    } catch {
      return json({ error: 'Invalid webhook payload' }, 400)
    }
  },
}

/**
 * Verify Stripe webhook signature using HMAC-SHA256.
 * Stripe signature header format: t=<timestamp>,v1=<signature>[,v1=<signature>...]
 */
async function verifyStripeSignature(
  body: string,
  signatureHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const elements = new Map<string, string[]>()
    for (const part of signatureHeader.split(',')) {
      const [key, value] = part.split('=', 2)
      if (!key || !value) continue
      const existing = elements.get(key) ?? []
      existing.push(value)
      elements.set(key, existing)
    }

    const timestamp = elements.get('t')?.[0]
    const signatures = elements.get('v1')
    if (!timestamp || !signatures?.length) return false

    // Reject timestamps older than 5 minutes to prevent replay attacks
    const timestampAge = Math.floor(Date.now() / 1000) - parseInt(timestamp, 10)
    if (isNaN(timestampAge) || timestampAge > 300 || timestampAge < -60) return false

    const payload = `${timestamp}.${body}`
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
    const expected = Array.from(new Uint8Array(mac))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return signatures.some(sig => timingSafeEqual(expected, sig))
  } catch {
    return false
  }
}

/** Constant-time string comparison to prevent timing attacks */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
