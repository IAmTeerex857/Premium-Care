import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Inbox as InboxIcon, Search } from 'lucide-react'
import { fetchSubmissions, subscribeToSubmissions } from '@/lib/api'
import type { Submission, SubmissionKind, SubmissionStatus } from '@/lib/types'
import { STATUS_LABEL } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EmptyState, ErrorState, KindBadge, Panel, PortalHeading, RowSkeleton, routeFor, StatusBadge, TimeAgo } from './components'
import { SubmissionDetail } from './SubmissionDetail'
import { useSeo } from '@/hooks/useSeo'

const config: Record<SubmissionKind, { title: string; subtitle: string; empty: string }> = {
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
  referral: {
    title: 'Referrals',
    subtitle: 'Client referrals from discharge planners, social workers, and partners.',
    empty: 'Referrals submitted by professional partners will appear here.',
  },
  application: {
    title: 'Job applications',
    subtitle: 'Applications submitted through the careers page.',
    empty: 'Applications from the careers page will appear here.',
  },
  newsletter: {
    title: 'Newsletter signups',
    subtitle: 'Email addresses collected from the footer signup form.',
    empty: 'Newsletter signups will appear here.',
  },
}

const statusFilters: Array<SubmissionStatus | 'all'> = ['all', 'new', 'in_progress', 'closed']

export function Inbox({ kind }: { kind: SubmissionKind }) {
  const meta = config[kind]
  useSeo({ title: `${meta.title}, Premium Care Portal` })

  const { id } = useParams()
  const [rows, setRows] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<SubmissionStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setError(null)
    try {
      // The contact inbox also surfaces newsletter signups.
      const all = await fetchSubmissions()
      setRows(all.filter((r) => (kind === 'contact' ? r.kind === 'contact' || r.kind === 'newsletter' : r.kind === kind)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }, [kind])

  useEffect(() => {
    setLoading(true)
    void load()
    return subscribeToSubmissions(() => void load())
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (!q) return true
      return [r.name, r.email, r.phone, r.subject, r.message]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    })
  }, [rows, status, search])

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
          const count = s === 'all' ? rows.length : rows.filter((r) => r.status === s).length
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              aria-pressed={status === s}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all duration-200 active:scale-[0.97]',
                status === s
                  ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                  : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)]',
              )}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
              <span className={cn('rounded-full px-1.5 text-[0.6875rem]', status === s ? 'bg-white/20' : 'bg-[color:var(--color-bg-soft)]')}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <Panel>
        {error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : loading ? (
          <RowSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title={rows.length === 0 ? 'Nothing here yet' : 'No matching submissions'}
            body={rows.length === 0 ? meta.empty : 'Try a different search term or status filter.'}
          />
        ) : (
          <ul className="divide-y divide-[color:var(--color-line)]">
            {filtered.map((r) => (
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
    </>
  )
}
