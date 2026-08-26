import { Handshake, Heart, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'
import { values } from '@/data/content'
import { SectionHeading } from '@/components/ui/Misc'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

const icons: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck, heart: Heart, sparkles: Sparkles, handshake: Handshake,
}

export function Values() {
  return (
    <section className="section bg-[color:var(--color-bg-soft)]">
      <div className="shell">
        <SectionHeading
          tag="What we stand for"
          title="Our core values"
          lead="Four commitments that shape how we hire, how we train, and how we show up in someone's home."
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = icons[v.icon]
            return (
              <RevealItem key={v.title}>
                <article className="card-lift group flex h-full flex-col gap-4 rounded-2xl border border-[color:var(--color-line)] bg-white p-7 shadow-[0_1px_3px_rgba(15,42,61,0.06)]">
                  <span className="grid size-12 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] transition-all duration-300 [transition-timing-function:var(--ease-premium)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.8} />
                  </span>
                  <h3 className="t-h4">{v.title}</h3>
                  <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{v.body}</p>
                </article>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
