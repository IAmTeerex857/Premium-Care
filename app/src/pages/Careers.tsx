import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  Banknote, CalendarCheck, Check, GraduationCap, HeartPulse, MapPin,
  TrendingUp, UsersRound, type LucideIcon,
} from 'lucide-react'
import { PageHero } from '@/components/layout/SiteLayout'
import { benefits, jobOpenings } from '@/data/content'
import { img } from '@/data/images'
import { site } from '@/data/site'
import { createSubmission } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'
import { SectionHeading, Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Field'
import { useSeo } from '@/hooks/useSeo'

const icons: Record<string, LucideIcon> = {
  banknote: Banknote, 'heart-pulse': HeartPulse, 'graduation-cap': GraduationCap,
  'calendar-check': CalendarCheck, 'trending-up': TrendingUp, 'users-round': UsersRound,
}

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(10, 'Enter a valid phone number.'),
  position: z.string().min(1, 'Choose the role you are applying for.'),
  experience: z.string().min(1, 'Select your experience level.'),
  certifications: z.string().trim().optional(),
  availability: z.string().min(1, 'Select your availability.'),
  message: z.string().trim().min(10, 'Tell us a little about yourself.'),
})

type FormValues = z.infer<typeof schema>

export default function Careers() {
  useSeo({
    title: 'Careers, Premium Care',
    description: 'Caregiver, CNA, RN, and operations roles across Maryland. Above-market pay, paid certification, and schedules you control.',
  })

  const [selectedRole, setSelectedRole] = useState('')

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work somewhere the care actually matters"
        lead="We are hiring caregivers, nurses, and coordinators across Maryland. Above-market pay, paid certification, and a schedule you set."
      >
        <div className="mt-4">
          <Button href="#openings" size="lg">See open positions <ArrowIcon /></Button>
        </div>
      </PageHero>

      {/* Why us */}
      <section className="section">
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[1.25rem] shadow-[0_20px_60px_-24px_rgba(15,42,61,0.32)]">
              <img src={img.careers} alt="Premium Care team members in a training session" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <span className="t-label text-[color:var(--color-accent)]">Why Premium Care</span>
            <h2 className="t-h2">Caregiving is a career here, not a gig</h2>
            <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)] md:text-base">
              <p>
                Every caregiver at Premium Care is a W-2 employee with real benefits, paid travel time, and a
                named supervisor who answers the phone. We do not use contractor arrangements to shift costs
                onto the people doing the hardest work.
              </p>
              <p>
                We also protect your assignments. You get a consistent client roster rather than a different
                address every morning, because that is better for clients and it is better for you.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-[color:var(--color-bg-soft)]">
        <div className="shell">
          <SectionHeading tag="Benefits" title="What we offer our team" />
          <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => {
              const Icon = icons[b.icon] ?? Banknote
              return (
                <RevealItem key={b.title}>
                  <article className="card-lift group flex h-full flex-col gap-3.5 rounded-2xl border border-[color:var(--color-line)] bg-white p-7 shadow-[0_1px_3px_rgba(15,42,61,0.06)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] transition-all duration-300 group-hover:bg-[color:var(--color-accent)] group-hover:text-white">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <h3 className="t-h4 text-[1.0625rem]">{b.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{b.body}</p>
                  </article>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Openings */}
      <section id="openings" className="section scroll-mt-24">
        <div className="shell">
          <SectionHeading tag="Open positions" title="Roles we are hiring for now" />
          <RevealGroup className="mx-auto mt-14 grid max-w-[58rem] gap-4">
            {jobOpenings.map((job) => (
              <RevealItem key={job.id}>
                <article className="card-lift flex flex-col gap-4 rounded-2xl border border-[color:var(--color-line)] bg-white p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-7">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="t-h4 text-[1.125rem]">{job.title}</h3>
                      <span className="rounded-full bg-[color:var(--color-accent)]/12 px-2.5 py-0.5 text-[0.75rem] font-semibold text-[color:var(--color-accent-dark)]">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">{job.blurb}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                      <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Banknote size={13} /> {job.pay}</span>
                      <span>{job.dept}</span>
                    </div>
                  </div>
                  <Button
                    size="sm" variant="secondary" href="#apply"
                    onClick={() => setSelectedRole(job.title)}
                    className="shrink-0"
                  >
                    Apply <ArrowIcon />
                  </Button>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-9 text-center text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
            Do not see your role? Send us your résumé anyway at{' '}
            <a href={`mailto:${site.careersEmail}`} className="link-underline font-medium text-[color:var(--color-primary)]">
              {site.careersEmail}
            </a>
            .
          </p>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="section scroll-mt-24 bg-[color:var(--color-bg-soft)]">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <SectionHeading
            align="left"
            tag="Apply"
            title="Tell us about yourself"
            lead="No cover letter needed. We read every application and reply to all of them, including the ones we cannot move forward."
          />
          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-white p-6 shadow-[0_16px_50px_-24px_rgba(15,42,61,0.28)] md:p-9">
              <ApplicationForm selectedRole={selectedRole} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function ApplicationForm({ selectedRole }: { selectedRole: string }) {
  const [state, setState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { position: '', experience: '', availability: '' },
  })

  // Reflect whichever "Apply" button the visitor clicked into the form.
  useEffect(() => {
    if (selectedRole) setValue('position', selectedRole, { shouldValidate: false })
  }, [selectedRole, setValue])

  async function onSubmit(v: FormValues) {
    setServerError(null); setState('loading')
    try {
      await createSubmission({
        kind: 'application', name: v.name, email: v.email, phone: v.phone,
        subject: `Application, ${v.position}`, message: v.message,
        payload: {
          position: v.position, experience: v.experience,
          certifications: v.certifications, availability: v.availability,
        },
      })
      setState('success'); reset()
    } catch (err) {
      setState('idle')
      setServerError(err instanceof Error ? err.message : 'Could not submit your application.')
    }
  }

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center gap-4 py-10 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-[color:var(--color-accent)] text-white">
          <Check size={26} strokeWidth={3} />
        </span>
        <h3 className="t-h3">Application received</h3>
        <p className="max-w-[26rem] text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
          Our talent team reviews every application within three business days and replies either way.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>Apply for another role</Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {!isSupabaseConfigured && (
        <Notice tone="warn">Demo mode: Supabase is not connected, so this application is stored locally in your browser.</Notice>
      )}
      {serverError && <Notice tone="warn">{serverError}</Notice>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Full name" required error={errors.name?.message} {...register('name')} />
        <Input label="Email address" type="email" required error={errors.email?.message} {...register('email')} />
        <Input label="Phone number" type="tel" required error={errors.phone?.message} {...register('phone')} />
        <Select label="Position" required error={errors.position?.message} {...register('position')}>
          <option value="">Select a role…</option>
          {jobOpenings.map((j) => <option key={j.id} value={j.title}>{j.title}</option>)}
          <option value="General application">General application</option>
        </Select>
        <Select label="Care experience" required error={errors.experience?.message} {...register('experience')}>
          <option value="">Select…</option>
          <option value="No experience, willing to train">No experience, willing to train</option>
          <option value="Less than 1 year">Less than 1 year</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5+ years">5+ years</option>
        </Select>
        <Select label="Availability" required error={errors.availability?.message} {...register('availability')}>
          <option value="">Select…</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Weekends only">Weekends only</option>
          <option value="Overnights">Overnights</option>
          <option value="Flexible / per diem">Flexible / per diem</option>
        </Select>
        <Input
          label="Certifications" wrapClass="sm:col-span-2"
          placeholder="HHA, CNA, RN, CPR, BLS…" hint="Optional, we pay for certification if you do not have one yet"
          error={errors.certifications?.message} {...register('certifications')}
        />
      </div>

      <Textarea
        label="Tell us about yourself"
        placeholder="Why caregiving? What kind of clients do you work best with?"
        required error={errors.message?.message} {...register('message')}
      />

      <Button type="submit" size="lg" disabled={state === 'loading'}>
        <SubmitStatus state={state} idleLabel="Submit application" />
        {state === 'idle' && <ArrowIcon />}
      </Button>

      <p className="text-center text-[0.8125rem] text-[color:var(--color-ink-muted)]">
        Premium Care is an equal opportunity employer.
      </p>
    </form>
  )
}
