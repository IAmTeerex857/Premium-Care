-- Keep privilege-elevated helpers outside the schemas exposed by PostgREST.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create or replace function private.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
     where p.id = auth.uid() and p.is_active
  );
$$;

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
     where p.id = auth.uid() and p.is_active and p.role = 'admin'
  );
$$;

revoke all on function private.is_staff() from public, anon;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_staff() to authenticated, service_role;
grant execute on function private.is_admin() to authenticated, service_role;

-- Public wrappers are safe invokers and reveal only the caller's own role.
create or replace function public.is_staff()
returns boolean language sql stable security invoker set search_path = public, private as $$
  select private.is_staff();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security invoker set search_path = public, private as $$
  select private.is_admin();
$$;

revoke all on function public.is_staff() from public, anon;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_staff() to authenticated, service_role;
grant execute on function public.is_admin() to authenticated, service_role;

create or replace function private.log_submission_access(p_submission_id uuid, p_action text)
returns void language plpgsql security definer set search_path = public, private as $$
begin
  if p_action <> 'view' then
    raise exception 'Unsupported audit action.' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.submissions s
     where s.id = p_submission_id
       and (
         private.is_admin()
         or (
           private.is_staff()
           and s.kind <> 'application'
           and (s.assigned_to is null or s.assigned_to = auth.uid())
         )
       )
  ) then
    raise exception 'Submission not found or access denied.' using errcode = '42501';
  end if;
  insert into public.access_log (actor_id, action, submission_id)
  values (auth.uid(), p_action, p_submission_id);
end
$$;

revoke all on function private.log_submission_access(uuid, text) from public, anon;
grant execute on function private.log_submission_access(uuid, text) to authenticated;

create or replace function public.log_submission_access(p_submission_id uuid, p_action text)
returns void language sql security invoker set search_path = public, private as $$
  select private.log_submission_access(p_submission_id, p_action);
$$;
revoke all on function public.log_submission_access(uuid, text) from public, anon;
grant execute on function public.log_submission_access(uuid, text) to authenticated;
