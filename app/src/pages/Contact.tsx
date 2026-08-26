import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/layout/SiteLayout'
import { ContactForm } from '@/components/sections/ContactForm'
import { BookingForm } from '@/components/sections/BookingForm'
import { site } from '@/data/site'
import { SectionHeading } from '@/components/ui/Misc'
import { Reveal } from '@/components/ui/Reveal'
import { useSeo } from '@/hooks/useSeo'

const mapQuery = encodeURIComponent(site.address.full)

export default function Contact() {
  useSeo({
    title: 'Contact Us — Premium Care',
    description: `Call ${site.phoneDisplay} or send a message. Free consultations, and we reply to every enquiry within one business day.`,
  })

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a care manager"
        lead="Call us, send a message, or book an appointment below. We reply to every enquiry within one business day."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          {/* Details */}
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {[
                { icon: Phone, label: 'Phone', value: site.phoneDisplay, href: site.phoneHref, note: site.emergencyNote },
                { icon: Mail, label: 'Email', value: site.email, href: site.emailHref, note: 'We reply within one business day' },
                { icon: MapPin, label: 'Office', value: `${site.address.line1}, ${site.address.city}, ${site.address.state} ${site.address.zip}`, note: 'Visits by appointment' },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                    <row.icon size={19} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="t-label mb-1">{row.label}</p>
                    {row.href ? (
                      <a href={row.href} className="link-underline font-[var(--font-display)] text-[1.0625rem] font-semibold text-[color:var(--color-primary)]">
                        {row.value}
                      </a>
                    ) : (
                      <p className="font-[var(--font-display)] text-[1.0625rem] font-semibold text-[color:var(--color-primary)]">{row.value}</p>
                    )}
                    <p className="mt-1 text-[0.875rem] text-[color:var(--color-ink-muted)]">{row.note}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">
                  <Clock size={19} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="t-label mb-2">Office hours</p>
                  <ul className="flex flex-col gap-1.5 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                    {site.hours.map((h) => (
                      <li key={h.days} className="flex flex-wrap gap-x-2">
                        <span className="font-medium text-[color:var(--color-primary)]">{h.days}</span>
                        <span>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[color:var(--color-line)] shadow-[0_10px_36px_-18px_rgba(15,42,61,0.28)]">
              <iframe
                title={`Map showing the ${site.name} office`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[19rem] w-full border-0"
              />
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-9">
              <h2 className="t-h3">Send us a message</h2>
              <p className="mt-2 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                For general questions. To book a consultation, use the appointment form below.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Appointment booking */}
      <section id="book" className="section scroll-mt-24 bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <SectionHeading
            tag="Book an appointment"
            title="Schedule a free consultation"
            lead="Twenty minutes on the phone, then an in-home assessment if it makes sense. No cost, no obligation."
          />
          <Reveal delay={0.1} className="mx-auto mt-12 max-w-[46rem]">
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-9">
              <BookingForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
