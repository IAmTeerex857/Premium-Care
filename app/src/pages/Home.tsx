import { Hero } from '@/components/sections/Hero'
import { Values } from '@/components/sections/Values'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { MissionTabs } from '@/components/sections/MissionTabs'
import { Process } from '@/components/sections/Process'
import { Testimonials } from '@/components/sections/Testimonials'
import { CtaBand } from '@/components/sections/CtaBand'
import { BookingForm } from '@/components/sections/BookingForm'
import { SectionHeading } from '@/components/ui/Misc'
import { Reveal } from '@/components/ui/Reveal'
import { useSeo } from '@/hooks/useSeo'

export default function Home() {
  useSeo({
    title: 'Premium Care, Compassionate Home Care & Disability Support',
    description:
      'Personalized in-home care, disability support, and skilled nursing across Maryland. Free consultation, care can start within 48 hours.',
  })

  return (
    <>
      <Hero />
      <Values />
      <ServicesGrid />
      <MissionTabs />
      <Process />
      <Testimonials />

      {/* Homepage appointment form, spec §10.1 */}
      <section id="book" className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <SectionHeading
            align="left"
            tag="Book an appointment"
            title="Let's start with a conversation"
            lead="Tell us a little about the situation and a care manager will call you within one business day. There is no cost and no obligation."
          >
            <ul className="mt-4 flex flex-col gap-3 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
              {[
                'Free in-home assessment within 48 hours',
                'Written care plan and pricing before anything starts',
                'No long-term contract, change or stop any time',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                  {t}
                </li>
              ))}
            </ul>
          </SectionHeading>

          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-9">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
