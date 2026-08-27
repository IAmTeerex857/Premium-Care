-- Public forms now enter through submit-public, which validates and writes with
-- the service role. The browser no longer has direct table or Storage writes.

drop policy if exists submissions_public_insert on public.submissions;
revoke insert on table public.submissions from public, anon, authenticated;
drop trigger if exists submissions_rate_limit on public.submissions;
revoke all on function public.rate_limit_submissions() from public, anon, authenticated;

drop policy if exists resumes_anon_upload on storage.objects;

-- The Edge Function sends notifications with its secret. Remove the legacy
-- trigger whose checked-in definition could only contain a placeholder secret.
drop trigger if exists on_submission_created on public.submissions;
revoke all on function public.notify_new_submission() from public, anon, authenticated;

-- Retention is destructive and may only be initiated by trusted automation.
revoke all on function public.purge_expired_submissions() from public, anon, authenticated;
grant execute on function public.purge_expired_submissions() to service_role;

-- Aggregate RPCs must not be usable by inactive accounts, and chart expansion
-- is deliberately capped to prevent an unbounded generate_series call.
create or replace function public.submission_counts()
returns table (kind public.submission_kind, status public.submission_status, count bigint)
language plpgsql stable security invoker set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'Active staff access is required.' using errcode = '42501';
  end if;
  return query
    select s.kind, s.status, count(*)::bigint
      from public.submissions s
     group by s.kind, s.status;
end
$$;

create or replace function public.submission_daily_volume(p_days int default 14)
returns table (day date, count bigint)
language plpgsql stable security invoker set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'Active staff access is required.' using errcode = '42501';
  end if;
  if p_days is null or p_days < 1 or p_days > 90 then
    raise exception 'p_days must be between 1 and 90.' using errcode = '22023';
  end if;
  return query
    select d::date,
           (select count(*) from public.submissions s
             where s.created_at >= d and s.created_at < d + interval '1 day')::bigint
      from generate_series(
             date_trunc('day', now()) - ((p_days - 1) * interval '1 day'),
             date_trunc('day', now()), interval '1 day') d;
end
$$;

revoke all on function public.submission_counts() from public, anon;
revoke all on function public.submission_daily_volume(int) from public, anon;
grant execute on function public.submission_counts() to authenticated;
grant execute on function public.submission_daily_volume(int) to authenticated;

-- Prevent an admin from locking out their own API session, and ensure that an
-- API update can never deactivate or demote the last active administrator.
create or replace function public.guard_profile_self_update()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_removes_admin boolean;
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if new.id is distinct from old.id or new.created_at is distinct from old.created_at then
    raise exception 'Profile identity and creation time are immutable.';
  end if;

  v_removes_admin := old.is_active and old.role = 'admin'
    and (not new.is_active or new.role <> 'admin');

  if old.id = auth.uid() and v_removes_admin then
    raise exception 'You cannot deactivate or demote your own administrator account.';
  end if;
  if v_removes_admin then
    -- Serialize admin removals so two concurrent requests cannot both observe
    -- another active admin and commit a complete lockout.
    perform pg_advisory_xact_lock(184726301);
    if (select count(*) from public.profiles where is_active and role = 'admin') <= 1 then
      raise exception 'At least one active administrator is required.';
    end if;
  end if;

  if public.is_admin() then
    return new;
  end if;
  if new.id <> old.id
     or new.role is distinct from old.role
     or new.is_active is distinct from old.is_active
     or new.email is distinct from old.email
     or new.created_at is distinct from old.created_at then
    raise exception 'You may only change your own display name.';
  end if;
  return new;
end
$$;

-- Atomic, per-client rate limits. IPs are keyed hashes produced with an Edge
-- secret, so this table does not retain client network addresses.
create table if not exists public.public_submission_rate_limits (
  ip_hash      text primary key,
  window_start timestamptz not null,
  request_count integer not null default 1 check (request_count > 0),
  updated_at   timestamptz not null default now()
);
alter table public.public_submission_rate_limits enable row level security;
revoke all on table public.public_submission_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table public.public_submission_rate_limits to service_role;

create or replace function public.consume_public_submission_limit(p_ip_hash text)
returns boolean language plpgsql security definer
set search_path = public as $$
declare v_count integer;
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role access is required.' using errcode = '42501';
  end if;
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid client hash.' using errcode = '22023';
  end if;

  insert into public.public_submission_rate_limits
    (ip_hash, window_start, request_count, updated_at)
  values (p_ip_hash, date_trunc('hour', now()), 1, now())
  on conflict (ip_hash) do update set
    window_start = case
      when public.public_submission_rate_limits.window_start < date_trunc('hour', now())
      then date_trunc('hour', now())
      else public.public_submission_rate_limits.window_start end,
    request_count = case
      when public.public_submission_rate_limits.window_start < date_trunc('hour', now()) then 1
      else public.public_submission_rate_limits.request_count + 1 end,
    updated_at = now()
  returning request_count into v_count;

  return v_count <= 10;
end
$$;
revoke all on function public.consume_public_submission_limit(text) from public, anon, authenticated;
grant execute on function public.consume_public_submission_limit(text) to service_role;

-- Retry/cleanup workers query only unresolved work and cap retries.
alter table public.notification_failures
  add column if not exists last_attempt_at timestamptz;
create index if not exists notification_failures_pending_idx
  on public.notification_failures (created_at)
  where resolved_at is null;
create index if not exists orphaned_resumes_pending_idx
  on public.orphaned_resumes (created_at)
  where deleted_at is null;

revoke all on table public.notification_failures from public, anon, authenticated;
grant select on table public.notification_failures to authenticated;
grant select, insert, update, delete on table public.notification_failures to service_role;
grant select, update, delete on table public.orphaned_resumes to service_role;
grant usage, select on sequence public.notification_failures_id_seq to service_role;

-- Explicit privileges avoid relying on legacy "auto expose" defaults. RLS still
-- determines which authenticated staff rows and operations are permitted.
grant select, update on table public.profiles to authenticated;
grant select, insert, delete on table public.invites to authenticated;
grant select, update, delete on table public.submissions to authenticated;
grant select, insert, delete on table public.submission_notes to authenticated;
grant select on table public.access_log to authenticated;
grant usage, select on sequence public.access_log_id_seq to authenticated;
grant execute on function public.log_submission_access(uuid, text) to authenticated;

grant select, insert on table public.submissions to service_role;
grant usage on type public.submission_kind, public.submission_status to service_role;

-- Members work only with unassigned or personally assigned care enquiries.
-- Employment applications and their resumes remain administrator-only.
drop policy if exists submissions_staff_read on public.submissions;
create policy submissions_staff_read on public.submissions
  for select to authenticated using (
    public.is_admin()
    or (
      public.is_staff()
      and kind <> 'application'
      and (assigned_to is null or assigned_to = auth.uid())
    )
  );

drop policy if exists submissions_staff_update on public.submissions;
create policy submissions_staff_update on public.submissions
  for update to authenticated
  using (
    public.is_admin()
    or (
      public.is_staff()
      and kind <> 'application'
      and (assigned_to is null or assigned_to = auth.uid())
    )
  )
  with check (
    public.is_admin()
    or (
      public.is_staff()
      and kind <> 'application'
      and (assigned_to is null or assigned_to = auth.uid())
    )
  );

drop policy if exists notes_staff_read on public.submission_notes;
create policy notes_staff_read on public.submission_notes
  for select to authenticated using (
    exists (
      select 1 from public.submissions s
       where s.id = submission_id
    )
  );

drop policy if exists notes_staff_insert on public.submission_notes;
create policy notes_staff_insert on public.submission_notes
  for insert to authenticated with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.submissions s
       where s.id = submission_id
    )
  );

drop policy if exists resumes_staff_read on storage.objects;
create policy resumes_staff_read on storage.objects
  for select to authenticated using (
    bucket_id = 'resumes' and public.is_admin()
  );

create or replace function public.log_submission_access(p_submission_id uuid, p_action text)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'Active staff access is required.' using errcode = '42501';
  end if;
  if p_action <> 'view' then
    raise exception 'Unsupported audit action.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.submissions where id = p_submission_id) then
    raise exception 'Submission not found or access denied.' using errcode = '42501';
  end if;
  insert into public.access_log (actor_id, action, submission_id)
  values (auth.uid(), p_action, p_submission_id);
end
$$;

-- Maintenance runs through a secret-authenticated Edge Function. Project URL
-- and secret values live in Vault and never in migration history.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

do $$
declare existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'premium-care-maintenance';
  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;
end
$$;

select cron.schedule(
  'premium-care-maintenance',
  '*/15 * * * *',
  $job$
    select net.http_post(
      url := (
        select decrypted_secret from vault.decrypted_secrets
         where name = 'premium_care_project_url' limit 1
      ) || '/functions/v1/process-maintenance',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-maintenance-secret', (
          select decrypted_secret from vault.decrypted_secrets
           where name = 'premium_care_maintenance_secret' limit 1
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 10000
    );
  $job$
);
