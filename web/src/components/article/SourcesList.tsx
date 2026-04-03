import { useState } from 'react'
import type { Source } from '../../data/types'

interface SourcesListProps {
  sources: Source[]
}

export function SourcesList({ sources }: SourcesListProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--deep-05)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 font-mono text-xs uppercase tracking-wider"
        style={{ color: 'var(--mist)' }}
        aria-expanded={expanded}
        aria-controls="sources-list"
      >
        Sources ({sources.length})
        <span aria-hidden="true" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          ▾
        </span>
      </button>

      {expanded && (
        <ul id="sources-list" className="mt-4 space-y-3 list-none p-0">
          {sources.map((source) => (
            <li key={source.url} className="flex items-start gap-3">
              <span
                className="inline-block px-2 py-0.5 rounded font-mono text-[0.6rem] uppercase mt-0.5"
                style={{
                  backgroundColor: source.tier === 1 ? 'var(--verdigris-10)' : 'var(--deep-05)',
                  color: source.tier === 1 ? 'var(--verdigris)' : 'var(--mist)',
                }}
              >
                Tier {source.tier}
              </span>
              <div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm underline"
                  style={{ color: 'var(--verdigris)' }}
                >
                  {source.name}
                </a>
                <p className="font-mono text-[0.65rem] mt-0.5" style={{ color: 'var(--mist)' }}>
                  {source.datasetName} · Accessed {source.accessedYear}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
