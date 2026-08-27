import { Link, Navigate, useParams } from 'react-router-dom'
import { Check, Home } from 'lucide-react'
import { serviceBySlug, services } from '@/data/services'
import { img } from '@/data/images'
import { serviceIcons, ServiceCard } from '@/components/sections/ServicesGrid'
import { BookingForm } from '@/components/sections/BookingForm'
import { CtaBand } from '@/components/sections/CtaBand'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Tag } from '@/components/ui/Tag'
import { ArrowIcon } from '@/components/ui/Button'
import { useSeo } from '@/hooks/useSeo'

export default function ServiceDetail() {
  const { slug = '' } = useParams()
  const service = serviceBySlug(slug)

  useSeo({
    title: service ? `${service.title}, Premium Care` : 'Service, Premium Care',
    description: service?.short,
  })

  if (!service) return <Navigate to="/services" replace />

  const Icon = serviceIcons[service.icon] ?? Home
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)]">
        <div className="shell py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
            <Link to="/" className="hover:text-[color:var(--color-primary)]">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/services" className="hover:text-[color:var(--color-primary)]">Services</Link>
            <span aria-hidden>/</span>
            <span className="text-[color:var(--color-primary)]">{service.title}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <Reveal className="flex flex-col gap-5">
              <span className="grid size-14 place-items-center rounded-2xl bg-white text-[color:var(--color-accent)] shadow-[0_6px_20px_-8px_rgba(15,42,61,0.28)]">
                <Icon size={26} strokeWidth={1.7} />
              </span>
              <h1 className="t-h1 text-[color:var(--color-primary-dark)]">{service.title}</h1>
              <p className="t-lead max-w-[36rem]">{service.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {service.goodFor.map((g) => <Tag key={g} dot={false}>{g}</Tag>)}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,61,0.32)]">
                <img src={img.services[service.slug]} alt="" loading="eager" className="aspect-[4/3] w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="t-label text-[color:var(--color-accent)]">What is included</span>
            <h2 className="t-h2">Everything this service covers</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-[color:var(--color-line)] bg-white p-4 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent)]/15 text-[color:var(--color-accent)]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-2xl border border-[color:var(--color-primary-light)]/25 bg-[color:var(--color-primary-light)]/6 p-6">
              <h3 className="t-h4 text-[1.0625rem]">Will insurance cover this?</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
                It depends on your plan and your clinical situation. We run a free benefits check before you
                commit to anything and tell you exactly what is covered and what is not.
              </p>
              <Link to="/contact" className="group mt-4 inline-flex items-center gap-2 font-[var(--font-display)] text-[0.875rem] font-semibold text-[color:var(--color-primary)]">
                Ask about coverage <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-8 lg:sticky lg:top-24 lg:self-start">
            <h3 className="t-h3 text-[1.375rem]">Request {service.title.toLowerCase()}</h3>
            <p className="mt-2 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
              A care manager will call within one business day.
            </p>
            <div className="mt-6">
              <BookingForm compact />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <h2 className="t-h2 text-center">Families often add these too</h2>
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((s) => <RevealItem key={s.slug}><ServiceCard service={s} /></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
