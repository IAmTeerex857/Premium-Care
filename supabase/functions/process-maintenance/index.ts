const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')
const MAINTENANCE_SECRET = Deno.env.get('MAINTENANCE_SECRET')

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index++) difference |= a.charCodeAt(index) ^ b.charCodeAt(index)
  return difference === 0
}

async function serviceFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('apikey', SERVICE_KEY!)
  headers.set('Authorization', `Bearer ${SERVICE_KEY}`)
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers })
}

async function patch(table: string, id: number, values: Record<string, unknown>) {
  const result = await serviceFetch(`/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(values),
  })
  if (!result.ok) throw new Error(`Could not update ${table} row ${id}.`)
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  if (!SUPABASE_URL || !SERVICE_KEY || !WEBHOOK_SECRET || !MAINTENANCE_SECRET) {
    console.error('process-maintenance is missing a required server secret')
    return new Response('Server misconfigured', { status: 503 })
  }
  const presented = req.headers.get('x-maintenance-secret') ?? ''
  if (!timingSafeEqual(presented, MAINTENANCE_SECRET)) return new Response('Unauthorized', { status: 401 })

  const result = {
    resumesDeleted: 0,
    notificationsRetried: 0,
    notificationsResolved: 0,
    submissionsPurged: 0,
    staleRateLimitsDeleted: false,
  }
  const errors: string[] = []

  const orphansResponse = await serviceFetch(
    '/rest/v1/orphaned_resumes?select=id,path&deleted_at=is.null&order=created_at.asc&limit=25',
  )
  if (orphansResponse.ok) {
    const orphans = await orphansResponse.json() as Array<{ id: number; path: string }>
    for (const orphan of orphans) {
      try {
        const removed = await serviceFetch(
          `/storage/v1/object/resumes/${orphan.path.split('/').map(encodeURIComponent).join('/')}`,
          { method: 'DELETE' },
        )
        // Missing objects are already clean; Storage commonly returns 404 for them.
        if (!removed.ok && removed.status !== 404) throw new Error(`Storage returned ${removed.status}.`)
        await patch('orphaned_resumes', orphan.id, { deleted_at: new Date().toISOString() })
        result.resumesDeleted++
      } catch (error) {
        errors.push(`resume ${orphan.id}: ${error instanceof Error ? error.message : 'cleanup failed'}`)
      }
    }
  } else {
    errors.push(`Could not load orphaned resumes (${orphansResponse.status}).`)
  }

  const failuresResponse = await serviceFetch('/rest/v1/rpc/claim_notification_failures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_limit: 25 }),
  })
  if (failuresResponse.ok) {
    const failures = await failuresResponse.json() as Array<{ id: number; submission_id: string | null; attempts: number }>
    for (const failure of failures) {
      const attemptedAt = new Date().toISOString()
      try {
        if (!failure.submission_id) {
          await patch('notification_failures', failure.id, {
            resolved_at: attemptedAt, last_attempt_at: attemptedAt,
            detail: 'Cannot retry a notification without a submission id.',
          })
          result.notificationsResolved++
          continue
        }
        const submissionResponse = await serviceFetch(
          `/rest/v1/submissions?select=id,kind,created_at&id=eq.${encodeURIComponent(failure.submission_id)}&limit=1`,
        )
        if (!submissionResponse.ok) {
          throw new Error(`Submission lookup returned ${submissionResponse.status}.`)
        }
        const submissions = await submissionResponse.json() as unknown[]
        const record = submissions[0]
        if (!record) {
          await patch('notification_failures', failure.id, {
            resolved_at: attemptedAt, last_attempt_at: attemptedAt,
            detail: 'Submission no longer exists; notification retry closed.',
          })
          result.notificationsResolved++
          continue
        }

        const notification = await fetch(`${SUPABASE_URL}/functions/v1/notify-submission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-webhook-secret': WEBHOOK_SECRET },
          body: JSON.stringify({ record, failure_id: failure.id }),
        })
        const body = await notification.text()
        const notificationResult = (() => {
          try { return JSON.parse(body) as { ok?: boolean; transient?: boolean } }
          catch { return {} }
        })()
        result.notificationsRetried++
        if (notification.ok && notificationResult.ok === true) {
          await patch('notification_failures', failure.id, {
            resolved_at: attemptedAt,
            status_code: notification.status, detail: 'Delivered by maintenance retry.',
          })
          result.notificationsResolved++
        } else {
          const finalAttempt = failure.attempts >= 5 || notificationResult.transient === false
          await patch('notification_failures', failure.id, {
            status_code: notification.status, detail: body.slice(0, 2000),
            resolved_at: finalAttempt ? attemptedAt : null,
          })
          if (finalAttempt) result.notificationsResolved++
        }
      } catch (error) {
        const finalAttempt = failure.attempts >= 5
        await patch('notification_failures', failure.id, {
          resolved_at: finalAttempt ? attemptedAt : null,
          detail: error instanceof Error ? error.message.slice(0, 2000) : 'Retry failed.',
        }).catch(() => {})
        if (finalAttempt) result.notificationsResolved++
        errors.push(`notification ${failure.id}: ${error instanceof Error ? error.message : 'retry failed'}`)
      }
    }
  } else {
    errors.push(`Could not load notification failures (${failuresResponse.status}).`)
  }

  try {
    const staleBefore = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString()
    const staleLimits = await serviceFetch(
      `/rest/v1/public_submission_rate_limits?updated_at=lt.${encodeURIComponent(staleBefore)}`,
      { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
    )
    if (!staleLimits.ok) throw new Error(`Rate-limit cleanup returned ${staleLimits.status}.`)
    result.staleRateLimitsDeleted = true
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Rate-limit cleanup failed.')
  }

  try {
    const historyBefore = new Date(Date.now() - 90 * 24 * 60 * 60_000).toISOString()
    const history = await serviceFetch(
      `/rest/v1/notification_failures?resolved_at=not.is.null&resolved_at=lt.${encodeURIComponent(historyBefore)}`,
      { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
    )
    if (!history.ok) throw new Error(`Notification-history cleanup returned ${history.status}.`)
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Notification-history cleanup failed.')
  }

  try {
    const purge = await serviceFetch('/rest/v1/rpc/purge_expired_submissions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    })
    if (!purge.ok) throw new Error(`Retention RPC returned ${purge.status}.`)
    result.submissionsPurged = Number(await purge.json()) || 0
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Retention cleanup failed.')
  }

  return new Response(JSON.stringify({ ok: errors.length === 0, ...result, errors }), {
    status: errors.length === 0 ? 200 : 207,
    headers: { 'Content-Type': 'application/json' },
  })
})
