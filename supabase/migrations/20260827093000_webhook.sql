-- ============================================================================
-- Premium Care — email notification webhook
-- Safe to re-run.
--
-- Public submissions now call notify-submission from the submit-public Edge
-- Function. Remove the legacy database webhook rather than storing a URL or
-- shared secret in migration history.
-- ============================================================================

drop trigger if exists on_submission_created on public.submissions;
drop function if exists public.notify_new_submission();
