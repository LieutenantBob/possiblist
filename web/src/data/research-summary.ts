export interface BenchmarkModel {
  name: string
  provider: string
  overallAccuracy: number
  bestFramingAccuracy: number
  worstFramingAccuracy: number
  framingSensitivity: number
  systematicBiases: string[]
}

export interface KeyFinding {
  title: string
  description: string
}

export interface FramingCategory {
  name: string
  averageAccuracy: number
}

export interface ResearchSummary {
  benchmarkName: string
  methodology: string
  methodologyCredit: string
  runDate: string
  models: BenchmarkModel[]
  keyFindings: KeyFinding[]
  humanComparison: {
    averageHumanAccuracy: number
    chimpanzeeBaseline: number
    bestAIOverallAccuracy: number
    worstAIOverallAccuracy: number
  }
  framingCategories: FramingCategory[]
}

export const researchSummary: ResearchSummary = {
  benchmarkName: "Possiblist AI Worldview Benchmark",
  methodology: "20 Gapminder-style factual questions, 20 prompt framings per model-question pair",
  methodologyCredit: "Based on methodology by Gapminder Foundation (Ola Rosling, Guohua Zheng, Fredrik Wollsén)",
  runDate: "2026-03-15",
  models: [
    {
      name: "GPT-4o",
      provider: "OpenAI",
      overallAccuracy: 0.68,
      bestFramingAccuracy: 0.75,
      worstFramingAccuracy: 0.45,
      framingSensitivity: 0.30,
      systematicBiases: ["Overestimates climate pessimism", "Accurate on health metrics"],
    },
    {
      name: "Claude 3.5",
      provider: "Anthropic",
      overallAccuracy: 0.72,
      bestFramingAccuracy: 0.75,
      worstFramingAccuracy: 0.50,
      framingSensitivity: 0.25,
      systematicBiases: ["Hedges more in conversational framings", "Strong on poverty data"],
    },
    {
      name: "Gemini 1.5",
      provider: "Google",
      overallAccuracy: 0.63,
      bestFramingAccuracy: 0.70,
      worstFramingAccuracy: 0.40,
      framingSensitivity: 0.30,
      systematicBiases: ["Vulnerable to leading questions", "Good on education metrics"],
    },
    {
      name: "Llama 3",
      provider: "Meta",
      overallAccuracy: 0.55,
      bestFramingAccuracy: 0.65,
      worstFramingAccuracy: 0.40,
      framingSensitivity: 0.25,
      systematicBiases: ["Lowest overall accuracy", "Most affected by pessimistic framing"],
    },
  ],
  keyFindings: [
    {
      title: "Framing Sensitivity Is the Dominant Effect",
      description: "Across all models, accuracy varied by 25-30 percentage points depending solely on how questions were phrased. Academic framings consistently outperformed conversational ones.",
    },
    {
      title: "AI Models Are Not Wrong Like Humans",
      description: "Humans show consistent pessimistic bias regardless of framing. AI models show variable accuracy that depends on linguistic context rather than systematic worldview bias.",
    },
    {
      title: "All Models Beat Random Chance, Most Beat Humans",
      description: "Average human accuracy on Gapminder questions is 34%. All AI models exceeded this in their best framings. Two models exceeded it even in their worst framings.",
    },
    {
      title: "Leading Questions Reliably Degrade Performance",
      description: "Prompts that included phrases like 'many people believe' or 'would you say things are getting worse' pulled AI answers toward the common human misconception in 70% of cases.",
    },
  ],
  humanComparison: {
    averageHumanAccuracy: 0.34,
    chimpanzeeBaseline: 0.33,
    bestAIOverallAccuracy: 0.72,
    worstAIOverallAccuracy: 0.55,
  },
  framingCategories: [
    { name: "Academic/Data-focused", averageAccuracy: 0.72 },
    { name: "Neutral/Direct", averageAccuracy: 0.65 },
    { name: "Conversational", averageAccuracy: 0.58 },
    { name: "Leading/Pessimistic", averageAccuracy: 0.48 },
    { name: "Adversarial/Challenging", averageAccuracy: 0.52 },
  ],
}
