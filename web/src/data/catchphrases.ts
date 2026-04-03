/** Possiblist catchphrases — displayed randomly on each page load */
export const catchphrases = [
  // Identity
  "I changed my mind. Twice. Before breakfast.",
  "Armed with data. Dangerous to assumptions.",
  "I fact-checked my feelings.",
  "Calmly furious. Accurately.",

  // Philosophy
  "Not optimism. Not pessimism. The third thing — the one with footnotes.",
  "The world is not as bad as you think. It is not as good as you hope. It is more interesting than either.",
  "Nuance is not a viral emotion. Yet.",
  "The data doesn't care about your narrative. But it has a much better one.",

  // Movement
  "The loud get organised. The calm just did.",
  "We don't march. We cite.",
  "Individually rational. Collectively unstoppable. Statistically significant.",
  "Evidence-based. Community-powered. Chimpanzee-proof.",

  // Playful
  "My worldview has been updated. Please refresh.",
  "I was wrong. It was the most interesting thing that happened to me all week.",
  "This is not a protest sign. It is a confidence interval.",
  "Keep calm and check the source.",
  "Strong opinions, loosely held, thoroughly cited.",

  // Gravity
  "A possiblist does not cherry-pick the comfortable data.",
  "Some numbers are getting better. Some are not. We look at both.",
  "Hope is not a strategy. But neither is despair. Data is a strategy.",

  // The classics
  "Pessimists see the glass as half empty. Optimists see it as half full. Possibilists remember that it is refillable.",
  "Being wrong is the beginning of being less wrong.",
  "A movement for people who would rather be accurate than loud.",
  "Scoring higher than a chimpanzee since 2026.",
]

export function getRandomCatchphrase(): string {
  return catchphrases[Math.floor(Math.random() * catchphrases.length)]
}
