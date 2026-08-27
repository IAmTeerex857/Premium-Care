import { Link } from 'react-router-dom'
import { AlertTriangle, DatabaseZap, ShieldOff } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/layout/Logo'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Misc'
import { useSeo } from '@/hooks/useSeo'

type Variant = 'loading' | 'unconfigured' | 'no-profile' | 'deactivated'

export function PortalSplash({ variant }: { variant: Variant }) {
  useSeo({ title: 'Premium Care Portal', noindex: true })
  const { signOut } = useAuth()

  if (variant === 'loading') {
    return (
      <div className="grid min-h-dvh place-items-center bg-[color:var(--color-bg-soft)] px-6">
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          <Logo />
          <div className="w-full space-y-3">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <p className="shimmer-text text-[0.875rem] font-medium">Loading your workspace…</p>
        </div>
      </div>
    )
  }

  const copy = {
    unconfigured: {
      icon: DatabaseZap,
      title: 'Portal not connected yet',
      body: import.meta.env.DEV
        ? 'The staff portal needs a Supabase project. Add its environment keys and restart the development server.'
        : 'The staff portal is temporarily unavailable. Please contact an administrator.',
    },
    'no-profile': {
      icon: AlertTriangle,
      title: 'No staff profile found',
      body: 'Your account exists but has no staff profile attached. Ask an administrator to review your access or send a new invitation.',
    },
    deactivated: {
      icon: ShieldOff,
      title: 'Account deactivated',
      body: 'Your access to the staff portal has been turned off. Contact an administrator if you believe this is a mistake.',
    },
  }[variant]

  const Icon = copy.icon

  return (
    <div className="grid min-h-dvh place-items-center bg-[color:var(--color-bg-soft)] px-6 py-16">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-[color:var(--color-line)] bg-white p-9 text-center shadow-[0_20px_60px_-30px_rgba(15,42,61,0.4)]">
        <Logo />
        <span className="grid size-14 place-items-center rounded-2xl bg-[color:var(--color-warm)]/10 text-[color:var(--color-warm)]">
          <Icon size={26} strokeWidth={1.8} />
        </span>
        <h1 className="t-h3">{copy.title}</h1>
        <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{copy.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button to="/" variant="secondary" size="sm">Back to website</Button>
          {variant !== 'unconfigured' && (
            <Button size="sm" onClick={() => void signOut()}>Sign out</Button>
          )}
        </div>
        {variant === 'unconfigured' && (
          <Link to="/portal/login" className="text-[0.8125rem] text-[color:var(--color-ink-muted)] underline">
            Go to the sign-in page anyway
          </Link>
        )}
      </div>
    </div>
  )
}
