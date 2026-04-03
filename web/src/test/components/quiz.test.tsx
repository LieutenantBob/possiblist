import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from '../../hooks/useSession'
import { AnswerOptions } from '../../components/quiz/AnswerOptions'
import { QuizCard } from '../../components/quiz/QuizCard'
import { getFactCard } from '../../data/loader'

const testCard = getFactCard('extreme-poverty-declining')!

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <SessionProvider>{ui}</SessionProvider>
    </BrowserRouter>
  )
}

describe('AnswerOptions', () => {
  const options = ['Option A', 'Option B', 'Option C', 'Option D']

  it('renders 4 buttons', () => {
    const onSelect = vi.fn()
    render(<AnswerOptions options={options} onSelect={onSelect} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('calls onSelect with correct index when clicked', () => {
    const onSelect = vi.fn()
    render(<AnswerOptions options={options} onSelect={onSelect} />)
    const buttons = screen.getAllByRole('button')

    fireEvent.click(buttons[2])
    expect(onSelect).toHaveBeenCalledWith(2)

    fireEvent.click(buttons[0])
    expect(onSelect).toHaveBeenCalledWith(0)
  })
})

describe('QuizCard', () => {
  it('shows teaser text before answering', () => {
    const onAnswered = vi.fn()
    const onNext = vi.fn()
    renderWithProviders(
      <QuizCard card={testCard} onAnswered={onAnswered} onNext={onNext} />
    )
    expect(screen.getByText(testCard.teaser)).toBeInTheDocument()
  })

  it('shows question text', () => {
    const onAnswered = vi.fn()
    const onNext = vi.fn()
    renderWithProviders(
      <QuizCard card={testCard} onAnswered={onAnswered} onNext={onNext} />
    )
    expect(screen.getByText(testCard.quiz.question)).toBeInTheDocument()
  })

  it('shows category badge', () => {
    const onAnswered = vi.fn()
    const onNext = vi.fn()
    renderWithProviders(
      <QuizCard card={testCard} onAnswered={onAnswered} onNext={onNext} />
    )
    expect(screen.getByText(testCard.category)).toBeInTheDocument()
  })
})
