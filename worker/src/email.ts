import { json, getSession, saveSession } from './index'
import type { Env } from './index'

export const handleEmail = {
  async subscribe(request: Request, env: Env, sessionId: string): Promise<Response> {
    let body: { email?: unknown; source?: unknown }
    try {
      body = await request.json() as typeof body
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }

    if (typeof body.email !== 'string' || !isValidEmail(body.email)) {
      return json({ error: 'Valid email required' }, 400)
    }

    const email = body.email.trim()
    const source = typeof body.source === 'string' && body.source.length <= 100
      ? body.source.replace(/[^a-z0-9-]/g, '')
      : undefined

    // Send to Resend
    const audienceId = env.RESEND_AUDIENCE_ID || 'default'
    if (env.RESEND_API_KEY) {
      try {
        await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            first_name: '',
            unsubscribed: false,
            ...(source ? { tags: [source] } : {}),
          }),
        })
      } catch {
        // Best-effort — email capture should not fail the request
      }
    }

    // Update session
    const session = await getSession(env, sessionId)
    const updatedSession = { ...session, emailCaptured: true }
    await saveSession(env, updatedSession)

    return json({ success: true, message: "You're in. Five surprising facts, every week." })
  },
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

// TODO(v2-digest): configure weekly digest cron
// Weekly digest template:
// Subject: "5 things you were wrong about this week (probably)"
// Content: Five emailDigestLine fields from recent fact cards
// Send: Mondays 8am GMT
