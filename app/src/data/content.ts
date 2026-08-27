import { img } from './images'

/* ---------------- Core values (spec §8.1) ---------------- */
export const values = [
  {
    icon: 'shield-check',
    title: 'Integrity',
    body: 'We say what we will do and then we do it. Transparent pricing, honest assessments, and no upselling care that someone does not need.',
  },
  {
    icon: 'heart',
    title: 'Compassion',
    body: 'Every caregiver we hire is screened for skill and for warmth. Technique can be trained. Kindness is who someone already is.',
  },
  {
    icon: 'sparkles',
    title: 'Excellence',
    body: 'Ongoing training, supervised visits, and quality reviews on every plan. We measure our work and we share the results with families.',
  },
  {
    icon: 'handshake',
    title: 'Collaboration',
    body: 'Families, physicians, and therapists all hold a piece of the picture. We keep everyone talking so nothing falls through the gaps.',
  },
] as const

/* ---------------- Mission / Vision / Approach tabs (spec §8.3) ---------------- */
export const missionTabs = [
  {
    id: 'mission',
    label: 'Our Mission',
    heading: 'Care that lets people stay who they are',
    body: 'We exist so that needing help with daily life never means giving up the life you built. Premium Care delivers professional, deeply personal support in the place people most want to be, their own home, surrounded by their own things, on their own schedule.',
    points: [
      'Person-centered plans, written with the client, not about them',
      'Consistent caregivers, because trust does not transfer',
      'Transparent pricing with no surprise invoices',
    ],
    image: img.mission,
  },
  {
    id: 'vision',
    label: 'Our Vision',
    heading: 'A country where aging at home is the default',
    body: 'Too many people move into facilities because coordinated home support was too hard to find, not because it was the right clinical decision. We are building the alternative: a care network good enough, and reliable enough, that home becomes the obvious choice.',
    points: [
      'Expanding to underserved communities first',
      'Caregiver careers with real wages and real advancement',
      'Technology that supports care instead of replacing it',
    ],
    image: img.aboutTeam,
  },
  {
    id: 'approach',
    label: 'Our Approach',
    heading: 'Assess, match, adjust, then keep listening',
    body: 'Care needs change, so a care plan that never changes is already failing. We start with a free in-home assessment, match a caregiver on skills and personality, and revisit the plan on a set cadence rather than waiting for something to go wrong.',
    points: [
      'Free in-home assessment within 48 hours',
      'Caregiver matching on both clinical fit and personality',
      'Scheduled plan reviews and 24/7 escalation',
    ],
    image: img.aboutStory,
  },
] as const

/* ---------------- Testimonials (spec §8.4) ---------------- */
export const testimonials = [
  {
    quote:
      'Premium Care changed our family. My mother resisted help for two years, and within a month she was asking when Denise was coming back. They matched her with someone who genuinely fits her, and that made all the difference.',
    name: 'Sarah M.',
    role: 'Daughter & family caregiver',
    avatar: img.avatars.sarah,
    rating: 5,
  },
  {
    quote:
      'After my hip replacement I needed skilled nursing at home and I needed it fast. They had a nurse at my door the day I was discharged, coordinated directly with my surgeon, and I never once had to explain my own chart to anyone.',
    name: 'Robert T.',
    role: 'Client, skilled nursing',
    avatar: img.avatars.robert,
    rating: 5,
  },
  {
    quote:
      'I was caring for my husband alone and I was completely finished. Respite care gave me two afternoons a week back. I did not realize how far gone I was until I had a little room to breathe again.',
    name: 'Linda K.',
    role: 'Spouse & family caregiver',
    avatar: img.avatars.linda,
    rating: 5,
  },
  {
    quote:
      'My son has an intellectual disability and has been through a lot of agencies. This is the first team that asked him what he wanted his week to look like before they wrote a single line of the plan.',
    name: 'Michael R.',
    role: 'Parent, disability support',
    avatar: img.avatars.michael,
    rating: 5,
  },
] as const

/* ---------------- Process steps ---------------- */
export const processSteps = [
  {
    step: '01',
    title: 'Free consultation',
    body: 'A 20-minute call to understand the situation, answer questions, and tell you honestly whether we are the right fit.',
  },
  {
    step: '02',
    title: 'In-home assessment',
    body: 'A care manager visits within 48 hours to assess needs, safety, and the home itself, at no cost and with no obligation.',
  },
  {
    step: '03',
    title: 'Your care plan',
    body: 'We write a plan with you, covering schedule, tasks, goals, and cost. You approve it before anything begins.',
  },
  {
    step: '04',
    title: 'Caregiver matching',
    body: 'We match on skills and on personality, then introduce you before the first shift. Not the right fit? We rematch, no questions.',
  },
  {
    step: '05',
    title: 'Ongoing support',
    body: 'Scheduled plan reviews, supervisory visits, and a 24/7 line. The plan changes as the needs change.',
  },
] as const

/* ---------------- Team ---------------- */
export const team = [
  { name: 'Dana Whitfield, RN', role: 'Founder & Director of Nursing', photo: img.team.dana,
    bio: 'Twenty-two years in home health, the last nine building Premium Care around the belief that consistency is the whole job.' },
  { name: 'Marcus Ellery', role: 'Director of Operations', photo: img.team.marcus,
    bio: 'Runs scheduling, compliance, and the on-call system. If your caregiver arrives on time, that is Marcus.' },
  { name: 'Priya Raghavan, LCSW', role: 'Head of Care Coordination', photo: img.team.priya,
    bio: 'Leads the coordination team and personally handles the most complex multi-provider cases.' },
  { name: 'James Okonkwo', role: 'Director of Talent & Training', photo: img.team.james,
    bio: 'Hires and trains every caregiver. Screens for warmth first, then teaches the rest.' },
] as const


export const faqs = [
  {
    q: 'How quickly can care start?',
    a: 'For most requests we complete the in-home assessment within 48 hours and begin care within 3 to 5 days. Hospital discharges and urgent situations are prioritized, we have started same-day care when the need warranted it.',
  },
  {
    q: 'Is there a minimum number of hours?',
    a: 'Our standard minimum is four hours per visit, which is what it realistically takes to deliver meaningful help rather than a rushed check-in. Skilled nursing visits are the exception and are scheduled by clinical need.',
  },
  {
    q: 'What if we do not like our caregiver?',
    a: 'You tell us and we rematch, without any awkward conversation on your end and at no cost. Fit is not a nice-to-have in this work, a caregiver who is not right for your household will not deliver good care no matter how skilled they are.',
  },
  {
    q: 'Are your caregivers insured and background-checked?',
    a: 'Every caregiver is a W-2 employee, not a contractor. All are background-checked at the state and federal level, reference-verified, licensed where their role requires it, and covered by our liability and workers’ compensation insurance.',
  },
  {
    q: 'How do I know whether insurance will cover this?',
    a: 'Call us and we will run a benefits check at no charge. We will tell you what your plan covers, what it will not, and what the out-of-pocket difference looks like before you commit to anything.',
  },
  {
    q: 'Can care change as needs change?',
    a: 'That is the expectation, not the exception. Plans are formally reviewed on a set cadence and can be adjusted any time in between, increasing hours after a hospitalization, or reducing them as someone recovers.',
  },
  {
    q: 'Do you provide care in facilities as well as homes?',
    a: 'Yes. We provide supplemental one-on-one support in assisted living, memory care, and skilled nursing facilities, which families often use when facility staffing does not cover the attention their relative needs.',
  },
  {
    q: 'What areas do you serve?',
    a: 'Anne Arundel, Howard, Baltimore, Montgomery, and Prince George’s counties, plus Baltimore City and the surrounding Maryland communities. Call us if you are just outside that range. We can often still help or refer you to someone reputable who can.',
  },
] as const

/* ---------------- Careers ---------------- */
export const jobOpenings = [
  { id: 'hha-hanover', title: 'Home Health Aide (HHA)', type: 'Full-time', location: 'Hanover, MD',
    dept: 'Direct Care', pay: '$21 - $26 / hour',
    blurb: 'Deliver personal care and daily living support to clients in their homes. Certification required; we pay for recertification.' },
  { id: 'cna-columbia', title: 'Certified Nursing Assistant (CNA)', type: 'Full-time', location: 'Columbia, MD',
    dept: 'Direct Care', pay: '$23 - $28 / hour',
    blurb: 'Hands-on clinical support under RN supervision, with a consistent client roster rather than a rotating schedule.' },
  { id: 'rn-field', title: 'Registered Nurse, Field', type: 'Full-time', location: 'Maryland',
    dept: 'Clinical', pay: '$78,000 - $95,000 / year',
    blurb: 'Own a caseload of skilled nursing clients, run assessments, and supervise aide teams in the field.' },
  { id: 'companion-pt', title: 'Companion Caregiver', type: 'Part-time', location: 'Hanover, MD',
    dept: 'Direct Care', pay: '$19 - $23 / hour',
    blurb: 'Companionship, light help, and outings. No certification required, we train. Ideal for students and retirees.' },
  { id: 'coordinator', title: 'Care Coordinator', type: 'Full-time', location: 'Hanover, MD (Hybrid)',
    dept: 'Operations', pay: '$58,000 - $68,000 / year',
    blurb: 'Be the single point of contact for a portfolio of families, managing schedules, benefits, and provider communication.' },
  { id: 'scheduler', title: 'Staffing Scheduler', type: 'Full-time', location: 'Hanover, MD',
    dept: 'Operations', pay: '$50,000 - $60,000 / year',
    blurb: 'Match caregivers to shifts, handle call-outs, and keep continuity intact. Fast-paced and genuinely important.' },
] as const

export const benefits = [
  { icon: 'banknote', title: 'Pay that reflects the work', body: 'Above-market hourly rates, guaranteed overtime, and paid travel time between clients.' },
  { icon: 'heart-pulse', title: 'Real health coverage', body: 'Medical, dental, and vision from day 31 for anyone working 30+ hours a week.' },
  { icon: 'graduation-cap', title: 'Paid training & certification', body: 'We cover HHA and CNA certification, recertification, and continuing education hours.' },
  { icon: 'calendar-check', title: 'Schedules you control', body: 'Set your availability. We build around it instead of asking you to build around us.' },
  { icon: 'trending-up', title: 'Somewhere to go', body: 'Clear advancement from aide to senior aide to coordinator, with the training paid for.' },
  { icon: 'users-round', title: 'Support behind you', body: '24/7 clinical on-call, a named supervisor, and monthly team check-ins that are not performative.' },
] as const
