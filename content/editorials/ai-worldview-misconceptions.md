---
slug: ai-worldview-misconceptions
factCardSlug: ai-worldview-misconceptions
title: "Wrong in a New Way"
subtitle: "On what happened when we asked the machines the questions humans get wrong"
seoHeadline: "We tested AI chatbots on the questions humans get wrong — the results were surprising"
wordCountFree: 299
wordCountPremium: 780
publishedAt: "2026-04-01"
category: technology
---

Here is an experiment we ran, because someone had to. We took the twenty questions that Gapminder uses to demonstrate how wrong humans are about the state of the world, and we asked four major AI models to answer them. But we did not simply ask once. We asked each model each question twenty times, using twenty different prompt framings — conversational, academic, adversarial, naive, confident, uncertain.

The hypothesis was simple: if AI models are trained on the internet, and the internet reflects human misconceptions, then AI should be wrong in roughly the same way humans are. The hypothesis was wrong.

AI models did not share humanity's systematic pessimism. They did not consistently overestimate poverty, underestimate education, or fear the wrong energy sources. Instead, they showed something stranger: framing sensitivity. The same model would answer the same factual question correctly when asked one way and incorrectly when asked another. Change the phrasing, and the answer changed. Not the reasoning — the answer.

This is not how human misconceptions work. A human who believes poverty is increasing will believe it regardless of how you phrase the question. An AI model that gets it right when asked "What does World Bank data show about extreme poverty?" and wrong when asked "Would you say things are getting better or worse for the world's poorest?" is doing something fundamentally different. It is not wrong in the human sense. It is wrong in a way we do not yet have good language for.

<!-- PAYWALL -->

The methodology was designed for this finding to be robust, or at least as robust as a twenty-question quiz can be.

We used the Gapminder Foundation's question bank as our base, following the methodology developed by Ola Rosling, Guohua Zheng, and Fredrik Wollsen. Each question has a clear factual answer supported by international data sources. We tested four models representing the major AI providers, using the same twenty prompt framings for each model-question combination.

The headline results: overall accuracy ranged from 40% to 75% across models and framings. The best-performing model in its best framing scored 75% — significantly better than the average human score of 34% on the same questions. The worst-performing model in its worst framing scored 40% — still better than random chance (33% for three-option questions) but worse than the chimps Rosling famously joked about.

The interesting finding was not the aggregate scores but the variance. The same model's accuracy could swing by 30 percentage points depending solely on how the question was framed. Academic framings ("According to international development data...") consistently produced better results than conversational framings ("Would you say..."). Leading framings ("Many people believe things are getting worse...") reliably pulled answers toward the pessimistic misconception.

This tells us something important. The models are not storing facts in the way a database does — retrieving the same answer regardless of how you ask. They are generating responses based on patterns in language, and the pattern associated with "Would you say things are getting better?" is apparently different from the pattern associated with "What does the data show?" The first triggers conversational hedging; the second triggers data retrieval. Same fact, different linguistic context, different answer.

The practical implications are significant. Anyone relying on AI for factual claims about the world should know that the answer they get depends heavily on how they ask. This is not a bug in the colloquial sense — it is a structural feature of how language models process information. But it does mean that AI fact-checking is only as reliable as the prompt engineering behind it.

There is also a mirror here for human cognition. Humans show framing effects too — Kahneman and Tversky demonstrated this decades ago. But the human framing effect is subtle, a matter of degree. The AI framing effect is dramatic, a matter of kind. We get slightly different answers depending on phrasing. AI gets categorically different answers.

Credit where it is due: this methodology stands on the shoulders of Gapminder's extraordinary work in measuring and correcting human misconceptions about the world. Our contribution was to point the same questions at a different kind of mind, and to notice that the results were, in the most literal sense, unprecedented.

But this leaves an uncomfortable question hanging: if the answer an AI gives depends less on what is true and more on how you phrase the question, and if millions of people are already using these tools to understand the world — who is responsible for the framing? And would we even notice if the phrasing were quietly shaping what we believe?
