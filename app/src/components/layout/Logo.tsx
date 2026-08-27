import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { site } from '@/data/site'

/**
 * The supplied logo is light blue + gold artwork built for dark backgrounds.
 *
 * - `tone="dark"` (footer, deep surfaces) shows the full lockup as-is, which is
 *   exactly what it was designed for.
 * - `tone="light"` (white header) shows the emblem beside a wordmark set in the
 *   accessible blue, because the pastel wordmark only reaches 1.6:1 on white and
 *   the stacked lockup's tagline is unreadable at header height.
 */
export function Logo({
  tone = 'light',
  className,
  showTagline = false,
}: {
  tone?: 'light' | 'dark'
  className?: string
  showTagline?: boolean
}) {
  if (tone === 'dark') {
    return (
      <Link to="/" aria-label={`${site.name} home`} className={cn('inline-block shrink-0', className)}>
        <img
          src="/logo-full.png"
          alt={`${site.name}: ${site.tagline}`}
          width={640}
          height={459}
          className="h-20 w-auto md:h-24"
        />
      </Link>
    )
  }

  return (
    <Link
      to="/"
      aria-label={`${site.name} home`}
      className={cn('group inline-flex items-center gap-2.5 shrink-0', className)}
    >
      <img
        src="/logo-mark.png"
        alt=""
        width={256}
        height={216}
        className="h-10 w-auto shrink-0 transition-transform duration-300 [transition-timing-function:var(--ease-premium)] group-hover:scale-[1.04] md:h-11"
      />
      <span className="flex flex-col leading-none">
        <span className="font-[var(--font-display)] text-[1.0625rem] font-bold tracking-[-0.02em] text-[color:var(--color-primary)]">
          Premium <span className="text-[color:var(--color-gold-ink)]">Care</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-muted)]">
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  )
}
