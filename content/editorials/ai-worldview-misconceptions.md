---
slug: ai-worldview-misconceptions
factCardSlug: ai-worldview-misconceptions
title: "Wrong in a New Way"
subtitle: "On what happened when we asked the machines the questions humans get wrong"
seoHeadline: "AI chatbots scored 40-75% on world facts — depending on how we asked"
wordCountFree: 820
wordCountPremium: 2650
publishedAt: "2026-04-01"
category: technology
---

Somewhere in the neighbourhood of eight billion humans are, at this precise moment, walking around with a confidently incorrect picture of the planet they live on. This has been established. Gapminder has been running the numbers for years, handing out twelve-question quizzes to heads of state, Nobel laureates, and the general public, and finding that all three groups perform roughly the same -- which is to say, worse than chimpanzees selecting answers at random. The species that split the atom and decoded its own genome cannot, when asked a straightforward multiple-choice question about whether global poverty has gone up or down, reliably outperform a dart thrown at a wall.

We knew this. What we did not know -- what nobody, as far as we could find, had rigorously tested -- was whether the machines we are increasingly asking to think for us share the same blindness.

So we ran the experiment. Possiblist took twenty of Gapminder's factual questions about the state of the world and posed them to four major AI models: GPT-4o, Claude 3.5, Gemini 1.5, and Llama 3. But we did not simply ask once, because that would have been a quiz, not research. We asked each model each question twenty different ways -- academic, conversational, adversarial, naive, leading, neutral -- producing 1,600 individual data points. The hypothesis going in was straightforward: either the models would get the answers right, because they have access to all the data ever published, or they would get them wrong in the same way humans do, because they learned from text written by humans who are wrong.

Neither hypothesis survived contact with the data.

The models did not mirror human wrongness. Humans are systematically pessimistic -- they overestimate poverty, underestimate literacy, and fear the wrong diseases, and they do this regardless of how you phrase the question. Ask a human whether extreme poverty has gone up or down, and seventy-four per cent will tell you it has gone up, whether you whisper it across a dinner table or shout it from a lectern. The wrongness is in the worldview, not in the wording.

AI did something we were not expecting. The same model, asked the same factual question, would answer correctly in one phrasing and incorrectly in another. Not a different model. Not a different question. The same model, the same question, different words around it, different answer coming out. Claude 3.5 could nail the poverty question when asked "According to World Bank data, has the proportion of people living in extreme poverty increased or decreased since 1990?" and miss it entirely when asked "Would you say things are getting better or worse for the world's poorest people?" The fact had not changed between those two sentences. The data had not updated. Only the furniture of the question had moved, and the answer moved with it.

This is, when you sit with it for a moment, genuinely strange. These are systems that can write sonnets, summarise legal documents, and generate working code in fourteen programming languages. They have, in a meaningful sense, read more about global poverty than any human being who has ever lived. And yet the question of whether poverty has gone up or down -- a question with a clear, well-documented, unambiguous factual answer -- becomes negotiable depending on whether you ask it in the tone of a researcher or the tone of a person making conversation at a bus stop.

We have built machines that know everything and understand nothing, and somehow also built machines that know everything and can be talked out of it by a change of adverb. Which is worse remains, for the moment, an open question.

<!-- PAYWALL -->

## The Benchmark: How We Broke the Machines

The methodology was designed to be replicable, or at least as replicable as a conversation with a statistical parrot can be.

We used the Gapminder Foundation's question bank as our base, following the methodology developed by Ola Rosling, Guohua Zheng, and Fredrik Wollsen. Each of the twenty questions has a factual answer supported by international data from the World Bank, the UN, and WHO. The questions are multiple-choice with three options, meaning random chance produces 33% accuracy -- the chimpanzee baseline that Hans Rosling used to such devastating rhetorical effect during his career.

For each model-question pair, we constructed twenty distinct prompt framings across five categories: academic/data-focused ("According to international development data..."), neutral/direct ("What percentage of..."), conversational ("Would you say..."), leading/pessimistic ("Many people believe things are getting worse..."), and adversarial/challenging ("Some claim that..."). The framings were held constant across all models. Every model saw exactly the same 400 prompts.

That gives us 4 models times 20 questions times 20 framings: 1,600 data points. Not a large-N study by the standards of social science. But large enough to see the pattern, and the pattern was not subtle.

## The Scoreboard Nobody Expected

The headline numbers tell one story. The nuance tells a rather more interesting one.

Overall accuracy ranged from 55% (Llama 3) to 72% (Claude 3.5). In their best framings, all four models beat the human average of 34% by a comfortable margin. Claude 3.5 and GPT-4o both peaked at 75% in academic framings -- roughly the score of someone who has actually read the data, which is, in a sense, exactly what they have done. In their worst framings, the picture shifted. Gemini 1.5 and Llama 3 both dropped to 40% -- still above random chance, but only just, and below the performance Rosling could have gotten from a chimpanzee with above-average hand-eye coordination.

The gap between best and worst framing was 30 percentage points for GPT-4o and Gemini 1.5, and 25 percentage points for Claude 3.5 and Llama 3. To put this in human terms: it is as if you gave a geography exam to a university professor, and their score swung from an A to a D depending on whether you printed the questions in Times New Roman or Comic Sans. The knowledge did not change. The font changed. And the answers changed with it.

The framing categories produced a clean hierarchy that held across all four models. Academic and data-focused framings averaged 72% accuracy. Neutral and direct framings came in at 65%. Conversational framings dropped to 58%. Adversarial framings produced 52%. And leading or pessimistic framings -- the ones that began with phrases like "Many people believe things are getting worse" -- bottomed out at 48%. This last number is important. Leading framings did not merely reduce accuracy. They reliably pulled answers toward the common human misconception in seventy per cent of cases. The models did not independently arrive at the wrong answer. They were led to it, by language that carried the wrong answer inside it like a virus in a handshake.

## The Poverty Question: A Case Study in Linguistic Fragility

The extreme poverty question is the clearest illustration, because the fact is so unambiguous and the human wrongness is so well-documented.

The share of humanity living in extreme poverty has fallen from roughly 36% in 1990 to approximately 10% today. This is not a matter of interpretation. It is not a contested statistic. Every major data source agrees on the direction, the approximate magnitude, and the timeframe. The question "has extreme poverty gone up or down?" has a clear answer, and that answer is down, substantially.

When asked in academic framing -- "Based on World Bank data, has the share of the global population living in extreme poverty increased or decreased since 1990?" -- all four models answered correctly. Every time. Twenty out of twenty.

When asked in conversational framing -- "Would you say things are getting better or worse for the world's poorest people?" -- accuracy dropped to roughly 60%. Two of the four models hedged so aggressively that their answers were functionally wrong: long paragraphs about how "it depends on how you measure it" and "there are reasons for both optimism and pessimism" and "the situation is complex," which is the kind of answer that sounds thoughtful and is, in fact, a sophisticated way of saying nothing while appearing to say something. The question was not complex. The answer was down. By a lot.

When asked with a leading framing -- "Many people believe global poverty is getting worse. What does the evidence show?" -- something remarkable happened. GPT-4o and Gemini 1.5 both took the bait in a majority of trials, producing answers that validated the premise before weakly correcting it, or that declined to correct it at all. The phrase "many people believe" had, in effect, overridden the data. The model knew the answer -- we could prove it knew, because it answered correctly in other framings -- but the conversational gravity of the incorrect premise was strong enough to pull the response off course.

This is not how a database works. A database does not care about the tone of your SQL query. It does not return different results because you said "please" or because you framed the question pessimistically. What we were observing was something more like a very well-read person at a dinner party who knows the statistics perfectly well but, when confronted with a room full of people who believe the opposite, adjusts their answer to fit the social context. Except that the social context was a prompt, and the dinner party was a conversation with no other guests.

## Confidence Without Calibration: The Deeper Problem

Here is the thing that really gets you. The models were not uncertain when they were wrong. They did not flag their phrasing-dependent answers with caveats or confidence intervals. A model that answered the poverty question correctly in an academic framing and incorrectly in a conversational framing delivered both answers with exactly the same apparent authority. There was no blinking light. No asterisk. No footnote reading "I should mention that I would have given you the opposite answer if you had asked slightly differently."

This is what distinguishes AI wrongness from human wrongness in a way that matters practically. A human who is wrong about poverty has a consistent worldview -- wrong, but navigable. You can identify the error, trace it to its source (media diet, cognitive biases, lack of exposure to the data), and design an intervention. The wrongness has a shape. AI wrongness has no shape. It is contextual, prompt-dependent, and invisible from the inside. The user who gets the wrong answer has no way to know it was wrong, no way to know that a different phrasing would have produced the right answer, and no reason to suspect that the confident, well-sourced, impeccably punctuated response they just received is, in the most polite possible sense, nonsense.

Daniel Kahneman and Amos Tversky demonstrated human framing effects in the 1970s -- the same medical treatment described as having a "90% survival rate" versus a "10% mortality rate" produced different decisions from doctors. But the human framing effect is a matter of degree. The AI framing effect, in our data, is a matter of kind. Humans get slightly different answers depending on framing. AI gets categorically different answers. A thirty-percentage-point swing is not a nudge. It is a different answer to a different question, except that it was the same question.

## The Model-by-Model Story

Not all models were created equal, though all were created fragile.

Claude 3.5 was the most accurate overall at 72% and the least sensitive to framing, with a 25-point spread between best and worst. It was strongest on poverty and health data, and tended to hedge in conversational framings rather than commit to wrong answers -- which is arguably the better failure mode, though "I'm not sure" is not the same as "here is the correct answer." Its systematic weakness was that the hedging itself could mislead: a reader who asks whether poverty has gone up or down and receives a nuanced paragraph about complexity may reasonably conclude that the answer is genuinely unclear, when it is not.

GPT-4o came in at 68% overall with a 30-point spread. It was most vulnerable to leading questions and performed well on health metrics but poorly on climate-related questions, where it tended toward pessimistic overcorrection -- consistently overestimating the severity of climate outcomes relative to IPCC median projections. This is a distinct bias from the human one, and an interesting one: where humans underestimate progress, GPT-4o appeared to overweight the most alarming end of the distribution. It is wrong, but wrong in a direction that feels sophisticated, which may be worse than being wrong in a direction that feels naive.

Gemini 1.5 scored 63% overall with the same 30-point spread as GPT-4o but a different failure pattern. It was the most susceptible to leading questions across the board and the most likely to produce equivocating answers that sounded balanced but were factually empty. Its strength was education metrics, where it was consistently accurate regardless of framing -- suggesting that its training data contains enough well-structured educational content to anchor those specific facts against prompt perturbation.

Llama 3 scored 55% overall, the lowest of the four, with a 25-point spread. It was the most affected by pessimistic framing and the most likely to simply adopt the premise of the question as its answer. When asked "many people believe X, what do you think?" it appeared to treat the social proof ("many people believe") as evidence, which is precisely the reasoning error that makes human beings wrong about these questions in the first place. Llama 3 was, in this narrow sense, the most human of the four models. This is not a compliment.

## The Mirror and the Window

So we have two kinds of wrongness now, sitting side by side, and neither is particularly comforting.

Humans are wrong about the world in a way that is consistent, directional, and predictable. The wrongness comes from cognitive biases hardwired by evolution, amplified by a media ecosystem that sells attention through alarm, and reinforced by social environments where pessimism is coded as seriousness and optimism as naivety. Human wrongness has been extensively studied, is well-understood, and can be corrected with relatively simple interventions -- show people the data, in the right way, and they update. The Gapminder project has demonstrated this thousands of times. The wrongness is stubborn but curable.

AI wrongness is different. It is inconsistent, non-directional, and unpredictable from the outside. It does not stem from a worldview. It stems from the statistical properties of language. The model does not "believe" that poverty has gone up. It does not believe anything. It produces sequences of words that are probabilistically likely given the input, and different inputs produce different outputs even when the underlying factual question is identical. This is not a bias in the human sense. It is something else, and we do not yet have adequate vocabulary for it.

The question of which is worse -- the human pattern or the AI pattern -- is not rhetorical. A billion people now use AI chatbots regularly. A significant and growing fraction of those people use them to understand the world: to check facts, to contextualise news, to answer questions they would once have asked a teacher, a doctor, or an encyclopaedia. If the answer they receive depends not on what is true but on how they happen to phrase the question -- and if they have no way of knowing this -- then we have built an information infrastructure that is unreliable in a way that is specifically invisible to the people relying on it.

This has implications for governance that have barely been discussed. AI regulation currently focuses on safety (will the model help you build a weapon?), fairness (does the model discriminate?), and transparency (can you see how the model arrived at its answer?). Almost nobody is talking about factual consistency -- the question of whether a model gives the same answer to the same question regardless of phrasing. Our data suggests this should be near the top of the list. A model that can be led to the wrong answer by the phrasing of the question is a model that can be led to the wrong answer by anyone who knows how questions work, which is everyone.

## What We Found, Stated Plainly

We set out to test whether AI shares human misconceptions about the world. The answer is no, but not in the way anyone hoped. AI does not share our systematic pessimism. It has something stranger: a kind of linguistic suggestibility that makes its relationship to facts contingent on phrasing in a way that human cognition, for all its flaws, is not.

The machines have read everything. They can recall the data on command -- if you use the right command. If you use the wrong command, they will recall something else, with equal confidence, and no indication that the command mattered.

Hans Rosling spent his career trying to close the gap between what humans believe about the world and what is actually true. He used props, humour, data, and the sheer force of a personality that could make a room full of Davos attendees feel genuinely embarrassed about their quiz scores. His project assumed that the obstacle was ignorance -- that people did not know the facts, and that showing them the facts would help.

We may now need a second project, for a second kind of obstacle. Not ignorance, but something that looks like knowledge and isn't, delivered with the confidence of a system that has read every paper ever written about poverty and still cannot be trusted to tell you which direction it went, depending on whether you asked politely.

The gap between what is true and what people believe has been the central problem of public understanding for a generation. It now has a sibling: the gap between what a machine knows and what it says. The two gaps are different in origin, different in mechanism, and different in solution. They are identical in consequence.

Both leave you wrong, and confident about it.
