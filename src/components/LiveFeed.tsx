import React from 'react'
import type { Commentary } from '../types'

interface LiveFeedProps {
  messages: Commentary[]
  isActive: boolean
  isLoading?: boolean
  isFinishedMatch?: boolean
}

const formatMinute = (minute?: number) => {
  if (minute === undefined || minute === null) {
    return null
  }
  return `${minute}'`
}

const formatMetadata = (metadata?: Record<string, unknown>) => {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null
  }
  try {
    return JSON.stringify(metadata)
  } catch {
    return null
  }
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  messages,
  isActive,
  isLoading,
  isFinishedMatch,
}) => {
  if (!isActive) {
    return (
      <div className="panel-surface h-full rounded-3xl border border-dashed border-blue-300/40 p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/50 bg-blue-500/20 shadow-[0_0_26px_rgba(65,132,255,0.35)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="display-font mb-2 text-xl font-bold tracking-wide text-blue-50">
          No Match Selected
        </h3>
        <p className="mx-auto max-w-xs text-sm text-slate-400">
          Select a match from the list to view live commentary and real-time
          updates.
        </p>
      </div>
    )
  }

  return (
    <div className="panel-surface neon-outline flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between border-b border-blue-300/30 bg-blue-500/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.95)] animate-pulse" />
          <h3 className="display-font text-base font-bold tracking-wide text-blue-50">
            Commentary Stream
          </h3>
        </div>
        <span className="rounded-full border border-blue-300/40 bg-slate-900/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-200">
          Realtime
        </span>
      </div>

      <div className="feed-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5">
        {isLoading ? (
          <div className="py-10 text-center text-sm italic text-slate-400">
            Loading commentary...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center text-sm italic text-slate-400">
            {isFinishedMatch
              ? 'No recap available for this match yet.'
              : 'Waiting for updates...'}
          </div>
        ) : (
          messages.map((msg, index) => {
            const timestamp = msg.createdAt
              ? new Date(msg.createdAt)
              : new Date()
            const minuteLabel = formatMinute(msg.minute)
            const metadataLabel = formatMetadata(msg.metadata)
            return (
              <div
                key={msg.id}
                className="commentary-entry"
                style={{ animationDelay: `${Math.min(index, 10) * 38}ms` }}
              >
                <div className="panel-surface-soft rounded-2xl p-3.5">
                  <div className="flex gap-3">
                    <div className="mt-1 flex flex-col items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(125,192,255,0.95)]" />
                      <div className="h-full w-px bg-blue-300/30" />
                    </div>
                    <div className="pb-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-slate-500">
                          {timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                        {minuteLabel && (
                          <span className="rounded-full border border-blue-300/35 bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-100">
                            {minuteLabel}
                          </span>
                        )}
                        {msg.sequence !== undefined && msg.sequence !== null && (
                          <span className="rounded-full border border-blue-300/35 bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-100">
                            Seq {msg.sequence}
                          </span>
                        )}
                        {msg.period && (
                          <span className="rounded-full border border-slate-500/40 bg-slate-800/70 px-2 py-0.5 text-slate-300">
                            {msg.period}
                          </span>
                        )}
                        {msg.eventType && (
                          <span className="rounded-full border border-rose-400/45 bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-rose-100">
                            {msg.eventType}
                          </span>
                        )}
                      </div>
                      {(msg.actor || msg.team) && (
                        <div className="mb-2 text-xs font-semibold text-slate-300">
                          {msg.actor ? msg.actor : 'Unknown'}
                          {msg.team ? ` | ${msg.team}` : ''}
                        </div>
                      )}
                      <p className="rounded-xl border border-blue-300/22 bg-slate-950/55 p-3 text-sm leading-relaxed text-slate-100">
                        {msg.message}
                      </p>
                      {metadataLabel && (
                        <div className="mt-2 rounded-md border border-slate-500/30 bg-slate-950/65 px-2 py-1 font-mono text-[11px] text-slate-400">
                          {metadataLabel}
                        </div>
                      )}
                      {msg.tags && msg.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.tags.map((tag) => (
                            <span
                              key={`${msg.id}-${tag}`}
                              className="rounded-full border border-blue-300/30 bg-blue-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.09em] text-blue-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
