import type { Env } from './index'

/**
 * Scheduled cron handlers for Possiblist automation loops.
 *
 * Configured in wrangler.toml:
 *   [triggers]
 *   crons = ["0 0 * * 0", "0 8 * * 1", "0 0 1 * *", "0 0 1 1,4,7,10 *"]
 *
 * - Weekly (Sunday midnight): content performance aggregation
 * - Weekly (Monday 8am): social asset generation + newsletter
 * - Monthly (1st): voice calibration report + fact freshness check
 * - Quarterly (1st of Jan/Apr/Jul/Oct): research refresh alert
 */

export async function handleScheduled(event: ScheduledEvent, env: Env): Promise<void> {
  const hour = new Date(event.scheduledTime).getUTCHours()
  const day = new Date(event.scheduledTime).getUTCDay()
  const date = new Date(event.scheduledTime).getUTCDate()
  const month = new Date(event.scheduledTime).getUTCMonth()

  // Sunday midnight — content performance
  if (day === 0 && hour === 0) {
    await aggregateContentPerformance(env)
  }

  // Monday 8am — social assets + newsletter digest
  if (day === 1 && hour === 8) {
    await generateSocialAssets(env)
  }

  // 1st of month — voice calibration + freshness check
  if (date === 1 && hour === 0) {
    await checkFactFreshness(env)
    await generateVoiceReport(env)
  }

  // Quarterly — research refresh alert
  if (date === 1 && [0, 3, 6, 9].includes(month) && hour === 0) {
    await alertResearchRefresh(env)
  }
}

// --- Loop 1: Content Performance (weekly) ---

interface CardPerformance {
  slug: string
  answeredCount: number
  wrongRate: number
  shareRate: number
  articleOpenRate: number
}

async function aggregateContentPerformance(env: Env): Promise<void> {
  // Scan all sessions from the past week and aggregate
  // In v1, we store a running tally per card in KV
  const keys = await env.SESSIONS.list({ prefix: 'perf:card:' })
  const performances: CardPerformance[] = []

  for (const key of keys.keys) {
    const raw = await env.SESSIONS.get(key.name)
    if (raw) {
      performances.push(JSON.parse(raw))
    }
  }

  if (performances.length === 0) return

  // Find insights
  const sorted = [...performances]
  const topShared = sorted.sort((a, b) => b.shareRate - a.shareRate)[0]
  const underperforming = sorted.sort((a, b) => a.articleOpenRate - b.articleOpenRate)[0]
  const easiest = sorted.sort((a, b) => a.wrongRate - b.wrongRate)[0]
  const hardest = sorted.sort((a, b) => b.wrongRate - a.wrongRate)[0]

  const report = {
    week: new Date().toISOString().split('T')[0],
    totalCards: performances.length,
    topShared: topShared?.slug,
    underperforming: underperforming?.slug,
    easiest: { slug: easiest?.slug, wrongRate: easiest?.wrongRate },
    hardest: { slug: hardest?.slug, wrongRate: hardest?.wrongRate },
    performances,
  }

  await env.SESSIONS.put(
    `report:weekly:${report.week}`,
    JSON.stringify(report),
    { expirationTtl: 60 * 60 * 24 * 90 } // 90 days
  )

  // Send report via Resend if configured
  if (env.RESEND_API_KEY) {
    await sendReport(env, 'Weekly Content Performance', report)
  }
}

// --- Loop 2: Social Asset Generation (weekly) ---

interface SocialAssets {
  slug: string
  twitter_quiz: string
  twitter_aside: string
  linkedin: string
  newsletter_line: string
}

async function generateSocialAssets(env: Env): Promise<void> {
  // Get the card scheduled for this week's social push
  // Rotate through cards: week number mod total cards
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const cardSlugs = await getCardSlugs(env)
  const slugIndex = weekNum % cardSlugs.length
  const slug = cardSlugs[slugIndex]

  // Read card data
  const cardRaw = await env.SESSIONS.get(`card:${slug}`)
  if (!cardRaw) return

  const card = JSON.parse(cardRaw) as {
    slug: string
    headline: string
    quiz: { question: string; surveyResult: { percentWrong: number; source: string } }
    brysonAside: string
    summary: string
    emailDigestLine: string
    reality: { figure: string; trendLabel: string }
  }

  const assets: SocialAssets = {
    slug: card.slug,

    twitter_quiz: `${card.quiz.surveyResult.percentWrong}% of people get this wrong:\n\n"${card.quiz.question}"\n\nAre you in the majority, or one of the few?\npossiblist.io/q/${card.slug}`,

    twitter_aside: `${card.brysonAside}\n\n— from Possiblist°\npossiblist.io/q/${card.slug}`,

    linkedin: `${card.headline}\n\n${card.summary.slice(0, 280)}...\n\nThe data: ${card.reality.figure} (${card.reality.trendLabel})\n\n${card.quiz.surveyResult.percentWrong}% of people surveyed got this wrong (${card.quiz.surveyResult.source}).\n\nTake the quiz: possiblist.io/q/${card.slug}\n\n#possiblist #factfulness #data`,

    newsletter_line: card.emailDigestLine,
  }

  await env.SESSIONS.put(
    `social:${new Date().toISOString().split('T')[0]}`,
    JSON.stringify(assets),
    { expirationTtl: 60 * 60 * 24 * 30 }
  )
}

// --- Loop 3: Fact Freshness Check (monthly) ---

interface FreshnessAlert {
  slug: string
  lastVerified: string
  monthsStale: number
  severity: 'warning' | 'stale'
}

async function checkFactFreshness(env: Env): Promise<void> {
  const cardSlugs = await getCardSlugs(env)
  const alerts: FreshnessAlert[] = []
  const now = new Date()

  for (const slug of cardSlugs) {
    const raw = await env.SESSIONS.get(`card:${slug}`)
    if (!raw) continue

    const card = JSON.parse(raw) as { slug: string; lastVerified: string }
    const verified = new Date(card.lastVerified + '-01') // "2026-04" → Date
    const monthsAgo = (now.getFullYear() - verified.getFullYear()) * 12 +
      (now.getMonth() - verified.getMonth())

    if (monthsAgo >= 12) {
      alerts.push({ slug, lastVerified: card.lastVerified, monthsStale: monthsAgo, severity: 'stale' })
    } else if (monthsAgo >= 6) {
      alerts.push({ slug, lastVerified: card.lastVerified, monthsStale: monthsAgo, severity: 'warning' })
    }
  }

  if (alerts.length > 0) {
    await env.SESSIONS.put(
      `freshness:${now.toISOString().split('T')[0]}`,
      JSON.stringify(alerts),
      { expirationTtl: 60 * 60 * 24 * 60 }
    )

    if (env.RESEND_API_KEY) {
      await sendReport(env, `Fact Freshness: ${alerts.length} cards need attention`, { alerts })
    }
  }
}

// --- Loop 4: Voice Calibration Report (monthly) ---

async function generateVoiceReport(env: Env): Promise<void> {
  // Correlate share rates with card metadata to find what voice patterns work best
  const keys = await env.SESSIONS.list({ prefix: 'perf:card:' })
  const data: Array<{ slug: string; shareRate: number; wrongRate: number }> = []

  for (const key of keys.keys) {
    const raw = await env.SESSIONS.get(key.name)
    if (raw) {
      const perf = JSON.parse(raw) as CardPerformance
      data.push({ slug: perf.slug, shareRate: perf.shareRate, wrongRate: perf.wrongRate })
    }
  }

  if (data.length === 0) return

  const sorted = [...data].sort((a, b) => b.shareRate - a.shareRate)
  const report = {
    month: new Date().toISOString().slice(0, 7),
    topSharers: sorted.slice(0, 5).map(d => d.slug),
    lowSharers: sorted.slice(-3).map(d => d.slug),
    avgShareRate: data.reduce((s, d) => s + d.shareRate, 0) / data.length,
  }

  await env.SESSIONS.put(
    `report:voice:${report.month}`,
    JSON.stringify(report),
    { expirationTtl: 60 * 60 * 24 * 365 }
  )
}

// --- Loop 5: Research Refresh Alert (quarterly) ---

async function alertResearchRefresh(env: Env): Promise<void> {
  if (env.RESEND_API_KEY) {
    await sendReport(env, 'Quarterly: Re-run AI Worldview Benchmark', {
      action: 'Run research/scripts/run-benchmark.js --models=all',
      reason: 'Quarterly benchmark refresh due',
      quarter: `Q${Math.floor(new Date().getMonth() / 3) + 1} ${new Date().getFullYear()}`,
    })
  }
}

// --- Helpers ---

async function getCardSlugs(env: Env): Promise<string[]> {
  // Hardcoded for v1 — in v2, read from D1 or KV index
  return [
    'extreme-poverty-declining', 'child-mortality-falling', 'life-expectancy-soaring',
    'girls-education-advancing', 'nuclear-safety-vs-coal', 'vaccination-coverage-global',
    'renewable-energy-rising', 'where-most-people-live', 'terrorism-deaths-peaked',
    'teen-birth-rates-falling', 'global-literacy-miracle', 'air-travel-safety',
    'maternal-mortality-falling', 'middle-class-explosion', 'wildlife-decline',
    'solar-cost-collapse', 'women-leading-countries', 'violence-long-run-decline',
    'global-hunger-trend', 'ozone-layer-recovering', 'ai-worldview-misconceptions',
  ]
}

async function sendReport(env: Env, subject: string, data: unknown): Promise<void> {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Possiblist Automation <auto@possiblist.io>',
        to: 'team@possiblist.io',
        subject: `[Possiblist] ${subject}`,
        text: JSON.stringify(data, null, 2),
      }),
    })
  } catch {
    // Best-effort — don't fail the cron
  }
}
