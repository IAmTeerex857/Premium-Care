/**
 * notify-submission
 * -----------------
 * Alerts the office inbox when a new public form submission arrives.
 *
 * The email deliberately carries NO submitted details: no message body, no
 * phone number, no health information. Enquiries to a care provider routinely
 * contain protected health information, and email is not a controlled channel.
 * Staff read the actual content inside the portal, behind authentication and
 * row level security. The email is a doorbell, not a filing cabinet.
 *
 * Called by submit-public and by the service-only retry worker.
 *
 * Secrets: RESEND_API_KEY, NOTIFY_TO, NOTIFY_FROM, WEBHOOK_SECRET
 */

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? 'info@premiumcareinc.com'
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') ?? 'Premium Care <onboarding@resend.dev>'
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
const SITE = 'https://premiumcareinc.com'

type Kind = 'booking' | 'contact' | 'referral' | 'application' | 'newsletter'

const META: Record<Kind, { label: string; sentence: string; route: string; emoji: string }> = {
  booking:     { label: 'Appointment request', sentence: 'Someone has requested an appointment.',        route: '/portal/bookings',     emoji: '📅' },
  contact:     { label: 'Contact message',     sentence: 'Someone has sent a message through the site.', route: '/portal/contacts',     emoji: '✉️' },
  referral:    { label: 'Client referral',     sentence: 'A partner has submitted a client referral.',   route: '/portal/contacts',     emoji: '🤝' },
  application: { label: 'Career application',  sentence: 'Someone has applied to join the team.',        route: '/portal/applications', emoji: '📋' },
  newsletter:  { label: 'Newsletter signup',   sentence: 'Someone has subscribed to the newsletter.',    route: '/portal/contacts',     emoji: '🔔' },
}

/** Constant-time compare so the secret cannot be recovered by timing. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

function buildEmail(kind: Kind, createdAt: string) {
  const m = META[kind] ?? META.contact
  const when = new Date(createdAt).toLocaleString('en-US', {
    timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short',
  })
  const cta = SITE + m.route

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(m.label)}</title>
</head>
<body style="margin:0;padding:0;background:#F1F4F8;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(m.sentence)} View it in the staff portal.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F4F8;padding:32px 16px;">
   <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;
                  border:1px solid #DEE4ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

      <!-- header -->
      <tr>
        <td style="background:#0F2A4D;padding:26px 32px;">
          <img src="${SITE}/logo-full.png" width="132" alt="Premium Care"
               style="display:block;border:0;width:132px;height:auto;">
        </td>
      </tr>

      <!-- body -->
      <tr>
        <td style="padding:36px 32px 8px;">
          <div style="font-size:34px;line-height:1;">${m.emoji}</div>
          <h1 style="margin:16px 0 0;font-size:23px;line-height:1.25;font-weight:700;color:#141D2A;letter-spacing:-0.01em;">
            New ${esc(m.label.toLowerCase())}
          </h1>
          <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:#485970;">
            ${esc(m.sentence)}
          </p>
          <p style="margin:20px 0 0;font-size:14px;line-height:1.5;color:#5E7087;">
            Received ${esc(when)} ET
          </p>
        </td>
      </tr>

      <!-- cta -->
      <tr>
        <td style="padding:28px 32px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" bgcolor="#1A4175" style="border-radius:999px;">
              <a href="${cta}"
                 style="display:inline-block;padding:15px 34px;font-size:16px;font-weight:600;
                        color:#ffffff;text-decoration:none;border-radius:999px;">
                Open the staff portal &rarr;
              </a>
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- privacy note -->
      <tr>
        <td style="padding:24px 32px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                 style="background:#F1F4F8;border-radius:12px;">
            <tr><td style="padding:16px 18px;font-size:13px;line-height:1.6;color:#485970;">
              For privacy, the details are not included in this email. Sign in to the portal to read the
              full submission, assign it, and add notes.
            </td></tr>
          </table>
        </td>
      </tr>

      <!-- footer -->
      <tr>
        <td style="border-top:1px solid #DEE4ED;padding:22px 32px;background:#FAFBFD;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#5E7087;">
            <strong style="color:#1A4175;">Premium Care</strong><br>
            Compassion. Care. Quality of Life.<br>
            Hanover, Maryland &nbsp;&middot;&nbsp; +1 (240) 437-2218
          </p>
          <p style="margin:12px 0 0;font-size:12px;color:#8494A6;">
            Automated notification from premiumcareinc.com
          </p>
        </td>
      </tr>
    </table>
   </td></tr>
  </table>
</body>
</html>`

  const text = [
    `New ${m.label.toLowerCase()}`,
    '',
    m.sentence,
    `Received ${when} ET`,
    '',
    `Open the staff portal: ${cta}`,
    '',
    'For privacy, the details are not included in this email.',
    'Sign in to the portal to read the full submission.',
    '',
    'Premium Care, Hanover, Maryland, +1 (240) 437-2218',
  ].join('\n')

  return { subject: `${m.emoji} New ${m.label.toLowerCase()}`, html, text }
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

/** Writes an undelivered notification into the outbox table. */
async function recordFailure(
  record: { id?: string; kind?: string },
  status: number,
  detail: string,
  resolved = false,
) {
  if (!SUPABASE_URL || !SERVICE_KEY) return false
  try {
    const result = await fetch(`${SUPABASE_URL}/rest/v1/notification_failures`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        submission_id: record.id ?? null,
        kind: record.kind ?? null,
        status_code: status,
        detail: detail.slice(0, 2000),
        resolved_at: resolved ? new Date().toISOString() : null,
      }),
    })
    return result.ok
  } catch (e) {
    console.error('Could not record notification failure', e)
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  // Fail CLOSED. A missing secret previously meant every caller was accepted.
  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not set; refusing all requests')
    return new Response('Server misconfigured', { status: 503 })
  }
  const presented = req.headers.get('x-webhook-secret') ?? ''
  if (!timingSafeEqual(presented, WEBHOOK_SECRET)) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return new Response('Email not configured', { status: 500 })
  }

  let record: { id?: string; kind?: Kind; created_at?: string }
  let failureId: number | null = null
  try {
    const body = await req.json()
    record = body.record ?? body
    failureId = Number.isInteger(body.failure_id) ? body.failure_id : null
  } catch {
    return new Response('Bad payload', { status: 400 })
  }
  if (!record?.kind) return new Response('Ignored: no submission record', { status: 200 })

  const { subject, html, text } = buildEmail(record.kind, record.created_at ?? new Date().toISOString())

  let res: Response
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], subject, html, text }),
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Email provider request failed.'
    const recorded = failureId === null ? await recordFailure(record, 0, detail) : false
    return new Response(JSON.stringify({ ok: false, status: 0, transient: true, detail, recorded }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!res.ok) {
    const detail = await res.text()
    // 429 and 5xx are transient and worth retrying; 4xx are permanent.
    const transient = res.status === 429 || res.status >= 500
    console.error('Resend error', res.status, transient ? '(transient)' : '(permanent)', detail)

    // Record every failure so an admin can see what was never delivered,
    // rather than silently dropping it as before.
    const recorded = failureId === null
      ? await recordFailure(record, res.status, detail, !transient)
      : false

    return new Response(JSON.stringify({
      ok: false, status: res.status, transient, detail, recorded,
    }), {
      // 5xx tells pg_net's log this was a real failure worth investigating.
      status: transient ? 503 : 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  })
})
