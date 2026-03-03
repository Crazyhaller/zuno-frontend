import React from 'react'
import type { Match } from '../types'

interface MatchCardProps {
  match: Match
  isActive: boolean
  onWatch: (id: string | number) => void
  onUnwatch: (id: string | number) => void
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isActive,
  onWatch,
  onUnwatch,
}) => {
  const statusLower = match.status.toLowerCase()
  const isLive = statusLower === 'live'
  const isFinished = statusLower === 'finished'

  const actionLabel = (() => {
    if (isLive) {
      return isActive ? 'Watching Live' : 'Watch Live'
    }
    if (statusLower === 'finished') {
      return isActive ? 'Viewing Recap' : 'View Recap'
    }
    return isActive ? 'Viewing Match' : 'View Match'
  })()

  const displayStatus =
    match.status.charAt(0).toUpperCase() + match.status.slice(1).toLowerCase()

  const statusToneClass = (() => {
    if (isLive) {
      return 'border-rose-400/55 bg-rose-500/20 text-rose-200'
    }
    if (isFinished) {
      return 'border-sky-300/45 bg-sky-500/15 text-sky-100'
    }
    return 'border-indigo-300/40 bg-indigo-500/15 text-indigo-100'
  })()

  return (
    <div
      className={`
      panel-surface-soft relative overflow-hidden rounded-2xl p-5 transition-all duration-300
      ${isActive ? 'border-blue-300/75 shadow-[0_0_0_1px_rgba(116,173,255,0.55),0_0_28px_rgba(54,112,255,0.35)] -translate-y-0.5' : 'hover:-translate-y-0.5 hover:border-blue-300/45'}
    `}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(92,164,255,0.38),transparent_70%)]" />

      <div className="flex justify-between items-start mb-4">
        <span className="neon-pill rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
          {match.sport}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-65 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.95)]" />
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${statusToneClass}`}
          >
            {displayStatus}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-semibold text-slate-100 line-clamp-1 pr-3">
            {match.homeTeam}
          </span>
          <span
            key={`home-${match.id}-${match.homeScore}`}
            className={`
              score-pop min-w-14 rounded-xl border border-blue-300/75 bg-slate-900/75 px-3 py-1.5 text-center text-xl font-bold text-blue-100 transition-all shadow-[0_0_18px_rgba(96,165,250,0.3)]
            `}
          >
            {match.homeScore}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-semibold text-slate-100 line-clamp-1 pr-3">
            {match.awayTeam}
          </span>
          <span
            key={`away-${match.id}-${match.awayScore}`}
            className={`
              score-pop min-w-14 rounded-xl border border-blue-300/75 bg-slate-900/75 px-3 py-1.5 text-center text-xl font-bold text-blue-100 transition-all shadow-[0_0_18px_rgba(96,165,250,0.3)]
            `}
          >
            {match.awayScore}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-blue-300/20 pt-4">
        <span className="text-xs font-medium text-slate-400">
          {new Date(match.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onWatch(match.id)}
            disabled={isActive}
            className={`
              neon-btn px-4 py-2 text-sm font-semibold
              ${
                isActive
                  ? 'cursor-default border-blue-300/55 bg-blue-500/25 text-blue-100 opacity-100'
                  : isLive
                    ? 'neon-btn-red'
                    : ''
              }
            `}
          >
            {actionLabel}
          </button>
          {isActive && (
            <button
              onClick={() => onUnwatch(match.id)}
              className="rounded-xl border border-blue-300/40 bg-slate-950/65 px-3 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-blue-200/60 hover:bg-slate-900/85"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
