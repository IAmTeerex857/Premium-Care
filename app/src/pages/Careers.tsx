import {
  Banknote, CalendarCheck, GraduationCap, HeartPulse, TrendingUp, UsersRound, type LucideIcon,
} from 'lucide-react'
import { PageHero } from '@/components/layout/SiteLayout'
import { CareerForm } from '@/components/sections/CareerForm'
import { benefits } from '@/data/content'
import { img } from '@/data/images'
import { site } from '@/data/site'
import { SectionHeading } from '@/components/ui/Misc'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { useSeo } from '@/hooks/useSeo'

const icons: Record<string, LucideIcon> = {
  banknote: Banknote, 'heart-pulse': HeartPulse, 'graduation-cap': GraduationCap,
  'calendar-check': CalendarCheck, 'trending-up': TrendingUp, 'users-round': UsersRound,
}

export default function Careers() {
  useSeo({
    title: 'Careers, Premium Care',
    description: 'Are you passionate enough to help individuals live a better life? Apply to join the Premium Care team across Maryland.',
  })

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join the Premium Care team"
        lead="Are you passionate enough to help individuals live a better life? You might be the one that we are looking for."
      >
        <div className="mt-4">
          <Button href="#apply" size="lg">Apply now <ArrowIcon /></Button>
        </div>
      </PageHero>

      {/* Why us */}
      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,77,0.32)]">
              <img src={img.careers} alt="Premium Care team members in a training session" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <span className="t-label text-[color:var(--color-primary-light)]">Why Premium Care</span>
            <h2 className="t-h2">Caregiving is a career here, not a gig</h2>
            <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)] md:text-base">
              <p>
                Every caregiver at Premium Care is a W-2 employee with real benefits, paid travel time, and a
                named supervisor who answers the phone. We do not use contractor arrangements to shift costs
                onto the people doing the hardest work.
              </p>
              <p>
                We also protect your assignments. You get a consistent client roster rather than a different
                address every morning, because that is better for clients and it is better for you.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <SectionHeading tag="Benefits" title="What we offer our team" />
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => {
              const Icon = icons[b.icon] ?? Banknote
              return (
                <RevealItem key={b.title}>
                  <article className="card-lift group flex h-full flex-col gap-3.5 rounded-2xl border border-[color:var(--color-line)] bg-white p-7 shadow-[0_1px_3px_rgba(15,42,77,0.06)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-primary-light)]/10 text-[color:var(--color-primary-light)] transition-all duration-300 group-hover:bg-[color:var(--color-primary-light)] group-hover:text-white">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h3 className="t-h4 text-[1.0625rem]">{b.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{b.body}</p>
                  </article>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="section scroll-mt-24">
        <div className="shell">
          <SectionHeading
            tag="Career"
            title="Apply to join us"
            lead="Fill in the form below and our team will be in touch. Every application is read and answered."
          />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-[46rem]">
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,77,0.28)] md:p-10">
              <CareerForm />
            </div>
          </Reveal>

          <p className="mt-9 text-center text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
            Questions about working with us? Email{' '}
            <a href={`mailto:${site.careersEmail}`} className="link-underline font-medium text-[color:var(--color-primary)]">
              {site.careersEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
