import { describe, expect, it } from 'vitest'
import { services, serviceBySlug } from '@/data/services'
import { navLinks, site } from '@/data/site'
import { img } from '@/data/images'

describe('site configuration', () => {
  it('uses the Maryland contact details', () => {
    expect(site.phoneHref).toBe('tel:+12404372218')
    expect(site.email).toBe('info@premiumcareinc.com')
    expect(site.address.full).toBe('Hanover, Maryland')
  })

  it('exposes only Instagram as a social link', () => {
    expect(site.socials).toHaveLength(1)
    expect(site.socials[0].icon).toBe('instagram')
  })

  it('does not link to removed pages', () => {
    const targets = navLinks.map((l) => l.to)
    expect(targets).not.toContain('/blog')
    expect(targets).not.toContain('/insurance')
    expect(targets).not.toContain('/referral')
  })
})

describe('services', () => {
  it('every service resolves by slug and has an image', () => {
    for (const s of services) {
      expect(serviceBySlug(s.slug)).toBe(s)
      expect(img.services[s.slug], `missing image for ${s.slug}`).toBeTruthy()
    }
  })

  it('slugs are unique', () => {
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length)
  })
})

describe('copy style', () => {
  it('contains no em dashes anywhere in site copy', () => {
    const blob = JSON.stringify({ services, site: { ...site, address: site.address.full } })
    expect(blob).not.toMatch(/—/)
  })
})
