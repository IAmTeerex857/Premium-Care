import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Mail, Phone, Send, Trash2 } from 'lucide-react'
import {
  addNote, deleteSubmission, fetchNotes, fetchProfiles, fetchSubmission, getResumeUrl,
  logSubmissionAccess, updateSubmission,
} from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Profile, Submission, SubmissionKind, SubmissionNote, SubmissionStatus } from '@/lib/types'
import { KIND_LABEL, STATUS_LABEL } from '@/lib/types'
import { cn, formatDateTime, initials } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Skeleton, Toast } from '@/components/ui/Misc'
import { ErrorState, KindBadge, Panel, routeFor, StatusBadge } from './components'

const statuses: SubmissionStatus[] = ['new', 'in_progress', 'closed']

export function SubmissionDetail({ id, kind, onChanged }: {
  id: string; kind: SubmissionKind; onChanged: () => void
}) {
  const { profile, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [row, setRow] = useState<Submission | null>(null)
  const [notes, setNotes] = useState<SubmissionNote[]>([])
  const [staff, setStaff] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const listRoute = routeFor(kind)

  // Tracks the submission the newest request was issued for, so a slow
  // response for a previously viewed row cannot overwrite the current one.
  const currentId = useRef(id)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [s, n, p] = await Promise.all([fetchSubmission(id), fetchNotes(id), fetchProfiles()])
      if (currentId.current !== id) return
      setRow(s); setNotes(n); setStaff(p.filter((x) => x.is_active))
      void logSubmissionAccess(id)
    } catch (err) {
      if (currentId.current !== id) return
      setError(err instanceof Error ? err.message : 'Failed to load this submission.')
    } finally {
      if (currentId.current === id) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    currentId.current = id
    setLoading(true)
    setRow(null)
    setNotes([])
    void load()
  }, [id, load])

  async function changeStatus(status: SubmissionStatus) {
    if (!row) return
    const previous = row.status
    setRow({ ...row, status })
    try {
      await updateSubmission(row.id, { status })
      setToast(`Marked as ${STATUS_LABEL[status].toLowerCase()}`)
      onChanged()
    } catch (err) {
      setRow({ ...row, status: previous })
      setToast(err instanceof Error ? err.message : 'Could not update the status.')
    }
  }

  async function changeAssignee(assigned_to: string | null) {
    if (!row) return
    try {
      await updateSubmission(row.id, { assigned_to })
      await load()
      setToast(assigned_to ? 'Assignment updated' : 'Assignment cleared')
      onChanged()
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not update the assignment.')
    }
  }

  async function submitNote(e: React.FormEvent) {
    e.preventDefault()
    if (!noteText.trim() || !profile) return
    setSavingNote(true)
    try {
      await addNote(id, profile.id, noteText.trim())
      setNoteText('')
      setNotes(await fetchNotes(id))
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not save the note.')
    } finally {
      setSavingNote(false)
    }
  }

  async function onDelete() {
    if (!confirm('Permanently delete this submission and all of its notes? This cannot be undone.')) return
    try {
      await deleteSubmission(id)
      onChanged()
      navigate(listRoute, { replace: true })
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not delete the submission.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-4 w-32" />
        <Panel className="p-6"><div className="space-y-3"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-24 w-full" /></div></Panel>
      </div>
    )
  }

  if (error || !row) {
    return <Panel><ErrorState message={error ?? 'Submission not found.'} onRetry={() => void load()} /></Panel>
  }

  return (
    <>
      <Link to={listRoute} className="group mb-6 inline-flex items-center gap-2 text-[0.875rem] font-medium text-[color:var(--color-ink-secondary)] transition-colors hover:text-[color:var(--color-primary)]">
        <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
        Back to {KIND_LABEL[kind].toLowerCase()}s
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        {/* Main */}
        <div className="flex flex-col gap-5">
          <Panel className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <KindBadge kind={row.kind} />
              <StatusBadge status={row.status} />
              <span className="text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                Received {formatDateTime(row.created_at)}
              </span>
            </div>

            <h1 className="t-h2 mt-4 text-[clamp(1.375rem,1.2rem+1vw,1.75rem)]">
              {row.name ?? row.email ?? 'Anonymous submission'}
            </h1>
            {row.subject && <p className="mt-2 text-[1rem] text-[color:var(--color-ink-secondary)]">{row.subject}</p>}

            <div className="mt-5 flex flex-wrap gap-2">
              {row.email && (
                <a href={`mailto:${row.email}`} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[0.8125rem] font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)]">
                  <Mail size={14} /> {row.email}
                </a>
              )}
              {row.phone && (
                <a href={`tel:${row.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-[0.8125rem] font-medium text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)]">
                  <Phone size={14} /> {row.phone}
                </a>
              )}
            </div>

            {row.message && (
              <div className="mt-6 rounded-xl bg-[color:var(--color-bg-muted)] p-5">
                <p className="t-label mb-2">Message</p>
                <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-[color:var(--color-ink)]">{row.message}</p>
              </div>
            )}

            {typeof row.payload?.resume_path === 'string' && (
              <div className="mt-6">
                <p className="t-label mb-2">Resume</p>
                <ResumeLink
                  path={row.payload.resume_path as string}
                  filename={(row.payload.resume_filename as string) ?? 'resume'}
                />
              </div>
            )}

            {Object.keys(row.payload ?? {}).length > 0 && (
              <div className="mt-5">
                <p className="t-label mb-3">Submitted details</p>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {flatten(row.payload)
                    .filter(([k]) => !/^Resume (Path|Filename)$/.test(k))
                    .map(([k, v]) => (
                    <div key={k} className="border-b border-[color:var(--color-line)] pb-2">
                      <dt className="text-[0.75rem] font-semibold uppercase tracking-wide text-[color:var(--color-ink-muted)]">{humanize(k)}</dt>
                      <dd className="mt-1 text-[0.9375rem] text-[color:var(--color-ink)]">{v}</dd>
                    </div>
                    ))}
                </dl>
              </div>
            )}
          </Panel>

          {/* Notes */}
          <Panel className="p-6">
            <h2 className="t-h4 text-[1rem]">Internal notes</h2>
            <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
              Visible to staff only. Never shown to the person who submitted the form.
            </p>

            {notes.length > 0 && (
              <ul className="mt-5 flex flex-col gap-4">
                {notes.map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-primary)] text-[0.6875rem] font-bold text-white">
                      {initials(n.author?.full_name, n.author?.email)}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl bg-[color:var(--color-bg-muted)] px-4 py-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-[var(--font-display)] text-[0.8125rem] font-semibold text-[color:var(--color-primary)]">
                          {n.author?.full_name ?? n.author?.email ?? 'Staff'}
                        </span>
                        <span className="text-[0.75rem] text-[color:var(--color-ink-muted)]">{formatDateTime(n.created_at)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-[color:var(--color-ink)]">{n.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={submitNote} className="mt-5 flex flex-col gap-3">
              <label htmlFor="note" className="sr-only">Add an internal note</label>
              <textarea
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note, what you tried, what the family said, what happens next…"
                rows={3}
                className="w-full resize-y rounded-xl border-[1.5px] border-[color:var(--color-line)] bg-[color:var(--color-bg-muted)] p-4 text-[0.9375rem] outline-none transition-all focus:border-[color:var(--color-primary-light)] focus:shadow-[0_0_0_3px_rgba(39,89,155,0.15)]"
              />
              <Button type="submit" size="sm" className="self-start" disabled={!noteText.trim() || savingNote}>
                <Send size={14} /> {savingNote ? 'Saving…' : 'Add note'}
              </Button>
            </form>
          </Panel>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-8 lg:self-start">
          <Panel className="p-5">
            <p className="t-label mb-3">Status</p>
            <div className="flex flex-col gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => void changeStatus(s)}
                  aria-pressed={row.status === s}
                  className={cn(
                    'flex items-center justify-between rounded-xl border px-4 py-2.5 text-[0.875rem] font-semibold transition-all duration-200 active:scale-[0.98]',
                    row.status === s
                      ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                      : 'border-[color:var(--color-line)] text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)]',
                  )}
                >
                  {STATUS_LABEL[s]}
                  {row.status === s && <span className="size-1.5 rounded-full bg-[color:var(--color-accent)]" />}
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <label htmlFor="assignee" className="t-label mb-3 block">Assigned to</label>
            <select
              id="assignee"
              value={row.assigned_to ?? ''}
              onChange={(e) => void changeAssignee(e.target.value || null)}
              className="h-11 w-full cursor-pointer rounded-xl border-[1.5px] border-[color:var(--color-line)] bg-[color:var(--color-bg-muted)] px-3 text-[0.875rem] outline-none focus:border-[color:var(--color-primary-light)]"
            >
              <option value="">Unassigned</option>
              {staff.map((p) => (
                <option key={p.id} value={p.id}>{p.full_name ?? p.email}</option>
              ))}
            </select>
            <p className="mt-2 text-[0.75rem] text-[color:var(--color-ink-muted)]">
              Last updated {formatDateTime(row.updated_at)}
            </p>
          </Panel>

          {isAdmin && (
            <Panel className="p-5">
              <p className="t-label mb-3">Danger zone</p>
              <button
                onClick={() => void onDelete()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-warm)]/40 px-4 py-2.5 text-[0.875rem] font-semibold text-[color:var(--color-warm)] transition-colors hover:bg-[color:var(--color-warm)]/8"
              >
                <Trash2 size={15} /> Delete submission
              </button>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                Permanent. Only administrators can delete.
              </p>
            </Panel>
          )}
        </div>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  )
}

/** Flattens the jsonb payload one level deep into label/value pairs. */
function flatten(payload: Record<string, unknown>, prefix = ''): Array<[string, string]> {
  const out: Array<[string, string]> = []
  for (const [k, v] of Object.entries(payload ?? {})) {
    if (v === null || v === undefined || v === '') continue
    const key = prefix ? `${prefix} ${k}` : k
    if (Array.isArray(v)) {
      out.push([key, v.join(', ')])
    } else if (typeof v === 'object') {
      out.push(...flatten(v as Record<string, unknown>, key))
    } else {
      out.push([key, String(v)])
    }
  }
  return out
}

function humanize(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Fetches a short-lived signed URL only when staff actually asks for it. */
function ResumeLink({ path, filename }: { path: string; filename: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function open() {
    setBusy(true); setErr(null)
    try {
      const url = await getResumeUrl(path)
      window.open(url, '_blank', 'noopener')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not open the resume.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => void open()}
        disabled={busy}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2.5 text-[0.875rem] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)] disabled:opacity-60"
      >
        <Download size={15} /> {busy ? 'Preparing...' : filename}
      </button>
      {err && <p className="text-[0.8125rem] text-[color:var(--color-warm)]">{err}</p>}
      <p className="text-[0.75rem] text-[color:var(--color-ink-muted)]">
        Opens a private link that expires after 5 minutes.
      </p>
    </div>
  )
}
