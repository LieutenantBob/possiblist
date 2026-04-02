import { useState, useEffect } from 'react'

export function useSubscription() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasCookie = document.cookie.includes('pl_premium=')
    setIsPremium(hasCookie)
    setLoading(false)
  }, [])

  return { isPremium, loading }
}
