-- ============================================================================
-- Premium Care — Supabase schema
-- Paste this whole file into the Supabase SQL Editor (Dashboard → SQL Editor → New query) and Run.
-- Safe to re-run: everything is guarded with IF NOT EXISTS / OR REPLACE.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_status as enum ('new', 'in_progress', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_kind as enum ('booking', 'contact', 'referral', 'application', 'newsletter');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Profiles — one row per auth user, holds the role
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.user_role not null default 'member',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Invites — admin creates these; signup consumes them
-- ---------------------------------------------------------------------------
create table if not exists public.invites (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  role         public.user_role not null default 'member',
  full_name    text,
  code         text not null unique,
  accepted_at  timestamptz,
  accepted_by  uuid references auth.users(id) on delete set null,
  invited_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create unique index if not exists invites_pending_email_idx
  on public.invites (lower(email)) where accepted_at is null;

-- ---------------------------------------------------------------------------
-- 4. Submissions — every public form lands here
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  kind         public.submission_kind not null,
  status       public.submission_status not null default 'new',
  name         text,
  email        text,
  phone        text,
  subject      text,
  message      text,
  -- kind-specific fields live here (service, preferred_date, ndis-equivalent, etc.)
  payload      jsonb not null default '{}'::jsonb,
  assigned_to  uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists submissions_kind_idx    on public.submissions (kind);
create index if not exists submissions_status_idx  on public.submissions (status);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- 5. Internal notes on a submission
-- ---------------------------------------------------------------------------
create table if not exists public.submission_notes (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  body          text not null,
  created_at    timestamptz not null default now()
);

create index if not exists notes_submission_idx on public.submission_notes (submission_id, created_at);

-- ---------------------------------------------------------------------------
-- 6. Helper functions
--    SECURITY DEFINER + search_path pinned, so RLS policies can call them
--    without recursing into profiles' own policies.
-- ---------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active
  );
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active and p.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 7. Signup trigger — turns an invite into a profile with the right role
--    * matching pending invite  -> role from the invite, invite marked accepted
--    * NO invite, and no users exist yet -> first account bootstraps as admin
--    * NO invite, users already exist     -> signup is rejected
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_invite public.invites%rowtype;
  v_count  int;
begin
  select * into v_invite
  from public.invites
  where lower(email) = lower(new.email) and accepted_at is null
  order by created_at desc limit 1;

  if found then
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data ->> 'full_name', v_invite.full_name),
      v_invite.role
    );

    update public.invites
       set accepted_at = now(), accepted_by = new.id
     where id = v_invite.id;

    return new;
  end if;

  select count(*) into v_count from public.profiles;
  if v_count = 0 then
    -- Bootstrap: the very first account becomes the admin.
    insert into public.profiles (id, email, full_name, role)
    values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'admin');
    return new;
  end if;

  raise exception 'No pending invitation exists for this email address.';
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 8. updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists submissions_touch on public.submissions;
create trigger submissions_touch
  before update on public.submissions
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 9. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.invites          enable row level security;
alter table public.submissions      enable row level security;
alter table public.submission_notes enable row level security;

-- ---- profiles ----
drop policy if exists profiles_self_read   on public.profiles;
drop policy if exists profiles_staff_read  on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
drop policy if exists profiles_admin_write on public.profiles;

create policy profiles_self_read on public.profiles
  for select using (id = auth.uid());

create policy profiles_staff_read on public.profiles
  for select using (public.is_staff());

create policy profiles_self_update on public.profiles
  for update using (id = auth.uid())
  -- a member must not be able to promote themselves
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy profiles_admin_write on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- ---- invites ----
drop policy if exists invites_admin_all on public.invites;
create policy invites_admin_all on public.invites
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- submissions ----
drop policy if exists submissions_public_insert on public.submissions;
drop policy if exists submissions_staff_read    on public.submissions;
drop policy if exists submissions_staff_update  on public.submissions;
drop policy if exists submissions_admin_delete  on public.submissions;

-- Anonymous visitors may CREATE a submission (that is the public form) but may
-- never read one back. Reading requires an active staff profile.
create policy submissions_public_insert on public.submissions
  for insert to anon, authenticated with check (true);

create policy submissions_staff_read on public.submissions
  for select using (public.is_staff());

create policy submissions_staff_update on public.submissions
  for update using (public.is_staff()) with check (public.is_staff());

create policy submissions_admin_delete on public.submissions
  for delete using (public.is_admin());

-- ---- notes ----
drop policy if exists notes_staff_read   on public.submission_notes;
drop policy if exists notes_staff_insert on public.submission_notes;
drop policy if exists notes_author_del   on public.submission_notes;

create policy notes_staff_read on public.submission_notes
  for select using (public.is_staff());

create policy notes_staff_insert on public.submission_notes
  for insert with check (public.is_staff() and author_id = auth.uid());

create policy notes_author_del on public.submission_notes
  for delete using (author_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- 10. Realtime (optional — lets the portal live-update)
-- ---------------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.submissions;
exception when duplicate_object then null; end $$;
