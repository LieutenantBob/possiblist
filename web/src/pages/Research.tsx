import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

import { researchSummary as summaryData } from '../data/research-summary'

export function Research() {
  const chartData = useMemo(() =>
    summaryData.models.map(m => ({
      name: m.name,
      accuracy: Math.round(m.overallAccuracy * 100),
    })),
  [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      {/* Headline */}
      <h1
        className="font-display font-semibold mb-4"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--deep)', lineHeight: 1.15 }}
      >
        Do AI Chatbots Share Humanity's Misconceptions?
      </h1>

      {/* Intro — in voice */}
      <p className="font-body leading-relaxed mb-4" style={{ color: 'var(--ink)', fontSize: '1.05rem' }}>
        We asked four major AI models the same twenty questions we ask humans,
        in twenty different ways, to see if their training data had inherited
        our misconceptions. It had — but not in the way anyone predicted.
        The models did not share humanity's systematic pessimism. They showed
        something stranger: change the phrasing of the question, and the answer changes.
        Not the reasoning. The answer.
      </p>
      <p className="font-italic italic mb-10" style={{ color: 'var(--mist)', fontSize: '0.95rem' }}>
        This is not how human wrongness works. It is something new.
      </p>

      {/* Interactive chart — accuracy by model */}
      <div
        className="rounded-lg p-6 mb-8"
        style={{ backgroundColor: 'var(--chalk)' }}
        role="img"
        aria-label="Bar chart showing AI model accuracy ranging from 55% to 72%"
      >
        <p className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--mist)' }}>
          Overall accuracy by model
        </p>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <XAxis
                dataKey="name"
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--mist)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--mist)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} animationDuration={1200}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--verdigris)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Human baseline */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--sienna)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--sienna)' }}>
            Average human: {Math.round(summaryData.humanComparison.averageHumanAccuracy * 100)}%
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--sienna)' }} />
        </div>
      </div>

      {/* Key findings */}
      <div className="space-y-6 mb-12">
        {summaryData.keyFindings.map((finding, i) => (
          <div key={i}>
            <h3 className="font-body font-semibold mb-1" style={{ fontSize: '1.05rem', color: 'var(--deep)' }}>
              {finding.title}
            </h3>
            <p className="font-body leading-relaxed" style={{ color: 'var(--ink)', fontSize: '0.95rem' }}>
              {finding.description}
            </p>
          </div>
        ))}
      </div>

      {/* Framing categories */}
      <div className="mb-12">
        <h3 className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--mist)' }}>
          Accuracy by prompt framing
        </h3>
        <div className="space-y-2">
          {summaryData.framingCategories.map((cat, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="font-body text-sm" style={{ color: 'var(--ink)' }}>
                {cat.name}
              </span>
              <span className="font-mono text-sm" style={{ color: 'var(--verdigris)' }}>
                {Math.round(cat.averageAccuracy * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology + Gapminder credit */}
      <div
        className="p-6 rounded-lg mb-12"
        style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--deep-05)' }}
      >
        <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mist)' }}>
          Methodology
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
          This benchmark uses the{' '}
          <a
            href="https://gapminder.org/ignorance"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--verdigris)' }}
          >
            Gapminder Foundation
          </a>'s
          methodology for measuring misconceptions about global development,
          developed by Ola Rosling, Guohua Zheng, and Fredrik Wollsén.
          We took their twenty questions, asked four AI models each one
          twenty different ways — conversational, academic, adversarial, naive —
          and watched the answers shift. The methodology is theirs.
          The discovery that AI is wrong in a fundamentally new way is ours.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="font-italic italic mb-4" style={{ color: 'var(--mist)', fontSize: '1rem' }}>
          Think you can do better than the AI?
        </p>
        <Link
          to="/quiz"
          className="inline-block px-8 py-3 rounded-lg font-body font-semibold no-underline"
          style={{
            backgroundColor: 'var(--verdigris)',
            color: 'var(--parchment)',
            fontSize: '1rem',
          }}
        >
          Take the quiz →
        </Link>
      </div>
    </div>
  )
}
