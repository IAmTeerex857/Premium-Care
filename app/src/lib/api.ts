import { requireSupabase, supabase, isSupabaseConfigured } from './supabase'
import type { Invite, Profile, Submission, SubmissionKind, SubmissionNote, SubmissionStatus, UserRole } from './types'

/* ============================ Public form submits ========================= */

type SubmitInput = {
  kind: SubmissionKind
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  payload?: Record<string, unknown>
}

export async function createSubmission(input: SubmitInput): Promise<void> {
  if (!isSupabaseConfigured) {
    // Dev fallback so the UI is fully demoable before keys are added.
    await new Promise((r) => setTimeout(r, 900))
    const key = 'premiumcare:pending-submissions'
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
    existing.unshift({ ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)))
    return
  }

  const { error } = await requireSupabase()
    .from('submissions')
    .insert({
      kind: input.kind,
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      subject: input.subject ?? null,
      message: input.message ?? null,
      payload: input.payload ?? {},
    })

  if (error) throw new Error(error.message)
}

/* ============================== Resume upload ============================ */

/**
 * Uploads a resume to the private `resumes` bucket and returns its path.
 * Anonymous visitors may write but never read, so the file is only reachable
 * by staff through a short-lived signed URL.
 */
export async function uploadResume(file: File): Promise<string> {
  if (!isSupabaseConfigured) return `demo/${file.name}`

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safe}`.replace(/\.[^.]*$/, `.${ext}`)

  const { error } = await requireSupabase()
    .storage.from('resumes')
    .upload(path, file, { contentType: file.type || undefined, upsert: false })

  if (error) throw new Error(`Could not upload your resume: ${error.message}`)
  return path
}

/** Staff-only, time-limited download link for an uploaded resume. */
export async function getResumeUrl(path: string, expiresInSeconds = 300): Promise<string> {
  const { data, error } = await requireSupabase()
    .storage.from('resumes')
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

/* ============================== Portal reads ============================= */

export async function fetchSubmissions(filters: {
  kind?: SubmissionKind | 'all'
  status?: SubmissionStatus | 'all'
  search?: string
} = {}): Promise<Submission[]> {
  let q = requireSupabase()
    .from('submissions')
    .select('*, assignee:profiles!submissions_assigned_to_fkey(id, full_name, email)')
    .order('created_at', { ascending: false })

  if (filters.kind && filters.kind !== 'all') q = q.eq('kind', filters.kind)
  if (filters.status && filters.status !== 'all') q = q.eq('status', filters.status)
  if (filters.search?.trim()) {
    const s = `%${filters.search.trim()}%`
    q = q.or(`name.ilike.${s},email.ilike.${s},subject.ilike.${s},message.ilike.${s}`)
  }

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []) as Submission[]
}

export async function fetchSubmission(id: string): Promise<Submission> {
  const { data, error } = await requireSupabase()
    .from('submissions')
    .select('*, assignee:profiles!submissions_assigned_to_fkey(id, full_name, email)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data as Submission
}

export async function updateSubmission(
  id: string,
  patch: Partial<Pick<Submission, 'status' | 'assigned_to'>>,
): Promise<void> {
  const { error } = await requireSupabase().from('submissions').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await requireSupabase().from('submissions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/* ================================= Notes ================================= */

export async function fetchNotes(submissionId: string): Promise<SubmissionNote[]> {
  const { data, error } = await requireSupabase()
    .from('submission_notes')
    .select('*, author:profiles!submission_notes_author_id_fkey(id, full_name, email)')
    .eq('submission_id', submissionId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as SubmissionNote[]
}

export async function addNote(submissionId: string, authorId: string, body: string): Promise<void> {
  const { error } = await requireSupabase()
    .from('submission_notes')
    .insert({ submission_id: submissionId, author_id: authorId, body })
  if (error) throw new Error(error.message)
}

/* ============================ Team management =========================== */

export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await requireSupabase()
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as Profile[]
}

export async function fetchInvites(): Promise<Invite[]> {
  const { data, error } = await requireSupabase()
    .from('invites')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as Invite[]
}

/** Admin-only. Creates the pending invite the signup trigger will consume. */
export async function createInvite(input: {
  email: string
  role: UserRole
  full_name?: string
  invited_by: string
}): Promise<Invite> {
  const code = generateInviteCode()
  const { data, error } = await requireSupabase()
    .from('invites')
    .insert({
      email: input.email.trim().toLowerCase(),
      role: input.role,
      full_name: input.full_name?.trim() || null,
      code,
      invited_by: input.invited_by,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('There is already a pending invitation for that email address.')
    }
    throw new Error(error.message)
  }
  return data as Invite
}

export async function revokeInvite(id: string): Promise<void> {
  const { error } = await requireSupabase().from('invites').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setProfileRole(id: string, role: UserRole): Promise<void> {
  const { error } = await requireSupabase().from('profiles').update({ role }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function setProfileActive(id: string, is_active: boolean): Promise<void> {
  const { error } = await requireSupabase().from('profiles').update({ is_active }).eq('id', id)
  if (error) throw new Error(error.message)
}

/* ================================ Utils ================================= */

function generateInviteCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

/** Realtime subscription used by the portal dashboard/inbox. */
export function subscribeToSubmissions(onChange: () => void) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('submissions-feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, onChange)
    .subscribe()
  return () => {
    void supabase?.removeChannel(channel)
  }
}
