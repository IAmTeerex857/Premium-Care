import { motion } from 'framer-motion'
import { CalendarCheck, ShieldCheck, Star } from 'lucide-react'
import { img } from '@/data/images'
import { stats } from '@/data/site'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { OrbField } from '@/components/ui/Orb'
import { CountUp } from '@/components/ui/CountUp'

const EASE = [0.23, 1, 0.32, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
})

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F8FAFB_0%,#FFFFFF_62%)]">
      <OrbField />

      <div className="shell relative pb-16 pt-14 md:pb-20 md:pt-20">
        <div className="flex flex-col items-center text-center">
          <motion.div {...rise(0)}>
            <Tag>Licensed &amp; insured · Serving Greater Boston</Tag>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="t-h1 mt-6 max-w-[45rem] text-[color:var(--color-primary-dark)]">
            Empowering lives through{' '}
            <span className="relative sm:whitespace-nowrap">
              <span className="bg-[linear-gradient(120deg,var(--color-accent),var(--color-primary-light))] bg-clip-text text-transparent">
                exceptional care
              </span>
            </span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="t-lead mt-6 max-w-[36rem]">
            Personalized in-home care, disability support, and skilled nursing — delivered by
            caregivers who show up consistently and treat your family like their own.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button to="/contact" size="lg">
              Book a free consultation <ArrowIcon />
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              Explore our services
            </Button>
          </motion.div>

          <motion.div {...rise(0.32)} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[color:var(--color-accent)]" /> Background-checked caregivers
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarCheck size={15} className="text-[color:var(--color-accent)]" /> Care can start in 48 hours
            </span>
            <span className="inline-flex items-center gap-2">
              <Star size={15} className="fill-[color:var(--color-gold-strong)] text-[color:var(--color-gold-strong)]" /> 4.9 average family rating
            </span>
          </motion.div>
        </div>

        {/* Hero image with floating UI cards — spec §7 */}
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
          className="relative mx-auto mt-14 max-w-[62rem]"
        >
          <div className="overflow-hidden rounded-[1.25rem] shadow-[0_24px_80px_-20px_rgba(15,42,61,0.28)]">
            <img
              src={img.hero}
              alt="A caregiver sitting with a client in a bright living room, sharing a conversation"
              width={1600} height={900} loading="eager" fetchPriority="high"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <FloatingCard
            className="left-[-1rem] top-8 md:left-[-2.5rem] md:top-14"
            delay={0.85}
          >
            <span className="grid size-9 place-items-center rounded-full bg-[color:var(--color-accent)]/12">
              <ShieldCheck size={17} className="text-[color:var(--color-accent)]" />
            </span>
            <div>
              <p className="font-[var(--font-display)] text-[0.8125rem] font-semibold text-[color:var(--color-primary)]">Care plan approved</p>
              <p className="text-[0.75rem] text-[color:var(--color-ink-muted)]">Reviewed with the family</p>
            </div>
          </FloatingCard>

          <FloatingCard
            className="bottom-8 right-[-1rem] md:bottom-14 md:right-[-2.5rem]"
            delay={1.0}
          >
            <span className="grid size-9 place-items-center rounded-full bg-[color:var(--color-primary-light)]/12">
              <CalendarCheck size={17} className="text-[color:var(--color-primary-light)]" />
            </span>
            <div>
              <p className="font-[var(--font-display)] text-[0.8125rem] font-semibold text-[color:var(--color-primary)]">Denise arrives 9:00 AM</p>
              <p className="text-[0.75rem] text-[color:var(--color-ink-muted)]">Same caregiver, every visit</p>
            </div>
          </FloatingCard>
        </motion.div>

        {/* Stats bar — spec §7 */}
        <div className="mx-auto mt-14 grid max-w-[58rem] grid-cols-2 gap-y-9 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="flex flex-col items-center gap-1.5 px-4 text-center md:not-first:border-l md:border-[color:var(--color-line)]"
            >
              <span className="font-[var(--font-mono)] text-[clamp(2rem,1.4rem+2vw,3rem)] font-bold leading-none tracking-[-0.02em] text-[color:var(--color-accent)]">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[0.875rem] text-[color:var(--color-ink-muted)]">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FloatingCard({ className, delay, children }: { className?: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={`absolute hidden items-center gap-3 rounded-2xl border border-[color:var(--color-line)] bg-white/92 px-4 py-3 shadow-[0_14px_40px_-14px_rgba(15,42,61,0.3)] backdrop-blur-md sm:flex ${className}`}
    >
      {children}
    </motion.div>
  )
}
