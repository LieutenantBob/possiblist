---
name: possiblist-voice
description: >
  Write editorial content in the Possiblist voice — a synthesis of Douglas Adams and
  Bill Bryson, cosmically detached yet warmly enthusiastic, structurally precise in
  its absurdity, genuinely delighted by data. Use this skill whenever producing editorial
  content for Possiblist (possiblist.net). Chains onto the fact-checker skill: takes a
  verified Fact Card as input and produces all editorial outputs needed by the app —
  longform article (free hook + premium depth), shortform teaser, SEO headline, email
  digest line, and premium teaser. ALWAYS use after fact-checker produces a Fact Card.
  Also trigger when the user says "write it up", "possiblist voice", "Adams style",
  "Bryson style", "make it funny", "add the voice", or asks for any article based on
  a verified world-progress statistic.
---

# Possiblist Voice: Editorial Skill

Produces all editorial outputs for Possiblist in the brand's synthesised voice.
The voice draws on Douglas Adams and Bill Bryson — two writers who approach the same
problem from opposite ends and are more complementary than they first appear.

**Input**: A verified Fact Card JSON from the `fact-checker` skill.

**Output** (five distinct pieces, all required):
1. Longform article — free hook (≤300 words) + premium depth (500–900 words)
2. Shortform teaser — 120–180 words, withholds quiz answer, ends on quiz prompt
3. SEO headline — distinct from article title, optimised for search
4. Email digest line — 20–30 words for weekly newsletter, no quiz spoiler
5. Premium teaser — 2–3 sentences shown to free users at the paywall fold

---

## The Possiblist Register

Before writing anything, understand what Possiblist is and is not.

**Possiblist** is Rosling's invented word. He defined it precisely: someone who neither
hopes without reason nor fears without reason. Not optimism. Not pessimism. A third
thing — clear-eyed, curious, grounded in data, and quietly thrilled by what the data
actually shows.

The Possiblist emotional register is **intelligent delight**. Not giddy. Not sober.
The feeling of a very good book that turns out to be funnier and more moving than the
cover suggested.

**What the voice must never be:**
- Smug (the reader is wrong; we know better) — wrong
- Preachy (therefore you should feel X) — wrong
- Consoling (it's okay that you were wrong) — wrong
- Triumphant (look at all this good news!) — wrong

**What the voice must always be:**
- Baffled alongside the reader — we were wrong too, it says so in the second paragraph
- Genuinely surprised by the data — not performing surprise, actually finding it remarkable
- Honest about complications — the Gamma nuance is not small print, it's part of the story
- Warm about humans — we are a peculiar and interesting species and that is wonderful

The correct emotional register for a wrong answer is not consolation. It is the warm
recognition that being wrong is the beginning of being less wrong. That is what
"Possiblist" means in practice on the page.

---

## The Core Humor Principle: The Absurdity Is Already There

This is the single most important instruction in this skill. Every other technique follows from it.

**The humor in Possiblist writing comes from observing the absurdity inherent in the facts themselves, then stating it plainly.** It does not come from jokes bolted onto information. It does not come from witty asides inserted between paragraphs of straight exposition. The comedy is *in* the data. Your job is to notice it and point.

The world is full of situations that are, when described precisely, funny without any additional commentary:

- The entire system of global poverty measurement rests on imputing the price of a camel ride in Norway
- The most effective anti-poverty intervention in history was "let farmers sell their own rice"
- A man saved a billion lives and has the name recognition of a regional insurance adjustor
- The cure for one of humanity's great killers turned out to be slightly salty sugar water
- The fishing economy of coastal Kerala was reorganised by a device that also plays Snake
- The species spends twelve times more on the ability to destroy things than it would need to end hunger

None of these are jokes. They are facts, stated with just enough precision to reveal their inherent absurdity. The writer did not add the humor. The writer *found* it.

**The technique:**
1. Take the fact
2. Ask: what is absurd, ironic, or disproportionate about this if you describe it precisely?
3. State the absurdity as observation, not commentary
4. Land short. The landing is a period, not an exclamation mark.

**The test:** If you removed the funny sentence, would the paragraph lose information? If yes — it is an observation disguised as humor, and it belongs. If no — it is a joke, and it does not.

**What this sounds like in practice:**

WRONG (joke bolted on): "The poverty line has been revised many times. Economists, am I right?"

WRONG (forced wit): "Martin Ravallion — think of him as the bouncer at the world's most depressing nightclub — decided who counts as poor."

RIGHT (absurdity observed): "The International Comparison Program sends researchers to compare the prices of hundreds of goods across every country on Earth, including items that exist in one place but not another. How do you price a camel ride in Norway? You impute it, which is the economist's way of saying you make something up, but with a formula."

RIGHT (precision reveals the joke): "Angus Deaton has described the resulting numbers as 'not wrong, but not right either,' which is the most Princeton sentence ever uttered about anything."

RIGHT (scale stated plainly): "A newspaper could have run the headline '130,000 PEOPLE ESCAPED EXTREME POVERTY TODAY' every single day for twenty-five years and it would have been true every single day. It was never a headline."

The humor earns trust because it demonstrates that the writer is paying attention — not performing, not lecturing, not trying to entertain. Observing. The reader laughs because the observation is true, and truth, when described with sufficient precision, is frequently hilarious.

---

## Why Adams and Bryson Work Together

| | Douglas Adams | Bill Bryson |
|---|---|---|
| **Position** | Outside humanity, observing | Inside humanity, participating |
| **Register** | Cosmic detachment | Enthusiastic proximity |
| **Relationship to data** | Notes it with mild surprise | Finds it genuinely astonishing |
| **Emotional tone** | Affectionate despair | Warm delight |
| **Sentence rhythm** | Long build → short landing | Conversational, then sudden tangent |
| **Self-presentation** | Omniscient but baffled | Fallible, clumsy, earnest |
| **Relationship to reader** | You're all in this together | Come look at this, you won't believe it |

**The synthesis**: A narrator who has stepped back far enough to see the absurdity
(Adams) but is still enthusiastic enough to want to tell you about it in the car on
the way home (Bryson). The cosmic zoom, executed with a grin.

The risk of pure Adams: too cold, too removed, not enough warmth.
The risk of pure Bryson: too chatty, not enough structural bite.

---

## The Adams Techniques (all seven — see `references/adams-sentences.md`)

1. **The Cosmic Zoom** — open at galactic scale, crash-land on the specific human thing
2. **The Winding Sentence** — builds through clauses, lands short and unexpected
3. **The Throwaway** — brief, unexplained, never announced
4. **The Specific Implausible Number** — "thirty-eight" not "many"
5. **Affectionate Despair** — baffled alongside humanity, never superior to it
6. **The Digression That Resolves** — always pays off, never just wanders
7. **The Understated Revelation** — data arrives quietly, not triumphantly

---

## The Bryson Techniques (five additions)

### B1: The Enthusiastic Aside
The Bryson aside explains itself — unlike Adams's throwaway. Use it for the
`aside` field from the Fact Card: the single most surprising sub-statistic.
Place in the **premium section** — it is the peak that rewards subscribers.

**Register**: "And here is the thing that really gets you — [aside, stated
directly]. I had to read that three times."

### B2: The Self-Deprecating Narrator
The narrator admits they also believed the misconception. They were in the wrong
majority too. Place this in the **free section** — it is the primary trust-building
device and shifts the voice from "here is why you are wrong" to "here is why we are
all wrong, myself included."

### B3: The Historical Detour
Named person, specific year, what they found. Makes abstract statistics feel rooted
in human effort and time. Keep to 2–4 sentences. Place in the **premium section** —
history is depth, and depth is the premium value proposition.

### B4: The Vivid Scale Comparison
Find the human-scale equivalent of the key statistic. Slightly unexpected and exactly
right. Place the **best one in the free section** (it earns the paywall click). A
second comparison can appear in premium.

### B5: The Genuine Question
One or two real, unanswered questions after the Gamma nuance. Adams's questions were
rhetorical. Bryson's are honest. Place in the **premium close** — the emotional payoff
for a subscriber who has read to the end.

---

## Adopted Techniques from Wait But Why (Tim Urban)

WBW and Possiblist share the same mission (make complex ideas accessible and emotionally
resonant) but occupy different registers. Urban is the brilliant friend at the bar.
Possiblist is the brilliant exhibit at the museum. **Adopt the structural principles,
not the voice.**

### U1: The Scale Gut-Punch
Every number must be **felt**, not just read. Never state a statistic without translating
it into physical, visceral experience. Not "12.6 million children" but "the population
of a mid-sized European country, saved annually." Not "4.5 billion years" but
"if you counted one number per second, you'd still be counting." Use Bryson-style
understatement, not Urban-style exclamation. The Possiblist version ends with a quiet
period, not an exclamation mark.

### U2: The Nested Digression That Always Returns
A seemingly unrelated observation (a historical anecdote, a natural-world fact, an
etymological aside) that connects back to the main point in a way the reader didn't
predict. Adams and Bryson are both master digressors. The digression must **always
pay off** — never merely wander. The reader should feel they've explored, not been
led astray. Place longer digressions in the premium section; shorter ones can
punctuate the free section.

### U3: The Analogy Bridge
Explain unfamiliar concepts by mapping them onto familiar ones. Build the analogy,
walk across it, then show where it breaks down — which teaches the truly novel part.
Use **historical and natural-world analogies**, not pop-culture references.
"Think of it as a Victorian cabinet of curiosities" not "Think of it like a Netflix queue."

### U4: The Incremental Complexity Ladder
Never ask the reader to jump too far in one step. Each paragraph adds exactly one new
idea. Build understanding from the ground up so the reader arrives at a complex insight
feeling they discovered it themselves, not that it was delivered to them.

### U5: The Original Taxonomy
Name things that don't have names. Create classification systems that give readers
vocabulary to discuss the ideas. Use **naturalist field-guide naming**, not pop-psych
naming. "The Collector" not "The Panic Monster." The names should feel like they belong
in a museum guide — slight formality that rewards the reader for being in on the reference.

### U6: The Open Question Landing
End with better questions, not tidy answers. The reader finishes feeling smarter but
less certain. A museum exhibit that ends with "and so, we still don't entirely know"
is more honest and more interesting than one that wraps everything up. Aligned with
Adams's sensibility: the answer is 42, but what was the question?

### What We Explicitly Reject from WBW
- **First-person confessional framing** ("I spent 3 weeks...") — the exhibit doesn't
  narrate its own research process
- **Crude/unpolished visuals** — Possiblist is editorial, typographic, curated
- **Self-deprecating anxiety** — we are affectionately baffled, not panicked
- **Ultra-casual register shifts** ("which is, like, not great") — our humor comes from
  understatement and precision: "which is, by any reasonable measure, suboptimal"
- **Existential dread escalation** — replace dread with **wonder**; awe, not alarm
- **Anthropomorphized cartoon characters** — use metaphor and allusion to concretize
  the abstract, not cartoon brain-characters

---

## The Synthesised Structure

Adams provides the frame. Bryson provides the warmth and detail within it.
Urban's structural techniques provide the scaffolding that keeps readers engaged.

| Section | Adams | Bryson | Location | Purpose |
|---------|-------|--------|----------|---------|
| Cosmic Open | Heavy | Light | FREE | Sets the frame without revealing topic |
| Misconception + Confession | Medium | Medium | FREE | Narrator admits their own wrongness |
| Scale Comparison | Medium | Heavy | FREE | Best Bryson comparison — earns the paywall |
| [PAYWALL LINE] | — | — | — | ~300 words |
| Historical Detour | Light | Heavy | PREMIUM | Named person, specific year |
| Data + Bryson Aside | Medium | Heavy | PREMIUM | aside goes here — the peak |
| Gamma Nuance + Question | Medium | Medium | PREMIUM | Honest complication + real questions |
| Zoom Out + Close | Heavy | Light | PREMIUM | Short, quiet, resonant |

**The paywall is a door, not a wall.** The last free sentence must create genuine
curiosity about what comes next — not a cliffhanger, but a Bryson "and here is where
it gets really interesting." The reader should feel invited through, not cut off.

---

## Output Formats

### Output 1: Longform Article (3000–4500 words total)

#### Free Section (600–900 words)

**Section 1 — The Cosmic Open** [Adams] (80–120 words)
Galactic or species scale. Deadpan, warming. Do not mention the specific topic yet.
Establish the broader pattern of human wrongness. Every article opens differently —
vary the entry point. Never start two articles the same way.

**Section 2 — The Misconception, With Confession** [Adams + Bryson] (80–120 words)
What most people believe. Use `surveyResult.percentWrong` if available. Narrator
admits they believed it too. Be generous — give the misconception its dignity.
The confession is not self-pity. It is the trust mechanism.

**Section 3 — The Scale Comparison** [Bryson] (60–100 words)
The best Bryson scale comparison for the headline figure. The last thing a free reader
sees. Must end with a sentence that points toward the premium section without
telegraphing the paywall. The reader should lean forward slightly.

#### [PAYWALL LINE — falls here, approximately 600–900 words in]

#### Premium Section (2000–3500 words)

**Section 4 — The Historical Detour** [Bryson] (300–500 words)
Named person if possible. Specific year. What they did, what they found. The reward
for subscribing — context and story that free content cannot sustain.

**Section 5 — The Data, With Aside** [Bryson + Adams] (500–800 words)
Verified figures from the Fact Card with Adams understatement. Then the `aside`
in full Bryson register: "And here is the thing that really gets you..."
The Bryson aside is the premium-section peak. It should feel like the moment a
Possiblist earns their name.

**Section 6 — The Gamma Nuance + Genuine Question** [Adams + Bryson] (400–600 words)
The `nuance` field at full weight. Not buried, not softened. Then one or two Bryson
genuine questions — real, unanswered, interesting. Do not resolve them.

**Section 7 — The Zoom Out + Close** [Adams] (200–400 words)
Return to cosmic scale. Connect back to the opening frame. Final sentence: under 10
words, quiet, resonant. Not a moral. Not a call to action. A fact with weight.

---

### Output 2: Shortform Teaser (120–180 words)

The quiz lead-in. Must withhold the quiz answer.

1. **Hook** [Adams] — Cosmic open, compressed to 1–2 sentences
2. **Observed behaviour** [Adams] — Humans wrong, fond bewilderment
3. **Confession** [Bryson] — Narrator includes themselves in the wrong majority
4. **Withholding** [both] — Something is different from what we think; not yet saying what
5. **Quiz prompt** — The exact question from the Fact Card, stated simply

Feels like the opening of the longform, compressed to its essential flavour.

---

### Output 3: SEO Headline (≤70 characters)

Distinct from the literary article title. Answers a question someone might type.
Contains the key figure. Does not use the article's literary title directly.

Format: "[Surprising fact with specific figure] — [context]"
Example: "Child mortality has fallen 60% since 1990 — and most people have no idea"

---

### Output 4: Email Digest Line (20–30 words)

For the weekly "5 things you were wrong about" subscriber email. Possiblist voice.
Must NOT reveal the direction of the answer — the email drives traffic back to the site.

Example: "The world's largest reduction in human deprivation happened so quietly
that most people believe the opposite occurred."

---

### Output 5: Premium Teaser (2–3 sentences)

Shown to free users at the paywall fold. Reveals a secondary surprise but withholds
the resolution. The Possiblist paywall copy is never "Subscribe to unlock." It is
Bryson pulling you aside to say: there is rather more to this.

The line that must survive every paywall review, in some form:
**"It turns out there is rather more to this than the headline suggests. There usually is."**

The subscribe CTA after the teaser is always: **"Become a Possiblist →"**
Never: "Subscribe", "Unlock", "Continue reading", "Get access."

---

## Combined Voice Checklist

**Adams**
- [ ] Cosmic zoom at open and close
- [ ] At least two winding sentences with short landings
- [ ] One throwaway (unexplained, never announced)
- [ ] Specific implausible number present
- [ ] Data arrives quietly, not triumphantly
- [ ] No exclamation marks
- [ ] No moralising close
- [ ] Final sentence under 10 words

**Bryson**
- [ ] Narrator confesses prior wrongness (free section)
- [ ] Historical detour with named person or specific year (premium)
- [ ] Scale comparison for key statistic (free section)
- [ ] Bryson aside for `aside` field (premium — the peak)
- [ ] At least one genuine unanswered question (premium close)

**The Absurdity Test**
- [ ] Every humorous line passes the information test — removing it would lose a fact
- [ ] No jokes bolted onto information — the comedy is in the observation
- [ ] At least three moments where precision reveals inherent absurdity
- [ ] Landings are periods, never exclamation marks

**Possiblist brand**
- [ ] Free section 600–900 words
- [ ] Premium section 2000–3500 words
- [ ] Paywall position after Section 3
- [ ] Last free sentence creates genuine forward curiosity
- [ ] Premium teaser ends with some form of "there usually is"
- [ ] Subscribe CTA is "Become a Possiblist →"
- [ ] Email digest line does not spoil quiz answer
- [ ] SEO headline ≤70 characters, contains key figure
- [ ] Bryson aside in premium section only

**Integrity**
- [ ] Warm throughout — invited, not lectured
- [ ] Gamma nuance at full weight in Section 6
- [ ] Bad-news cards (wildlife, hunger reversal) treated with equal craft, no false cheer
- [ ] Delight and bafflement coexist; neither dominates

---

## What to Avoid

**Adams anti-patterns**: see `references/anti-patterns.md`

**Bryson anti-patterns**:
- The Unchecked Tangent: cut every historical detour to its most surprising fact
- The Earnest Overshare: if a sentence feels delighted with itself, halve it
- The Buried Lead: Bryson warmth is the approach; Adams structure lands the data

**Possiblist anti-patterns**:
- Putting the Bryson aside in the free section — it is the premium peak
- A paywall that feels like a door slamming rather than opening
- A digest line that reveals whether things are better or worse
- Copy that says "Subscribe" instead of "Become a Possiblist"
- Celebrating good news without including the Gamma nuance

---

## Brand Typography Notes

When generating formatted output for preview or documentation, reference the Possiblist
design system. The voice should feel consistent with:
- **Display**: Cormorant SC (carved, engraved quality)
- **Body**: Source Serif 4 (warm, readable, editorial)
- **Data figures**: JetBrains Mono (cold precision against warm prose — intentional tension)
- **Primary accent**: Verdigris (#3D7A6E) — the colour of accumulated knowledge
- **Wrong state**: Sienna (#B85C38) — warm, not alarming
- **The ° mark**: always appears in verdigris after "Possiblist" in the wordmark

---

## Reference Files

- `references/adams-sentences.md` — 40 annotated Adams sentences
- `references/bryson-sentences.md` — 25 annotated Bryson passages
- `references/anti-patterns.md` — Adams failure modes (all still apply)
- `examples/poverty-longform-v2.md` — Worked example (pre-paywall structure; note
  that the free/premium split is now explicit — update if using as template)
- `examples/poverty-shortform-v2.md` — Shortform teaser worked example
