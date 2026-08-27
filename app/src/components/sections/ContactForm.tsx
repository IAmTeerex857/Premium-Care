import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { createSubmission } from '@/lib/api'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Input, Select, Textarea } from '@/components/ui/Field'
import { Button, ArrowIcon } from '@/components/ui/Button'
import { Notice, SubmitStatus, type SubmitState } from '@/components/ui/Misc'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().optional(),
  subject: z.string().min(1, 'Choose a subject.'),
  message: z.string().trim().min(10, 'Please tell us a little more (10 characters minimum).'),
})

type FormValues = z.infer<typeof schema>

export function ContactForm() {
  const [state, setState] = useState<SubmitState>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema), defaultValues: { subject: '' },
  })

  async function onSubmit(v: FormValues) {
    setServerError(null); setState('loading')
    try {
      await createSubmission({
        kind: 'contact', name: v.name, email: v.email, phone: v.phone,
        subject: v.subject, message: v.message,
      })
      setState('success'); reset()
    } catch (err) {
      setState('idle')
      setServerError(err instanceof Error ? err.message : 'Could not send your message.')
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
        <h3 className="t-h3">Message sent</h3>
        <p className="max-w-[26rem] text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
          We reply to every message within one business day.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>Send another message</Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {import.meta.env.DEV && !isSupabaseConfigured && (
        <Notice tone="warn">Demo mode: Supabase is not connected, so this message is stored locally in your browser.</Notice>
      )}
      {serverError && <Notice tone="warn">{serverError}</Notice>}

      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Your name" placeholder="Jane Doe" required error={errors.name?.message} {...register('name')} />
        <Input label="Email address" type="email" placeholder="jane@example.com" required error={errors.email?.message} {...register('email')} />
        <Input label="Phone number" type="tel" placeholder="(555) 010-0000" hint="Optional" error={errors.phone?.message} {...register('phone')} />
        <Select label="Subject" required error={errors.subject?.message} {...register('subject')}>
          <option value="">Select a subject…</option>
          <option value="New care enquiry">New care enquiry</option>
          <option value="Insurance & billing">Insurance &amp; billing</option>
          <option value="Existing client support">Existing client support</option>
          <option value="Careers">Careers</option>
          <option value="Partnership or referral">Partnership or referral</option>
          <option value="Something else">Something else</option>
        </Select>
      </div>

      <Textarea label="Message" placeholder="Tell us what is going on and how we can help…" required error={errors.message?.message} {...register('message')} />

      <Button type="submit" size="lg" disabled={state === 'loading'}>
        <SubmitStatus state={state} idleLabel="Send message" />
        {state === 'idle' && <ArrowIcon />}
      </Button>
    </form>
  )
}
