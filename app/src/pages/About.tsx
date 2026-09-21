import { PageHero } from '@/components/layout/SiteLayout'
import { Values } from '@/components/sections/Values'
import { MissionTabs } from '@/components/sections/MissionTabs'
import { CtaBand } from '@/components/sections/CtaBand'
import { SectionHeading } from '@/components/ui/Misc'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { team } from '@/data/content'
import { stats } from '@/data/site'
import { useSeo } from '@/hooks/useSeo'

export default function About() {
  useSeo({
    title: 'About Us, Premium Care',
    description: 'Learn how Premium Care approaches dependable, person-centered in-home and community care across Maryland.',
  })

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Compassion. Care. Quality of Life."
        lead="We provide dependable, person-centered support that helps people live safely, confidently, and independently at home and in their communities."
      />

      {/* Stats band */}
      <section className="bg-[color:var(--color-primary)] py-14 md:py-16">
        <div className="shell grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 text-center">
              <span className="font-[var(--font-mono)] text-[clamp(2rem,1.4rem+2vw,3rem)] font-bold leading-none text-[color:var(--color-accent)]">
                <CountUp to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[0.875rem] text-white/65">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <MissionTabs />
      <Values />

      {/* Team */}
      <section className="section">
        <div className="shell">
          <SectionHeading
            tag="Leadership"
            title="The people behind the plan"
            lead="Four people who between them have spent more than sixty years in home health, and who still take client calls."
          />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <RevealItem key={m.name}>
                <article className="group flex h-full flex-col items-center gap-4 text-center">
                  <div className="relative overflow-hidden rounded-full shadow-[0_8px_24px_-8px_rgba(15,42,61,0.3)]">
                    <img
                      src={m.photo} alt={m.name} loading="lazy"
                      className="size-32 rounded-full object-cover transition-transform duration-500 [transition-timing-function:var(--ease-premium)] group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="font-[var(--font-display)] text-[1.0625rem] font-semibold text-[color:var(--color-primary)]">{m.name}</h3>
                    <p className="mt-0.5 text-[0.8125rem] font-medium text-[color:var(--color-accent)]">{m.role}</p>
                  </div>
                  <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{m.bio}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand
        title="Come see whether we are the right fit"
        lead="We would rather tell you honestly that another provider suits your situation better than take on care we cannot do well."
      />
    </>
  )
}
