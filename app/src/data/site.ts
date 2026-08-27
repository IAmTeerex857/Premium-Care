/**
 * Single source of truth for business details.
 * Swap these placeholders for the real thing and the whole site updates.
 */
export const site = {
  name: 'Premium Care',
  tagline: 'Compassion. Care. Quality of Life.',
  description:
    'Personalized in-home care, disability support, and skilled nursing that helps people live fully, safely, and independently.',
  phone: '+1 (240) 437-2218',
  phoneHref: 'tel:+12404372218',
  phoneDisplay: '+1 (240) 437-2218',
  email: 'info@premiumcareinc.com',
  emailHref: 'mailto:info@premiumcareinc.com',
  careersEmail: 'info@premiumcareinc.com',
  address: {
    line1: '7000 Arundel Mills Circle, Suite 200',
    city: 'Hanover',
    state: 'MD',
    zip: '21076',
    get full() {
      return `${this.line1}, ${this.city}, ${this.state} ${this.zip}`
    },
  },
  hours: [
    { days: 'Monday - Friday', time: '8:00 AM - 6:00 PM ET' },
    { days: 'Saturday', time: '9:00 AM - 2:00 PM ET' },
    { days: 'Sunday', time: 'Closed, on-call support available' },
  ],
  emergencyNote: '24/7 on-call support for active clients',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/premiumcareinc?utm_source=qr', icon: 'instagram' },
  ],
} as const

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const

export const stats = [
  { value: 500, suffix: '+', label: 'Families served' },
  { value: 98, suffix: '%', label: 'Satisfaction rate' },
  { value: 24, suffix: '/7', label: 'On-call support' },
  { value: 15, suffix: 'yrs', label: 'Of care experience' },
] as const
