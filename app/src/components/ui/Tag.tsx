import { cn } from '@/lib/utils'

/** Section eyebrow pill, spec §9.3. */
export function Tag({
  children,
  tone = 'light',
  className,
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 h-7 px-3 rounded-full text-[0.8125rem] font-medium border',
        tone === 'light'
          ? 'bg-[color:var(--color-bg-soft)] border-[color:var(--color-line)] text-[color:var(--color-ink-secondary)]'
          : 'bg-white/10 border-white/15 text-white/85',
        className,
      )}
    >
      {children}
    </span>
  )
}
