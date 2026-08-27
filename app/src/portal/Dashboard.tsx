import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, Briefcase, CalendarCheck, Inbox, Mail, TrendingUp, type LucideIcon,
} from 'lucide-react'
import { fetchDailyVolume, fetchSubmissionCounts, fetchSubmissions, subscribeToSubmissions } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Submission, SubmissionKind, SubmissionStatus } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Misc'
import { ArrowIcon } from '@/components/ui/Button'
import { EmptyState, ErrorState, KindBadge, Panel, PortalHeading, RowSkeleton, routeFor, StatusBadge, TimeAgo } from './components'
import { useSeo } from '@/hooks/useSeo'

const tiles: { kind: SubmissionKind; label: string; to: string; icon: LucideIcon }[] = [
  { kind: 'booking', label: 'Appointments', to: '/portal/bookings', icon: CalendarCheck },
  { kind: 'contact', label: 'Messages', to: '/portal/contacts', icon: Mail },
  { kind: 'application', label: 'Applications', to: '/portal/applications', icon: Briefcase },
]

export default function Dashboard() {
  useSeo({ title: 'Dashboard, Premium Care Portal' })

  const { profile } = useAuth()
  const [rows, setRows] = useState<Submission[]>([])
  const [counts, setCounts] = useState<Array<{ kind: SubmissionKind; status: SubmissionStatus; count: number }>>([])
  const [volume, setVolume] = useState<Array<{ day: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      // Counts and chart come from Postgres aggregates, so they stay correct
      // however many rows exist; the feed only needs the newest few.
      const [recent, c, v] = await Promise.all([
        fetchSubmissions({ pageSize: 8 }),
        fetchSubmissionCounts(),
        fetchDailyVolume(14),
      ])
      setRows(recent.rows); setCounts(c); setVolume(v)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    return subscribeToSubmissions(() => void load())
  }, [load])

  const summary = useMemo(() => {
    const byKind = {} as Record<SubmissionKind, { total: number; open: number }>
    for (const t of tiles) byKind[t.kind] = { total: 0, open: 0 }
    let openAll = 0
    for (const c of counts) {
      const bucket = byKind[c.kind]
      if (bucket) {
        bucket.total += c.count
        if (c.status !== 'closed') bucket.open += c.count
      }
      if (c.status !== 'closed') openAll += c.count
    }
    return { byKind, openAll }
  }, [counts])

  const series = useMemo(
    () => volume.map((v) => ({ date: v.day, count: Number(v.count) })),
    [volume],
  )

  const peak = Math.max(1, ...series.map((d) => d.count))
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <>
      <PortalHeading
        title={`Good ${greeting()}, ${firstName}`}
        subtitle={
          loading
            ? 'Loading the latest activity…'
            : summary.openAll > 0
              ? `${summary.openAll} submission${summary.openAll === 1 ? '' : 's'} still open across all inboxes.`
              : 'Every inbox is clear. Nice work.'
        }
      />

      {error ? (
        <Panel><ErrorState message={error} onRetry={() => void load()} /></Panel>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((t) => {
              const c = summary.byKind[t.kind]
              return (
                <Link
                  key={t.kind} to={t.to}
                  className="card-lift group flex flex-col gap-4 rounded-2xl border border-[color:var(--color-line)] bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] transition-colors duration-300 group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                      <t.icon size={18} strokeWidth={1.9} />
                    </span>
                    {!loading && c && c.open > 0 && (
                      <span className="rounded-full bg-[color:var(--color-warm)]/12 px-2 py-0.5 text-[0.6875rem] font-bold text-[color:var(--color-warm)]">
                        {c.open} open
                      </span>
                    )}
                  </div>
                  <div>
                    {loading ? (
                      <Skeleton className="h-8 w-14" />
                    ) : (
                      <p className="font-[var(--font-mono)] text-[1.875rem] font-bold leading-none tracking-tight text-[color:var(--color-primary)]">
                        {c?.total ?? 0}
                      </p>
                    )}
                    <p className="mt-1.5 text-[0.875rem] text-[color:var(--color-ink-muted)]">{t.label}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.75fr]">
            {/* Recent activity */}
            <Panel>
              <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
                <h2 className="t-h4 text-[1rem]">Recent activity</h2>
                <Link to="/portal/bookings" className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[color:var(--color-primary)]">
                  View inboxes <ArrowIcon />
                </Link>
              </div>

              {loading ? (
                <RowSkeleton />
              ) : rows.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No submissions yet"
                  body="When someone submits a form on the public website, it will appear here in real time."
                />
              ) : (
                <ul className="divide-y divide-[color:var(--color-line)]">
                  {rows.slice(0, 8).map((r) => (
                    <li key={r.id}>
                      <Link to={`${routeFor(r.kind)}/${r.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[color:var(--color-bg-muted)]">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <KindBadge kind={r.kind} />
                            <p className="truncate font-[var(--font-display)] text-[0.9375rem] font-semibold text-[color:var(--color-primary)]">
                              {r.name ?? r.email ?? 'Anonymous'}
                            </p>
                          </div>
                          <p className="mt-1 truncate text-[0.875rem] text-[color:var(--color-ink-secondary)]">
                            {r.subject ?? r.message ?? ', '}
                          </p>
                        </div>
                        <StatusBadge status={r.status} />
                        <TimeAgo iso={r.created_at} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            {/* Volume chart */}
            <Panel className="p-5">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[color:var(--color-accent)]" />
                <h2 className="t-h4 text-[1rem]">Last 14 days</h2>
              </div>
              <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                {series.reduce((a, d) => a + d.count, 0)} submissions received
              </p>

              {series.length === 0 || series.every((d) => d.count === 0) ? (
                <div className="mt-6 flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--color-line)] text-center">
                  <BarChart3 size={22} className="text-[color:var(--color-ink-muted)]" />
                  <p className="text-[0.875rem] font-medium text-[color:var(--color-ink-secondary)]">No submissions yet</p>
                  <p className="max-w-[16rem] text-[0.75rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                    Daily volume will chart here as enquiries come in from the website.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-7 flex h-40 items-end gap-1.5" role="img" aria-label={`Submissions per day for the last 14 days. Busiest day: ${peak}.`}>
                    {series.map((d) => (
                      <div key={d.date} className="group relative flex flex-1 flex-col items-center justify-end">
                        <span className="pointer-events-none absolute -top-7 z-10 whitespace-nowrap rounded-md bg-[color:var(--color-primary-dark)] px-2 py-1 text-[0.6875rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {d.count} on {formatDate(d.date, { month: 'short', day: 'numeric' })}
                        </span>
                        <div
                          className={cn(
                            'w-full rounded-t-[3px] transition-all duration-500 [transition-timing-function:var(--ease-premium)]',
                            d.count > 0
                              ? 'bg-[color:var(--color-primary-light)] group-hover:bg-[color:var(--color-primary)]'
                              : 'bg-[color:var(--color-line)]',
                          )}
                          style={{ height: `${Math.max((d.count / peak) * 100, 3)}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between text-[0.6875rem] text-[color:var(--color-ink-muted)]">
                    <span>{formatDate(series[0]?.date ?? new Date().toISOString(), { month: 'short', day: 'numeric' })}</span>
                    <span>Busiest day: {peak}</span>
                    <span>Today</span>
                  </div>
                </>
              )}
            </Panel>
          </div>
        </>
      )}
    </>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
}
