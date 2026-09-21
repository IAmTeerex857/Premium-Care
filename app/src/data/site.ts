/**
 * Single source of truth for business details.
 * Swap these placeholders for the real thing and the whole site updates.
 */
export const site = {
  name: 'Premium Care',
  tagline: 'Compassion. Care. Quality of Life.',
  description:
    'Personalized in-home care, disability support, and skilled nursing that helps people live fully, safely, and independently.',
  phone: '+1 (443) 983-4222',
  phoneHref: 'tel:+14439834222',
  phoneDisplay: '+1 (443) 983-4222',
  email: 'info@premiumcareinc.com',
  emailHref: 'mailto:info@premiumcareinc.com',
  careersEmail: 'info@premiumcareinc.com',
  address: {
    city: 'Hanover',
    state: 'MD',
    stateLong: 'Maryland',
    get full() {
      return `${this.city}, ${this.stateLong}`
    },
  },
  hours: [{ days: 'Monday - Friday', time: '9:00 AM - 5:00 PM ET' }],
  emergencyNote: 'Available Monday - Friday, 9:00 AM - 5:00 PM ET',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/premiumcareinc?utm_source=qr', icon: 'instagram' },
  ],
} as const

export const serviceAreas = [
  {
    name: 'Central Maryland Regional Office', abbreviation: 'CMRO', countLabel: '5 jurisdictions',
    counties: ['Anne Arundel County', 'Baltimore County', 'Baltimore City', 'Harford County', 'Howard County'],
  },
  {
    name: 'Southern Maryland Regional Office', abbreviation: 'SMRO', countLabel: '5 counties',
    counties: ['Calvert County', 'Charles County', 'Montgomery County', "Prince George’s County", "St. Mary’s County"],
  },
  {
    name: 'Eastern Shore Regional Office', abbreviation: 'ESRO', countLabel: '9 counties',
    counties: ['Caroline County', 'Cecil County', 'Dorchester County', 'Kent County', "Queen Anne’s County", 'Somerset County', 'Talbot County', 'Wicomico County', 'Worcester County'],
  },
  {
    name: 'Western Maryland Regional Office', abbreviation: 'WMRO', countLabel: '5 counties',
    counties: ['Allegany County', 'Carroll County', 'Frederick County', 'Garrett County', 'Washington County'],
  },
] as const

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
  { value: 5, suffix: ' days', label: 'Office support each week' },
  { value: 15, suffix: 'yrs', label: 'Of care experience' },
] as const
