-- Server-side aggregates so the portal never depends on a fetched page.
create or replace function public.submission_counts()
returns table (kind public.submission_kind, status public.submission_status, count bigint)
language sql stable security invoker set search_path = public as $$
  select s.kind, s.status, count(*)::bigint
    from public.submissions s
   group by s.kind, s.status;
$$;

create or replace function public.submission_daily_volume(p_days int default 14)
returns table (day date, count bigint)
language sql stable security invoker set search_path = public as $$
  select d::date,
         (select count(*) from public.submissions s
           where s.created_at >= d and s.created_at < d + interval '1 day')::bigint
    from generate_series(
           date_trunc('day', now()) - ((p_days - 1) * interval '1 day'),
           date_trunc('day', now()),
           interval '1 day') d;
$$;

grant execute on function public.submission_counts()          to authenticated;
grant execute on function public.submission_daily_volume(int) to authenticated;
grant execute on function public.log_submission_access(uuid, text) to authenticated;
