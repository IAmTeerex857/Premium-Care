import { PageHero } from '@/components/layout/SiteLayout'
import { site } from '@/data/site'
import { useSeo } from '@/hooks/useSeo'

type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'sub'; text: string }

type Section = { id: string; heading: string; blocks: Block[] }

/* ------------------------------------------------------------------ */
/*  Shared renderer                                                     */
/* ------------------------------------------------------------------ */

function Inline({ text }: { text: string }) {
  // Supports **bold** so the drafts can emphasize defined terms.
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-[color:var(--color-ink)]">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function LegalPage({ eyebrow, title, lead, updated, effective, sections }: {
  eyebrow: string
  title: string
  lead: string
  updated: string
  effective: string
  sections: Section[]
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
          {/* Contents */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="t-label mb-4">On this page</p>
            <ol className="flex flex-col gap-2.5 border-l border-[color:var(--color-line)] pl-4">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block py-1 text-[0.875rem] leading-snug text-[color:var(--color-ink-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
                  >
                    <span className="mr-2 font-[var(--font-mono)] text-[0.75rem] text-[color:var(--color-ink-muted)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Body */}
          <div className="min-w-0">
            <div className="mb-10 flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] px-6 py-5 text-[0.875rem]">
              <div>
                <p className="t-label mb-1">Effective</p>
                <p className="font-medium text-[color:var(--color-primary)]">{effective}</p>
              </div>
              <div>
                <p className="t-label mb-1">Last updated</p>
                <p className="font-medium text-[color:var(--color-primary)]">{updated}</p>
              </div>
            </div>

            <div className="flex max-w-[44rem] flex-col gap-12">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="t-h3 text-[1.375rem]">
                    <span className="mr-3 font-[var(--font-mono)] text-[0.9375rem] font-bold text-[color:var(--color-accent)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.heading}
                  </h2>

                  <div className="mt-4 flex flex-col gap-4">
                    {s.blocks.map((b, j) => {
                      if (b.type === 'sub') {
                        return (
                          <h3 key={j} className="t-h4 mt-2 text-[1rem]">{b.text}</h3>
                        )
                      }
                      if (b.type === 'list') {
                        return (
                          <ul key={j} className="flex flex-col gap-2.5 pl-1">
                            {b.items.map((item, k) => (
                              <li key={k} className="flex gap-3 text-[0.9375rem] leading-[1.75] text-[color:var(--color-ink-secondary)]">
                                <span className="mt-[0.6875rem] size-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                                <span><Inline text={item} /></span>
                              </li>
                            ))}
                          </ul>
                        )
                      }
                      return (
                        <p key={j} className="text-[1rem] leading-[1.8] text-[color:var(--color-ink-secondary)]">
                          <Inline text={b.text} />
                        </p>
                      )
                    })}
                  </div>
                </section>
              ))}

              {/* Contact */}
              <section id="contact-us" className="scroll-mt-28 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] p-7">
                <h2 className="t-h4 text-[1.0625rem]">Questions about this policy?</h2>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-secondary)]">
                  Contact our Privacy Officer:
                </p>
                <ul className="mt-4 flex flex-col gap-1.5 text-[0.9375rem] text-[color:var(--color-ink-secondary)]">
                  <li>
                    <span className="font-medium text-[color:var(--color-primary)]">Email: </span>
                    <a href={site.emailHref} className="link-underline">{site.email}</a>
                  </li>
                  <li>
                    <span className="font-medium text-[color:var(--color-primary)]">Phone: </span>
                    <a href={site.phoneHref} className="link-underline">{site.phoneDisplay}</a>
                  </li>
                  <li>
                    <span className="font-medium text-[color:var(--color-primary)]">Mail: </span>
                    {site.name}, {site.address.line1}, {site.address.city}, {site.address.state} {site.address.zip}
                  </li>
                </ul>
              </section>

              <p className="rounded-xl border border-[color:var(--color-warm)]/30 bg-[color:var(--color-warm)]/6 p-5 text-[0.8125rem] leading-relaxed text-[#8F3B37]">
                <strong className="font-semibold">Draft for review.</strong> This document was prepared as a
                working draft and is not legal advice. Health care privacy obligations — including HIPAA, state
                privacy statutes, and home-care licensing rules — vary by jurisdiction and by how your agency
                actually operates. Have counsel review and adapt it before launch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Privacy Policy                                                      */
/* ------------------------------------------------------------------ */

const privacySections: Section[] = [
  {
    id: 'overview',
    heading: 'Overview',
    blocks: [
      { type: 'p', text: `${site.name} ("Premium Care", "we", "us", or "our") provides in-home care, disability support, and skilled nursing services. We understand that inviting a care provider into your life means trusting us with information that is personal, medical, and financial. This policy explains what we collect, why we collect it, who we share it with, and the choices you have.` },
      { type: 'p', text: 'This policy covers our website, our online forms, our staff portal, and the information we collect in the course of delivering care. It applies to clients, prospective clients, family members and authorized representatives, professional referral partners, job applicants, and website visitors.' },
      { type: 'p', text: '**A note on two different sets of rules.** Information you submit through this website — a contact form, a consultation request — is governed by this policy. Once you become a client, the medical information we create and maintain about your care is additionally governed by our **Notice of Privacy Practices** under HIPAA, which we provide at the start of services. Where the two documents differ regarding protected health information, the Notice of Privacy Practices controls.' },
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information we collect',
    blocks: [
      { type: 'sub', text: 'Information you give us directly' },
      { type: 'list', items: [
        '**Contact details** — name, email address, postal address, and phone number.',
        '**Relationship information** — whether you are enquiring for yourself or on behalf of a parent, spouse, child, or client, and your authority to do so.',
        '**Care information** — the needs you describe, including diagnoses, mobility, cognition, current supports, medications, and safety concerns.',
        '**Scheduling preferences** — preferred dates, times, and the services you are interested in.',
        '**Insurance and funding information** — your funding source, member or policy identifiers, and information needed to verify benefits on your behalf.',
        '**Referral information** — when a professional refers a client, the referrer’s details and the client information they provide.',
        '**Employment information** — for job applicants: work history, certifications, licenses, availability, and anything else submitted through our careers page.',
      ]},
      { type: 'sub', text: 'Information we create in the course of care' },
      { type: 'list', items: [
        'Assessments, care plans, visit notes, incident reports, and progress documentation.',
        'Scheduling and visit records, including caregiver assignments and hours delivered.',
        'Billing records, claims, invoices, and payment history.',
        'Communications with you, your family, your physicians, and your payers.',
      ]},
      { type: 'sub', text: 'Information collected automatically' },
      { type: 'list', items: [
        'Standard server and device information — IP address, browser type, operating system, referring page, and pages visited.',
        'Cookies and similar technologies, as described in the Cookies section below.',
      ]},
      { type: 'p', text: 'We do not knowingly collect information from children under 13 through this website. Where we provide services to a minor, we collect their information from a parent or legal guardian.' },
    ],
  },
  {
    id: 'protected-health-information',
    heading: 'Protected health information',
    blocks: [
      { type: 'p', text: 'Information that relates to your physical or mental health, the care you receive, or payment for that care, and that identifies you, is **protected health information (PHI)**. We treat PHI as confidential and handle it in accordance with HIPAA and applicable state law.' },
      { type: 'p', text: 'Access to PHI inside our organization is limited by role. A caregiver sees the care plan and notes for the clients they are assigned to. A coordinator sees the records of the families in their portfolio. Administrative access is restricted to staff whose duties require it, and access to health information is logged.' },
      { type: 'p', text: 'We do not use PHI for marketing, and we do not sell it. We will not disclose PHI for any purpose that requires your authorization without first obtaining that authorization in writing, and you may revoke such an authorization at any time.' },
    ],
  },
  {
    id: 'how-we-use-information',
    heading: 'How we use your information',
    blocks: [
      { type: 'p', text: 'We use your information for the following purposes, and no others:' },
      { type: 'list', items: [
        '**To respond to you** — returning your call or message, answering questions, and scheduling a consultation.',
        '**To provide care** — assessing needs, building and updating your care plan, matching and scheduling caregivers, and coordinating with your other providers.',
        '**To handle payment** — verifying benefits, submitting claims, invoicing, and collecting payment.',
        '**To run our operations** — quality review, supervision, caregiver training, complaint handling, and internal auditing.',
        '**To meet legal obligations** — licensing, accreditation, mandatory reporting, public health reporting, and responding to lawful requests.',
        '**To improve our website** — understanding which pages are useful and diagnosing technical problems.',
        '**To communicate with you** — service notices and, only if you have opted in, our newsletter.',
      ]},
      { type: 'p', text: 'We do **not** sell personal information. We do **not** share your information with third parties for their own marketing purposes. We do **not** use your care information to target advertising.' },
    ],
  },
  {
    id: 'who-we-share-with',
    heading: 'Who we share information with',
    blocks: [
      { type: 'p', text: 'We share your information only where it is necessary, and only with:' },
      { type: 'list', items: [
        '**Your care team** — the caregivers, nurses, and coordinators assigned to you.',
        '**Other providers involved in your care** — physicians, therapists, hospitals, pharmacies, and facilities, where the disclosure is for treatment purposes or where you have authorized it.',
        '**People you have authorized** — family members, an authorized representative, a health care proxy, or a power of attorney, to the extent you have designated them.',
        '**Payers** — Medicaid, Medicare, insurers, VA programs, and claims administrators, for verification, authorization, and payment.',
        '**Service providers** — vendors who host our systems, process payments, or provide software, each bound by written confidentiality obligations and, where they handle PHI, by a Business Associate Agreement.',
        '**Authorities** — where required by law, including licensing bodies, public health reporting, mandatory reporting of suspected abuse or neglect, and valid legal process such as a subpoena or court order.',
      ]},
      { type: 'p', text: 'In the event of a merger, acquisition, or transfer of our business, client records may transfer to the successor entity, which would remain bound by the commitments in this policy and by applicable law.' },
    ],
  },
  {
    id: 'cookies',
    heading: 'Cookies and analytics',
    blocks: [
      { type: 'p', text: 'Our website uses a small number of cookies and similar technologies:' },
      { type: 'list', items: [
        '**Strictly necessary** — these keep your staff portal session signed in and protect against cross-site request forgery. The site cannot function without them.',
        '**Preference** — these remember choices such as a dismissed notice.',
        '**Analytics** — these help us understand aggregate traffic patterns. We configure analytics to avoid collecting information that identifies you individually.',
      ]},
      { type: 'p', text: 'We do not use advertising cookies and we do not permit third-party advertising networks to track you across our site. You can block or delete cookies in your browser settings, though doing so will prevent the staff portal from working.' },
      { type: 'p', text: 'Our website honours the Global Privacy Control (GPC) signal where your browser sends one.' },
    ],
  },
  {
    id: 'how-long-we-keep-it',
    heading: 'How long we keep your information',
    blocks: [
      { type: 'p', text: 'We keep information only as long as we need it, or as long as the law requires:' },
      { type: 'list', items: [
        '**Client care records** — retained for the period required by applicable state and federal law, which for adult clients is commonly a minimum of six to ten years after the last date of service, and for minors is measured from the age of majority.',
        '**Billing and claims records** — retained for the period required by the applicable payer program and by tax law.',
        '**Website enquiries that do not become clients** — retained for up to 24 months, then deleted.',
        '**Job applications** — retained for up to 12 months unless you ask us to keep them on file longer.',
        '**Newsletter subscriptions** — retained until you unsubscribe.',
      ]},
      { type: 'p', text: 'When a retention period ends, we securely delete or destroy the information.' },
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights and choices',
    blocks: [
      { type: 'p', text: 'Subject to applicable law, you may:' },
      { type: 'list', items: [
        '**Access** the information we hold about you and receive a copy of your care record.',
        '**Correct** information you believe is inaccurate or incomplete.',
        '**Request deletion** of information, where no legal retention obligation applies.',
        '**Request restrictions** on how we use or disclose your health information.',
        '**Request confidential communications** — for example, asking us to call a specific number or write to an alternative address.',
        '**Receive an accounting of disclosures** of your health information.',
        '**Opt out of marketing** at any time, using the unsubscribe link in any email or by contacting us.',
        '**Withdraw an authorization** you previously gave, effective going forward.',
      ]},
      { type: 'p', text: 'To exercise any of these rights, contact our Privacy Officer using the details at the end of this policy. We will verify your identity before acting on a request, and we will respond within the timeframe the applicable law allows. We will not discriminate against you for exercising a privacy right.' },
      { type: 'p', text: 'Residents of states with comprehensive privacy laws may have additional rights, including the right to appeal a refused request. Note that information held in a HIPAA-covered care record is generally governed by HIPAA rather than by state consumer privacy law.' },
    ],
  },
  {
    id: 'security',
    heading: 'How we protect your information',
    blocks: [
      { type: 'p', text: 'We maintain administrative, physical, and technical safeguards appropriate to the sensitivity of the information we hold, including:' },
      { type: 'list', items: [
        'Encryption of data in transit and at rest.',
        'Role-based access controls that limit each staff member to the information their duties require.',
        'Audit logging on systems containing health information.',
        'Background checks, confidentiality agreements, and annual privacy training for all staff.',
        'Written Business Associate Agreements with vendors who handle protected health information.',
        'An incident response plan, with breach notification to affected individuals and regulators as required by law.',
      ]},
      { type: 'p', text: 'No system is perfectly secure. If we become aware of a breach affecting your information, we will notify you in the manner and within the timeframe required by applicable law.' },
    ],
  },
  {
    id: 'third-party-links',
    heading: 'Third-party links and services',
    blocks: [
      { type: 'p', text: 'Our website links to third-party sites and embeds third-party content, including a map provider on our contact page. Those providers operate under their own privacy policies, and we are not responsible for their practices. We encourage you to read the policies of any third-party site you visit.' },
    ],
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    blocks: [
      { type: 'p', text: 'We may update this policy as our services, technology, or legal obligations change. We will revise the "Last updated" date at the top of this page, and where changes are material we will provide more prominent notice — by email to active clients, or by a notice on this website — before the change takes effect.' },
      { type: 'p', text: 'Continued use of our website or services after a change takes effect indicates acceptance of the revised policy.' },
    ],
  },
]

export function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy — Premium Care',
    description: 'How Premium Care collects, uses, protects, and shares personal and protected health information, and the privacy rights available to you.',
  })

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead="What we collect, why we collect it, who sees it, and the control you have over it."
      effective="September 1, 2026"
      updated="August 26, 2026"
      sections={privacySections}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Terms of Service                                                    */
/* ------------------------------------------------------------------ */

const termsSections: Section[] = [
  {
    id: 'agreement',
    heading: 'Agreement to these terms',
    blocks: [
      { type: 'p', text: `These Terms of Service ("Terms") govern your access to and use of the ${site.name} website, its forms, and the staff portal (together, the "Site"). By using the Site you agree to these Terms. If you do not agree, please do not use the Site.` },
      { type: 'p', text: 'These Terms govern the **website**. They do not govern the delivery of care itself. Care services are governed by the separate written Service Agreement and Care Plan you sign before services begin. Where these Terms and a signed Service Agreement conflict regarding services, the Service Agreement controls.' },
      { type: 'p', text: 'You must be at least 18 years old to submit a form on this Site.' },
    ],
  },
  {
    id: 'emergencies',
    heading: 'Not for emergencies',
    blocks: [
      { type: 'p', text: '**If you are experiencing a medical emergency, call 911 immediately.**' },
      { type: 'p', text: 'This Site is not monitored continuously. Do not use a web form, an email address, or any other feature of this Site to report an emergency, a suspected stroke or heart attack, a fall, a medication error, thoughts of self-harm, or any other urgent situation. Messages submitted through this Site may not be read until the next business day.' },
      { type: 'p', text: 'Existing clients with an urgent concern should call our 24/7 on-call line rather than using this Site.' },
    ],
  },
  {
    id: 'not-medical-advice',
    heading: 'Informational content is not medical advice',
    blocks: [
      { type: 'p', text: 'Articles, guides, checklists, service descriptions, and coverage explanations on this Site are general information intended to help families understand their options. They are **not** medical, nursing, legal, financial, or insurance advice, and they are not a substitute for consultation with a qualified professional who knows the specific situation.' },
      { type: 'p', text: 'Reading this Site does not create a provider-patient relationship, a client relationship, or any duty of care on our part. Never disregard or delay seeking professional advice because of something you read here.' },
    ],
  },
  {
    id: 'enquiries',
    heading: 'Enquiries, bookings, and referrals',
    blocks: [
      { type: 'p', text: 'Submitting a form on this Site is a **request for contact**. It is not a booking, not an acceptance of you as a client, and not a commitment by either party. Specifically:' },
      { type: 'list', items: [
        'An appointment request is a request for a consultation, not a confirmed appointment. A member of our team will contact you to confirm a time.',
        'We may decline to accept a prospective client where the needs described fall outside our clinical scope, our service area, or our current capacity.',
        'Care begins only after an assessment has been completed and a written Service Agreement and Care Plan have been signed by both parties.',
      ]},
      { type: 'p', text: 'If you submit a **referral** on behalf of another person, you represent that you have that person’s consent — or the consent of their authorized representative — to share their information with us and for us to contact them directly.' },
    ],
  },
  {
    id: 'coverage',
    heading: 'Insurance, coverage, and pricing information',
    blocks: [
      { type: 'p', text: 'Information on this Site about Medicaid, Medicare, long-term care insurance, VA benefits, workers’ compensation, and private pay describes how those funding sources generally work. It is a starting point for a conversation, not a determination.' },
      { type: 'p', text: 'Actual coverage depends on your specific plan, your clinical circumstances, and the determination of the payer. **We do not guarantee that any service will be covered, or that any estimate of cost will match your final responsibility.** A benefits check performed by our team is an estimate made in good faith on the information available; it is not a guarantee of payment.' },
      { type: 'p', text: 'Rates quoted on this Site, if any, are subject to change. The rates that apply to you are those stated in your signed Service Agreement.' },
    ],
  },
  {
    id: 'your-responsibilities',
    heading: 'Your responsibilities',
    blocks: [
      { type: 'p', text: 'When you use this Site, you agree to:' },
      { type: 'list', items: [
        'Provide information that is accurate, current, and complete.',
        'Have the authority to submit information about any person other than yourself.',
        'Use the Site only for lawful purposes.',
        'Not attempt to gain unauthorized access to the staff portal, any account, or any system connected to the Site.',
        'Not scrape, harvest, or systematically extract content from the Site.',
        'Not upload malicious code, or interfere with the operation or security of the Site.',
        'Not impersonate another person or misrepresent your affiliation with any organization.',
      ]},
    ],
  },
  {
    id: 'staff-portal',
    heading: 'Staff portal',
    blocks: [
      { type: 'p', text: 'The staff portal is restricted to authorized personnel of Premium Care. Access is granted by invitation and may be modified or revoked at any time.' },
      { type: 'p', text: 'If you hold a portal account you agree to keep your credentials confidential, to use the portal solely for legitimate business purposes, to access only the information your role requires, and to notify us immediately of any suspected unauthorized access. Portal activity is logged. Unauthorized access to or misuse of protected health information may result in disciplinary action and may carry civil and criminal penalties under federal and state law.' },
    ],
  },
  {
    id: 'intellectual-property',
    heading: 'Intellectual property',
    blocks: [
      { type: 'p', text: `All content on this Site — text, design, layout, graphics, logos, and the ${site.name} name and marks — is owned by us or used under license, and is protected by copyright, trademark, and other laws.` },
      { type: 'p', text: 'You may view, download, and print pages from this Site for your own personal, non-commercial use in evaluating or receiving care. Any other use — reproduction, republication, distribution, or the creation of derivative works — requires our prior written permission.' },
      { type: 'p', text: 'If you send us feedback or suggestions about the Site, you grant us a non-exclusive, royalty-free, perpetual right to use them without obligation to you.' },
    ],
  },
  {
    id: 'third-party',
    heading: 'Third-party content and links',
    blocks: [
      { type: 'p', text: 'This Site contains links to third-party websites and embeds third-party content, including mapping services. We provide these for convenience and do not endorse, control, or accept responsibility for their content, availability, or privacy practices. Your use of a third-party service is governed by that provider’s terms.' },
    ],
  },
  {
    id: 'disclaimers',
    heading: 'Disclaimers',
    blocks: [
      { type: 'p', text: 'The Site is provided on an **"as is"** and **"as available"** basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.' },
      { type: 'p', text: 'We do not warrant that the Site will be uninterrupted, timely, secure, or error-free, or that content on the Site is accurate, complete, or current. Care guidance and regulatory information change; we update this Site periodically but cannot guarantee that every page reflects the latest position at the moment you read it.' },
      { type: 'p', text: 'Nothing in this section limits any warranty or obligation that cannot be excluded under applicable law, and nothing here affects our obligations under a signed Service Agreement or our professional and licensing duties as a care provider.' },
    ],
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    blocks: [
      { type: 'p', text: 'To the fullest extent permitted by law, Premium Care and its officers, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, revenue, or profits, arising out of or relating to your use of **this Site**.' },
      { type: 'p', text: '**This limitation applies to the website only.** It does not limit our liability for personal injury, professional negligence, or any claim arising from the care services we deliver — those are governed by your Service Agreement and by applicable law, and nothing in these Terms waives any right you have in that respect.' },
      { type: 'p', text: 'Some jurisdictions do not permit certain limitations of liability. Where that is the case, the limitations above apply only to the extent permitted.' },
    ],
  },
  {
    id: 'indemnity',
    heading: 'Indemnification',
    blocks: [
      { type: 'p', text: 'You agree to indemnify and hold harmless Premium Care from any claim, loss, or expense (including reasonable legal fees) arising from your breach of these Terms, your misuse of the Site, or your submission of information about another person without the authority to do so.' },
    ],
  },
  {
    id: 'accessibility',
    heading: 'Accessibility',
    blocks: [
      { type: 'p', text: 'We are committed to making this Site usable by everyone, and we work toward conformance with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.' },
      { type: 'p', text: 'If you encounter a barrier on this Site, or need information from it in an alternative format, contact us and we will provide the information you need through another channel and work to fix the underlying issue.' },
    ],
  },
  {
    id: 'termination',
    heading: 'Suspension and termination',
    blocks: [
      { type: 'p', text: 'We may suspend or terminate your access to the Site, in whole or in part, at any time and without notice, where we reasonably believe you have breached these Terms or where necessary to protect the Site, our clients, or our staff.' },
      { type: 'p', text: 'Sections that by their nature should survive termination — including intellectual property, disclaimers, limitation of liability, indemnification, and governing law — will survive.' },
    ],
  },
  {
    id: 'governing-law',
    heading: 'Governing law and disputes',
    blocks: [
      { type: 'p', text: `These Terms are governed by the laws of the Commonwealth of Massachusetts, without regard to its conflict-of-laws rules. You agree that the state and federal courts located in ${site.address.city}, ${site.address.state} have exclusive jurisdiction over any dispute arising from these Terms or your use of the Site.` },
      { type: 'p', text: 'If any provision of these Terms is found unenforceable, that provision will be limited or severed to the minimum extent necessary, and the remaining provisions will stay in full force.' },
    ],
  },
  {
    id: 'changes-terms',
    heading: 'Changes to these terms',
    blocks: [
      { type: 'p', text: 'We may revise these Terms from time to time. The revised version takes effect when posted, and the "Last updated" date at the top of this page will reflect the change. Your continued use of the Site after that date constitutes acceptance of the revised Terms.' },
      { type: 'p', text: 'We encourage you to review this page periodically.' },
    ],
  },
]

export function TermsOfService() {
  useSeo({
    title: 'Terms of Service — Premium Care',
    description: 'The terms governing use of the Premium Care website, its forms, and the staff portal.',
  })

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lead="The rules for using this website. Care services are governed separately, by your signed Service Agreement."
      effective="September 1, 2026"
      updated="August 26, 2026"
      sections={termsSections}
    />
  )
}
