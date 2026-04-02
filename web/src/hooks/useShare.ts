import { useCallback } from 'react'

interface ShareOptions {
  title: string
  text: string
  url: string
}

export function useShare() {
  const share = useCallback(async (options: ShareOptions) => {
    if (navigator.share) {
      try {
        await navigator.share(options)
        return true
      } catch {
        // User cancelled or error — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${options.text}\n${options.url}`)
      return true
    } catch {
      return false
    }
  }, [])

  return { share }
}
