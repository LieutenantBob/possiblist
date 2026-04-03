export interface ChartDataPoint {
  year: number
  value: number
}

export interface SurveyResult {
  percentWrong: number
  mostCommonWrongAnswer: string
  source: string
  surveyNote: string | null
}

export interface Quiz {
  question: string
  options: string[]
  correctIndex: number
  surveyResult: SurveyResult
}

export interface Source {
  name: string
  url: string
  tier: number
  datasetName: string
  accessedYear: number
}

export interface Reality {
  figure: string
  year: number
  trend: string
  trendLabel: string
  chartType: string
  chartData: ChartDataPoint[]
}

export interface ShareText {
  wrong: string
  correct: string
  score: string | null
}

export interface ActionCard {
  learn: {
    title: string
    url: string
    time: string
    description: string
  }
  fund: {
    org: string
    url: string
    directUrl: string
    description: string
    impact: string
    rating?: string
  }
  act: {
    action: string
    time: string
    description: string
    url?: string
  }
}

export interface FactCard {
  slug: string
  category: string
  status: string
  confidence: string
  lastVerified: string
  shareabilityScore: string
  premiumDepthScore: string
  quiz: Quiz
  headline: string
  teaser: string
  metaDescription: string
  summary: string
  freePreviewWordCount: number
  reality: Reality
  nuance: string
  brysonAside: string
  sources: Source[]
  editorialSlug: string
  shareText: ShareText
  emailDigestLine: string
  premiumTeaser: string
  b2bClassroomNote: string
  publishingRecommendation: string
  publishingNote: string
  actionCard?: ActionCard
}

export interface EditorialFrontmatter {
  slug: string
  factCardSlug: string
  title: string
  subtitle: string
  seoHeadline: string
  wordCountFree: number
  wordCountPremium: number
  publishedAt: string
  category: string
}

export interface Editorial {
  frontmatter: EditorialFrontmatter
  freeContent: string
  premiumContent: string
}
