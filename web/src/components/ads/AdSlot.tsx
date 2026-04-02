import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
  slot: 'article-top' | 'article-mid'
  className?: string
}

/**
 * AdSense ad slot — lazy-loaded on article pages only.
 * Renders after 100px scroll for article-top slot.
 * Never rendered on quiz, subscribe, score, about, or research pages.
 */
export function AdSlot({ slot, className = '' }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const dimensions = slot === 'article-top'
    ? { desktop: '728x90', mobile: '320x100' }
    : { desktop: '300x250', mobile: '300x250' }

  return (
    <div
      ref={ref}
      className={`flex justify-center ${className}`}
      data-ad-slot={slot}
      aria-hidden="true"
    >
      {visible && (
        <div
          className="flex items-center justify-center rounded"
          style={{
            backgroundColor: 'var(--deep-05)',
            color: 'var(--mist)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            minHeight: slot === 'article-top' ? '90px' : '250px',
            width: '100%',
            maxWidth: slot === 'article-top' ? '728px' : '300px',
          }}
        >
          {/* Placeholder — replace with AdSense ins tag in production */}
          ad · {dimensions.desktop}
        </div>
      )}
    </div>
  )
}
