import { cn } from '@/lib/utils'

/**
 * Thinking orb used inside submit buttons, spec §9.4 / §10 (Orbs-inspired).
 * Pure CSS so it costs nothing and respects prefers-reduced-motion.
 */
export function ThinkingOrb({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <span
      role="status"
      aria-label="Submitting"
      className={cn('relative inline-block shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-90"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, currentColor 110deg, transparent 260deg)',
          animation: 'orb-spin 900ms linear infinite',
          maskImage: 'radial-gradient(circle, transparent 52%, #000 55%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 52%, #000 55%)',
        }}
      />
      <span className="absolute inset-[38%] rounded-full bg-current opacity-70" style={{ animation: 'dot-pulse 1.2s ease-in-out infinite' }} />
    </span>
  )
}

/**
 * Ambient blurred gradient orbs for hero backgrounds, spec §11.5.
 * Decorative only; pointer-events-none and aria-hidden.
 */
export function OrbField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -top-40 -left-28 size-[34rem] rounded-full opacity-[0.28] blur-[90px]"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #9FD2EC, transparent 68%)',
          animation: 'drift 22s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -top-24 right-[-10rem] size-[30rem] rounded-full opacity-[0.22] blur-[100px]"
        style={{
          background: 'radial-gradient(circle at 60% 40%, #E8CF95, transparent 70%)',
          animation: 'drift 28s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute bottom-[-14rem] left-1/3 size-[28rem] rounded-full opacity-[0.16] blur-[110px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #27599B, transparent 70%)',
          animation: 'orb-float 24s ease-in-out infinite',
        }}
      />
    </div>
  )
}
