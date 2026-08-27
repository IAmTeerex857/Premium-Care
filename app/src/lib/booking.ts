import { z } from 'zod'

export function localDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().min(10, 'Enter a valid phone number.'),
  service: z.string().min(1, 'Choose the service you need.'),
  date: z.string()
    .min(1, 'Choose a preferred date.')
    .refine((value) => !value || value >= localDateValue(), 'Choose today or a future date.'),
  time: z.string().min(1, 'Choose a preferred time.'),
  relationship: z.string().min(1, 'Tell us who care is for.'),
  message: z.string().trim().max(2000).optional(),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
