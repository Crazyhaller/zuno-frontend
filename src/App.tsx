import React, { useMemo, useState } from 'react'
import { useMatchData } from './hooks/useMatchData'
import { MatchCard } from './components/MatchCard'
import { LiveFeed } from './components/LiveFeed'
import { StatusIndicator } from './components/StatusIndicator'

type MatchFilter = 'all' | 'live' | 'finished' | 'scheduled'

const FILTER_OPTIONS: Array<{ label: string; value: MatchFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Finished', value: 'finished' },
  { label: 'Scheduled', value: 'scheduled' },
]

const App: React.FC = () => {
  const pageSize = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<MatchFilter>('all')
  const {
    matches,
    isLoading,
    error,
    commentary,
    isCommentaryLoading,
    wsError,
    status,
    activeMatchId,
    newMatchesCount,
    dismissNewMatches,
    watchMatch,
    unwatchMatch,
    reloadMatches,
  } = useMatchData()

  const activeMatch = useMemo(() => {
    if (activeMatchId == null) {
      return null
    }
    const selectedId = String(activeMatchId)
    return matches.find((match) => String(match.id) === selectedId) ?? null
  }, [activeMatchId, matches])

  const liveMatchesCount = useMemo(
    () =>
      matches.filter((match) => match.status.toLowerCase() === 'live').length,
    [matches],
  )

  const finishedMatchesCount = useMemo(
    () =>
      matches.filter((match) => match.status.toLowerCase() === 'finished')
        .length,
    [matches],
  )

  const scheduledMatchesCount = Math.max(
    0,
    matches.length - liveMatchesCount - finishedMatchesCount,
  )

  const filteredMatches = useMemo(() => {
    if (statusFilter === 'all') {
      return matches
    }
    return matches.filter(
      (match) => match.status.toLowerCase() === statusFilter,
    )
  }, [matches, statusFilter])

  const averageCombinedScore = useMemo(() => {
    if (matches.length === 0) {
      return 0
    }
    const total = matches.reduce(
      (sum, match) => sum + match.homeScore + match.awayScore,
      0,
    )
    return (total / matches.length).toFixed(1)
  }, [matches])

  const liveCoverage = useMemo(() => {
    if (matches.length === 0) {
      return '0%'
    }
    return `${Math.round((liveMatchesCount / matches.length) * 100)}%`
  }, [liveMatchesCount, matches.length])

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const pagedMatches = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    return filteredMatches.slice(startIndex, startIndex + pageSize)
  }, [filteredMatches, safeCurrentPage, pageSize])

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-6 md:px-8 md:py-10">
      <div className="pointer-events-none absolute -left-24 top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(63,125,255,0.38),transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-32 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,58,96,0.24),transparent_74%)] blur-3xl" />

      <div className="mx-auto max-w-7xl space-y-7">
        <header className="panel-surface neon-outline enter-up rounded-3xl p-5 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="neon-pill inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Real-time Sports Intelligence Layer
              </span>
              <div>
                <h1 className="display-font neon-blue-text text-3xl font-extrabold tracking-[0.1em] md:text-4xl">
                  ZUNO MATCH OPS
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300/85 md:text-base">
                  Unified live monitoring, recap consumption, and commentary
                  streaming in a single operator-facing experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="neon-pill rounded-full px-3 py-1 text-xs font-semibold">
                  Total: {matches.length}
                </span>
                <span className="neon-pill rounded-full px-3 py-1 text-xs font-semibold">
                  Live: {liveMatchesCount}
                </span>
                <span className="neon-pill rounded-full px-3 py-1 text-xs font-semibold">
                  Finished: {finishedMatchesCount}
                </span>
                <span className="neon-pill rounded-full px-3 py-1 text-xs font-semibold">
                  Scheduled: {scheduledMatchesCount}
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 lg:items-end">
              <StatusIndicator status={status} />
              {wsError && (
                <div className="w-full rounded-xl border border-rose-400/35 bg-rose-500/12 px-3 py-2 text-xs font-medium text-rose-100">
                  <span className="font-semibold uppercase tracking-[0.08em]">
                    Socket:
                  </span>{' '}
                  {wsError}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="product-card">
            <div className="icon-shell">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M4 6h16M4 12h16M4 18h9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="product-card-label">Ingestion Pipeline</p>
            <p className="product-card-value">Event Stream Normalized</p>
            <p className="product-card-copy">
              Match, score, and commentary data are synced through a single
              normalized feed for downstream consistency.
            </p>
          </article>

          <article className="product-card">
            <div className="icon-shell">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M12 6v6l4 2m4-2a8 8 0 11-16 0 8 8 0 0116 0z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="product-card-label">Latency Posture</p>
            <p className="product-card-value">Sub-minute Refresh Window</p>
            <p className="product-card-copy">
              Polling and websocket reconciliation keep operational timelines
              current without requiring manual refresh actions.
            </p>
          </article>

          <article className="product-card">
            <div className="icon-shell">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M5 12l4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="product-card-label">Operator Reliability</p>
            <p className="product-card-value">Reconnect + State Recovery</p>
            <p className="product-card-copy">
              Automatic reconnect strategy and subscription recovery protect
              continuity during transient network interruptions.
            </p>
          </article>
        </section>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          <main className="panel-surface enter-up enter-up-delay space-y-5 rounded-3xl p-4 md:p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <h2 className="display-font text-lg font-bold tracking-[0.08em] text-blue-50 md:text-xl">
                  Match Console
                </h2>
                <p className="text-xs text-slate-400">
                  Filter and inspect matches by current lifecycle status.
                </p>
              </div>
              <span className="rounded-full border border-blue-300/35 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-slate-200">
                Loaded: {isLoading ? '...' : filteredMatches.length}
              </span>
            </div>

            <div className="segmented-control">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value)
                    setCurrentPage(1)
                  }}
                  className={`segmented-control-item ${statusFilter === option.value ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {newMatchesCount > 0 && (
              <div className="rounded-2xl border border-blue-300/35 bg-blue-500/10 p-3.5 shadow-[0_0_14px_rgba(88,151,255,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-blue-100">
                    {newMatchesCount} new match
                    {newMatchesCount > 1 ? 'es are' : ' is'} now available
                  </span>
                  <button
                    onClick={dismissNewMatches}
                    className="neon-btn px-3 py-1.5 text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="rounded-2xl border border-dashed border-blue-300/30 bg-slate-950/45 px-6 py-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200/40 border-t-blue-300" />
                <p className="text-sm text-slate-400">Loading match feed...</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-400/45 bg-rose-500/12 p-5 text-center">
                <h3 className="display-font neon-red-text text-lg font-bold tracking-[0.07em]">
                  Connection Error
                </h3>
                <p className="mx-auto mt-3 max-w-lg rounded-lg border border-rose-300/28 bg-black/25 px-3 py-2 font-mono text-xs text-rose-100">
                  {error}
                </p>
                <p className="mx-auto mt-3 max-w-lg text-sm text-rose-100/80">
                  Unable to reach the API endpoint. Verify backend health and
                  network reachability.
                </p>
                <button
                  onClick={reloadMatches}
                  className="neon-btn neon-btn-red mt-4 px-5 py-2 text-sm font-semibold"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {!isLoading && !error && filteredMatches.length === 0 && (
              <div className="rounded-2xl border border-dashed border-blue-300/30 bg-slate-950/40 px-6 py-12 text-center text-sm text-slate-300">
                No matches found for the current filter.
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              {pagedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isActive={activeMatchId == match.id}
                  onWatch={watchMatch}
                  onUnwatch={unwatchMatch}
                />
              ))}
            </div>

            {!isLoading && !error && filteredMatches.length > pageSize && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/18 pt-2">
                <span className="text-xs text-slate-400">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                    disabled={safeCurrentPage === 1}
                    className="neon-btn px-3 py-1.5 text-xs font-semibold"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="neon-btn px-3 py-1.5 text-xs font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>

          <aside className="space-y-4 lg:col-span-1">
            <section className="panel-surface-soft rounded-2xl p-4">
              <h3 className="display-font text-xs font-bold uppercase tracking-[0.12em] text-blue-100">
                Operational Pulse
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="kpi-tile">
                  <p className="kpi-label">Live Coverage</p>
                  <p className="kpi-value">{liveCoverage}</p>
                </div>
                <div className="kpi-tile">
                  <p className="kpi-label">Avg Score</p>
                  <p className="kpi-value">{averageCombinedScore}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Data synchronization and commentary stream are continuously
                monitored for operational consistency and recap completeness.
              </p>
            </section>

            <div className="h-[520px] lg:sticky lg:top-8 lg:h-[calc(100vh-110px)]">
              <LiveFeed
                messages={commentary}
                isActive={!!activeMatchId}
                isLoading={isCommentaryLoading}
                isFinishedMatch={
                  activeMatch?.status.toLowerCase() === 'finished'
                }
              />
            </div>
          </aside>
        </div>

        <section className="panel-surface rounded-3xl p-5 md:p-6">
          <h3 className="display-font text-sm font-bold tracking-[0.1em] text-blue-100 md:text-base">
            Product Notes
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-300/25 bg-slate-950/45 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                Why Teams Use This
              </p>
              <p>
                Centralized visibility across live, scheduled, and finished
                events reduces context switching for operations and editorial
                teams.
              </p>
              <p className="mt-2">
                Recap access and live stream context are maintained in one UI to
                preserve match-level continuity.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-300/25 bg-slate-950/45 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                Security + Delivery
              </p>
              <p>
                Built with API protection, websocket safeguards, and resilient
                reconnect logic for production-grade runtime behavior.
              </p>
              <p className="mt-2">
                Suitable as a base surface for internal dashboards, client
                portals, and SLA-backed live products.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
