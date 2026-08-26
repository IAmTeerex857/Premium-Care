import { img } from './images'

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readMinutes: number
  author: string
  cover: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'signs-a-loved-one-needs-help',
    title: '8 Quiet Signs a Parent Needs Help at Home',
    excerpt:
      'The moment care becomes necessary is rarely dramatic. It usually shows up in the mail pile, the refrigerator, and the laundry basket.',
    category: 'Family Guidance',
    date: '2026-08-12',
    readMinutes: 6,
    author: 'Dana Whitfield, RN',
    cover: img.blog['signs-a-loved-one-needs-help'],
    body: [
      'Families almost never call us after a single dramatic event. They call after months of small observations that finally added up on a holiday visit — the kind of details that are easy to explain away one at a time and impossible to ignore together.',
      'Here is what our care managers look for first, and what each one usually means.',
      '**1. The mail is piling up.** Unopened bills and second notices are one of the earliest and most reliable indicators of executive-function decline. Managing mail requires sorting, prioritizing, and following through — the exact sequence that erodes first.',
      '**2. The refrigerator tells the truth.** Expired food, near-empty shelves, or a freezer full of untouched meals someone else delivered all point to the same thing: cooking has become too hard, and eating is being skipped.',
      '**3. Familiar clothes, worn repeatedly.** The same outfit across several visits usually means laundry has become difficult, or that dressing itself now takes more effort than it once did.',
      '**4. New dents in the car.** Unexplained scrapes on the bumper or garage frame frequently precede a serious driving incident by months. Ask about them directly.',
      '**5. Weight loss no one mentions.** Clothes fitting differently is often the first visible sign of poor nutrition, depression, or an untreated medical issue.',
      '**6. The house smells different.** Odors related to incontinence, spoiled food, or reduced cleaning are among the hardest things for families to raise, and among the most important.',
      '**7. Social withdrawal.** Dropping out of a long-standing church group, card game, or walking club is rarely about losing interest. It usually reflects mobility, continence, or memory concerns someone is hiding.',
      '**8. Medication confusion.** Pill organizers filled incorrectly, duplicate prescriptions, or bottles that should be empty and are not — these carry immediate clinical risk and warrant a call to the prescriber.',
      'One of these on its own may be nothing. Three or more together usually means the current arrangement is no longer working, and that a conversation is overdue rather than premature.',
      'That conversation goes better when it starts with a question rather than a conclusion. "What part of the week has gotten hardest?" gets you further than "You need help."',
    ],
  },
  {
    slug: 'paying-for-home-care',
    title: 'How Families Actually Pay for Home Care',
    excerpt:
      'Medicare, Medicaid waivers, long-term care insurance, VA benefits, and private pay — what each one really covers.',
    category: 'Insurance & Costs',
    date: '2026-07-29',
    readMinutes: 9,
    author: 'Priya Raghavan, LCSW',
    cover: img.blog['paying-for-home-care'],
    body: [
      'The single most common misunderstanding we encounter is the belief that Medicare pays for home care. It pays for *some* home health care, under specific conditions, for a limited time. It does not pay for the ongoing daily support most families are actually looking for.',
      'Here is the honest breakdown of the five funding paths.',
      '**Medicare.** Covers intermittent skilled nursing and therapy when a physician certifies medical necessity and the patient is considered homebound. It is time-limited and clinically driven. It does not cover custodial care — bathing, meals, companionship — when that is the only need.',
      '**Medicaid and HCBS waivers.** For those who meet income and asset limits, state Home and Community-Based Services waivers are the most substantial source of funding for ongoing personal care. Waiting lists exist in many states, so apply earlier than you think you need to.',
      '**Long-term care insurance.** If a policy was purchased years ago, read it now rather than at the point of crisis. Most policies have an elimination period — often 90 days of paid care before reimbursement begins — and require documentation of deficits in activities of daily living.',
      '**VA benefits.** Aid & Attendance provides a monthly benefit above the standard VA pension for veterans and surviving spouses who need help with daily activities. The Veteran-Directed Care program goes further, giving veterans a budget to arrange their own services.',
      '**Private pay.** Straightforward and immediate, with no eligibility process. Many families use private pay as a bridge while a Medicaid or VA application is pending, then transition once it is approved.',
      'Most families we work with end up combining two or three of these rather than relying on a single source. A benefits check before you commit to anything is free, takes about twenty minutes, and regularly uncovers coverage people did not know they had.',
    ],
  },
  {
    slug: 'preventing-falls-at-home',
    title: 'The 30-Minute Home Safety Sweep',
    excerpt:
      'One in four adults over 65 falls each year. A significant share of those falls trace back to fixable conditions in the home.',
    category: 'Safety',
    date: '2026-07-15',
    readMinutes: 5,
    author: 'Dana Whitfield, RN',
    cover: img.blog['preventing-falls-at-home'],
    body: [
      'Falls are the leading cause of injury-related hospitalization among older adults, and a hip fracture after 65 changes the trajectory of someone’s independence more than almost any other single event.',
      'The encouraging part is how many of the contributing conditions are fixable in an afternoon.',
      '**Start with the floor.** Remove throw rugs entirely — they are the most common single hazard we find, and no amount of non-slip backing makes them safe. Tape down cords, clear walking paths, and fix any transition strip that catches a toe.',
      '**Then the bathroom.** Install grab bars at the toilet and inside the shower, anchored into studs rather than drywall anchors. Add a shower chair and a handheld showerhead. Replace a low toilet with a comfort-height model or add a raised seat.',
      '**Light everything.** Age-related vision changes mean older eyes need substantially more light than younger ones. Add motion-activated nightlights along the path from bed to bathroom, and make sure every staircase has a switch at both ends.',
      '**Handle the stairs.** Railings on both sides, secure and full-length. Contrast tape on the edge of each step. Nothing stored on the treads, ever.',
      '**Check the shoes.** Loose slippers and socks on hardwood cause a surprising share of indoor falls. Supportive shoes with a back and a non-slip sole should be worn indoors too.',
      '**Review the medications.** Sedatives, blood pressure medications, and anything causing dizziness on standing all raise fall risk. A pharmacist can review the full list for interactions at no cost.',
      'Our free in-home assessment includes this full safety sweep with a written report, whether or not you go on to use our services.',
    ],
  },
  {
    slug: 'caregiver-burnout',
    title: 'Caregiver Burnout Is a Medical Issue, Not a Character Flaw',
    excerpt:
      'Family caregivers show measurably worse health outcomes than non-caregiving peers. Here is how to recognize the point of danger.',
    category: 'Caregiver Support',
    date: '2026-06-30',
    readMinutes: 7,
    author: 'Priya Raghavan, LCSW',
    cover: img.blog['caregiver-burnout'],
    body: [
      'Family caregivers consistently report higher rates of depression, worse sleep, delayed medical care for themselves, and greater chronic disease burden than comparable adults who are not caregiving. This is a well-documented health phenomenon, not a personal failing.',
      'Burnout also arrives gradually enough that the person experiencing it is usually the last to identify it.',
      '**The early markers.** Sleep that does not restore. Irritability that feels unfamiliar. Losing interest in things that used to matter. Skipping your own appointments because there is no room in the week.',
      '**The serious markers.** Resentment toward the person you are caring for, followed by guilt about the resentment. Feeling trapped. Intrusive thoughts about escape. Physical symptoms with no clear cause.',
      '**What helps, in order of effect.** Regular respite is the single most effective intervention — not an emergency break once things collapse, but scheduled, predictable time away built into the week from the start.',
      'Beyond that: keep your own medical appointments, accept the specific help people offer rather than deflecting it, and join a caregiver support group. Talking to people in the same situation reduces isolation faster than almost anything else.',
      'And be precise when people ask how they can help. "Could you sit with Mom Thursday from two to five" gets a yes far more often than "let me know if you need anything" ever produces an offer.',
      'Using respite care is not a failure of devotion. A caregiver who collapses cannot provide care at all, and the person depending on you needs you sustainable more than they need you constant.',
    ],
  },
  {
    slug: 'dementia-communication',
    title: 'Talking With Someone Who Has Dementia',
    excerpt:
      'Correcting, quizzing, and reasoning all tend to backfire. What works looks quite different from ordinary conversation.',
    category: 'Dementia Care',
    date: '2026-06-11',
    readMinutes: 6,
    author: 'Dana Whitfield, RN',
    cover: img.blog['dementia-communication'],
    body: [
      'The instincts that serve every other conversation — correcting an error, asking someone to remember, explaining why they are mistaken — reliably make things worse in dementia care. They produce distress without producing accuracy.',
      'What follows is what our dementia-trained caregivers actually practice.',
      '**Join the reality rather than argue with it.** If someone asks about a spouse who died years ago, "tell me about him" is both kinder and more effective than a correction that forces them to experience the loss as new. This is not deception; it is meeting someone where they are.',
      '**Do not quiz.** "Do you remember me?" places someone in a test they will fail. "Hi Mom, it’s Sarah" hands them the answer and preserves their dignity.',
      '**One idea at a time.** Short sentences, one instruction, then wait. Processing takes longer than it used to, and filling the silence interrupts the work being done in it.',
      '**Read the feeling, not the words.** Agitation in the late afternoon is usually sundowning, not a reaction to you. Repeated questions usually signal anxiety rather than curiosity. Respond to what is underneath.',
      '**Use your face and your hands.** Tone, expression, and touch remain comprehensible long after language becomes unreliable. Approach from the front, make eye contact, and slow down.',
      '**Redirect instead of refusing.** "Let’s have some tea first" moves someone along far more gently than "no, you can’t go outside" — which invites a fight neither of you can win.',
      'These techniques take practice, and every family gets them wrong at first. That is expected, and it is not the same as failing.',
    ],
  },
  {
    slug: 'first-week-of-care',
    title: 'What the First Week of Home Care Actually Looks Like',
    excerpt:
      'Families are often nervous about a stranger in the house. Here is what really happens, day by day.',
    category: 'Getting Started',
    date: '2026-05-28',
    readMinutes: 5,
    author: 'Marcus Ellery',
    cover: img.blog['first-week-of-care'],
    body: [
      'Almost every family hesitates at the same point: the idea of someone unfamiliar in a parent’s home, handling private things. It is a reasonable concern and we would rather describe the process plainly than reassure you vaguely.',
      '**Before day one.** You meet your caregiver, with your care manager present, before any shift begins. If the fit feels wrong in that meeting, say so — we would much rather rematch before care starts than after.',
      '**Day one.** Deliberately light. Your caregiver learns the house, the routines, and the preferences that matter, and mostly follows your lead. Real tasks stay minimal on purpose; establishing comfort matters more on the first day than efficiency.',
      '**Days two and three.** The routine begins to settle. Your caregiver starts working from the care plan, and your care manager checks in by phone at the end of each day to catch anything that needs adjusting immediately.',
      '**Days four and five.** Most clients who were resistant start warming here. The caregiver knows how the coffee is made and which chair is the good one, and the interaction stops feeling like a service call.',
      '**End of week one.** Your care manager conducts a supervisory visit in person, reviews the plan against reality, and makes adjustments. This is the natural moment to raise anything that is not working.',
      'A note on resistance: it is normal and it is usually temporary. Most people who firmly refused help are, within a few weeks, asking when their caregiver is next scheduled. Consistency is what turns that corner — which is exactly why we keep the same caregiver with the same client.',
    ],
  },
]

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)
export const categories = Array.from(new Set(posts.map((p) => p.category)))
