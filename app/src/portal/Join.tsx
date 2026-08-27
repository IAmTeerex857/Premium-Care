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
    code: z.string().trim().length(16, 'Enter the 16-character invitation code your administrator gave you.'),
    password: z.string()
      .min(8, 'Use at least 8 characters.')
      .regex(/[A-Za-z]/, 'Include at least one letter.')
      .regex(/\d/, 'Include at least one number.'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof schema>

export default function Join() {
  useSeo({ title: 'Create Your Staff Account, Premium Care', noindex: true })

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
      await signUp(v.email, v.password, v.fullName, v.code)
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
      subtitle="Use the exact email address you were invited with, plus the invitation code. Accounts cannot be created any other way."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/portal/login" className="link-underline font-semibold text-[color:var(--color-primary)]">Sign in</Link>
        </>
      }
    >
      {done ? (
        <Notice>
          Account created. If your project requires email confirmation, check your inbox before signing in, otherwise you are being redirected now.
        </Notice>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {!isSupabaseConfigured && (
            <Notice tone="warn">
              {import.meta.env.DEV
                ? <>Supabase is not connected. Add your keys to <code>app/.env.local</code> first.</>
                : 'Account creation is temporarily unavailable.'}
            </Notice>
          )}
          {error && <Notice tone="warn">{error}</Notice>}

          <Input label="Full name" autoComplete="name" required error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Invited email address" type="email" autoComplete="email" required error={errors.email?.message} {...register('email')} />
          <Input
            label="Invitation code" required autoComplete="off" spellCheck={false}
            placeholder="ABCD2345EFGH6789"
            hint="From the invitation your administrator sent you"
            className="font-[var(--font-mono)] tracking-[0.18em] uppercase"
            error={errors.code?.message} {...register('code')}
          />
          <Input label="Password" type="password" autoComplete="new-password" required hint="At least 8 characters, including a letter and number" error={errors.password?.message} {...register('password')} />
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
