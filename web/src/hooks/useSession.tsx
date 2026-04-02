import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Answer {
  slug: string
  answeredAt: string
  chosenIndex: number
  correct: boolean
  timeToAnswer: number
}

interface Session {
  id: string
  answers: Answer[]
  emailCaptured: boolean
  startedAt: string
}

interface SessionContextValue {
  session: Session
  recordAnswer: (answer: Omit<Answer, 'answeredAt'>) => void
  markEmailCaptured: () => void
  hasAnswered: (slug: string) => boolean
  getAnswer: (slug: string) => Answer | undefined
}

const SESSION_KEY = 'possiblist_session'

const SessionContext = createContext<SessionContextValue | null>(null)

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
    localStorage.removeItem(SESSION_KEY)
  }
  return createSession()
}

function createSession(): Session {
  return {
    id: generateId(),
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

export function SessionProvider({ children }: { children: ReactNode }) {
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

  return (
    <SessionContext.Provider value={{
      session,
      recordAnswer,
      markEmailCaptured,
      hasAnswered,
      getAnswer,
    }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return ctx
}
