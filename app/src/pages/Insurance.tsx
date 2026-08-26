import {
  Briefcase, Building2, FileText, Medal, ShieldPlus, Wallet, type LucideIcon,
} from 'lucide-react'
import { PageHero } from '@/components/layout/SiteLayout'
import { coverageOptions, faqs } from '@/data/content'
import { site } from '@/data/site'
import { Accordion, SectionHeading } from '@/components/ui/Misc'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { CtaBand } from '@/components/sections/CtaBand'
import { useSeo } from '@/hooks/useSeo'

const icons: Record<string, LucideIcon> = {
  'building-2': Building2, 'shield-plus': ShieldPlus, 'file-text': FileText,
  medal: Medal, wallet: Wallet, briefcase: Briefcase,
}

export default function Insurance() {
  useSeo({
    title: 'Insurance & Coverage — Premium Care',
    description: 'Medicaid HCBS waivers, Medicare, long-term care insurance, VA benefits, and private pay. Free benefits check before you commit.',
  })

  return (
    <>
      <PageHero
        eyebrow="Insurance & coverage"
        title="Paying for care, explained plainly"
        lead="Most families are surprised by what is covered — in both directions. Here is how each funding source actually works, and how to find out what applies to you."
      >
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button to="/contact" size="lg">Request a free benefits check <ArrowIcon /></Button>
          <Button href={site.phoneHref} variant="secondary" size="lg">Call {site.phoneDisplay}</Button>
        </div>
      </PageHero>

      <section className="section">
        <div className="shell">
          <SectionHeading
            tag="Funding sources"
            title="Six ways families pay for care"
            lead="Most people end up combining two or three of these rather than relying on a single source."
          />

          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coverageOptions.map((c) => {
              const Icon = icons[c.icon] ?? Wallet
              return (
                <RevealItem key={c.title}>
                  <article className="card-lift group flex h-full flex-col gap-4 rounded-2xl border border-[color:var(--color-line)] bg-white p-7 shadow-[0_1px_3px_rgba(15,42,61,0.06)]">
                    <span className="grid size-12 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] transition-all duration-300 [transition-timing-function:var(--ease-premium)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <h3 className="t-h4">{c.title}</h3>
                    <p className="flex-1 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{c.body}</p>
                    <div className="mt-1 border-t border-[color:var(--color-line)] pt-4">
                      <p className="t-label mb-2.5">Typically covers</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.covers.map((x) => (
                          <span key={x} className="rounded-full bg-[color:var(--color-bg-soft)] px-2.5 py-1 text-[0.75rem] text-[color:var(--color-ink-secondary)]">
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Eligibility helper */}
      <section className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <SectionHeading
            tag="Where to start"
            title="A rough guide to what applies to you"
            lead="This is not a substitute for a benefits check, but it will tell you which conversation to have first."
          />

          <RevealGroup className="mx-auto mt-12 grid max-w-[58rem] gap-4">
            {[
              { if: 'A physician says skilled nursing or therapy is needed, and leaving home is a major effort', then: 'Start with Medicare Part A/B.' },
              { if: 'Income and assets are limited, and the need is daily help rather than clinical care', then: 'Start with your state Medicaid HCBS waiver — apply early, waiting lists are common.' },
              { if: 'A long-term care policy was purchased years ago and never used', then: 'Pull the policy out now and check the elimination period. We will read it with you.' },
              { if: 'The client is a veteran or the surviving spouse of one', then: 'Start with VA Aid & Attendance or Veteran-Directed Care.' },
              { if: 'Care is needed immediately and no benefit is approved yet', then: 'Private pay as a bridge, while we help file the application in parallel.' },
              { if: 'The need follows a workplace or auto injury', then: 'Your claims adjuster — we bill them directly once services are approved.' },
            ].map((row) => (
              <RevealItem key={row.if}>
                <div className="grid gap-3 rounded-2xl border border-[color:var(--color-line)] bg-white p-6 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-8">
                  <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
                    <span className="t-label mr-2 text-[color:var(--color-ink-muted)]">If</span>
                    {row.if}
                  </p>
                  <p className="text-[0.9375rem] font-medium leading-relaxed text-[color:var(--color-primary)]">
                    <span className="t-label mr-2 text-[color:var(--color-accent)]">Then</span>
                    {row.then}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-[42rem] text-center">
            <p className="text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
              Still unsure? A benefits check takes about twenty minutes, costs nothing, and regularly uncovers
              coverage people did not know they had.
            </p>
            <div className="mt-6 flex justify-center">
              <Button to="/contact" size="lg">Request a benefits check <ArrowIcon /></Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading tag="Common questions" title="Frequently asked questions" />
          <div className="mx-auto mt-12 max-w-[48rem]">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title="We will tell you what it costs before you decide anything"
        lead="Written rates, written coverage estimate, no obligation. That is the whole offer."
      />
    </>
  )
}
