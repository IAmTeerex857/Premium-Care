-- ============================================================================
-- Premium Care — email notification webhook
-- Safe to re-run.
--
-- Fires the notify-submission edge function on every new public form
-- submission, which emails it to info@premiumcareinc.com.
--
-- BEFORE RUNNING: replace <YOUR_WEBHOOK_SECRET> below with the same value set
-- as the WEBHOOK_SECRET secret on the notify-submission edge function.
--
-- NOTE: this deliberately uses pg_net directly rather than
-- supabase_functions.http_request(). That helper only exists after Database
-- Webhooks has been enabled through the dashboard UI, so depending on it makes
-- this script fail on a fresh project. pg_net needs no dashboard step.
-- ============================================================================

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_submission()
returns trigger
language plpgsql
security definer                       -- so anonymous form inserts can fire it
set search_path = public, extensions, net
as $$
begin
  -- pg_net queues the request asynchronously, so a slow or failing webhook
  -- never delays or blocks the visitor's form submission.
  perform net.http_post(
    url     := 'https://freaociztiktyytaarto.supabase.co/functions/v1/notify-submission',
    body    := jsonb_build_object('record', to_jsonb(new)),
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 -- Replace with the WEBHOOK_SECRET set on the edge function.
                 -- Kept out of git on purpose; the deployed copy has the real value.
                 'x-webhook-secret', '<YOUR_WEBHOOK_SECRET>'
               ),
    timeout_milliseconds := 5000
  );
  return new;
exception when others then
  -- A notification problem must never reject a real submission.
  raise warning 'notify_new_submission failed: %', sqlerrm;
  return new;
end $$;

drop trigger if exists on_submission_created on public.submissions;

create trigger on_submission_created
  after insert on public.submissions
  for each row execute function public.notify_new_submission();

-- Verify:
--   select tgname from pg_trigger
--    where tgrelid = 'public.submissions'::regclass and not tgisinternal;
--
-- Inspect delivery attempts:
--   select id, status_code, error_msg, created
--     from net._http_response order by created desc limit 10;
