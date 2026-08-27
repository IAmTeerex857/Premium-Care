import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { services } from '@/data/services'
import { createSubmission } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'
import { CheckboxPill, Input, Select, Textarea } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'

const schema = z.object({
  referrerName: z.string().trim().min(2, 'Enter your name.'),
  referrerOrg: z.string().trim().min(2, 'Enter your organization.'),
  referrerRole: z.string().trim().optional(),
  referrerEmail: z.string().trim().email('Enter a valid email address.'),
  referrerPhone: z.string().trim().min(10, 'Enter a valid phone number.'),

  clientName: z.string().trim().min(2, "Enter the client's name."),
  clientPhone: z.string().trim().min(10, 'Enter a valid phone number.'),
  clientEmail: z.string().trim().email('Enter a valid email address.').or(z.literal('')).optional(),
  clientZip: z.string().trim().min(5, 'Enter a 5-digit ZIP code.'),
  fundingSource: z.string().min(1, 'Select the expected funding source.'),
  memberId: z.string().trim().optional(),
  urgency: z.string().min(1, 'Select an urgency level.'),
  servicesNeeded: z.array(z.string()).min(1, 'Select at least one service.'),
  consent: z.literal(true, { message: 'Confirmation of consent is required.' }),
  notes: z.string().trim().max(3000).optional(),
})

type FormValues = z.infer<typeof schema>

export function ReferralForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { servicesNeeded: [], fundingSource: '', urgency: '' },
  })

  async function onSubmit(v: FormValues) {
    setServerError(null); setState('loading')
    try {
      await createSubmission({
        kind: 'referral',
        name: v.referrerName,
        email: v.referrerEmail,
        phone: v.referrerPhone,
        subject: `Referral for ${v.clientName}, ${v.urgency}`,
        message: v.notes,
        payload: {
          referrer: { name: v.referrerName, organization: v.referrerOrg, role: v.referrerRole, email: v.referrerEmail, phone: v.referrerPhone },
          client: { name: v.clientName, phone: v.clientPhone, email: v.clientEmail, zip: v.clientZip },
          funding_source: v.fundingSource,
          member_id: v.memberId,
          urgency: v.urgency,
          services_needed: v.servicesNeeded,
          consent_confirmed: v.consent,
        },
      })
      setState('success'); reset()
    } catch (err) {
      setState('idle')
      setServerError(err instanceof Error ? err.message : 'Could not submit the referral.')
    }
  }

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/6 px-7 py-14 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-[color:var(--color-accent)] text-white">
          <Check size={26} strokeWidth={3} />
        </span>
        <h3 className="t-h3">Referral submitted</h3>
        <p className="max-w-[28rem] text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
          Our intake team reviews referrals the same business day and will contact both you and the client
          directly. Urgent referrals are escalated immediately.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>Submit another referral</Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-9">
      {!isSupabaseConfigured && (
        <Notice tone="warn">Demo mode: Supabase is not connected, so this referral is stored locally in your browser.</Notice>
      )}
      {serverError && <Notice tone="warn">{serverError}</Notice>}

      <fieldset className="flex flex-col gap-5">
        <legend className="t-label mb-1 text-[color:var(--color-accent)]">Referring professional</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Your name" required error={errors.referrerName?.message} {...register('referrerName')} />
          <Input label="Organization" required error={errors.referrerOrg?.message} {...register('referrerOrg')} />
          <Input label="Your role" placeholder="Discharge planner, social worker…" hint="Optional" error={errors.referrerRole?.message} {...register('referrerRole')} />
          <Input label="Email address" type="email" required error={errors.referrerEmail?.message} {...register('referrerEmail')} />
          <Input label="Phone number" type="tel" required wrapClass="sm:col-span-2" error={errors.referrerPhone?.message} {...register('referrerPhone')} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="t-label mb-1 text-[color:var(--color-accent)]">Client details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Client name" required error={errors.clientName?.message} {...register('clientName')} />
          <Input label="Client phone" type="tel" required error={errors.clientPhone?.message} {...register('clientPhone')} />
          <Input label="Client email" type="email" hint="Optional" error={errors.clientEmail?.message} {...register('clientEmail')} />
          <Input label="Client ZIP code" required error={errors.clientZip?.message} {...register('clientZip')} />
          <Select label="Expected funding source" required error={errors.fundingSource?.message} {...register('fundingSource')}>
            <option value="">Select one…</option>
            <option value="Medicaid / HCBS waiver">Medicaid / HCBS waiver</option>
            <option value="Medicare">Medicare</option>
            <option value="Long-term care insurance">Long-term care insurance</option>
            <option value="VA benefits">VA benefits</option>
            <option value="Private pay">Private pay</option>
            <option value="Workers' compensation">Workers’ compensation</option>
            <option value="Unknown">Unknown / to be determined</option>
          </Select>
          <Input label="Member or policy ID" hint="Optional, helps us verify benefits faster" error={errors.memberId?.message} {...register('memberId')} />
          <Select label="Urgency" required wrapClass="sm:col-span-2" error={errors.urgency?.message} {...register('urgency')}>
            <option value="">Select urgency…</option>
            <option value="Urgent, care needed within 24 hours">Urgent, care needed within 24 hours</option>
            <option value="Hospital discharge pending">Hospital discharge pending</option>
            <option value="Within 1 week">Within 1 week</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="Planning ahead">Planning ahead</option>
          </Select>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="t-label mb-1 text-[color:var(--color-accent)]">Services required</legend>
        <Controller
          control={control}
          name="servicesNeeded"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2.5">
              {services.map((s) => {
                const checked = field.value.includes(s.title)
                return (
                  <CheckboxPill
                    key={s.slug}
                    label={s.title}
                    checked={checked}
                    onChange={(next) =>
                      field.onChange(next ? [...field.value, s.title] : field.value.filter((x) => x !== s.title))
                    }
                  />
                )
              })}
            </div>
          )}
        />
        {errors.servicesNeeded && (
          <p role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{errors.servicesNeeded.message}</p>
        )}
      </fieldset>

      <Textarea
        label="Additional notes"
        placeholder="Diagnosis, mobility level, cognitive status, living situation, safety concerns, current supports…"
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-muted)] p-4 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
          <input
            type="checkbox"
            className="mt-px size-5 shrink-0 accent-[color:var(--color-accent)]"
            {...register('consent')}
          />
          <span>
            I confirm that the client (or their authorized representative) has consented to this referral and to
            Premium Care contacting them directly.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{errors.consent.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={state === 'loading'}>
        <SubmitStatus state={state} idleLabel="Submit referral" />
        {state === 'idle' && <ArrowIcon />}
      </Button>
    </form>
  )
}
