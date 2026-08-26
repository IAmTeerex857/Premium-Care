import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Mail, ShieldCheck, UserPlus, Users, X } from 'lucide-react'
import {
  createInvite, fetchInvites, fetchProfiles, revokeInvite, setProfileActive, setProfileRole,
} from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { Invite, Profile, UserRole } from '@/lib/types'
import { cn, formatDate, initials } from '@/lib/utils'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Field'
import { Notice, SubmitStatus, Toast, type SubmitState } from '@/components/ui/Misc'
import { EmptyState, ErrorState, Panel, PortalHeading, RowSkeleton } from './components'
import { useSeo } from '@/hooks/useSeo'

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  full_name: z.string().trim().optional(),
  role: z.enum(['admin', 'member']),
})
type FormValues = z.infer<typeof schema>

export default function Team() {
  useSeo({ title: 'Team — Premium Care Portal' })

  const { profile } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [p, i] = await Promise.all([fetchProfiles(), fetchInvites()])
      setProfiles(p); setInvites(i)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the team.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const pending = invites.filter((i) => !i.accepted_at)

  async function onRoleChange(id: string, role: UserRole) {
    try {
      await setProfileRole(id, role)
      await load()
      setToast(`Role updated to ${role}`)
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not update the role.')
    }
  }

  async function onActiveChange(id: string, active: boolean) {
    try {
      await setProfileActive(id, active)
      await load()
      setToast(active ? 'Member reactivated' : 'Member deactivated')
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not update the member.')
    }
  }

  async function onRevoke(id: string) {
    if (!confirm('Revoke this invitation? The person will no longer be able to create an account with it.')) return
    try {
      await revokeInvite(id)
      await load()
      setToast('Invitation revoked')
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Could not revoke the invitation.')
    }
  }

  return (
    <>
      <PortalHeading
        title="Team"
        subtitle="Invite staff members, set their role, and manage portal access."
        action={
          <Button size="md" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <X size={16} /> : <UserPlus size={16} />}
            {showForm ? 'Cancel' : 'Invite a member'}
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="mb-5 overflow-hidden"
          >
            <InviteForm
              adminId={profile?.id ?? ''}
              onCreated={async (invite) => {
                await load()
                setToast(`Invitation created for ${invite.email}`)
                setShowForm(false)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <Panel><ErrorState message={error} onRetry={() => void load()} /></Panel>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Pending invitations */}
          {pending.length > 0 && (
            <Panel>
              <div className="border-b border-[color:var(--color-line)] px-5 py-4">
                <h2 className="t-h4 text-[1rem]">Pending invitations</h2>
                <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                  These people can create an account at <code className="rounded bg-[color:var(--color-bg-soft)] px-1.5 py-0.5">/portal/join</code> using this exact email address.
                </p>
              </div>
              <ul className="divide-y divide-[color:var(--color-line)]">
                {pending.map((i) => (
                  <li key={i.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-[var(--font-display)] text-[0.9375rem] font-semibold text-[color:var(--color-primary)]">
                          {i.full_name ?? i.email}
                        </p>
                        <RoleChip role={i.role} />
                      </div>
                      <p className="mt-0.5 truncate text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                        {i.email} · invited {formatDate(i.created_at, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <CopyButton text={`${window.location.origin}/portal/join`} label="Copy join link" />
                      <button
                        onClick={() => void onRevoke(i.id)}
                        className="rounded-full border border-[color:var(--color-line)] px-3.5 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-warm)] transition-colors hover:bg-[color:var(--color-warm)]/8"
                      >
                        Revoke
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Members */}
          <Panel>
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
              <h2 className="t-h4 text-[1rem]">Members</h2>
              <span className="text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                {profiles.length} account{profiles.length === 1 ? '' : 's'}
              </span>
            </div>

            {loading ? (
              <RowSkeleton rows={4} />
            ) : profiles.length === 0 ? (
              <EmptyState icon={Users} title="No members yet" body="Invite your first team member to get started." />
            ) : (
              <ul className="divide-y divide-[color:var(--color-line)]">
                {profiles.map((p) => {
                  const isSelf = p.id === profile?.id
                  return (
                    <li key={p.id} className={cn('flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between', !p.is_active && 'opacity-60')}>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[color:var(--color-primary)] text-[0.8125rem] font-bold text-white">
                          {initials(p.full_name, p.email)}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate font-[var(--font-display)] text-[0.9375rem] font-semibold text-[color:var(--color-primary)]">
                              {p.full_name ?? p.email}
                            </p>
                            {isSelf && (
                              <span className="rounded-full bg-[color:var(--color-bg-soft)] px-2 py-0.5 text-[0.6875rem] font-semibold text-[color:var(--color-ink-muted)]">You</span>
                            )}
                            {!p.is_active && (
                              <span className="rounded-full bg-[color:var(--color-warm)]/12 px-2 py-0.5 text-[0.6875rem] font-semibold text-[color:var(--color-warm)]">Deactivated</span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                            {p.email} · joined {formatDate(p.created_at, { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <label className="sr-only" htmlFor={`role-${p.id}`}>Role for {p.email}</label>
                        <select
                          id={`role-${p.id}`}
                          value={p.role}
                          disabled={isSelf}
                          onChange={(e) => void onRoleChange(p.id, e.target.value as UserRole)}
                          title={isSelf ? 'You cannot change your own role' : undefined}
                          className="h-10 cursor-pointer rounded-full border-[1.5px] border-[color:var(--color-line)] bg-white px-3.5 text-[0.8125rem] font-semibold text-[color:var(--color-primary)] outline-none focus:border-[color:var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => void onActiveChange(p.id, !p.is_active)}
                          disabled={isSelf}
                          title={isSelf ? 'You cannot deactivate yourself' : undefined}
                          className="rounded-full border border-[color:var(--color-line)] px-3.5 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-ink-secondary)] transition-colors hover:bg-[color:var(--color-bg-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {p.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Notice>
            <strong className="font-semibold">How invitations work:</strong> creating an invitation does not send an
            email by itself — pass the join link to your new member however you normally would. When they sign up at{' '}
            <code>/portal/join</code> with the invited email address, the database grants them the role you selected here.
          </Notice>
        </div>
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  )
}

function RoleChip({ role }: { role: UserRole }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide',
      role === 'admin'
        ? 'bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]'
        : 'bg-[color:var(--color-bg-soft)] text-[color:var(--color-ink-secondary)]',
    )}>
      {role === 'admin' && <ShieldCheck size={11} />}
      {role}
    </span>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-line)] px-3.5 py-2 text-[0.8125rem] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-bg-soft)]"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied' : label}
    </button>
  )
}

function InviteForm({ adminId, onCreated }: { adminId: string; onCreated: (invite: Invite) => void }) {
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'member' },
  })

  async function onSubmit(v: FormValues) {
    setError(null); setState('loading')
    try {
      const invite = await createInvite({ email: v.email, role: v.role, full_name: v.full_name, invited_by: adminId })
      setState('idle'); reset()
      onCreated(invite)
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Could not create the invitation.')
    }
  }

  return (
    <Panel className="p-6">
      <div className="flex items-center gap-2">
        <Mail size={17} className="text-[color:var(--color-accent)]" />
        <h2 className="t-h4 text-[1rem]">Invite a team member</h2>
      </div>
      <p className="mt-1.5 text-[0.875rem] text-[color:var(--color-ink-secondary)]">
        They will be able to create their own account with this email address and the role you choose.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
        {error && <Notice tone="warn">{error}</Notice>}
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Email address" type="email" required placeholder="name@premiumcare.com" error={errors.email?.message} {...register('email')} />
          <Input label="Full name" placeholder="Optional" error={errors.full_name?.message} {...register('full_name')} />
          <Select label="Role" required error={errors.role?.message} {...register('role')}>
            <option value="member">Member — read and manage submissions</option>
            <option value="admin">Admin — full access including Team</option>
          </Select>
        </div>
        <Button type="submit" size="md" className="self-start" disabled={state === 'loading'}>
          <SubmitStatus state={state} idleLabel="Create invitation" />
          {state === 'idle' && <ArrowIcon />}
        </Button>
      </form>
    </Panel>
  )
}
