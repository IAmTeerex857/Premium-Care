import { describe, expect, it } from 'vitest'
import { bookingSchema, localDateValue } from '@/lib/booking'

const validBooking = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '5555555555',
  service: 'Skilled nursing',
  time: 'Morning',
  relationship: 'Myself',
}

describe('booking dates', () => {
  it('formats the local calendar date rather than using UTC', () => {
    expect(localDateValue(new Date(2026, 7, 27, 23, 30))).toBe('2026-08-27')
  })

  it('rejects a date before the current local date', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const result = bookingSchema.safeParse({ ...validBooking, date: localDateValue(yesterday) })
    expect(result.success).toBe(false)
  })

  it('accepts the current local date', () => {
    const result = bookingSchema.safeParse({ ...validBooking, date: localDateValue() })
    expect(result.success).toBe(true)
  })
})
