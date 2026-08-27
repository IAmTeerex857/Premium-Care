import { AnimatePresence, motion } from 'framer-motion'
import { Check, Star, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Tag } from './Tag'
import { ThinkingOrb } from './Orb'
import { Reveal } from './Reveal'

/* --------------------------------- Heading -------------------------------- */
export function SectionHeading({
  tag, title, lead, align = 'center', tone = 'light', className, children,
}: {
  tag?: string; title: ReactNode; lead?: ReactNode
  align?: 'center' | 'left'; tone?: 'light' | 'dark'
  className?: string; children?: ReactNode
}) {
  return (
    <Reveal className={cn('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {tag && <Tag tone={tone}>{tag}</Tag>}
      <h2 className={cn('t-h2 max-w-[52rem]', tone === 'dark' && 'text-white')}>{title}</h2>
      {lead && (
        <p className={cn('t-lead max-w-[40rem]', tone === 'dark' && 'text-white/75')}>{lead}</p>
      )}
      {children}
    </Reveal>
  )
}

/* ---------------------------------- Card ---------------------------------- */
export function Card({ className, children, hover = true, ...rest }: { className?: string; children: ReactNode; hover?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-[color:var(--color-line)] shadow-[0_1px_3px_rgba(15,42,61,0.06)]',
        hover && 'card-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* -------------------------------- Skeleton -------------------------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} aria-hidden />
}

/* ------------------------------- StarRating ------------------------------- */
export function StarRating({ value = 5, size = 16 }: { value?: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < value ? 'fill-[color:var(--color-gold-strong)] text-[color:var(--color-gold-strong)]' : 'text-[color:var(--color-line)]'}
        />
      ))}
    </div>
  )
}

/* ------------------------------- Accordion -------------------------------- */
export function Accordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.q}
            className={cn(
              'rounded-2xl border bg-white transition-colors duration-300',
              isOpen ? 'border-[color:var(--color-primary-light)]/40 shadow-[0_8px_28px_-16px_rgba(15,42,61,0.28)]' : 'border-[color:var(--color-line)]',
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
            >
              <span className="t-h4 text-[1rem] md:text-[1.0625rem] text-[color:var(--color-primary)]">{item.q}</span>
              <span
                className={cn(
                  'grid place-items-center size-8 shrink-0 rounded-full border transition-all duration-300 [transition-timing-function:var(--ease-premium)]',
                  isOpen
                    ? 'rotate-45 bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white'
                    : 'border-[color:var(--color-line)] text-[color:var(--color-ink-muted)]',
                )}
              >
                <svg viewBox="0 0 14 14" className="size-3.5" fill="none" aria-hidden>
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-14 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)] md:px-6 md:pb-6">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ----------------------------- Submit button ------------------------------ */
export type SubmitState = 'idle' | 'loading' | 'success' | 'error'

/** Orb → checkmark morph on submit, spec §10 "Submit animation". */
export function SubmitStatus({ state, idleLabel, successLabel = 'Submitted' }: {
  state: SubmitState; idleLabel: string; successLabel?: string
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'loading' && (
          <motion.span key="l" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }}>
            <ThinkingOrb />
          </motion.span>
        )}
        {state === 'success' && (
          <motion.span key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
            <Check size={18} strokeWidth={2.6} />
          </motion.span>
        )}
      </AnimatePresence>
      <span>
        {state === 'loading' ? 'Sending…' : state === 'success' ? successLabel : idleLabel}
      </span>
    </span>
  )
}

/* ---------------------------------- Toast --------------------------------- */
export function Toast({ message, tone = 'success', onDismiss }: {
  message: string | null; tone?: 'success' | 'error'; onDismiss: () => void
}) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          role={tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full py-3 pl-4 pr-3 text-[0.875rem] font-medium text-white shadow-[0_16px_40px_-12px_rgba(15,42,61,0.5)]',
            tone === 'success' ? 'bg-[color:var(--color-primary)]' : 'bg-[color:var(--color-warm)]',
          )}
        >
          {tone === 'success' ? <Check size={16} /> : <X size={16} />}
          <span className="max-w-[70vw]">{message}</span>
          <button onClick={onDismiss} aria-label="Dismiss" className="grid place-items-center size-6 rounded-full hover:bg-white/15">
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------- Alert box ------------------------------- */
export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: ReactNode }) {
  return (
    <div className={cn(
      'rounded-xl border px-4 py-3 text-[0.875rem] leading-relaxed',
      tone === 'warn'
        ? 'border-[color:var(--color-warm)]/35 bg-[color:var(--color-warm)]/8 text-[#8F3B37]'
        : 'border-[color:var(--color-primary-light)]/25 bg-[color:var(--color-primary-light)]/8 text-[color:var(--color-primary)]',
    )}>
      {children}
    </div>
  )
}
