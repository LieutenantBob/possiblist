import { useState, useEffect, useCallback } from 'react'

/**
 * Premium status is determined server-side via the httpOnly pl_premium cookie.
 * The client cannot read httpOnly cookies, so we check via the API.
 * For article pages, the server gates content directly.
 * This hook provides a cached client-side approximation.
 *
 * Preview mode: add ?preview=possiblist to any URL to unlock premium view.
 * This is a client-side preview only — no server-side content is exposed.
 */
export function useSubscription() {
  const [isPremium, setIsPremium] = useState(() => {
    // Check for preview mode via URL param or sessionStorage
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('preview') === 'possiblist') {
        sessionStorage.setItem('pl_preview', '1')
        return true
      }
      return sessionStorage.getItem('pl_preview') === '1'
    }
    return false
  })
  const [loading, setLoading] = useState(true)

  const checkPremium = useCallback(async (slug?: string) => {
    // If already in preview mode, skip API check
    if (sessionStorage.getItem('pl_preview') === '1') {
      setIsPremium(true)
      setLoading(false)
      return
    }

    try {
      const checkSlug = slug ?? 'extreme-poverty-declining'
      const res = await fetch(`/api/articles/${checkSlug}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json() as { isPremium: boolean }
        setIsPremium(data.isPremium)
      }
    } catch {
      // Default to non-premium on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkPremium()
  }, [checkPremium])

  return { isPremium, loading, refresh: checkPremium }
}
