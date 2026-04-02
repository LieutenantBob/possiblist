import { useState, useCallback } from 'react'

interface Answer {
  slug: string
  answeredAt: string
  chosenIndex: number
  correct: boolean
  timeToAnswer: number
}

interface Session {
  id: string
  isPremium: boolean
  stripeCustomerId?: string
  answers: Answer[]
  emailCaptured: boolean
  startedAt: string
}

const SESSION_KEY = 'possiblist_session'

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

function loadSession(): Session {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // Ignore parse errors
  }
  return createSession()
}

function createSession(): Session {
  return {
    id: generateId(),
    isPremium: document.cookie.includes('pl_premium='),
    answers: [],
    emailCaptured: false,
    startedAt: new Date().toISOString(),
  }
}

function saveSession(session: Session): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Ignore storage errors
  }
}

export function useSession() {
  const [session, setSession] = useState<Session>(loadSession)

  const recordAnswer = useCallback((answer: Omit<Answer, 'answeredAt'>) => {
    setSession(prev => {
      const updated: Session = {
        ...prev,
        answers: [
          ...prev.answers,
          { ...answer, answeredAt: new Date().toISOString() },
        ],
      }
      saveSession(updated)
      return updated
    })
  }, [])

  const markEmailCaptured = useCallback(() => {
    setSession(prev => {
      const updated: Session = { ...prev, emailCaptured: true }
      saveSession(updated)
      return updated
    })
  }, [])

  const hasAnswered = useCallback((slug: string): boolean => {
    return session.answers.some(a => a.slug === slug)
  }, [session.answers])

  const getAnswer = useCallback((slug: string): Answer | undefined => {
    return session.answers.find(a => a.slug === slug)
  }, [session.answers])

  return {
    session,
    recordAnswer,
    markEmailCaptured,
    hasAnswered,
    getAnswer,
  }
}
