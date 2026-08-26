import { Phone } from 'lucide-react'
import { site } from '@/data/site'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Reveal } from '@/components/ui/Reveal'

export function CtaBand({
  title = 'Not sure where to start? Neither were most of our families.',
  lead = 'A twenty-minute call costs nothing and usually brings more clarity than a week of research. We will tell you honestly if we are not the right fit.',
}: { title?: string; lead?: string }) {
  return (
    <section className="section">
      <div className="shell">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-[color:var(--color-primary)] px-7 py-14 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 size-[26rem] rounded-full opacity-30 blur-[90px]"
            style={{ background: 'radial-gradient(circle, #9FD2EC, transparent 68%)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-16 size-[24rem] rounded-full opacity-20 blur-[90px]"
            style={{ background: 'radial-gradient(circle, #E8CF95, transparent 68%)' }}
          />

          <div className="relative flex flex-col items-center gap-5">
            <Tag tone="dark">Free consultation</Tag>
            <h2 className="t-h2 max-w-[38rem] text-white">{title}</h2>
            <p className="max-w-[36rem] text-[1.0625rem] leading-relaxed text-white/75">{lead}</p>

            <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
              <Button to="/contact" variant="accent" size="lg">
                Book a consultation <ArrowIcon />
              </Button>
              <Button
                href={site.phoneHref} size="lg"
                className="border-[1.5px] border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                <Phone size={17} /> {site.phoneDisplay}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
