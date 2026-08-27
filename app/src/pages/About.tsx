import { PageHero } from '@/components/layout/SiteLayout'
import { Values } from '@/components/sections/Values'
import { MissionTabs } from '@/components/sections/MissionTabs'
import { CtaBand } from '@/components/sections/CtaBand'
import { SectionHeading } from '@/components/ui/Misc'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { team } from '@/data/content'
import { stats } from '@/data/site'
import { img } from '@/data/images'
import { useSeo } from '@/hooks/useSeo'

export default function About() {
  useSeo({
    title: 'About Us, Premium Care',
    description: 'Founded by a nurse who watched too many families settle for care that did not fit. Meet the team behind Premium Care.',
  })

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We are here because of you"
        lead="Premium Care was founded by a nurse who spent two decades watching families settle for care that did not fit them. We built the alternative."
      />

      {/* Story */}
      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,61,0.32)]">
              <img src={img.aboutStory} alt="A Premium Care nurse reviewing a care plan with a family at a kitchen table" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-5">
            <span className="t-label text-[color:var(--color-accent)]">Our story</span>
            <h2 className="t-h2">It started with one family who kept getting a different caregiver</h2>
            <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)] md:text-base">
              <p>
                In 2011, Dana Whitfield was a hospital nurse discharging an elderly patient for the third time in
                six months. Nothing clinical had gone wrong. The problem was that the agency covering his home
                visits sent someone different almost every week, and no one ever knew what had changed since the
                last visit.
              </p>
              <p>
                She started Premium Care with a single conviction: continuity is not a scheduling luxury, it is
                the clinical intervention. A caregiver who knows that Tuesday is a hard day, that the left knee
                gives out on stairs, that a certain tone means pain rather than irritation, that caregiver
                catches things a rotating roster never will.
              </p>
              <p>
                Fifteen years later we serve more than five hundred families across Maryland. We still
                assign one caregiver to one client and protect that pairing harder than anything else in the
                business, because it is the entire reason the work succeeds.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

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
