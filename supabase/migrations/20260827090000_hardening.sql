-- ============================================================================
-- Premium Care, security hardening
-- Addresses: admin bootstrap, self-service reactivation, unvalidated invite
-- codes, unrestricted anonymous insert, mutable submission fields.
-- Idempotent.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. Invites: hashed, expiring, single use
-- ---------------------------------------------------------------------------
alter table public.invites add column if not exists code_hash  text;
alter table public.invites add column if not exists expires_at timestamptz
  not null default (now() + interval '7 days');
alter table public.invites add column if not exists revoked_at timestamptz;

-- The old plaintext `code` column is a credential at rest. Migrate any
-- existing rows to a hash, then drop it.
update public.invites
   set code_hash = encode(extensions.digest(code, 'sha256'), 'hex')
 where code_hash is null and code is not null;

alter table public.invites drop column if exists code;

create index if not exists invites_code_hash_idx on public.invites (code_hash);

-- ---------------------------------------------------------------------------
-- 2. Signup: require a valid, unexpired, unused invitation. No bootstrap.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  v_invite public.invites%rowtype;
  v_code   text;
  v_hash   text;
begin
  v_code := nullif(trim(new.raw_user_meta_data ->> 'invite_code'), '');
  if v_code is null then
    raise exception 'An invitation code is required to create a staff account.';
  end if;

  v_hash := encode(extensions.digest(upper(v_code), 'sha256'), 'hex');

  select * into v_invite
    from public.invites
   where code_hash = v_hash
     and lower(email) = lower(new.email)
     and accepted_at is null
     and revoked_at is null
     and expires_at > now()
   limit 1;

  if not found then
    raise exception 'That invitation code is not valid for this email address, or it has expired.';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data ->> 'full_name', v_invite.full_name),
          v_invite.role);

  update public.invites
     set accepted_at = now(), accepted_by = new.id
   where id = v_invite.id;

  return new;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Profiles: a member may edit their own display name and nothing else.
--    Previously WITH CHECK constrained only `role`, which left is_active,
--    email and created_at self-writable, so a deactivated user could
--    reactivate themselves.
-- ---------------------------------------------------------------------------
create or replace function public.guard_profile_self_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then
    return new;                      -- admins may change role and is_active
  end if;
  if new.id <> old.id
     or new.role      is distinct from old.role
     or new.is_active is distinct from old.is_active
     or new.email     is distinct from old.email
     or new.created_at is distinct from old.created_at then
    raise exception 'You may only change your own display name.';
  end if;
  return new;
end $$;

drop trigger if exists profiles_guard_self_update on public.profiles;
create trigger profiles_guard_self_update
  before update on public.profiles
  for each row execute function public.guard_profile_self_update();

-- A deactivated account must not be able to update its row at all.
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update to authenticated
  using (id = auth.uid() and is_active)
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. Submissions: anonymous writers may not choose status, timestamps,
--    assignment, or unbounded payloads.
-- ---------------------------------------------------------------------------
alter table public.submissions
  drop constraint if exists submissions_length_guard;
alter table public.submissions
  add constraint submissions_length_guard check (
        coalesce(length(name), 0)    <= 200
    and coalesce(length(email), 0)   <= 320
    and coalesce(length(phone), 0)   <= 60
    and coalesce(length(subject), 0) <= 300
    and coalesce(length(message), 0) <= 5000
    and pg_column_size(payload)      <= 16384
  );

create or replace function public.force_submission_defaults()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_staff() then
    return new;                      -- staff may seed rows deliberately
  end if;
  new.status      := 'new';
  new.assigned_to := null;
  new.created_at  := now();
  new.updated_at  := now();
  return new;
end $$;

drop trigger if exists submissions_force_defaults on public.submissions;
create trigger submissions_force_defaults
  before insert on public.submissions
  for each row execute function public.force_submission_defaults();

-- ---------------------------------------------------------------------------
-- 5. Submissions: staff may triage, not rewrite history.
-- ---------------------------------------------------------------------------
create or replace function public.guard_submission_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.kind       is distinct from old.kind
     or new.name    is distinct from old.name
     or new.email   is distinct from old.email
     or new.phone   is distinct from old.phone
     or new.subject is distinct from old.subject
     or new.message is distinct from old.message
     or new.payload is distinct from old.payload
     or new.created_at is distinct from old.created_at then
    raise exception 'Submission content is immutable. Only status and assignment may change.';
  end if;
  return new;
end $$;

drop trigger if exists submissions_guard_update on public.submissions;
create trigger submissions_guard_update
  before update on public.submissions
  for each row execute function public.guard_submission_update();

-- ---------------------------------------------------------------------------
-- 6. Rate limit anonymous submissions (10 per email per hour, 60/hour global)
-- ---------------------------------------------------------------------------
create or replace function public.rate_limit_submissions()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_recent int; v_total int;
begin
  if public.is_staff() then return new; end if;

  select count(*) into v_total
    from public.submissions where created_at > now() - interval '1 hour';
  if v_total >= 60 then
    raise exception 'Too many submissions right now. Please try again shortly, or call us.';
  end if;

  if new.email is not null then
    select count(*) into v_recent
      from public.submissions
     where lower(email) = lower(new.email)
       and created_at > now() - interval '1 hour';
    if v_recent >= 10 then
      raise exception 'You have submitted several times already. Please call us instead.';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists submissions_rate_limit on public.submissions;
create trigger submissions_rate_limit
  before insert on public.submissions
  for each row execute function public.rate_limit_submissions();

-- ---------------------------------------------------------------------------
-- 7. Access audit for reads of submission content (privacy policy commitment)
-- ---------------------------------------------------------------------------
create table if not exists public.access_log (
  id            bigserial primary key,
  actor_id      uuid references public.profiles(id) on delete set null,
  action        text not null,
  submission_id uuid,
  created_at    timestamptz not null default now()
);
create index if not exists access_log_created_idx on public.access_log (created_at desc);

alter table public.access_log enable row level security;
drop policy if exists access_log_admin_read on public.access_log;
create policy access_log_admin_read on public.access_log
  for select using (public.is_admin());
drop policy if exists access_log_staff_insert on public.access_log;
create policy access_log_staff_insert on public.access_log
  for insert with check (public.is_staff() and actor_id = auth.uid());

create or replace function public.log_submission_access(p_submission_id uuid, p_action text)
returns void language sql security invoker set search_path = public as $$
  insert into public.access_log (actor_id, action, submission_id)
  values (auth.uid(), p_action, p_submission_id);
$$;

-- ---------------------------------------------------------------------------
-- 8. Retention: delete submissions that are closed and older than 24 months
-- ---------------------------------------------------------------------------
create or replace function public.purge_expired_submissions()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  with gone as (
    delete from public.submissions
     where status = 'closed' and updated_at < now() - interval '24 months'
     returning 1)
  select count(*) into n from gone;
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- 9. Notification outbox so transient email failures are retried, not lost
-- ---------------------------------------------------------------------------
create table if not exists public.notification_failures (
  id            bigserial primary key,
  submission_id uuid,
  kind          text,
  status_code   int,
  detail        text,
  attempts      int not null default 1,
  resolved_at   timestamptz,
  created_at    timestamptz not null default now()
);
alter table public.notification_failures enable row level security;
drop policy if exists notif_fail_admin on public.notification_failures;
create policy notif_fail_admin on public.notification_failures
  for select using (public.is_admin());
