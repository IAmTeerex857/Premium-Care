/**
 * Single source of truth for business details.
 * Swap these placeholders for the real thing and the whole site updates.
 */
export const site = {
  name: 'Premium Care',
  tagline: 'We Are Here Because of You',
  description:
    'Personalized in-home care, disability support, and skilled nursing that helps people live fully, safely, and independently.',
  phone: '(555) 010-4827',
  phoneHref: 'tel:+15550104827',
  phoneDisplay: '(555) 010-4827',
  email: 'hello@premiumcare.com',
  emailHref: 'mailto:hello@premiumcare.com',
  careersEmail: 'careers@premiumcare.com',
  address: {
    line1: '1400 Beacon Street, Suite 300',
    city: 'Boston',
    state: 'MA',
    zip: '02446',
    get full() {
      return `${this.line1}, ${this.city}, ${this.state} ${this.zip}`
    },
  },
  hours: [
    { days: 'Monday – Friday', time: '8:00 AM – 6:00 PM ET' },
    { days: 'Saturday', time: '9:00 AM – 2:00 PM ET' },
    { days: 'Sunday', time: 'Closed — on-call support available' },
  ],
  emergencyNote: '24/7 on-call support for active clients',
  socials: [
    { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
    { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  ],
} as const

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Services', to: '/services' },
  { label: 'Insurance', to: '/insurance' },
  { label: 'Careers', to: '/careers' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
] as const

export const stats = [
  { value: 500, suffix: '+', label: 'Families served' },
  { value: 98, suffix: '%', label: 'Satisfaction rate' },
  { value: 24, suffix: '/7', label: 'On-call support' },
  { value: 15, suffix: 'yrs', label: 'Of care experience' },
] as const
