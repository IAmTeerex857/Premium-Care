-- Final privilege and worker-concurrency hardening.

-- Staff record access through the validated RPC, not direct audit inserts.
revoke insert on table public.access_log from authenticated;

create or replace function public.log_submission_access(p_submission_id uuid, p_action text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_action <> 'view' then
    raise exception 'Unsupported audit action.' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.submissions s
     where s.id = p_submission_id
       and (
         public.is_admin()
         or (
           public.is_staff()
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
revoke all on function public.log_submission_access(uuid, text) from public, anon;
grant execute on function public.log_submission_access(uuid, text) to authenticated;

-- PostgREST needs SELECT for return=representation and maintenance lookups.
grant select, insert on table public.submissions to service_role;

-- Claim retries atomically so overlapping workers cannot send the same email.
create or replace function public.claim_notification_failures(p_limit integer default 25)
returns table (id bigint, submission_id uuid, attempts integer)
language plpgsql security definer set search_path = public as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'Service role access is required.' using errcode = '42501';
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'p_limit must be between 1 and 100.' using errcode = '22023';
  end if;

  return query
  with candidates as (
    select f.id
      from public.notification_failures f
     where f.resolved_at is null
       and f.attempts < 5
       and (f.last_attempt_at is null or f.last_attempt_at < now() - interval '5 minutes')
     order by f.created_at
     for update skip locked
     limit p_limit
  )
  update public.notification_failures f
     set attempts = f.attempts + 1,
         last_attempt_at = now()
    from candidates c
   where f.id = c.id
  returning f.id, f.submission_id, f.attempts;
end
$$;
revoke all on function public.claim_notification_failures(integer) from public, anon, authenticated;
grant execute on function public.claim_notification_failures(integer) to service_role;
