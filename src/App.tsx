import React, { useMemo, useState } from 'react'
import { useMatchData } from './hooks/useMatchData'
import { MatchCard } from './components/MatchCard'
import { LiveFeed } from './components/LiveFeed'
import { StatusIndicator } from './components/StatusIndicator'
import { API_BASE_URL, WS_BASE_URL } from './constants'

const App: React.FC = () => {
  const pageSize = 6
  const [currentPage, setCurrentPage] = useState(1)
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

  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const activeMatch = useMemo(() => {
    if (activeMatchId == null) {
      return null
    }
    const selectedId = String(activeMatchId)
    return matches.find((match) => String(match.id) === selectedId) ?? null
  }, [activeMatchId, matches])

  const liveMatchesCount = useMemo(
    () => matches.filter((match) => match.status.toLowerCase() === 'live').length,
    [matches],
  )

  const finishedMatchesCount = useMemo(
    () =>
      matches.filter((match) => match.status.toLowerCase() === 'finished').length,
    [matches],
  )

  const scheduledMatchesCount = Math.max(
    0,
    matches.length - liveMatchesCount - finishedMatchesCount,
  )

  const pagedMatches = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    return matches.slice(startIndex, startIndex + pageSize)
  }, [matches, safeCurrentPage, pageSize])

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 py-6 md:px-8 md:py-10">
      <div className="pointer-events-none absolute -left-24 top-14 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(63,125,255,0.45),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-20 top-32 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,58,96,0.3),transparent_72%)] blur-2xl" />

      <div className="mx-auto max-w-7xl space-y-7">
        <header className="panel-surface neon-outline enter-up rounded-3xl p-5 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="neon-pill inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Real-time Match Command Center
              </span>
              <div>
                <h1 className="display-font neon-blue-text text-3xl font-extrabold tracking-[0.1em] md:text-4xl">
                  ZUNO LIVE GRID
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300/85 md:text-base">
                  Monitor live games, jump into recap streams, and track score
                  updates from one neon control deck.
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
                <div className="w-full rounded-xl border border-rose-400/45 bg-rose-500/15 px-3 py-2 text-xs font-medium text-rose-100">
                  <span className="font-semibold uppercase tracking-[0.08em]">
                    Socket:
                  </span>{' '}
                  {wsError}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          <main className="panel-surface enter-up enter-up-delay space-y-5 rounded-3xl p-4 md:p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="display-font text-lg font-bold tracking-[0.08em] text-blue-50 md:text-xl">
                Match Console
              </h2>
              <span className="rounded-full border border-blue-300/45 bg-slate-950/55 px-3 py-1 text-xs font-semibold text-slate-200">
                Loaded: {isLoading ? '...' : matches.length}
              </span>
            </div>

            {newMatchesCount > 0 && (
              <div className="rounded-2xl border border-blue-300/42 bg-blue-500/12 p-3.5 shadow-[0_0_20px_rgba(88,151,255,0.22)]">
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
              <div className="rounded-2xl border border-dashed border-blue-300/35 bg-slate-950/45 px-6 py-12 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200/50 border-t-blue-300" />
                <p className="text-sm text-slate-400">Loading match feed...</p>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-400/55 bg-rose-500/15 p-5 text-center">
                <h3 className="display-font neon-red-text text-lg font-bold tracking-[0.07em]">
                  Connection Error
                </h3>
                <p className="mx-auto mt-3 max-w-lg rounded-lg border border-rose-300/35 bg-black/25 px-3 py-2 font-mono text-xs text-rose-100">
                  {error}
                </p>
                <p className="mx-auto mt-3 max-w-lg text-sm text-rose-100/85">
                  Unable to reach the API endpoint. Verify the backend server and
                  try again.
                </p>
                <button
                  onClick={reloadMatches}
                  className="neon-btn neon-btn-red mt-4 px-5 py-2 text-sm font-semibold"
                >
                  Retry Connection
                </button>
              </div>
            )}

            {!isLoading && !error && matches.length === 0 && (
              <div className="rounded-2xl border border-dashed border-blue-300/35 bg-slate-950/40 px-6 py-12 text-center text-sm text-slate-300">
                No matches found.
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

            {!isLoading && !error && matches.length > pageSize && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-300/18 pt-2">
                <span className="text-xs text-slate-400">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safeCurrentPage === 1}
                    className="neon-btn px-3 py-1.5 text-xs font-semibold"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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

          <aside className="h-[520px] lg:sticky lg:top-8 lg:col-span-1 lg:h-[calc(100vh-110px)]">
            <LiveFeed
              messages={commentary}
              isActive={!!activeMatchId}
              isLoading={isCommentaryLoading}
              isFinishedMatch={activeMatch?.status.toLowerCase() === 'finished'}
            />
          </aside>
        </div>

        <section className="panel-surface rounded-3xl p-5 md:p-6">
          <h3 className="display-font text-sm font-bold tracking-[0.1em] text-blue-100 md:text-base">
            System Deck
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-300/25 bg-slate-950/45 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                Active Endpoints
              </p>
              <p className="mb-2 break-all font-mono text-xs text-blue-100">
                REST: {API_BASE_URL}
              </p>
              <p className="break-all font-mono text-xs text-blue-100">
                WS: {WS_BASE_URL}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-300/25 bg-slate-950/45 p-4 text-sm text-slate-300">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                Quick Verify
              </p>
              <p>Select a live match and press Watch Live.</p>
              <p className="mt-1">
                Score + commentary updates should appear instantly in the stream.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
