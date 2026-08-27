import { ClipboardCheck, Clock3, PhoneCall, ShieldCheck } from 'lucide-react'
import { PageHero } from '@/components/layout/SiteLayout'
import { ReferralForm } from '@/components/sections/ReferralForm'
import { site } from '@/data/site'
import { Reveal } from '@/components/ui/Reveal'
import { useSeo } from '@/hooks/useSeo'

const steps = [
  { icon: ClipboardCheck, title: 'Submit the form', body: 'Takes about four minutes. Only the fields marked required are needed to start.' },
  { icon: Clock3, title: 'Same-day review', body: 'Our intake team reviews every referral the same business day it arrives.' },
  { icon: PhoneCall, title: 'We contact both parties', body: 'We call the client directly and confirm back to you so nothing is left uncertain.' },
  { icon: ShieldCheck, title: 'Benefits verified', body: 'We run the benefits check and tell you both what is covered before care begins.' },
]

export default function Referral() {
  useSeo({
    title: 'Make a Referral, Premium Care',
    description: 'Referral form for discharge planners, social workers, physicians, and case managers. Same-day review, urgent referrals escalated immediately.',
  })

  return (
    <>
      <PageHero
        eyebrow="For professionals"
        title="Refer a client to Premium Care"
        lead="For discharge planners, social workers, physicians, case managers, and community partners. Urgent referrals are escalated the moment they arrive."
      />

      <section className="section">
        <div className="shell">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-white p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                    <s.icon size={19} strokeWidth={1.8} />
                  </span>
                  <h3 className="t-h4 text-[1.0625rem]">{s.title}</h3>
                  <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mx-auto mt-14 max-w-[52rem]">
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-10">
              <h2 className="t-h3">Referral details</h2>
              <p className="mt-2 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                For an urgent referral, call{' '}
                <a href={site.phoneHref} className="link-underline font-medium text-[color:var(--color-primary)]">
                  {site.phoneDisplay}
                </a>{' '}
                instead, someone will pick up.
              </p>
              <div className="mt-8">
                <ReferralForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
