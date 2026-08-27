export type Service = {
  slug: string
  title: string
  short: string
  summary: string
  icon: string
  includes: string[]
  goodFor: string[]
  featured?: boolean
}

export const services: Service[] = [
  {
    slug: 'in-home-care',
    title: 'In-Home Care',
    short: 'Everyday help that keeps people safely at home.',
    summary:
      'Our most requested service. A caregiver you actually know comes to the house on a consistent schedule to help with the parts of the day that have gotten harder, meals, laundry, light housekeeping, medication reminders, and simply being there.',
    icon: 'house',
    includes: [
      'Meal planning and preparation',
      'Light housekeeping and laundry',
      'Medication reminders',
      'Grocery shopping and errands',
      'Mobility and transfer assistance',
      'Overnight and live-in options',
    ],
    goodFor: ['Seniors aging in place', 'Post-hospital recovery', 'Chronic condition management'],
    featured: true,
  },
  {
    slug: 'personal-care',
    title: 'Personal Care & Assistance',
    short: 'Dignified hands-on support with daily living.',
    summary:
      'Hands-on assistance with activities of daily living, delivered by trained aides who understand that this is the most personal work there is. We take privacy and dignity as seriously as we take safety.',
    icon: 'heart-handshake',
    includes: [
      'Bathing, grooming, and dressing',
      'Toileting and incontinence care',
      'Transfer and ambulation support',
      'Feeding assistance',
      'Repositioning and skin checks',
      'Morning and evening routines',
    ],
    goodFor: ['Limited mobility', 'Post-surgical recovery', 'Advanced chronic illness'],
    featured: true,
  },
  {
    slug: 'companion-care',
    title: 'Companion Care',
    short: 'Because isolation is a health condition too.',
    summary:
      'Consistent, warm company for people who are managing fine physically but spending too much time alone. Conversation, shared activities, outings, and a reliable set of eyes on how someone is really doing.',
    icon: 'users',
    includes: [
      'Conversation and companionship',
      'Games, hobbies, and reading together',
      'Walks and community outings',
      'Help staying connected with family',
      'Appointment accompaniment',
      'Wellness check-ins',
    ],
    goodFor: ['Social isolation', 'Early memory changes', 'Recently widowed clients'],
  },
  {
    slug: 'respite-care',
    title: 'Respite Care',
    short: 'Short-term relief for family caregivers.',
    summary:
      'Family caregivers burn out, quietly, and faster than anyone admits. Respite care gives you a few hours, a weekend, or a two-week vacation while someone qualified takes over, following the routine you have already built.',
    icon: 'life-buoy',
    includes: [
      'Hourly, overnight, or extended respite',
      'Same-caregiver continuity where possible',
      'Full handover of your existing routine',
      'Emergency and short-notice coverage',
      'Written daily reports while you are away',
      'Support for the caregiver, too',
    ],
    goodFor: ['Family caregivers', 'Planned travel', 'Caregiver illness or emergency'],
    featured: true,
  },
  {
    slug: 'skilled-nursing',
    title: 'Skilled Nursing',
    short: 'Licensed clinical care in the home.',
    summary:
      'RN and LPN-delivered clinical care at home, coordinated directly with your physician. For people who need real medical oversight but do not need, or want, to be in a facility to get it.',
    icon: 'stethoscope',
    includes: [
      'Wound care and dressing changes',
      'Medication administration and management',
      'Injections and infusion support',
      'Vital sign monitoring',
      'Catheter and ostomy care',
      'Physician communication and reporting',
    ],
    goodFor: ['Post-hospital discharge', 'Complex medication regimens', 'Wound management'],
  },
  {
    slug: 'disability-support',
    title: 'Disability Support',
    short: 'Support built around independence, not limitation.',
    summary:
      'Person-centered support for adults with physical, intellectual, and developmental disabilities. We build the plan around what someone wants their life to look like, then support the parts that need supporting.',
    icon: 'accessibility',
    includes: [
      'Daily living skills coaching',
      'Community access and participation',
      'Employment and volunteering support',
      'Behavioral support plan implementation',
      'Supported independent living',
      'Family and household training',
    ],
    goodFor: ['Adults with IDD', 'Physical disabilities', 'Transition-age young adults'],
  },
  {
    slug: 'care-coordination',
    title: 'Care Coordination',
    short: 'One person holding the whole picture.',
    summary:
      'A dedicated coordinator who tracks the appointments, the specialists, the insurance, and the paperwork so families stop losing evenings to phone trees. Included at no extra cost with ongoing care plans.',
    icon: 'clipboard-list',
    includes: [
      'Single point of contact for the family',
      'Appointment scheduling and tracking',
      'Insurance and benefits navigation',
      'Care plan updates as needs change',
      'Provider and specialist communication',
      'Hospital admission and discharge support',
    ],
    goodFor: ['Complex medical needs', 'Long-distance family caregivers', 'Multiple providers'],
  },
  {
    slug: 'transportation',
    title: 'Transportation',
    short: 'Safe rides, with someone who stays.',
    summary:
      'Door-through-door transportation to appointments, therapy, and community life. Our caregivers do not drop off and drive away, they walk you in, wait, take notes, and bring you home.',
    icon: 'car',
    includes: [
      'Medical and therapy appointments',
      'Wheelchair-accessible vehicle options',
      'Door-through-door escort',
      'Note-taking during appointments',
      'Pharmacy and grocery stops',
      'Social and religious outings',
    ],
    goodFor: ['Non-drivers', 'Wheelchair users', 'Post-procedure transport'],
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)
