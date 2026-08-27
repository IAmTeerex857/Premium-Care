import { Logo } from '@/components/layout/Logo'

/** Route-level suspense fallback, skeleton shimmer, spec §11.4. */
export function PageFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-[color:var(--color-bg)] px-6">
      <div className="flex flex-col items-center gap-5">
        <Logo />
        <p className="shimmer-text text-[0.875rem] font-medium">Loading…</p>
      </div>
    </div>
  )
}
