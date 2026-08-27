-- Trigger helpers are internal implementation details, not public RPCs.
alter function public.touch_updated_at() set search_path = public;

revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.guard_profile_self_update() from public, anon, authenticated;
revoke all on function public.force_submission_defaults() from public, anon, authenticated;
revoke all on function public.guard_submission_update() from public, anon, authenticated;
revoke all on function public.rate_limit_submissions() from public, anon, authenticated;
revoke all on function public.queue_resume_cleanup() from public, anon, authenticated;

-- These SECURITY DEFINER helpers are required by RLS policies. Anonymous users
-- no longer write directly to public tables, so only authenticated users and
-- trusted server operations need them.
revoke all on function public.is_staff() from public, anon;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_staff() to authenticated, service_role;
grant execute on function public.is_admin() to authenticated, service_role;
