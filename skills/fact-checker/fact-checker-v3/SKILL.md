---
name: fact-checker
description: >
  Multi-agent parallel fact-checking skill for producing verified, sourced content cards
  about global statistics and common misconceptions. Use this skill whenever the user wants
  to fact-check a claim, verify a statistic, produce a "myth vs reality" content card,
  research world development data, or build content for Possiblist or any Rosling-inspired
  misconception-busting platform. Triggers on: "fact check", "verify this", "is it true
  that", "what's the real number", "misconception", "myth vs reality", "produce a fact card",
  "check the data", or any request to research global statistics on health, poverty,
  education, gender, climate, crime, or economic development. ALWAYS use this skill when
  producing content for Possiblist (possiblist.io).
---

# Fact-Checker: Parallel Multi-Agent Verification Skill

This skill orchestrates **three asynchronous verification agents** that independently
research a claim, then cross-check each other's findings before producing a final
verified Fact Card. No claim is published unless at least 2 of 3 agents agree on the data.

The Fact Card is the single source of truth for the Possiblist quiz, editorial pipeline,
paywall, share mechanic, and email digest. Every field matters.

---

## Overview: The Agent Pipeline

```
User submits claim/topic
        │
        ▼
┌───────────────────────────────────────────┐
│              ORCHESTRATOR                 │
│  Decomposes claim + assigns shareability  │
│  and premium depth scores.                │
│  Spawns 3 agents in parallel.             │
└───────┬───────────────┬───────────────────┘
        │               │               │
        ▼               ▼               ▼
  [Agent Alpha]   [Agent Beta]   [Agent Gamma]
  Primary source  Alt source     Devil's advocate
  research        research       & cross-check
        │               │               │
        └───────────────┴───────────────┘
                        │
                        ▼
             SYNTHESIS & VERDICT
             Consensus check
             Conflict resolution
                        │
                        ▼
           FULL FACT CARD OUTPUT
```

---

## Step 1: Orchestrator — Claim Decomposition

Before spawning agents, decompose the input and assign scores:

```
INPUT: Raw claim or topic

DECOMPOSE INTO:
  1. The common misconception (what do people typically believe?)
  2. The verifiable factual question (what is the actual measurable thing?)
  3. The primary metric (%, absolute number, trend, rate?)
  4. Time frame (most recent available? historical trend?)
  5. Geographic scope (global, regional, specific countries?)
  6. Likely authoritative sources (see Source Tier List)

ALSO ASSIGN:
  7. Shareability score (High / Medium / Low)
     High = emotional surprise, counter-intuitive, affects everyone
     Medium = interesting to educated readers, requires context
     Low = nuanced, valuable but harder to share in one line

  8. Premium depth potential (High / Medium / Low)
     High = rich history, multiple nuances, strong Bryson aside potential
     Medium = solid longform but one clear story
     Low = better as a short card; premium depth adds little
```

Write decomposition out before spawning agents.

---

## Step 2: Spawn Three Agents in Parallel

### Agent Alpha — Primary Source Research
- Go directly to Tier 1 sources
- Find most recent data point with a year attached
- Record: figure, year, source name, URL, dataset name, methodology note
- Note any important caveats (definition changes, measurement methodology)
- Do NOT round or editorialize — record the exact figure
- Also record: the Gapminder/Ipsos survey figure if available (`surveyResult.percentWrong`)

### Agent Beta — Alternative Source Research
- Do NOT use the same primary source as Alpha
- Prefer Tier 1; Tier 2 acceptable if needed
- If figures broadly agree (within 10%): record as corroborating
- If figures diverge (>20%): flag as CONFLICT
- Also hunt for: the `brysonAside` — the most surprising specific sub-statistic,
  more astonishing than the headline figure, goes in the premium article section

### Agent Gamma — Devil's Advocate & Cross-Check
- Actively try to disprove or complicate the claim
- Look for: counter-evidence, regional exceptions, trend reversals, data quality issues
- Check: has this been misused or misquoted in media before?
- Produce: a one-sentence `nuance` — honest, important, full visual weight on reveal page
- Produce: one-sentence `b2bClassroomNote` if applicable

---

## Step 3: Synthesis & Verdict

```
IF Alpha and Beta agree within 10%:   → VERIFIED ✓
IF Alpha and Beta diverge 10–30%:    → PARTIALLY VERIFIED ⚠️
IF diverge >30% OR Gamma finds serious counter-evidence: → CONTESTED ❌
```

Conflict resolution: prefer more recent data → larger sample → better-documented
methodology → present range honestly as PARTIALLY VERIFIED.

---

## Step 4: Output — The Full Fact Card (JSON)

Output must be valid JSON matching this schema exactly. Every field required.
The `possiblist-voice` skill and the build prompt both depend on this structure.

```json
{
  "slug": "[topic-kebab-case]",
  "category": "[poverty|health|education|gender|climate|safety|population|technology]",
  "status": "verified|partially-verified|contested",
  "confidence": "high|medium|low",
  "lastVerified": "[YYYY-MM]",
  "shareabilityScore": "high|medium|low",
  "premiumDepthScore": "high|medium|low",

  "quiz": {
    "question": "[Direct, no preamble. The exact question shown on the quiz card.]",
    "options": [
      "[Wrong — most common misconception]",
      "[Wrong — second most common]",
      "[Correct answer]",
      "[Wrong — plausible distractor]"
    ],
    "correctIndex": 2,
    "surveyResult": {
      "percentWrong": 74,
      "mostCommonWrongAnswer": "[text of wrong option]",
      "source": "Gapminder/Ipsos survey, [year]",
      "surveyNote": null
    }
  },

  "headline": "[Clickworthy, max 12 words. The surprising truth framed compellingly.]",
  "metaDescription": "[150–160 chars. Key figure + surprise. For SEO and OG tags.]",

  "summary": "[100-word hook in Possiblist voice. Free content. Compelling enough to make the reader want the full article. Does NOT give away the full story — it is the hook, not the paywall preview.]",

  "freePreviewWordCount": 300,

  "reality": {
    "figure": "[Key number formatted for display — e.g. '~10%' or '37 per 1,000']",
    "year": 2024,
    "trend": "declining|rising|stable|mixed",
    "trendLabel": "[Short chart label — e.g. '36% → 10% since 1990']",
    "chartType": "line|bar|area",
    "chartData": [
      { "year": 1990, "value": 36 },
      { "year": 2000, "value": 28 },
      { "year": 2010, "value": 16 },
      { "year": 2024, "value": 10 }
    ]
  },

  "nuance": "[1–2 sentences. The Gamma complication. Displayed at full visual weight on the reveal page — never a footnote.]",

  "brysonAside": "[The single most surprising sub-statistic. More astonishing than the headline. Goes in the premium article section. Bryson would say 'I had to read that three times.']",

  "sources": [
    {
      "name": "[Source name]",
      "url": "[URL]",
      "tier": 1,
      "datasetName": "[Specific dataset or indicator]",
      "accessedYear": 2026
    }
  ],

  "editorialSlug": "[same as slug]",

  "shareText": {
    "wrong": "I just found out I was wrong about [topic] — and I was in good company. [X]% of people get this wrong. possiblist.io/q/[slug]",
    "correct": "I actually got one right on Possiblist — [topic]. I'm still wrong about most things. Are you? possiblist.io/q/[slug]",
    "score": null
  },

  "emailDigestLine": "[20–30 words. Possiblist voice. Does NOT spoil the quiz answer. For weekly digest. Creates curiosity without revealing the direction.]",

  "premiumTeaser": "[2–3 sentences shown to free users at the paywall fold. Reveals a secondary surprise but withholds the resolution. Must create genuine desire to become a Possiblist.]",

  "b2bClassroomNote": "[1–2 sentences for educator site-licence feature. Suggests classroom discussion or curriculum connection. Null if not applicable.]",

  "publishingRecommendation": "PUBLISH AS-IS|PUBLISH WITH CAVEAT|DO NOT PUBLISH — REFRAME|NEEDS MORE RESEARCH",
  "publishingNote": "[Brief explanation of the recommendation]"
}
```

---

## Source Tier List

Full annotated list with API endpoints: see `references/sources.md`

### Tier 1 — Ground Truth
- **Our World in Data** — ourworldindata.org
- **World Bank Open Data** — data.worldbank.org
- **Gapminder** — gapminder.org/data + ignorance survey data
- **WHO Global Health Observatory** — who.int/data/gho
- **UN Statistics Division** — unstats.un.org
- **UNICEF Data** — data.unicef.org
- **IEA** — iea.org (energy data)
- **Global Carbon Project** — globalcarbonproject.org

### Tier 2 — Reliable Secondary
- **Pew Research Center** — public opinion, demographics
- **Lancet / NEJM / IHME GBD** — health statistics
- **IMF World Economic Outlook** — economic data
- **OECD Data** — developed country comparisons
- **WWF Living Planet Index** — biodiversity, wildlife
- **Gapminder AI Worldview Benchmark** — for card wa-21 (AI misconceptions)
  URL: gapminder.org/ai/worldview_benchmark/
  Dataset: github.com/open-numbers/ddf--gapminder--ai_worldview_benchmark (CC-BY)

### Tier 3 — Use with Caution
- News articles, Wikipedia, government national statistics
- Always trace back to Tier 1 or Tier 2 primary

### ❌ Never Use
- Social media, undated statistics, sources without methodology

---

## Priority Topic Queue

**Launch set — generate first:**
1. `extreme-poverty-declining`
2. `child-mortality-falling`
3. `life-expectancy-soaring`
4. `girls-education-advancing`
5. `nuclear-safety-vs-coal`

**Weeks 2–5 post-launch:**
6. `vaccination-coverage-global`
7. `renewable-energy-rising`
8. `where-most-people-live`
9. `terrorism-deaths-peaked`
10. `teen-birth-rates-falling`
11. `global-literacy-miracle`
12. `air-travel-safety`
13. `maternal-mortality-falling`
14. `middle-class-explosion`
15. `wildlife-decline` *(bad-news card — essential for credibility)*
16. `solar-cost-collapse`
17. `women-leading-countries`
18. `violence-long-run-decline`
19. `global-hunger-trend`
20. `ozone-layer-recovering`

**Card 21 — Original research (special handling):**
`ai-worldview-misconceptions`
- This card is based on Possiblist's own AI Worldview Benchmark research
- Run the benchmark first: `wrong-again-research/scripts/run-benchmark.js --models=all`
- Score results: `wrong-again-research/scripts/score-results.js`
- Feed `results/findings.md` into this skill as the Fact Card input
- Agent Alpha = Gapminder's published benchmark (Tier 2)
- Agent Beta = Possiblist's own benchmark results (primary research, Tier 1 for our purposes)
- Agent Gamma = Devil's advocate: note that models tested are older generation; framing
  sensitivity finding is the key insight, not just the correct-rate comparison
- Credit in article: Ola Rosling, Guohua Zheng, Fredrik Wollsén (Gapminder methodology)
- The quiz question: "Do AI chatbots share humanity's systematic misconceptions
  about the world?" — answer: "Yes, but in a fundamentally different way"

Full topic details with misconception framing, metrics, and sources:
see `references/topic-packs.md`

---

## Speed Mode

For rapid bulk production (human review required before publish):
1. Run Alpha and Beta only (skip Gamma)
2. If agree within 15%: mark `status: "fast-verified"` — NOT publishable as-is
3. Queue Gamma before final publish
4. Leave `nuance`, `brysonAside`, `premiumTeaser` as `null` until full verification

Never deploy a fast-verified card to production.

---

## Quality Gates

**Data quality**
- [ ] At least 2 independent sources found
- [ ] Both sources Tier 1 or Tier 2
- [ ] Data from 2015 or later (unless explicitly historical)
- [ ] Key figure includes year
- [ ] `chartData` has at least 3 data points

**Possiblist monetisation readiness**
- [ ] `headline` ≤12 words, immediately clickworthy
- [ ] `metaDescription` 150–160 chars, contains key figure
- [ ] `summary` is a hook, does not give away the full story
- [ ] `emailDigestLine` does not spoil quiz answer
- [ ] `premiumTeaser` creates genuine desire to become a Possiblist
- [ ] `shareText.wrong` and `shareText.correct` reference possiblist.io
- [ ] `brysonAside` is more surprising than the headline figure

**Integrity**
- [ ] Gamma nuance present, non-trivial, proportionate
- [ ] `publishingRecommendation` explicit with note
- [ ] `surveyResult.percentWrong` cited or estimated with source

---

## Reference Files

- `references/sources.md` — Annotated sources with API endpoints
- `references/topic-packs.md` — All 60 topics including priority 21
- `references/misconception-surveys.md` — Gapminder/Ipsos survey data
- `scripts/fetch_owid.py` — Our World in Data + World Bank data fetcher
