import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Check, Paperclip, X } from 'lucide-react'
import { createSubmission } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'
import { CheckboxPill, Input, Select, Textarea } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'
import { cn } from '@/lib/utils'

const LICENSES = ['CMT', 'CNA', 'RN', 'LPN', 'HHA', 'Other (please specify)'] as const
const SHIFTS = ['Day', 'PM', 'Noc (overnight)', 'Live-In'] as const
const YESNO = ['Yes', 'No'] as const

const schema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name.'),
    address: z.string().trim().min(3, 'Enter your street address.'),
    city: z.string().trim().min(2, 'Enter your city.'),
    state: z.string().trim().min(2, 'Enter your state.'),
    zip: z.string().trim().min(5, 'Enter your ZIP code.'),
    phoneDay: z.string().trim().min(10, 'Enter a daytime phone number.'),
    phoneEvening: z.string().trim().optional(),
    email: z.string().trim().email('Enter a valid email address.'),
    license: z.string().min(1, 'Select the license you hold.'),
    licenseOther: z.string().trim().optional(),
    overEighteen: z.string().min(1, 'Please answer this question.'),
    driversLicense: z.string().min(1, 'Please answer this question.'),
    ownsCar: z.string().min(1, 'Please answer this question.'),
    shifts: z.array(z.string()).min(1, 'Select at least one shift.'),
    experience: z.string().trim().optional(),
    heardAbout: z.string().trim().optional(),
  })
  .refine((v) => v.license !== 'Other (please specify)' || !!v.licenseOther?.trim(), {
    message: 'Tell us which license you hold.',
    path: ['licenseOther'],
  })

type FormValues = z.infer<typeof schema>

const MAX_RESUME_BYTES = 10 * 1024 * 1024

export function CareerForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const [resume, setResume] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { shifts: [], license: '', overEighteen: '', driversLicense: '', ownsCar: '' },
  })

  const license = watch('license')

  /** Signature check, because an extension proves nothing about content. */
  async function sniff(file: File): Promise<boolean> {
    const head = new Uint8Array(await file.slice(0, 8).arrayBuffer())
    const starts = (...bytes: number[]) => bytes.every((b, i) => head[i] === b)
    if (starts(0x25, 0x50, 0x44, 0x46)) return true                 // %PDF
    if (starts(0x50, 0x4b, 0x03, 0x04)) return true                 // zip (docx)
    if (starts(0xd0, 0xcf, 0x11, 0xe0)) return true                 // legacy .doc
    if (starts(0x7b, 0x5c, 0x72, 0x74)) return true                 // {\rt (rtf)
    // Plain text has no signature; accept only if it really is text/plain.
    return file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')
  }

  async function pickResume(file: File | null) {
    setResumeError(null)
    if (!file) return setResume(null)
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError('That file is larger than 10 MB. Please attach a smaller file.')
      return
    }
    if (!(await sniff(file))) {
      setResumeError('That does not look like a PDF, Word, RTF or text document.')
      return
    }
    setResume(file)
  }

  async function onSubmit(v: FormValues) {
    setServerError(null)
    setState('loading')
    try {
      await createSubmission({
        kind: 'application',
        name: v.name,
        email: v.email,
        phone: v.phoneDay,
        subject: `Career application, ${v.license === 'Other (please specify)' ? v.licenseOther : v.license}`,
        message: v.experience || undefined,
        payload: {
          address: { street: v.address, city: v.city, state: v.state, zip: v.zip },
          phone_day: v.phoneDay,
          phone_evening: v.phoneEvening,
          license: v.license === 'Other (please specify)' ? v.licenseOther : v.license,
          over_eighteen: v.overEighteen,
          drivers_license: v.driversLicense,
          owns_car: v.ownsCar,
          preferred_shifts: v.shifts,
          heard_about_us: v.heardAbout,
        },
      }, resume ?? undefined)
      setState('success')
      reset()
      setResume(null)
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
        className="flex flex-col items-center gap-4 py-14 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-[color:var(--color-primary)] text-white">
          <Check size={26} strokeWidth={3} />
        </span>
        <h3 className="t-h3">Application received</h3>
        <p className="max-w-[28rem] text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
          Thank you for your interest in Premium Care. Our team reviews every application and will be in
          touch within three business days.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>Submit another application</Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      {import.meta.env.DEV && !isSupabaseConfigured && (
        <Notice tone="warn">Demo mode: Supabase is not connected, so this application is stored locally in your browser.</Notice>
      )}
      {serverError && <Notice tone="warn">{serverError}</Notice>}

      <fieldset className="flex flex-col gap-5">
        <legend className="t-label mb-1 text-[color:var(--color-primary-light)]">Your details</legend>
        <Input label="Name" required error={errors.name?.message} {...register('name')} />
        <Input label="Address" required error={errors.address?.message} {...register('address')} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Input label="City" required error={errors.city?.message} {...register('city')} />
          <Input label="State" required placeholder="MD" error={errors.state?.message} {...register('state')} />
          <Input label="ZIP code" required error={errors.zip?.message} {...register('zip')} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Phone (day)" type="tel" required error={errors.phoneDay?.message} {...register('phoneDay')} />
          <Input label="Phone (evening)" type="tel" hint="Optional" error={errors.phoneEvening?.message} {...register('phoneEvening')} />
        </div>
        <Input label="Email address" type="email" required error={errors.email?.message} {...register('email')} />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="t-label mb-1 text-[color:var(--color-primary-light)]">Qualifications</legend>
        <Select label="What license do you currently hold?" required error={errors.license?.message} {...register('license')}>
          <option value="">Select one...</option>
          {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        {license === 'Other (please specify)' && (
          <Input label="Which license?" required error={errors.licenseOther?.message} {...register('licenseOther')} />
        )}

        <div className="grid gap-6 sm:grid-cols-3">
          <RadioRow control={control} name="overEighteen" label="Are you over 18?" error={errors.overEighteen?.message} />
          <RadioRow control={control} name="driversLicense" label="Do you have a driver's license?" error={errors.driversLicense?.message} />
          <RadioRow control={control} name="ownsCar" label="Do you own a car?" error={errors.ownsCar?.message} />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[0.8125rem] font-semibold font-[var(--font-display)] text-[color:var(--color-ink-secondary)]">
            What shifts would you prefer? <span className="text-[color:var(--color-warm)]">*</span>
          </span>
          <Controller
            control={control}
            name="shifts"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2.5">
                {SHIFTS.map((s) => (
                  <CheckboxPill
                    key={s} label={s}
                    checked={field.value.includes(s)}
                    onChange={(next) =>
                      field.onChange(next ? [...field.value, s] : field.value.filter((x) => x !== s))
                    }
                  />
                ))}
              </div>
            )}
          />
          {errors.shifts && <p role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{errors.shifts.message}</p>}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="t-label mb-1 text-[color:var(--color-primary-light)]">A little more</legend>
        <Textarea
          label="Previous experience"
          placeholder="Where have you worked, what kind of clients have you supported, and for how long?"
          hint="Optional"
          error={errors.experience?.message}
          {...register('experience')}
        />
        <Input label="How did you hear about us?" hint="Optional" error={errors.heardAbout?.message} {...register('heardAbout')} />

        <div className="flex flex-col gap-2">
          <span className="text-[0.8125rem] font-semibold font-[var(--font-display)] text-[color:var(--color-ink-secondary)]">
            Attach resume
          </span>
          <label
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-[0.875rem] border-[1.5px] border-dashed px-5 py-4 transition-colors',
              resume
                ? 'border-[color:var(--color-primary-light)] bg-[color:var(--color-primary-light)]/6'
                : 'border-[color:var(--color-line)] bg-[color:var(--color-bg-muted)] hover:border-[color:var(--color-primary-light)]',
            )}
          >
            <Paperclip size={17} className="shrink-0 text-[color:var(--color-primary-light)]" />
            <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
              {resume ? resume.name : 'PDF, DOC, DOCX, RTF or TXT, up to 10 MB'}
            </span>
            {resume && (
              <span
                role="button" tabIndex={0} aria-label="Remove attached resume"
                onClick={(e) => { e.preventDefault(); void pickResume(null) }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void pickResume(null) } }}
                className="grid size-7 shrink-0 place-items-center rounded-full text-[color:var(--color-ink-muted)] hover:bg-white hover:text-[color:var(--color-warm)]"
              >
                <X size={14} />
              </span>
            )}
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.rtf,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/rtf"
              onChange={(e) => void pickResume(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className={cn('text-[0.8125rem]', resumeError ? 'text-[color:var(--color-warm)]' : 'text-[color:var(--color-ink-muted)]')}>
            {resumeError ?? 'Optional, but it helps us move faster.'}
          </p>
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={state === 'loading'}>
        <SubmitStatus state={state} idleLabel="Submit" />
        {state === 'idle' && <ArrowIcon />}
      </Button>

      <p className="text-center text-[0.8125rem] text-[color:var(--color-ink-muted)]">
        Premium Care is an equal opportunity employer.
      </p>
    </form>
  )
}

/* Yes / No radio pair. */
function RadioRow({ control, name, label, error }: {
  control: import('react-hook-form').Control<FormValues>
  name: 'overEighteen' | 'driversLicense' | 'ownsCar'
  label: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[0.8125rem] font-semibold font-[var(--font-display)] text-[color:var(--color-ink-secondary)]">
        {label} <span className="text-[color:var(--color-warm)]">*</span>
      </span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div role="radiogroup" aria-label={label} className="flex gap-2.5">
            {YESNO.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={field.value === opt}
                onClick={() => field.onChange(opt)}
                className={cn(
                  'h-10 min-w-[4.5rem] rounded-full border-[1.5px] px-5 text-[0.875rem] font-semibold transition-all duration-200 active:scale-[0.97]',
                  field.value === opt
                    ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white'
                    : 'border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-secondary)] hover:border-[color:var(--color-primary-light)]',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      />
      {error && <p role="alert" className="text-[0.8125rem] text-[color:var(--color-warm)]">{error}</p>}
    </div>
  )
}
