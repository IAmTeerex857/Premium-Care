import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CalendarCheck, Check } from 'lucide-react'
import { services } from '@/data/services'
import { createSubmission } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Input, Select, Textarea } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(10, 'Enter a valid phone number.'),
  service: z.string().min(1, 'Choose the service you need.'),
  date: z.string().min(1, 'Choose a preferred date.'),
  time: z.string().min(1, 'Choose a preferred time.'),
  relationship: z.string().min(1, 'Tell us who care is for.'),
  message: z.string().trim().max(2000).optional(),
})

type FormValues = z.infer<typeof schema>

const today = new Date().toISOString().split('T')[0]

export function BookingForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { relationship: '' },
  })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    setState('loading')
    try {
      await createSubmission({
        kind: 'booking',
        name: values.name,
        email: values.email,
        phone: values.phone,
        subject: `Appointment request, ${values.service}`,
        message: values.message || null as unknown as string,
        payload: {
          service: values.service,
          preferred_date: values.date,
          preferred_time: values.time,
          care_for: values.relationship,
        },
      })
      setState('success')
      reset()
    } catch (err) {
      setState('idle')
      setServerError(err instanceof Error ? err.message : 'Could not send your request. Please call us instead.')
    }
  }

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-accent)]/30 bg-[color:var(--color-accent)]/6 px-7 py-14 text-center"
      >
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
          className="grid size-14 place-items-center rounded-full bg-[color:var(--color-accent)] text-white"
        >
          <Check size={26} strokeWidth={3} />
        </motion.span>
        <h3 className="t-h3">Request received</h3>
        <p className="max-w-[26rem] text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
          A care manager will call you within one business day to confirm your appointment. If it is urgent,
          call us directly and we will pick up.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>
          Submit another request
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {!isSupabaseConfigured && (
        <Notice tone="warn">
          Demo mode: Supabase is not connected, so this request will be stored locally in your browser
          instead of reaching the staff portal.
        </Notice>
      )}
      {serverError && <Notice tone="warn">{serverError}</Notice>}

      <div className={compact ? 'grid gap-5' : 'grid gap-5 sm:grid-cols-2'}>
        <Input label="Full name" placeholder="Jane Doe" required error={errors.name?.message} {...register('name')} />
        <Input label="Email address" type="email" placeholder="jane@example.com" required error={errors.email?.message} {...register('email')} />
        <Input label="Phone number" type="tel" placeholder="(555) 010-0000" required error={errors.phone?.message} {...register('phone')} />
        <Select label="Who is care for?" required error={errors.relationship?.message} {...register('relationship')}>
          <option value="">Select one…</option>
          <option value="Myself">Myself</option>
          <option value="Parent">A parent</option>
          <option value="Spouse or partner">A spouse or partner</option>
          <option value="Child">A child</option>
          <option value="Other family member">Another family member</option>
          <option value="A client (professional referral)">A client, I am a professional</option>
        </Select>
        <Select label="Service needed" required error={errors.service?.message} wrapClass={compact ? '' : 'sm:col-span-2'} {...register('service')}>
          <option value="">Select a service…</option>
          {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
          <option value="Not sure yet">I am not sure yet</option>
        </Select>
        <Input label="Preferred date" type="date" min={today} required error={errors.date?.message} {...register('date')} />
        <Select label="Preferred time" required error={errors.time?.message} {...register('time')}>
          <option value="">Select a time…</option>
          <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
          <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
          <option value="Late afternoon (4pm - 6pm)">Late afternoon (4pm - 6pm)</option>
        </Select>
      </div>

      <Textarea
        label="Anything we should know?"
        placeholder="Diagnosis, current support, mobility, what a good week would look like…"
        error={errors.message?.message}
        {...register('message')}
      />

      <Button type="submit" size="lg" disabled={state === 'loading'} full={compact}>
        <CalendarCheck size={17} className={state === 'loading' ? 'hidden' : ''} />
        <SubmitStatus state={state} idleLabel="Schedule an appointment" />
        {state === 'idle' && <ArrowIcon />}
      </Button>

      <p className="text-center text-[0.8125rem] text-[color:var(--color-ink-muted)]">
        No obligation. We never share your information with third parties.
      </p>
    </form>
  )
}
