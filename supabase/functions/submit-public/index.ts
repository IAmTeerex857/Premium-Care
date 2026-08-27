const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RATE_LIMIT_SALT = Deno.env.get('RATE_LIMIT_SALT')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
const MAX_RESUME_BYTES = 10 * 1024 * 1024
const KINDS = new Set(['booking', 'contact', 'newsletter', 'application'])
const SHIFTS = new Set(['Day', 'PM', 'Noc (overnight)', 'Live-In'])
const allowedOrigins = new Set(
  (Deno.env.get('ALLOWED_ORIGINS') ??
    'https://premiumcareinc.com,https://www.premiumcareinc.com,http://localhost:5173')
    .split(',').map((value) => value.trim()).filter(Boolean),
)

type Submission = {
  kind: 'booking' | 'contact' | 'newsletter' | 'application'
  name: string | null
  email: string | null
  phone: string | null
  subject: string | null
  message: string | null
  payload: Record<string, unknown>
}

function cors(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'https://premiumcareinc.com',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

function response(origin: string | null, body: string, status: number) {
  return new Response(body, { status, headers: { ...cors(origin), 'Content-Type': 'application/json' } })
}

function text(value: unknown, max: number, required = false): string | null {
  if (value == null || value === '') {
    if (required) throw new Error('A required field is missing.')
    return null
  }
  if (typeof value !== 'string') throw new Error('A form field has an invalid value.')
  const result = value.trim()
  if ((required && !result) || result.length > max) throw new Error('A form field has an invalid length.')
  return result || null
}

function email(value: unknown, required = true) {
  const result = text(value, 320, required)
  if (result && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new Error('Enter a valid email address.')
  return result?.toLowerCase() ?? null
}

function stringPayload(source: Record<string, unknown>, key: string, max = 300, required = false) {
  return text(source[key], max, required)
}

function oneOf(value: string | null, allowed: readonly string[]) {
  if (!value || !allowed.includes(value)) throw new Error('A form field has an invalid value.')
  return value
}

function validate(raw: unknown): Submission {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid submission.')
  const input = raw as Record<string, unknown>
  if (typeof input.kind !== 'string' || !KINDS.has(input.kind)) throw new Error('Unsupported form type.')
  const kind = input.kind as Submission['kind']
  const source = input.payload && typeof input.payload === 'object' && !Array.isArray(input.payload)
    ? input.payload as Record<string, unknown>
    : {}
  const submission: Submission = {
    kind,
    name: text(input.name, 200, kind !== 'newsletter'),
    email: email(input.email),
    phone: text(input.phone, 60, kind === 'booking' || kind === 'application'),
    subject: text(input.subject, 300, kind === 'contact'),
    message: text(input.message, 5000, kind === 'contact'),
    payload: {},
  }
  if (submission.name && submission.name.length < 2) throw new Error('Enter your full name.')
  if (submission.phone && submission.phone.replace(/\D/g, '').length < 7) {
    throw new Error('Enter a valid phone number.')
  }

  if (kind === 'booking') {
    const preferredDate = stringPayload(source, 'preferred_date', 10, true)
    if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) throw new Error('Choose a valid preferred date.')
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date())
    const datePart = (type: 'year' | 'month' | 'day') => parts.find((part) => part.type === type)?.value ?? ''
    const today = `${datePart('year')}-${datePart('month')}-${datePart('day')}`
    if (preferredDate < today) throw new Error('Choose today or a future preferred date.')
    submission.payload = {
      service: stringPayload(source, 'service', 200, true),
      preferred_date: preferredDate,
      preferred_time: stringPayload(source, 'preferred_time', 100, true),
      care_for: stringPayload(source, 'care_for', 100, true),
    }
  } else if (kind === 'application') {
    const address = source.address && typeof source.address === 'object' && !Array.isArray(source.address)
      ? source.address as Record<string, unknown>
      : {}
    const shifts = source.preferred_shifts
    if (!Array.isArray(shifts) || shifts.length < 1 || shifts.length > 4 ||
        shifts.some((shift) => typeof shift !== 'string' || !SHIFTS.has(shift))) {
      throw new Error('Select at least one valid preferred shift.')
    }
    submission.payload = {
      address: {
        street: stringPayload(address, 'street', 200, true),
        city: stringPayload(address, 'city', 100, true),
        state: stringPayload(address, 'state', 40, true),
        zip: stringPayload(address, 'zip', 20, true),
      },
      phone_day: stringPayload(source, 'phone_day', 60, true),
      phone_evening: stringPayload(source, 'phone_evening', 60),
      license: stringPayload(source, 'license', 100, true),
      over_eighteen: oneOf(stringPayload(source, 'over_eighteen', 3, true), ['Yes', 'No']),
      drivers_license: oneOf(stringPayload(source, 'drivers_license', 3, true), ['Yes', 'No']),
      owns_car: oneOf(stringPayload(source, 'owns_car', 3, true), ['Yes', 'No']),
      preferred_shifts: shifts,
      heard_about_us: stringPayload(source, 'heard_about_us', 300),
    }
  }

  if (JSON.stringify(submission.payload).length > 12_000) throw new Error('The submitted form is too large.')
  return submission
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function serviceFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('apikey', SERVICE_KEY!)
  headers.set('Authorization', `Bearer ${SERVICE_KEY}`)
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers })
}

async function consumeRateLimit(ipHash: string) {
  const result = await serviceFetch('/rest/v1/rpc/consume_public_submission_limit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_ip_hash: ipHash }),
  })
  if (!result.ok) throw new Error('Could not check the submission limit.')
  return await result.json() === true
}

async function inspectResume(file: File) {
  if (file.size < 4 || file.size > MAX_RESUME_BYTES) throw new Error('Resume must be no larger than 10 MB.')
  const ext = file.name.split('.').pop()?.toLowerCase()
  const bytes = new Uint8Array(await file.arrayBuffer())
  const starts = (...signature: number[]) => signature.every((value, index) => bytes[index] === value)
  let contentType: string | null = null

  if (ext === 'pdf' && starts(0x25, 0x50, 0x44, 0x46)) contentType = 'application/pdf'
  if (ext === 'doc' && starts(0xd0, 0xcf, 0x11, 0xe0)) contentType = 'application/msword'
  if (ext === 'rtf' && starts(0x7b, 0x5c, 0x72, 0x74, 0x66)) contentType = 'application/rtf'
  if (ext === 'docx' && starts(0x50, 0x4b, 0x03, 0x04)) {
    const archiveText = new TextDecoder('latin1').decode(bytes)
    if (archiveText.includes('[Content_Types].xml') && archiveText.includes('word/')) {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  }
  if (ext === 'txt' && !bytes.includes(0)) {
    try {
      new TextDecoder('utf-8', { fatal: true }).decode(bytes)
      contentType = 'text/plain'
    } catch { /* invalid UTF-8 is not a text resume */ }
  }
  if (!contentType) throw new Error('Resume must be a valid PDF, DOC, DOCX, RTF, or UTF-8 text file.')
  return { bytes, contentType, ext }
}

async function recordNotificationFailure(record: { id: string; kind: string }, detail: string) {
  await serviceFetch('/rest/v1/notification_failures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ submission_id: record.id, kind: record.kind, status_code: 0, detail: detail.slice(0, 2000) }),
  }).catch(() => {})
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (req.method === 'OPTIONS') {
    if (origin && !allowedOrigins.has(origin)) return response(origin, JSON.stringify({ error: 'Origin not allowed.' }), 403)
    return new Response(null, { status: 204, headers: cors(origin) })
  }
  if (req.method !== 'POST') return response(origin, JSON.stringify({ error: 'Method not allowed.' }), 405)
  if (origin && !allowedOrigins.has(origin)) return response(origin, JSON.stringify({ error: 'Origin not allowed.' }), 403)
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_RESUME_BYTES + 512_000) {
    return response(origin, JSON.stringify({ error: 'The submitted form is too large.' }), 413)
  }
  if (!SUPABASE_URL || !SERVICE_KEY || !RATE_LIMIT_SALT) {
    console.error('submit-public is missing a required server secret')
    return response(origin, JSON.stringify({ error: 'Form service is temporarily unavailable.' }), 503)
  }

  try {
    const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    // Supabase's proxy supplies one of these headers; never trust an IP field in the request body.
    const clientIp = req.headers.get('cf-connecting-ip') ?? forwarded
    if (!clientIp) throw new Error('Could not identify the submitting client.')
    if (!await consumeRateLimit(await sha256(`${RATE_LIMIT_SALT}:${clientIp}`))) {
      return response(origin, JSON.stringify({ error: 'Too many attempts. Please try again next hour or call us.' }), 429)
    }

    const contentType = req.headers.get('content-type') ?? ''
    let raw: unknown
    let resume: File | null = null
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const serialized = form.get('submission')
      if (typeof serialized !== 'string' || serialized.length > 20_000) throw new Error('Invalid submission.')
      raw = JSON.parse(serialized)
      const candidate = form.get('resume')
      resume = candidate instanceof File && candidate.size > 0 ? candidate : null
    } else if (contentType.includes('application/json')) {
      raw = await req.json()
    } else {
      throw new Error('Unsupported request format.')
    }

    const submission = validate(raw)
    if (resume && submission.kind !== 'application') throw new Error('This form does not accept a resume.')
    let resumePath: string | null = null
    if (resume) {
      const inspected = await inspectResume(resume)
      const safeName = resume.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60) || `resume.${inspected.ext}`
      resumePath = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}-${safeName}`
      const upload = await serviceFetch(`/storage/v1/object/resumes/${resumePath.split('/').map(encodeURIComponent).join('/')}`, {
        method: 'POST',
        headers: { 'Content-Type': inspected.contentType, 'x-upsert': 'false' },
        body: inspected.bytes,
      })
      if (!upload.ok) throw new Error('Could not securely store the resume.')
      submission.payload.resume_path = resumePath
      submission.payload.resume_filename = resume.name.slice(0, 255)
    }

    const inserted = await serviceFetch('/rest/v1/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(submission),
    })
    if (!inserted.ok) {
      if (resumePath) {
        try {
          const removed = await serviceFetch(
            `/storage/v1/object/resumes/${resumePath.split('/').map(encodeURIComponent).join('/')}`,
            { method: 'DELETE' },
          )
          if (!removed.ok) throw new Error(`Storage returned ${removed.status}.`)
        } catch {
          await serviceFetch('/rest/v1/orphaned_resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
            body: JSON.stringify({ path: resumePath }),
          }).catch(() => {})
        }
      }
      throw new Error('Could not save the submission.')
    }
    const record = (await inserted.json())[0] as { id: string; kind: string; created_at: string }

    if (WEBHOOK_SECRET) {
      try {
        const notified = await fetch(`${SUPABASE_URL}/functions/v1/notify-submission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': WEBHOOK_SECRET },
          body: JSON.stringify({ record }),
        })
        if (!notified.ok) {
          const result = await notified.json().catch(() => ({})) as { recorded?: boolean }
          if (!result.recorded) await recordNotificationFailure(record, `Notification endpoint returned ${notified.status}.`)
        }
      } catch (error) {
        await recordNotificationFailure(record, error instanceof Error ? error.message : 'Notification request failed.')
      }
    } else {
      await recordNotificationFailure(record, 'WEBHOOK_SECRET is not configured on submit-public.')
    }

    return response(origin, JSON.stringify({ ok: true }), 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid submission.'
    console.error('submit-public rejected request:', message)
    return response(origin, JSON.stringify({ error: message }), 400)
  }
})
