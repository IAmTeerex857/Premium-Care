# Supabase backend

`migrations/` is the database source of truth. Apply migrations in filename
order with `npm run db:push` from `app/`.

| Migration | Purpose |
|---|---|
| `20260826120000_init.sql` | Core tables, roles, RLS, and signup trigger |
| `20260827090000_hardening.sql` | Hashed expiring invites, guarded writes, rate limits, access log, retention, and notification failures |
| `20260827091000_storage.sql` | Private resume bucket, policies, and orphan queue |
| `20260827092000_aggregates.sql` | Dashboard aggregate functions |
| `20260827093000_webhook.sql` | Removes the obsolete database webhook |
| `20260827100000_backend_remediation.sql` | Edge-only public writes, least privilege, rate limiting, and scheduled maintenance |
| `20260827101000_final_hardening.sql` | Audit privileges, service grants, and atomic notification retry claims |
| `20260827102000_function_privileges.sql` | Internal function privileges and fixed search paths |
| `20260827103000_private_helpers.sql` | Moves privileged RLS and audit logic outside the exposed API schema |

Do not assume every migration is safe to rerun manually. Supabase records
applied migrations, so use `db push` rather than repeatedly pasting the full set
into the SQL Editor.

## Edge Functions And Secrets

Public forms use `submit-public`; notifications use `notify-submission`; retries,
retention, and resume cleanup use `process-maintenance`.

Configure these Edge Function secrets:

- `WEBHOOK_SECRET`
- `RATE_LIMIT_SALT`
- `MAINTENANCE_SECRET`
- `RESEND_API_KEY`
- `NOTIFY_TO`
- `NOTIFY_FROM`
- `ALLOWED_ORIGINS`

Store the project URL and the same maintenance secret in Supabase Vault under
`premium_care_project_url` and `premium_care_maintenance_secret`. Secret values
must never be committed.

Deploy functions before pushing the remediation migration:

```bash
npm run sb -- functions deploy notify-submission
npm run sb -- functions deploy submit-public
npm run sb -- functions deploy process-maintenance
npm run db:push
```

The functions that accept non-user requests have JWT verification disabled in
`config.toml`. `notify-submission` and `process-maintenance` instead require
dedicated secrets and fail closed when those secrets are missing.

## First administrator

The hardened signup trigger requires an invitation for every account. Do not
create the first user directly in **Authentication > Users**: that creation does
not include the required invitation code and the trigger will reject it.

Generate a random code locally and keep its plaintext value:

```bash
openssl rand -hex 8
```

In the Supabase SQL Editor, insert an out-of-band admin invitation. Replace both
placeholders; enter the code in uppercase in the SQL and in the join form.

```sql
insert into public.invites (email, full_name, role, code_hash, expires_at)
values (
  lower('<ADMIN_EMAIL>'),
  'Premium Care Administrator',
  'admin',
  encode(extensions.digest(upper('<PLAINTEXT_CODE>'), 'sha256'), 'hex'),
  now() + interval '7 days'
);
```

Visit `/portal/join`, then register with that exact email and code. The signup
trigger creates the profile, grants the admin role, and consumes the invitation.
Delete an unused bootstrap invitation in the SQL Editor if it is no longer
needed.

## Later invitations

Administrators create invitations in **Portal > Team**. Only the SHA-256 hash is
stored. The plaintext code is displayed once, is bound to the invited email,
expires after seven days, and can be used once. Send the code and
`https://premiumcareinc.com/portal/join` to the recipient through an appropriate
channel; the application does not email invitations.

## Retention And Storage Cleanup

The remediation migration schedules `process-maintenance` every 15 minutes with
`pg_cron`, `pg_net`, and the Vault values above. It retries transient email
failures, deletes queued resume objects, removes stale rate-limit rows, and
purges closed submissions after 24 months. The destructive purge RPC is callable
only by the service role.

## Verification

After deployment, submit a non-sensitive test form and verify the portal record
and notification delivery. Notifications do not block form submission, so
monitor `public.notification_failures`, `public.orphaned_resumes`, Cron history,
and Edge Function logs.
