import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Inbox as InboxIcon, Search } from 'lucide-react'
import { fetchSubmissionCounts, fetchSubmissions, subscribeToSubmissions } from '@/lib/api'
import type { Submission, SubmissionKind, SubmissionStatus } from '@/lib/types'
import { STATUS_LABEL } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EmptyState, ErrorState, KindBadge, Panel, PortalHeading, RowSkeleton, routeFor, StatusBadge, TimeAgo } from './components'
import { SubmissionDetail } from './SubmissionDetail'
import { useSeo } from '@/hooks/useSeo'

type InboxKind = Exclude<SubmissionKind, 'referral' | 'newsletter'>

const config: Record<InboxKind, { title: string; subtitle: string; empty: string }> = {
  booking: {
    title: 'Appointment requests',
    subtitle: 'Consultation and assessment requests from the website booking forms.',
    empty: 'Appointment requests submitted through the website will appear here.',
  },
  contact: {
    title: 'Messages',
    subtitle: 'General enquiries from the contact form and newsletter signups.',
    empty: 'Messages sent through the contact form will appear here.',
  },
  application: {
    title: 'Job applications',
    subtitle: 'Applications submitted through the careers page.',
    empty: 'Applications from the careers page will appear here.',
  },
}

const statusFilters: Array<SubmissionStatus | 'all'> = ['all', 'new', 'in_progress', 'closed']
const PAGE_SIZE = 50

export function Inbox({ kind }: { kind: InboxKind }) {
  const meta = config[kind]
  useSeo({ title: `${meta.title}, Premium Care Portal`, noindex: true })

  const { id } = useParams()
  const [rows, setRows] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState<Record<SubmissionStatus, number> | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<SubmissionStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const requestId = useRef(0)

  const kinds = useMemo<SubmissionKind[]>(
    () => kind === 'contact' ? ['contact', 'newsletter', 'referral'] : [kind],
    [kind],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPageIndex(0)
      setDebouncedSearch(search.trim())
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPageIndex(0)
    setStatus('all')
    setSearch('')
    setDebouncedSearch('')
  }, [kind])

  const load = useCallback(async () => {
    const request = ++requestId.current
    setError(null)
    try {
      const [page, aggregateCounts] = await Promise.all([
        fetchSubmissions({
          kind: kinds,
          status,
          search: debouncedSearch,
          pageSize: PAGE_SIZE,
          page: pageIndex,
        }),
        fetchSubmissionCounts().catch(() => null),
      ])
      if (request !== requestId.current) return

      if (aggregateCounts) {
        const nextCounts = { new: 0, in_progress: 0, closed: 0 }
        for (const count of aggregateCounts) {
          if (kinds.includes(count.kind)) nextCounts[count.status] += Number(count.count)
        }
        setCounts(nextCounts)
      }
      const lastPage = Math.max(0, Math.ceil(page.total / PAGE_SIZE) - 1)
      if (pageIndex > lastPage) {
        setTotal(page.total)
        setPageIndex(lastPage)
        return
      }
      setRows(page.rows)
      setTotal(page.total)
    } catch (err) {
      if (request !== requestId.current) return
      setError(err instanceof Error ? err.message : 'Failed to load submissions.')
    } finally {
      if (request === requestId.current) setLoading(false)
    }
  }, [debouncedSearch, kinds, pageIndex, status])

  useEffect(() => {
    setLoading(true)
    void load()
    const unsubscribe = subscribeToSubmissions(() => void load())
    return () => {
      requestId.current += 1
      unsubscribe()
    }
  }, [load])

  // Detail view for a single submission.
  if (id) return <SubmissionDetail id={id} kind={kind} onChanged={() => void load()} />

  return (
    <>
      <PortalHeading
        title={meta.title}
        subtitle={meta.subtitle}
        action={
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-muted)]" />
            <label htmlFor="inbox-search" className="sr-only">Search submissions</label>
            <input
              id="inbox-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, message…"
              className="h-11 w-full rounded-full border-[1.5px] border-[color:var(--color-line)] bg-white pl-10 pr-4 text-[0.875rem] outline-none transition-all focus:border-[color:var(--color-primary-light)] focus:shadow-[0_0_0_3px_rgba(39,89,155,0.15)]"
            />
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {statusFilters.map((s) => {
          const count = counts && (s === 'all' ? counts.new + counts.in_progress + counts.closed : counts[s])
          return (
            <button
              key={s}
              onClick={() => { setPageIndex(0); setStatus(s) }}
              aria-pressed={status === s}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all duration-200 active:scale-[0.97]',
                status === s
                  ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                  : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)]',
              )}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
              {count !== null && (
                <span className={cn('rounded-full px-1.5 text-[0.6875rem]', status === s ? 'bg-white/20' : 'bg-[color:var(--color-bg-soft)]')}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {(debouncedSearch || status !== 'all') && !loading && !error && (
        <p className="-mt-2 mb-4 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
          {total} matching submission{total === 1 ? '' : 's'}
        </p>
      )}

      <Panel>
        {error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : loading ? (
          <RowSkeleton rows={6} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title={status === 'all' && !debouncedSearch ? 'Nothing here yet' : 'No matching submissions'}
            body={status === 'all' && !debouncedSearch ? meta.empty : 'Try a different search term or status filter.'}
          />
        ) : (
          <ul className="divide-y divide-[color:var(--color-line)]">
            {rows.map((r) => (
              <li key={r.id}>
                <Link
                  to={`${routeFor(kind)}/${r.id}`}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-[color:var(--color-bg-muted)] sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {kind === 'contact' && <KindBadge kind={r.kind} />}
                      <p className="truncate font-[var(--font-display)] text-[0.9375rem] font-semibold text-[color:var(--color-primary)]">
                        {r.name ?? r.email ?? 'Anonymous'}
                      </p>
                      {r.email && r.name && (
                        <span className="truncate text-[0.8125rem] text-[color:var(--color-ink-muted)]">{r.email}</span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-[0.875rem] text-[color:var(--color-ink-secondary)]">
                      {r.subject ?? r.message ?? ', '}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {r.assignee && (
                      <span className="hidden rounded-full bg-[color:var(--color-bg-soft)] px-2.5 py-1 text-[0.75rem] text-[color:var(--color-ink-secondary)] md:inline">
                        {r.assignee.full_name ?? r.assignee.email}
                      </span>
                    )}
                    <StatusBadge status={r.status} />
                    <TimeAgo iso={r.created_at} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {total > PAGE_SIZE && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-[0.8125rem] text-[color:var(--color-ink-muted)]">
            Showing {pageIndex * PAGE_SIZE + 1}
            {'\u2013'}
            {Math.min((pageIndex + 1) * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
              disabled={pageIndex === 0}
              className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPageIndex((i) => i + 1)}
              disabled={(pageIndex + 1) * PAGE_SIZE >= total}
              className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}
