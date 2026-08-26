import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'accent'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 font-[var(--font-display)] font-semibold ' +
  'rounded-full text-center text-balance select-none cursor-pointer ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-200 ' +
  '[transition-timing-function:var(--ease-premium)] active:scale-[0.97] ' +
  'disabled:opacity-55 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'text-white bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-primary)_100%)] ' +
    'shadow-[0_2px_8px_rgba(38,113,143,0.28)] hover:shadow-[0_8px_26px_rgba(38,113,143,0.42)] hover:-translate-y-px',
  accent:
    'text-[color:var(--color-primary-dark)] bg-[color:var(--color-sky)] ' +
    'shadow-[0_2px_8px_rgba(159,210,236,0.55)] hover:bg-[color:var(--color-sky)] hover:-translate-y-px',
  secondary:
    'text-[color:var(--color-primary)] bg-transparent border-[1.5px] border-[color:var(--color-line)] ' +
    'hover:bg-[color:var(--color-bg-soft)] hover:border-[color:var(--color-primary-light)]',
  dark:
    'text-white bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)] ' +
    'shadow-[0_2px_10px_rgba(15,42,61,0.2)] hover:-translate-y-px',
  ghost:
    'text-[color:var(--color-primary)] bg-transparent hover:text-[color:var(--color-primary-light)]',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 py-2 text-[0.8125rem]',
  md: 'min-h-11 px-5 py-2.5 text-[0.9375rem] sm:px-6',
  lg: 'min-h-[3.25rem] px-6 py-3 text-base sm:px-8',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  to?: string
  href?: string
  full?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', to, href, full, className, children, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], full && 'w-full', className)

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  )
})

/** Arrow that slides right on parent hover — spec §7 CTA behaviour. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden
      className={cn('transition-transform duration-300 [transition-timing-function:var(--ease-premium)] group-hover:translate-x-1', className)}
    >
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
