import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Input } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'
import { PortalShell } from './Login'
import { useSeo } from '@/hooks/useSeo'

const schema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name.'),
    email: z.string().trim().email('Enter the email address you were invited with.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof schema>

export default function Join() {
  useSeo({ title: 'Create Your Staff Account — Premium Care' })

  const { signUp, session } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (session) return <Navigate to="/portal" replace />

  async function onSubmit(v: FormValues) {
    setError(null); setState('loading')
    try {
      await signUp(v.email, v.password, v.fullName)
      setState('success')
      setDone(true)
      // If email confirmation is off, the session already exists.
      setTimeout(() => navigate('/portal', { replace: true }), 1200)
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Could not create your account.')
    }
  }

  return (
    <PortalShell
      title="Create your account"
      subtitle="Use the exact email address your administrator invited. Accounts can only be created from an existing invitation."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/portal/login" className="link-underline font-semibold text-[color:var(--color-primary)]">Sign in</Link>
        </>
      }
    >
      {done ? (
        <Notice>
          Account created. If your project requires email confirmation, check your inbox before signing in —
          otherwise you are being redirected now.
        </Notice>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {!isSupabaseConfigured && (
            <Notice tone="warn">Supabase is not connected. Add your keys to <code>app/.env.local</code> first.</Notice>
          )}
          {error && <Notice tone="warn">{error}</Notice>}

          <Input label="Full name" autoComplete="name" required error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Invited email address" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" autoComplete="new-password" required hint="At least 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm password" type="password" autoComplete="new-password" required error={errors.confirm?.message} {...register('confirm')} />

          <Button type="submit" size="lg" full disabled={state === 'loading' || !isSupabaseConfigured}>
            <SubmitStatus state={state} idleLabel="Create account" successLabel="Account created" />
            {state === 'idle' && <ArrowIcon />}
          </Button>
        </form>
      )}
    </PortalShell>
  )
}
