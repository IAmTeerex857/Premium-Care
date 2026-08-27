-- ============================================================================
-- Premium Care, resume storage
-- Private bucket: applicants may write, only active staff may read.
-- Idempotent.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 10485760,
        array['application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain',
              'application/rtf'])
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Applicants upload but can never list or read the bucket back.
drop policy if exists resumes_anon_upload on storage.objects;
create policy resumes_anon_upload on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'resumes');

drop policy if exists resumes_staff_read on storage.objects;
create policy resumes_staff_read on storage.objects
  for select using (bucket_id = 'resumes' and public.is_staff());

drop policy if exists resumes_admin_delete on storage.objects;
create policy resumes_admin_delete on storage.objects
  for delete using (bucket_id = 'resumes' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Deleting a submission should not leave its resume behind. Storage blocks
-- direct DELETE on storage.objects, so record the orphan for a cleanup pass.
-- ---------------------------------------------------------------------------
create table if not exists public.orphaned_resumes (
  id         bigserial primary key,
  path       text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
alter table public.orphaned_resumes enable row level security;
drop policy if exists orphaned_admin on public.orphaned_resumes;
create policy orphaned_admin on public.orphaned_resumes
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.queue_resume_cleanup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.payload ? 'resume_path' and old.payload ->> 'resume_path' is not null then
    insert into public.orphaned_resumes (path) values (old.payload ->> 'resume_path');
  end if;
  return old;
end $$;

drop trigger if exists submissions_queue_resume_cleanup on public.submissions;
create trigger submissions_queue_resume_cleanup
  before delete on public.submissions
  for each row execute function public.queue_resume_cleanup();
