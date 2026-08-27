import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'
import { PortalShell } from './Login'
import { useSeo } from '@/hooks/useSeo'

const schema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: 'Passwords do not match.', path: ['confirm'] })

type FormValues = z.infer<typeof schema>

/**
 * Landing page for the emailed recovery link.
 *
 * Supabase puts the session in the URL fragment and fires PASSWORD_RECOVERY.
 * Until the new password is saved we must NOT treat this like a normal signed
 * in session, or the guard would bounce the user to the dashboard before they
 * could change anything, which is what made recovery useless before.
 */
export default function ResetPassword() {
  useSeo({ title: 'Set a New Password, Premium Care' })

  const { updatePassword, signOut } = useAuth()
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (!supabase) return
    // A recovery link may already be exchanged by the time we mount.
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)))
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function onSubmit(v: FormValues) {
    setError(null)
    setState('loading')
    try {
      await updatePassword(v.password)
      setState('success')
      // Force a clean sign in with the new credentials.
      setTimeout(async () => {
        await signOut()
        navigate('/portal/login', { replace: true })
      }, 1400)
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Could not update your password.')
    }
  }

  return (
    <PortalShell
      title="Set a new password"
      subtitle="Choose a new password for your Premium Care staff account."
      footer={<Link to="/portal/login" className="link-underline font-semibold text-[color:var(--color-primary)]">Back to sign in</Link>}
    >
      {!ready ? (
        <Notice tone="warn">
          This page needs a valid recovery link. Open the most recent
          {' '}password reset email and use the link inside it. Links expire after one hour.
        </Notice>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {error && <Notice tone="warn">{error}</Notice>}
          <Input label="New password" type="password" autoComplete="new-password" required
                 hint="At least 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm new password" type="password" autoComplete="new-password" required
                 error={errors.confirm?.message} {...register('confirm')} />
          <Button type="submit" size="lg" full disabled={state === 'loading'}>
            <SubmitStatus state={state} idleLabel="Save new password" successLabel="Password updated" />
            {state === 'idle' && <ArrowIcon />}
          </Button>
        </form>
      )}
    </PortalShell>
  )
}
