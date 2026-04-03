import { Google, Apple, Facebook } from 'arctic'
import { json } from './index'
import type { Env } from './index'

// --- Types ---

interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  provider: 'google' | 'apple' | 'meta' | 'email'
  isPremium: boolean
  createdAt: string
}

interface AuthSession {
  userId: string
  createdAt: string
  expiresAt: string
}

// --- OAuth Providers ---

function getGoogle(env: Env) {
  return new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${env.ALLOWED_ORIGIN}/api/auth/google/callback`)
}

function getApple(env: Env) {
  // Apple requires: clientId, teamId, keyId, pkcs8PrivateKey, redirectURI
  return new Apple(
    env.APPLE_CLIENT_ID,
    env.APPLE_TEAM_ID ?? '',
    env.APPLE_KEY_ID ?? '',
    new TextEncoder().encode(env.APPLE_CLIENT_SECRET),
    `${env.ALLOWED_ORIGIN}/api/auth/apple/callback`
  )
}

function getFacebook(env: Env) {
  return new Facebook(env.META_CLIENT_ID, env.META_CLIENT_SECRET, `${env.ALLOWED_ORIGIN}/api/auth/meta/callback`)
}

// --- Session Helpers ---

async function createAuthSession(env: Env, userId: string): Promise<string> {
  const token = crypto.randomUUID()
  const session: AuthSession = {
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  }
  await env.SESSIONS.put(`auth:${token}`, JSON.stringify(session), {
    expirationTtl: 365 * 24 * 60 * 60,
  })
  return token
}

export async function getAuthUser(env: Env, request: Request): Promise<User | null> {
  const cookies = request.headers.get('Cookie') ?? ''
  const match = cookies.match(/pl_auth=([\w-]+)/)
  if (!match) return null

  const raw = await env.SESSIONS.get(`auth:${match[1]}`)
  if (!raw) return null

  const session: AuthSession = JSON.parse(raw)
  if (new Date(session.expiresAt) < new Date()) return null

  const userRaw = await env.SESSIONS.get(`user:${session.userId}`)
  if (!userRaw) return null

  return JSON.parse(userRaw)
}

function authCookie(token: string): string {
  return `pl_auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${365 * 24 * 60 * 60}; Secure`
}

function clearAuthCookie(): string {
  return 'pl_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure'
}

// --- Password Hashing (Web Crypto PBKDF2) ---

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256
  )
  const hash = new Uint8Array(bits)
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
  const hashHex = Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${saltHex}:${hashHex}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key,
    256
  )
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === hashHex
}

// --- User Storage (KV-based for v1, migrate to D1 in v2) ---

async function findUserByEmail(env: Env, email: string): Promise<User | null> {
  const userId = await env.SESSIONS.get(`email:${email.toLowerCase()}`)
  if (!userId) return null
  const raw = await env.SESSIONS.get(`user:${userId}`)
  return raw ? JSON.parse(raw) : null
}

async function findUserByProvider(env: Env, provider: string, providerId: string): Promise<User | null> {
  const userId = await env.SESSIONS.get(`oauth:${provider}:${providerId}`)
  if (!userId) return null
  const raw = await env.SESSIONS.get(`user:${userId}`)
  return raw ? JSON.parse(raw) : null
}

async function createUser(env: Env, data: {
  email: string
  name: string
  avatar?: string | null
  provider: User['provider']
  providerId?: string
  passwordHash?: string
}): Promise<User> {
  const id = crypto.randomUUID()
  const user: User = {
    id,
    email: data.email.toLowerCase(),
    name: data.name,
    avatar: data.avatar ?? null,
    provider: data.provider,
    isPremium: false,
    createdAt: new Date().toISOString(),
  }

  const ttl = 365 * 24 * 60 * 60 * 5 // 5 years

  await Promise.all([
    env.SESSIONS.put(`user:${id}`, JSON.stringify(user), { expirationTtl: ttl }),
    env.SESSIONS.put(`email:${data.email.toLowerCase()}`, id, { expirationTtl: ttl }),
    ...(data.providerId
      ? [env.SESSIONS.put(`oauth:${data.provider}:${data.providerId}`, id, { expirationTtl: ttl })]
      : []),
    ...(data.passwordHash
      ? [env.SESSIONS.put(`password:${id}`, data.passwordHash, { expirationTtl: ttl })]
      : []),
  ])

  return user
}

// --- Route Handlers ---

export const handleAuth = {
  // --- OAuth: Start ---
  async oauthStart(env: Env, provider: string): Promise<Response> {
    const state = crypto.randomUUID()
    let url: URL

    try {
      switch (provider) {
        case 'google': {
          const google = getGoogle(env)
          const scopes = ['openid', 'email', 'profile']
          url = google.createAuthorizationURL(state, 'code_verifier', scopes)
          break
        }
        case 'apple': {
          const apple = getApple(env)
          const scopes = ['name', 'email']
          url = apple.createAuthorizationURL(state, scopes)
          break
        }
        case 'meta': {
          const fb = getFacebook(env)
          const scopes = ['email', 'public_profile']
          url = fb.createAuthorizationURL(state, scopes)
          break
        }
        default:
          return json({ error: 'Unknown provider' }, 400)
      }
    } catch {
      return json({ error: `${provider} auth not configured` }, 503)
    }

    // Store state for CSRF verification
    await env.SESSIONS.put(`oauth_state:${state}`, provider, { expirationTtl: 600 })

    return Response.redirect(url.toString(), 302)
  },

  // --- OAuth: Callback ---
  async oauthCallback(env: Env, provider: string, request: Request): Promise<Response> {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (!code || !state) {
      return redirectWithError(env, 'Missing authorization code')
    }

    // Verify state
    const storedProvider = await env.SESSIONS.get(`oauth_state:${state}`)
    if (storedProvider !== provider) {
      return redirectWithError(env, 'Invalid state parameter')
    }
    await env.SESSIONS.delete(`oauth_state:${state}`)

    let email = ''
    let name = ''
    let avatar: string | null = null
    let providerId = ''

    try {
      switch (provider) {
        case 'google': {
          const google = getGoogle(env)
          const tokens = await google.validateAuthorizationCode(code, 'code_verifier')
          const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.accessToken()}` },
          })
          const profile = await res.json() as { id: string; email: string; name: string; picture: string }
          email = profile.email
          name = profile.name
          avatar = profile.picture
          providerId = profile.id
          break
        }
        case 'apple': {
          const apple = getApple(env)
          const tokens = await apple.validateAuthorizationCode(code)
          // Apple returns user info in the ID token
          const claims = decodeJwtPayload(tokens.idToken())
          email = (claims as { email?: string }).email ?? ''
          name = (claims as { name?: string }).name ?? email.split('@')[0]
          providerId = (claims as { sub: string }).sub
          break
        }
        case 'meta': {
          const fb = getFacebook(env)
          const tokens = await fb.validateAuthorizationCode(code)
          const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.accessToken()}`)
          const profile = await res.json() as { id: string; email?: string; name: string; picture?: { data?: { url?: string } } }
          email = profile.email ?? ''
          name = profile.name
          avatar = profile.picture?.data?.url ?? null
          providerId = profile.id
          break
        }
      }
    } catch {
      return redirectWithError(env, 'Authentication failed')
    }

    if (!email) {
      return redirectWithError(env, 'Email not provided by provider')
    }

    // Find or create user
    let user = await findUserByProvider(env, provider, providerId)
    if (!user) {
      user = await findUserByEmail(env, email)
      if (user) {
        // Link OAuth to existing email account
        await env.SESSIONS.put(`oauth:${provider}:${providerId}`, user.id, {
          expirationTtl: 365 * 24 * 60 * 60 * 5,
        })
      } else {
        user = await createUser(env, {
          email,
          name,
          avatar,
          provider: provider as User['provider'],
          providerId,
        })
      }
    }

    const token = await createAuthSession(env, user.id)
    const origin = env.ALLOWED_ORIGIN || 'https://possiblist.io'

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${origin}/my-possiblist`,
        'Set-Cookie': authCookie(token),
      },
    })
  },

  // --- Email: Register ---
  async register(request: Request, env: Env): Promise<Response> {
    let body: { email?: string; password?: string; name?: string }
    try {
      body = await request.json() as typeof body
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    if (!body.email || !body.password) {
      return json({ error: 'Email and password required' }, 400)
    }
    if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return json({ error: 'Valid email required' }, 400)
    }
    if (typeof body.password !== 'string' || body.password.length < 8) {
      return json({ error: 'Password must be at least 8 characters' }, 400)
    }

    const existing = await findUserByEmail(env, body.email)
    if (existing) {
      return json({ error: 'An account with this email already exists' }, 409)
    }

    const passwordHash = await hashPassword(body.password)
    const user = await createUser(env, {
      email: body.email,
      name: body.name ?? body.email.split('@')[0],
      provider: 'email',
      passwordHash,
    })

    const token = await createAuthSession(env, user.id)

    return json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      201,
      { 'Set-Cookie': authCookie(token) }
    )
  },

  // --- Email: Login ---
  async login(request: Request, env: Env): Promise<Response> {
    let body: { email?: string; password?: string }
    try {
      body = await request.json() as typeof body
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    if (!body.email || !body.password) {
      return json({ error: 'Email and password required' }, 400)
    }

    const user = await findUserByEmail(env, body.email)
    if (!user) {
      return json({ error: 'Invalid email or password' }, 401)
    }

    const storedHash = await env.SESSIONS.get(`password:${user.id}`)
    if (!storedHash) {
      return json({ error: `This account uses ${user.provider} sign-in` }, 401)
    }

    const valid = await verifyPassword(body.password as string, storedHash)
    if (!valid) {
      return json({ error: 'Invalid email or password' }, 401)
    }

    const token = await createAuthSession(env, user.id)

    return json(
      { success: true, user: { id: user.id, email: user.email, name: user.name } },
      200,
      { 'Set-Cookie': authCookie(token) }
    )
  },

  // --- Logout ---
  async logout(request: Request, env: Env): Promise<Response> {
    const cookies = request.headers.get('Cookie') ?? ''
    const match = cookies.match(/pl_auth=([\w-]+)/)
    if (match) {
      await env.SESSIONS.delete(`auth:${match[1]}`)
    }

    return json(
      { success: true },
      200,
      { 'Set-Cookie': clearAuthCookie() }
    )
  },

  // --- Get Current User ---
  async me(env: Env, request: Request): Promise<Response> {
    const user = await getAuthUser(env, request)
    if (!user) {
      return json({ authenticated: false }, 200)
    }

    return json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      },
    })
  },
}

// --- Helpers ---

function redirectWithError(env: Env, message: string): Response {
  const origin = env.ALLOWED_ORIGIN || 'https://possiblist.io'
  return Response.redirect(`${origin}/login?error=${encodeURIComponent(message)}`, 302)
}

function decodeJwtPayload(token: string): unknown {
  const parts = token.split('.')
  if (parts.length !== 3) return {}
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(payload))
}
