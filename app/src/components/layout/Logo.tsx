import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <Link to="/" aria-label="Premium Care — home" className={cn('inline-flex items-center gap-2.5 shrink-0', className)}>
      <span className="relative grid place-items-center size-9 rounded-[0.625rem] bg-[linear-gradient(135deg,var(--color-accent)_0%,var(--color-primary)_100%)] shadow-[0_2px_10px_rgba(46,196,182,0.3)]">
        <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" aria-hidden>
          <path d="M12 20s-6-4-6-8.4A3.8 3.8 0 0 1 12 8.6a3.8 3.8 0 0 1 6 3C18 16 12 20 12 20Z" fill="#fff" fillOpacity=".95" />
          <path d="M9.4 12.6h1.5l.8-1.9 1.1 3 .8-1.5h1.4" stroke="var(--color-primary)" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-[var(--font-display)] text-[1.0625rem] font-bold tracking-[-0.02em] leading-none">
        <span className={tone === 'dark' ? 'text-white' : 'text-[color:var(--color-primary)]'}>Premium</span>
        <span className="text-[color:var(--color-accent)]"> Care</span>
      </span>
    </Link>
  )
}
