import { cn, relativeTime } from '@/lib/utils'
import { KIND_LABEL, STATUS_LABEL, type SubmissionKind, type SubmissionStatus } from '@/lib/types'
import { Skeleton } from '@/components/ui/Misc'

export function PortalHeading({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="t-h2 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('rounded-2xl border border-[color:var(--color-line)] bg-white', className)}>
      {children}
    </div>
  )
}

const statusStyles: Record<SubmissionStatus, string> = {
  new: 'bg-[color:var(--color-accent)]/12 text-[color:var(--color-accent-dark)] border-[color:var(--color-accent)]/25',
  in_progress: 'bg-[color:var(--color-gold)]/25 text-[color:var(--color-gold-ink)] border-[color:var(--color-gold-strong)]/40',
  closed: 'bg-[color:var(--color-bg-soft)] text-[color:var(--color-ink-muted)] border-[color:var(--color-line)]',
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.75rem] font-semibold', statusStyles[status])}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  )
}

const kindStyles: Record<SubmissionKind, string> = {
  booking: 'bg-[#E3ECF8] text-[#1A4175]',
  contact: 'bg-[#E8ECF7] text-[#33477A]',
  referral: 'bg-[#DDE6F5] text-[#0F2A4D]',
  application: 'bg-[#FAF4E6] text-[#896B24]',
  newsletter: 'bg-[color:var(--color-bg-soft)] text-[color:var(--color-ink-secondary)]',
}

export function KindBadge({ kind }: { kind: SubmissionKind }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide', kindStyles[kind])}>
      {KIND_LABEL[kind]}
    </span>
  )
}

export function TimeAgo({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} title={new Date(iso).toLocaleString()} className="shrink-0 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
      {relativeTime(iso)}
    </time>
  )
}

export function EmptyState({ title, body, icon: Icon }: {
  title: string; body: string; icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-[color:var(--color-bg-soft)] text-[color:var(--color-ink-muted)]">
        <Icon size={24} />
      </span>
      <h3 className="t-h4 text-[1.0625rem]">{title}</h3>
      <p className="max-w-[24rem] text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{body}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <h3 className="t-h4 text-[1.0625rem] text-[color:var(--color-warm)]">Could not load this</h3>
      <p className="max-w-[28rem] text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-soft)]">
          Try again
        </button>
      )}
    </div>
  )
}

export function RowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-[color:var(--color-line)]">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

/** Maps a submission kind to its inbox route. */
export function routeFor(kind: SubmissionKind) {
  return {
    booking: '/portal/bookings',
    contact: '/portal/contacts',
    referral: '/portal/referrals',
    application: '/portal/applications',
    newsletter: '/portal/contacts',
  }[kind]
}
