import { PageHero } from '@/components/layout/SiteLayout'
import { ServiceCard } from '@/components/sections/ServicesGrid'
import { Process } from '@/components/sections/Process'
import { CtaBand } from '@/components/sections/CtaBand'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { services } from '@/data/services'
import { useSeo } from '@/hooks/useSeo'

export default function Services() {
  useSeo({
    title: 'Our Services — Premium Care',
    description: 'In-home care, personal care, companion care, respite, skilled nursing, disability support, care coordination, and transportation.',
  })

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Eight services, one plan"
        lead="Most families start with one service and add others as needs change. Everything below can be combined into a single schedule with a single point of contact."
      />

      <section className="section">
        <div className="shell">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <RevealItem key={s.slug}><ServiceCard service={s} /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Process tone="soft" />
      <CtaBand
        title="Not sure which service you need?"
        lead="That is the most common place families start. Our free assessment exists precisely to answer that question."
      />
    </>
  )
}
