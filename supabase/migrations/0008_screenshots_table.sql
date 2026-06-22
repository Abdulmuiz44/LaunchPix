-- Screenshots table for standalone screenshot uploads (not project-scoped)
-- Used by POST /api/v1/screenshots/upload

create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  customer_id text,
  name text,
  product_name text,
  mime_type text not null,
  size_bytes integer not null,
  width integer,
  height integer,
  storage_bucket text not null default 'screenshots',
  storage_key text not null,
  public_url text,
  storage_mode text not null default 'supabase',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_screenshots_user_id on public.screenshots(user_id);
create index if not exists idx_screenshots_customer_id on public.screenshots(customer_id);
create index if not exists idx_screenshots_created_at on public.screenshots(created_at desc);
create unique index if not exists idx_screenshots_storage_key on public.screenshots(storage_bucket, storage_key);

create trigger trg_screenshots_updated_at
before update on public.screenshots
for each row execute function public.set_updated_at();

-- Storage bucket for screenshot uploads
-- Public bucket: uploaded screenshot URLs are publicly accessible.
-- This is intentional for v0.1 to allow deterministic rendering via public URLs.
-- Future improvement: switch to private bucket + signed URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'screenshots',
  'screenshots',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies for screenshots bucket
-- Upload: service-role only (server-side upload via API route)
-- Read: public (bucket is public for rendering)
-- Delete: owner-only via server-side check

create policy "Public read access to screenshots"
on storage.objects
for select
using (bucket_id = 'screenshots');

create policy "Service role can upload screenshots"
on storage.objects
for insert
with check (bucket_id = 'screenshots');

create policy "Service role can delete screenshots"
on storage.objects
for delete
using (bucket_id = 'screenshots');

-- RLS for screenshots table
-- Server-side routes use service role, so RLS policies are permissive.
-- Ownership is enforced in application code (API routes check user_id).

alter table public.screenshots enable row level security;

create policy "Users can view own screenshots"
on public.screenshots
for select
using (user_id = auth.uid()::text);

create policy "Users can insert own screenshots"
on public.screenshots
for insert
with check (user_id = auth.uid()::text);

create policy "Users can delete own screenshots"
on public.screenshots
for delete
using (user_id = auth.uid()::text);
