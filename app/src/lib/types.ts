export type UserRole = 'admin' | 'member'
export type SubmissionStatus = 'new' | 'in_progress' | 'closed'
export type SubmissionKind = 'booking' | 'contact' | 'referral' | 'application' | 'newsletter'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  created_at: string
}

export type Submission = {
  id: string
  kind: SubmissionKind
  status: SubmissionStatus
  name: string | null
  email: string | null
  phone: string | null
  subject: string | null
  message: string | null
  payload: Record<string, unknown>
  assigned_to: string | null
  created_at: string
  updated_at: string
  assignee?: Pick<Profile, 'id' | 'full_name' | 'email'> | null
}

export type SubmissionNote = {
  id: string
  submission_id: string
  author_id: string
  body: string
  created_at: string
  author?: Pick<Profile, 'id' | 'full_name' | 'email'> | null
}

export type Invite = {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  code: string
  accepted_at: string | null
  accepted_by: string | null
  invited_by: string | null
  created_at: string
}

export const KIND_LABEL: Record<SubmissionKind, string> = {
  booking: 'Appointment',
  contact: 'Contact',
  referral: 'Referral',
  application: 'Application',
  newsletter: 'Newsletter',
}

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  closed: 'Closed',
}
