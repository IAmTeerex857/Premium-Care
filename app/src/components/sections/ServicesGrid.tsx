import { Link } from 'react-router-dom'
import {
  Accessibility, Car, ClipboardList, Heart, HeartHandshake, Home, LifeBuoy,
  Stethoscope, Users, type LucideIcon,
} from 'lucide-react'
import { services, type Service } from '@/data/services'
import { img } from '@/data/images'
import { cn } from '@/lib/utils'
import { SectionHeading } from '@/components/ui/Misc'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button, ArrowIcon } from '@/components/ui/Button'

export const serviceIcons: Record<string, LucideIcon> = {
  house: Home,
  'heart-handshake': HeartHandshake,
  users: Users,
  'life-buoy': LifeBuoy,
  stethoscope: Stethoscope,
  accessibility: Accessibility,
  'clipboard-list': ClipboardList,
  car: Car,
  heart: Heart,
}

export function ServiceCard({ service, large = false }: { service: Service; large?: boolean }) {
  const Icon = serviceIcons[service.icon] ?? Home
  return (
    <Link
      to={`/services/${service.slug}`}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[color:var(--color-line)] bg-white shadow-[0_1px_3px_rgba(15,42,61,0.06)]"
    >
      <div className={cn('relative overflow-hidden', large ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        <img
          src={img.services[service.slug]}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-premium)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-white/92 text-[color:var(--color-primary)] shadow-[0_4px_14px_-4px_rgba(15,42,61,0.3)] backdrop-blur-sm">
          <Icon size={19} strokeWidth={1.8} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className={cn('t-h4 transition-colors group-hover:text-[color:var(--color-primary-light)]', large && 'text-[1.5rem]')}>
          {service.title}
        </h3>
        <p className="flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
          {large ? service.summary : service.short}
        </p>
        <span className="mt-2 inline-flex items-center gap-2 font-[var(--font-display)] text-[0.875rem] font-semibold text-[color:var(--color-primary)]">
          Learn more <ArrowIcon />
        </span>
      </div>
    </Link>
  )
}

export function ServicesGrid() {
  const [first, second, third, ...rest] = services

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          tag="What we offer"
          title="Care shaped around one person at a time"
          lead="Eight services that combine into a single plan — adjusted whenever the need changes, not on a fixed annual cycle."
        />

        {/* Bento grid — spec §8.2 */}
        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <RevealItem className="lg:col-span-2 lg:row-span-1">
            <ServiceCard service={first!} large />
          </RevealItem>
          <RevealItem><ServiceCard service={second!} /></RevealItem>
          <RevealItem><ServiceCard service={third!} /></RevealItem>
          {rest.slice(0, 2).map((s) => (
            <RevealItem key={s.slug}><ServiceCard service={s} /></RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-11 flex justify-center">
          <Button to="/services" variant="secondary" size="lg">
            View all services <ArrowIcon />
          </Button>
        </div>
      </div>
    </section>
  )
}
