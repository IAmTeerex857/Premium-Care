import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const inputBase =
  'w-full min-w-0 h-[3.25rem] px-5 rounded-[0.875rem] text-[0.9375rem] text-[color:var(--color-ink)] ' +
  'bg-[color:var(--color-bg-muted)] border-[1.5px] border-[color:var(--color-line)] outline-none ' +
  'transition-[border-color,box-shadow] duration-200 ' +
  'placeholder:text-[color:var(--color-ink-muted)] ' +
  'focus:border-[color:var(--color-primary-light)] focus:shadow-[0_0_0_3px_rgba(38,113,143,0.14)] ' +
  'disabled:opacity-60'

const errorRing =
  'border-[color:var(--color-warm)] focus:border-[color:var(--color-warm)] focus:shadow-[0_0_0_3px_rgba(255,107,107,0.14)]'

function Shell({
  label, error, hint, required, htmlFor, children, className,
}: {
  label?: string; error?: string; hint?: string; required?: boolean
  htmlFor: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[0.8125rem] font-semibold font-[var(--font-display)] text-[color:var(--color-ink-secondary)]">
          {label} {required && <span className="text-[color:var(--color-warm)]">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{error}</p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[0.8125rem] text-[color:var(--color-ink-muted)]">{hint}</p>
      ) : null}
    </div>
  )
}

type BaseProps = { label?: string; error?: string; hint?: string; wrapClass?: string }

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & BaseProps>(
  function Input({ label, error, hint, wrapClass, className, id, required, ...props }, ref) {
    const auto = useId()
    const fid = id ?? auto
    return (
      <Shell label={label} error={error} hint={hint} required={required} htmlFor={fid} className={wrapClass}>
        <input
          ref={ref} id={fid} required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
          className={cn(inputBase, error && errorRing, className)}
          {...props}
        />
      </Shell>
    )
  },
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps>(
  function Textarea({ label, error, hint, wrapClass, className, id, required, ...props }, ref) {
    const auto = useId()
    const fid = id ?? auto
    return (
      <Shell label={label} error={error} hint={hint} required={required} htmlFor={fid} className={wrapClass}>
        <textarea
          ref={ref} id={fid} required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
          className={cn(inputBase, 'h-[8.75rem] py-4 resize-y rounded-2xl leading-relaxed', error && errorRing, className)}
          {...props}
        />
      </Shell>
    )
  },
)

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & BaseProps>(
  function Select({ label, error, hint, wrapClass, className, id, required, children, ...props }, ref) {
    const auto = useId()
    const fid = id ?? auto
    return (
      <Shell label={label} error={error} hint={hint} required={required} htmlFor={fid} className={wrapClass}>
        <select
          ref={ref} id={fid} required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : hint ? `${fid}-hint` : undefined}
          className={cn(
            inputBase,
            'appearance-none bg-no-repeat pr-11 cursor-pointer',
            "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%237C8C9C' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")]",
            '[background-position:right_1.125rem_center]',
            error && errorRing,
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </Shell>
    )
  },
)

/** Checkbox row used by the referral multi-select. */
export function CheckboxPill({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex items-center gap-2 h-10 pl-3 pr-4 rounded-full border-[1.5px] text-[0.875rem] text-left',
        'transition-all duration-200 [transition-timing-function:var(--ease-premium)] active:scale-[0.97]',
        checked
          ? 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)] text-white'
          : 'bg-white border-[color:var(--color-line)] text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)]',
      )}
    >
      <span className={cn(
        'grid place-items-center size-[1.125rem] rounded-md border-[1.5px] shrink-0',
        checked ? 'bg-white/95 border-white' : 'border-[color:var(--color-line)]',
      )}>
        {checked && (
          <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
            <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="var(--color-primary)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  )
}
