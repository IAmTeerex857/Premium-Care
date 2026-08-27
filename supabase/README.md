# Database

`migrations/` is the single source of truth. Apply in filename order.

| Migration | What it does |
|---|---|
| `20260826120000_init.sql` | Tables, roles, RLS, signup trigger |
| `20260827090000_hardening.sql` | Hashed/expiring invites, no admin bootstrap, column guards, rate limits, access log, retention, outbox |
| `20260827091000_storage.sql` | Private `resumes` bucket and its policies |
| `20260827092000_aggregates.sql` | Server-side count and daily-volume RPCs |
| `20260827093000_webhook.sql` | Trigger that calls the notification edge function |

## Applying

With the CLI (from `app/`):

```bash
npm run db:push
```

Or paste each file into the SQL editor in filename order. Every migration is
idempotent and safe to re-run.

## Creating the first administrator

There is deliberately **no bootstrap**. The first admin is provisioned
out-of-band so that a public deployment can never be claimed by a visitor:

```sql
-- 1. Create the user in Authentication -> Users in the dashboard.
-- 2. Then, with their id:
insert into public.profiles (id, email, full_name, role)
values ('<auth-user-uuid>', 'admin@premiumcareinc.com', 'Premium Care', 'admin')
on conflict (id) do update set role = 'admin', is_active = true;
```

Everyone after that joins by invitation only.

## Invitations

Only a SHA-256 hash of the code is stored. The plaintext is shown to the
admin once at creation and cannot be recovered. Codes expire after 7 days,
are single use, and are bound to the invited email address.

## Scheduled jobs

Two functions are meant to run on a schedule (Supabase → Integrations → Cron):

```sql
select public.purge_expired_submissions();   -- daily; enforces 24-month retention
```

Orphaned resumes are queued in `public.orphaned_resumes` when a submission is
deleted. Storage blocks direct SQL deletes, so remove those files with the
Storage API or from the dashboard.
