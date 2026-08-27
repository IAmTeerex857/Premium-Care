import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Logo } from '@/components/layout/Logo'
import { Input } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'
import { OrbField } from '@/components/ui/Orb'
import { useSeo } from '@/hooks/useSeo'

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})
type FormValues = z.infer<typeof schema>

export function PortalShell({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode
}) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[color:var(--color-bg-soft)] px-5 py-12">
      <OrbField />
      <div className="relative w-full max-w-[26rem]">
        <Link to="/" className="group mb-7 inline-flex items-center gap-2 text-[0.875rem] font-medium text-[color:var(--color-ink-secondary)] transition-colors hover:text-[color:var(--color-primary)]">
          <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to website
        </Link>

        <div className="rounded-3xl border border-[color:var(--color-line)] bg-white p-8 shadow-[0_24px_70px_-32px_rgba(15,42,61,0.42)]">
          <Logo />
          <h1 className="t-h3 mt-7">{title}</h1>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-[0.875rem] text-[color:var(--color-ink-secondary)]">{footer}</div>}
      </div>
    </div>
  )
}

export default function Login() {
  useSeo({ title: 'Staff Sign In, Premium Care', noindex: true })

  const { signIn, session, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [resetNote, setResetNote] = useState<string | null>(null)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  if (session) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
    return <Navigate to={from ?? '/portal'} replace />
  }

  async function onSubmit(v: FormValues) {
    setError(null); setResetNote(null); setState('loading')
    try {
      await signIn(v.email, v.password)
      navigate('/portal', { replace: true })
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    }
  }

  async function onReset() {
    const email = getValues('email')
    if (!email) {
      setError('Enter your email address first, then choose "Forgot password".')
      return
    }
    setError(null)
    try {
      await resetPassword(email)
      setResetNote(`If an account exists for ${email}, a password reset link is on its way.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset email.')
    }
  }

  return (
    <PortalShell
      title="Staff sign in"
      subtitle="Access the Premium Care employee portal."
      footer={
        <>
          Been invited but have no account yet?{' '}
          <Link to="/portal/join" className="link-underline font-semibold text-[color:var(--color-primary)]">
            Create your account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {!isSupabaseConfigured && (
          <Notice tone="warn">
            {import.meta.env.DEV
              ? <>Supabase is not connected. Add your project URL and anon key to <code>app/.env.local</code>, then restart the dev server.</>
              : 'The staff portal is temporarily unavailable.'}
          </Notice>
        )}
        {error && <Notice tone="warn">{error}</Notice>}
        {resetNote && <Notice>{resetNote}</Notice>}

        <Input label="Work email" type="email" autoComplete="email" placeholder="you@premiumcare.com" required error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" placeholder="••••••••" required error={errors.password?.message} {...register('password')} />

        <button type="button" onClick={() => void onReset()} className="-mt-2 self-start py-1.5 text-[0.8125rem] font-medium text-[color:var(--color-primary-light)] hover:underline">
          Forgot your password?
        </button>

        <Button type="submit" size="lg" full disabled={state === 'loading' || !isSupabaseConfigured}>
          <SubmitStatus state={state} idleLabel="Sign in" />
          {state === 'idle' && <ArrowIcon />}
        </Button>
      </form>
    </PortalShell>
  )
}
