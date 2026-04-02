import { json, getSession, saveSession } from './index'
import type { Env } from './index'

const PRICES = {
  annual: 'possiblist-annual',   // £39/year
  monthly: 'possiblist-monthly', // £4.99/month
}

export const handleSubscription = {
  async createCheckout(env: Env, plan: string, requestUrl: string): Promise<Response> {
    const priceId = plan === 'monthly' ? PRICES.monthly : PRICES.annual
    const origin = new URL(requestUrl).origin

    if (!env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 503)
    }

    try {
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'subscription',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
          'success_url': `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
          'cancel_url': `${origin}/subscribe`,
        }).toString(),
      })

      const session = await response.json() as { url: string; id: string }

      if (session.url) {
        return Response.redirect(session.url, 303)
      }

      return json({ error: 'Failed to create checkout session' }, 500)
    } catch {
      return json({ error: 'Stripe checkout failed' }, 500)
    }
  },

  async verify(env: Env, stripeSessionId: string): Promise<Response> {
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

      const stripeSession = await response.json() as {
        payment_status: string
        customer: string
        client_reference_id?: string
      }

      if (stripeSession.payment_status !== 'paid') {
        return json({ error: 'Payment not completed' }, 402)
      }

      // Store premium status in KV
      await env.SESSIONS.put(
        `premium:${stripeSession.customer}`,
        JSON.stringify({ active: true, verifiedAt: new Date().toISOString() }),
        { expirationTtl: 60 * 60 * 24 * 400 } // ~13 months
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

    // In production, verify the webhook signature using Stripe's library.
    // For v1, we process the event body directly with basic validation.
    try {
      const body = await request.text()
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
            { expirationTtl: 60 * 60 * 24 * 30 } // Keep for 30 days
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
