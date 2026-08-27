import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { InstagramIcon } from './SocialIcons'
import { navLinks, site } from '@/data/site'
import { services } from '@/data/services'
import { createSubmission } from '@/lib/api'
import { Logo } from './Logo'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { SubmitStatus, type SubmitState } from '@/components/ui/Misc'

const socialIcons = { instagram: InstagramIcon }

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError(null)
    setState('loading')
    try {
      await createSubmission({ kind: 'newsletter', email, subject: 'Newsletter signup' })
      setState('success')
      setEmail('')
      setTimeout(() => setState('idle'), 4000)
    } catch (err) {
      setState('idle')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
        <input
          id="footer-newsletter"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-invalid={!!error}
          className="h-[3.25rem] flex-1 rounded-full border-[1.5px] border-white/15 bg-white/8 px-5 text-[0.9375rem] text-white outline-none transition-all duration-200 placeholder:text-white/45 focus:border-[color:var(--color-sky)] focus:bg-white/12 focus:shadow-[0_0_0_3px_rgba(159,210,236,0.25)]"
        />
        <Button type="submit" variant="accent" size="lg" disabled={state !== 'idle'} className="sm:w-auto">
          <SubmitStatus state={state} idleLabel="Subscribe" successLabel="Subscribed" />
          {state === 'idle' && <ArrowIcon />}
        </Button>
      </div>
      {error && <p role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{error}</p>}
    </form>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[color:var(--color-primary-dark)] text-white/85">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-[36rem] rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: 'radial-gradient(circle, #9FD2EC, transparent 68%)' }}
      />

      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Logo tone="dark" />
            <p className="max-w-[22rem] text-[0.9375rem] leading-relaxed text-white/70">
              {site.description}
            </p>
            <a
              href={site.socials.find((s) => s.icon === 'instagram')!.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-2 text-[0.875rem] font-medium text-[color:var(--color-sky)] transition-colors hover:text-[color:var(--color-gold)]"
            >
              <InstagramIcon size={15} /> @premiumcareinc
            </a>
            <div className="flex gap-2.5">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon as keyof typeof socialIcons]
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="grid place-items-center size-10 rounded-full border border-white/12 text-white/70 transition-all duration-300 [transition-timing-function:var(--ease-premium)] hover:scale-110 hover:border-[color:var(--color-sky)] hover:bg-[color:var(--color-sky)] hover:text-[color:var(--color-primary-dark)]"
                  >
                    <Icon size={17} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="t-label mb-5 text-white/50">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-[0.9375rem]">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-block text-white/70 transition-all duration-200 hover:translate-x-0.5 hover:text-[color:var(--color-sky)]">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/referral" className="inline-block text-white/70 transition-all duration-200 hover:translate-x-0.5 hover:text-[color:var(--color-sky)]">
                  Make a Referral
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="t-label mb-5 text-white/50">Our Services</h3>
            <ul className="flex flex-col gap-3 text-[0.9375rem]">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="inline-block text-white/70 transition-all duration-200 hover:translate-x-0.5 hover:text-[color:var(--color-sky)]">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="t-label mb-5 text-white/50">Get in Touch</h3>
            <ul className="flex flex-col gap-4 text-[0.9375rem]">
              <li>
                <a href={site.phoneHref} className="flex items-start gap-3 text-white/70 transition-colors hover:text-[color:var(--color-sky)]">
                  <Phone size={16} className="mt-1 shrink-0 text-[color:var(--color-sky)]" />
                  <span>{site.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={site.emailHref} className="flex items-start gap-3 break-all text-white/70 transition-colors hover:text-[color:var(--color-sky)]">
                  <Mail size={16} className="mt-1 shrink-0 text-[color:var(--color-sky)]" />
                  <span>{site.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="mt-1 shrink-0 text-[color:var(--color-sky)]" />
                <span>{site.address.line1}<br />{site.address.city}, {site.address.state} {site.address.zip}</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock size={16} className="mt-1 shrink-0 text-[color:var(--color-sky)]" />
                <span>
                  {site.hours.map((h) => (
                    <span key={h.days} className="block">{h.days}: {h.time}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-9">
          <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h3 className="t-h3 text-white">Stay updated with Premium Care</h3>
              <p className="mt-2 text-[0.9375rem] text-white/65">
                Care guidance, benefits updates, and community news. One email a month, no filler.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-[0.8125rem] text-white/55 md:flex-row md:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="transition-colors hover:text-[color:var(--color-sky)]">Privacy Policy</Link>
            <Link to="/terms-of-service" className="transition-colors hover:text-[color:var(--color-sky)]">Terms of Service</Link>
            <Link to="/portal/login" className="transition-colors hover:text-[color:var(--color-sky)]">Staff Portal</Link>
            <span className="text-white/35">Licensed & Insured Home Care Agency</span>
          </nav>
        </div>
      </div>
    </footer>
  )
}
