import { useState, useEffect, useCallback } from 'react'

/**
 * Premium status is determined server-side via the httpOnly pl_premium cookie.
 * The client cannot read httpOnly cookies, so we check via the API.
 * For article pages, the server gates content directly.
 * This hook provides a cached client-side approximation.
 */
export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkPremium = useCallback(async (slug?: string) => {
    try {
      // Use a known article slug to check premium status server-side
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
