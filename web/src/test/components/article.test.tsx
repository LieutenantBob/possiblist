import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PaywallGate } from '../../components/article/PaywallGate'
import { SourcesList } from '../../components/article/SourcesList'
import type { Source } from '../../data/types'

const testTeaser = 'What the headline figure does not tell you is where this progress did not happen.'

const testSources: Source[] = [
  {
    name: 'World Bank Poverty & Inequality Platform',
    url: 'https://pip.worldbank.org',
    tier: 1,
    datasetName: 'Poverty headcount ratio at $3/day (2021 PPP)',
    accessedYear: 2026,
  },
  {
    name: 'Our World in Data — Poverty',
    url: 'https://ourworldindata.org/poverty',
    tier: 1,
    datasetName: 'Share of population in extreme poverty',
    accessedYear: 2026,
  },
  {
    name: 'UN Development Programme',
    url: 'https://www.undp.org',
    tier: 2,
    datasetName: 'Human Development Index',
    accessedYear: 2026,
  },
]

describe('PaywallGate', () => {
  it('renders the teaser text', () => {
    render(
      <BrowserRouter>
        <PaywallGate teaser={testTeaser} />
      </BrowserRouter>
    )
    expect(screen.getByText(testTeaser)).toBeInTheDocument()
  })

  it('renders "Become a Possiblist →" CTA link', () => {
    render(
      <BrowserRouter>
        <PaywallGate teaser={testTeaser} />
      </BrowserRouter>
    )
    const link = screen.getByRole('link', { name: /Become a Possiblist/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/subscribe')
  })

  it('renders "There usually is." line', () => {
    render(
      <BrowserRouter>
        <PaywallGate teaser={testTeaser} />
      </BrowserRouter>
    )
    expect(
      screen.getByText(/There usually is\./)
    ).toBeInTheDocument()
  })
})

describe('SourcesList', () => {
  it('renders collapsed by default', () => {
    render(<SourcesList sources={testSources} />)
    const button = screen.getByRole('button', { name: /Sources/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('expands when button is clicked', () => {
    render(<SourcesList sources={testSources} />)
    const button = screen.getByRole('button', { name: /Sources/ })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders correct number of sources when expanded', () => {
    render(<SourcesList sources={testSources} />)
    const button = screen.getByRole('button', { name: /Sources/ })
    fireEvent.click(button)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })
})
