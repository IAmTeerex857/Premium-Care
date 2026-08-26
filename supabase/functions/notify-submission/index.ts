/**
 * notify-submission
 * -----------------
 * Emails every new public form submission to the office inbox.
 *
 * Triggered by a Supabase Database Webhook on INSERT into public.submissions,
 * so it covers appointments, contact messages, referrals, job applications and
 * newsletter signups without the frontend needing to know anything about email.
 *
 * Required secrets (supabase secrets set ...):
 *   RESEND_API_KEY   – from resend.com
 *   NOTIFY_TO        – e.g. info@premiumcareinc.com
 *   NOTIFY_FROM      – e.g. "Premium Care Website <website@premiumcareinc.com>"
 *   WEBHOOK_SECRET   – any long random string, also set as an x-webhook-secret
 *                      header on the Database Webhook
 */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? 'info@premiumcareinc.com'
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') ?? 'Premium Care Website <onboarding@resend.dev>'
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')

type Submission = {
  id: string
  kind: 'booking' | 'contact' | 'referral' | 'application' | 'newsletter'
  status: string
  name: string | null
  email: string | null
  phone: string | null
  subject: string | null
  message: string | null
  payload: Record<string, unknown>
  created_at: string
}

const KIND_LABEL: Record<Submission['kind'], string> = {
  booking: 'Appointment request',
  contact: 'Contact message',
  referral: 'Client referral',
  application: 'Job application',
  newsletter: 'Newsletter signup',
}

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

const humanize = (k: string) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

/** Flattens the jsonb payload into label/value rows, one level deep. */
function flatten(obj: Record<string, unknown>, prefix = ''): Array<[string, string]> {
  const out: Array<[string, string]> = []
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (v === null || v === undefined || v === '') continue
    const key = prefix ? `${prefix} — ${humanize(k)}` : humanize(k)
    if (Array.isArray(v)) out.push([key, v.join(', ')])
    else if (typeof v === 'object') out.push(...flatten(v as Record<string, unknown>, key))
    else out.push([key, String(v)])
  }
  return out
}

function buildEmail(s: Submission) {
  const label = KIND_LABEL[s.kind] ?? 'Website submission'
  const rows: Array<[string, string]> = []
  if (s.name) rows.push(['Name', s.name])
  if (s.email) rows.push(['Email', s.email])
  if (s.phone) rows.push(['Phone', s.phone])
  if (s.subject) rows.push(['Subject', s.subject])
  rows.push(...flatten(s.payload ?? {}))
  rows.push([
    'Received',
    new Date(s.created_at).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' }) + ' ET',
  ])

  const tableRows = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #DCE7EE;color:#5A7183;font-size:13px;white-space:nowrap;vertical-align:top">${esc(k)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #DCE7EE;color:#14212B;font-size:14px">${esc(v)}</td>
      </tr>`,
    )
    .join('')

  const messageBlock = s.message
    ? `<div style="margin:22px 0 0">
         <p style="margin:0 0 8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5A7183">Message</p>
         <div style="background:#F1F6F9;border-radius:12px;padding:16px;color:#14212B;font-size:14px;line-height:1.65;white-space:pre-wrap">${esc(s.message)}</div>
       </div>`
    : ''

  const html = `<!doctype html>
<html><body style="margin:0;background:#F1F6F9;padding:28px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #DCE7EE">
    <div style="background:#0D394F;padding:22px 24px">
      <p style="margin:0;color:#9FD2EC;font-size:12px;letter-spacing:.08em;text-transform:uppercase">Premium Care — website</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:21px;font-weight:600">${esc(label)}</h1>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse">${tableRows}</table>
      ${messageBlock}
      <p style="margin:24px 0 0;font-size:13px;color:#5A7183;line-height:1.6">
        ${s.email ? 'Reply to this email to respond directly to the sender.' : 'No email address was provided.'}
        View it in the staff portal at
        <a href="https://premiumcareinc.com/portal" style="color:#26718F">premiumcareinc.com/portal</a>.
      </p>
    </div>
  </div>
</body></html>`

  const text = [
    `${label}`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    s.message ? `\nMessage:\n${s.message}` : '',
    '',
    'Staff portal: https://premiumcareinc.com/portal',
  ].join('\n')

  const who = s.name ?? s.email ?? 'website visitor'
  return { subject: `[${label}] ${who}`, html, text }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  // Reject anything that isn't our webhook.
  if (WEBHOOK_SECRET && req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return new Response('Email not configured', { status: 500 })
  }

  let record: Submission
  try {
    const body = await req.json()
    record = body.record ?? body
  } catch {
    return new Response('Bad payload', { status: 400 })
  }
  if (!record?.kind) return new Response('Ignored: no submission record', { status: 200 })

  const { subject, html, text } = buildEmail(record)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      subject,
      html,
      text,
      // Lets staff hit Reply and reach the person who filled in the form.
      ...(record.email ? { reply_to: record.email } : {}),
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('Resend error', res.status, detail)
    // 200 keeps Postgres from retrying forever on a permanent failure.
    return new Response(JSON.stringify({ ok: false, status: res.status, detail }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
