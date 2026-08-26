import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { missionTabs } from '@/data/content'
import { cn } from '@/lib/utils'
import { Tag } from '@/components/ui/Tag'
import { Reveal } from '@/components/ui/Reveal'

const EASE = [0.23, 1, 0.32, 1] as const

/** Segmented-control tabbed section — spec §8.3. */
export function MissionTabs() {
  const [active, setActive] = useState<(typeof missionTabs)[number]['id']>(missionTabs[0].id)
  const tab = missionTabs.find((t) => t.id === active)!

  return (
    <section className="section bg-[color:var(--color-bg-soft)]">
      <div className="shell">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <Tag>Who we are</Tag>
          <h2 className="t-h2 max-w-[40rem]">Built on a simple idea</h2>

          <div
            role="tablist"
            aria-label="Mission, vision and approach"
            className="mt-3 inline-flex rounded-full border border-[color:var(--color-line)] bg-white p-1.5 shadow-[0_1px_3px_rgba(15,42,61,0.06)]"
          >
            {missionTabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => setActive(t.id)}
                className={cn(
                  'relative rounded-full px-4 py-2 font-[var(--font-display)] text-[0.8125rem] font-semibold transition-colors duration-200 sm:px-6 sm:text-[0.9375rem]',
                  active === t.id ? 'text-white' : 'text-[color:var(--color-ink-muted)] hover:text-[color:var(--color-primary)]',
                )}
              >
                {active === t.id && (
                  <motion.span
                    layoutId="tab-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[color:var(--color-primary)]"
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className="flex flex-col gap-5 lg:order-2">
                <h3 className="t-h3">{tab.heading}</h3>
                <p className="t-lead">{tab.body}</p>
                <ul className="mt-1 flex flex-col gap-3">
                  {tab.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,61,0.32)] lg:order-1">
                <img src={tab.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
