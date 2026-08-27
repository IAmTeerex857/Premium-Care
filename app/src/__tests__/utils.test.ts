import { describe, expect, it } from 'vitest'
import { cn, initials, formatDate, relativeTime } from '@/lib/utils'

describe('cn', () => {
  it('joins truthy class names and drops falsy ones', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })
})

describe('initials', () => {
  it('uses the first two words of a name', () => {
    expect(initials('Dana Whitfield')).toBe('DW')
  })
  it('falls back to the email local part', () => {
    expect(initials(null, 'admin@premiumcareinc.com')).toBe('A')
  })
  it('never throws on empty input', () => {
    expect(initials(null, null)).toBe('?')
  })
})

describe('formatDate', () => {
  it('formats an ISO date', () => {
    expect(formatDate('2026-08-27T00:00:00Z', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' }))
      .toBe('Aug 27, 2026')
  })
})

describe('relativeTime', () => {
  it('reports recent timestamps as minutes', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString()
    expect(relativeTime(fiveMinAgo)).toBe('5m ago')
  })
  it('reports hours', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3_600_000).toISOString()
    expect(relativeTime(threeHoursAgo)).toBe('3h ago')
  })
})
