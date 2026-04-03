# Possiblist° — Roadmap

## Phase 1 (v1) — Shipped
- 21 fact cards with full quiz, reveal, editorial pipeline
- User accounts (Google/Apple/Meta/email OAuth)
- Possiblist Score (shareable percentage)
- "Where This Number Moves" action cards (Learn/Fund/Act)
- Charity routing with direct links
- Stripe subscriptions (£39/yr, £4.99/mo)
- AI Worldview Benchmark (original research)
- Fathom analytics with funnel events
- Cloudflare Pages + Worker deployment

## Phase 2 — The Movement

### Possiblist Forum
- Moderated discussion under each article (not Reddit — Letters to the Editor tone)
- Threaded replies, upvoting on insight not agreement
- Premium members can post; free users can read
- Moderation standards match the Possiblist voice: evidence-based, warm, never smug
- Flag system: "This needs a source" rather than "report"

### Adaptive Quiz + Spaced Repetition
- ML-ordered questions based on user's weakest categories
- Spaced repetition for revisiting previous wrong answers
- "You got this wrong 3 months ago — has the data changed your mind?"

### Automated Weekly Digest
- Cron-triggered email via Resend
- "5 things you were wrong about this week (probably)"
- Mondays 8am GMT, personalised to user's quiz history

### Monthly Impact Letter
- Aggregate impact of Possiblist members
- "This month, 2,400 Possiblist members read about child mortality.
  340 donated to the organisations listed."

### Possiblist Badge
- Shareable identity marker with personal stats
- "I am a Possiblist. I have been wrong about 14 things this year
  and have done something about 3 of them."

### Migrate to D1
- User storage from KV to Cloudflare D1 (SQLite)
- Answer history, action tracking, forum posts

### B2B / Classroom Mode
- Institutional licensing with team management
- Teacher dashboard: aggregate student misconceptions
- Custom question sets, exportable reports

### Content Expansion
- Multilingual content (Spanish, French, German)
- Guest editorial contributions
- Downloadable fact card PDFs

## Phase 3 — Collective Voice

### Possiblist Positions
- Evidence-based position statements drafted collaboratively by members
- "1,200 Possiblist members believe, based on [these data sources], that [position]"
- Not petitions. Data-backed positions with full citations.
- Curated by editorial team, voted on by members
- Delivered collectively to relevant decision-makers

### The Possiblist Index
- Annual publication: "The State of Being Wrong"
- Which misconceptions improved this year? Which got worse?
- Compare AI vs human accuracy over time
- Becomes a citeable reference for media and policy

### Political Engagement
- Evidence-based voter guides: "What does the data say about [policy]?"
- Not partisan — factual. Possiblist doesn't tell you what to vote for,
  it tells you what the numbers say about what you're voting on.
- Collective letters to representatives, backed by data and member count

### Possiblist Chapters
- Local groups: "Possiblist London", "Possiblist Berlin"
- Monthly meetups: one quiz, one article discussion, one action
- Not activism — intellectual community with practical output

### Mobile App
- React Native, push notifications for new cards
- Offline mode for completed quizzes

### Admin CMS
- Content management, editorial workflow, bulk operations

### Enhanced Analytics
- A/B testing for quiz ordering
- Conversion funnel optimization
- Shareability tracking per card

### Search
- Full-text search across fact cards and editorials
- Category filtering, tag-based discovery
