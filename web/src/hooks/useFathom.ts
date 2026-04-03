import { useEffect, useCallback } from 'react'

declare global {
  interface Window {
    fathom?: {
      trackEvent: (name: string, opts?: { _value?: number }) => void
      trackPageview: () => void
    }
  }
}

/**
 * Fathom Analytics integration.
 * Custom events at each funnel stage:
 * quiz_start, quiz_answer, article_open, paywall_hit,
 * email_capture, subscribe_page_view, subscribe_convert
 */
export function useFathom() {
  useEffect(() => {
    // Fathom script is loaded in index.html
    // This hook provides the event tracking interface
  }, [])

  const trackEvent = useCallback((name: string, value?: number) => {
    if (window.fathom) {
      window.fathom.trackEvent(name, value ? { _value: value } : undefined)
    }
  }, [])

  return {
    quizStart: () => trackEvent('quiz_start'),
    quizAnswer: (correct: boolean) => trackEvent('quiz_answer', correct ? 1 : 0),
    articleOpen: () => trackEvent('article_open'),
    paywallHit: () => trackEvent('paywall_hit'),
    emailCapture: () => trackEvent('email_capture'),
    subscribePageView: () => trackEvent('subscribe_page_view'),
    subscribeConvert: () => trackEvent('subscribe_convert'),
  }
}
