import { processSteps } from '@/data/content'
import { SectionHeading } from '@/components/ui/Misc'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

export function Process({ tone = 'light' }: { tone?: 'light' | 'soft' }) {
  return (
    <section className={`section ${tone === 'soft' ? 'bg-[color:var(--color-bg-soft)]' : ''}`}>
      <div className="shell">
        <SectionHeading
          tag="How it works"
          title="From first call to ongoing care"
          lead="Five steps, no obligation until you approve the plan and the price in writing."
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s) => (
            <RevealItem key={s.step}>
              <article className="card-lift group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white p-6 shadow-[0_1px_3px_rgba(15,42,61,0.06)]">
                <span className="font-[var(--font-mono)] text-[1.75rem] font-bold leading-none text-[color:var(--color-accent)]/35 transition-colors duration-300 group-hover:text-[color:var(--color-accent)]">
                  {s.step}
                </span>
                <h3 className="t-h4 text-[1.0625rem]">{s.title}</h3>
                <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{s.body}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
