import { json, getSession, saveSession } from './index'
import type { Env } from './index'

export const handleEmail = {
  async subscribe(request: Request, env: Env, sessionId: string): Promise<Response> {
    const body = await request.json() as { email: string; source?: string }

    if (!body.email || !isValidEmail(body.email)) {
      return json({ error: 'Valid email required' }, 400)
    }

    // Send to Resend
    if (env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/audiences/default/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: body.email,
            first_name: '',
            unsubscribed: false,
            // Tag with source slug for segmentation
            ...(body.source ? { tags: [body.source] } : {}),
          }),
        })
      } catch {
        // Log but don't fail — email capture is best-effort
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// TODO: configure weekly digest cron in v2
// Weekly digest template:
// Subject: "5 things you were wrong about this week (probably)"
// Content: Five emailDigestLine fields from recent fact cards
// Send: Mondays 8am GMT
