create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  product_type text not null,
  platform text not null,
  description text not null,
  audience text not null,
  website_url text,
  primary_color text,
  style_preset text not null default 'minimal',
  style_prompt text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  file_url text not null,
  normalized_url text,
  original_filename text not null,
  mime_type text not null,
  width integer,
  height integer,
  file_size integer,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  status text not null default 'draft',
  ai_summary jsonb,
  copy_json jsonb,
  style_json jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations(id) on delete cascade,
  asset_type text not null,
  width integer not null,
  height integer not null,
  file_url text not null,
  preview_url text,
  metadata_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'active',
  credits_remaining integer not null default 3,
  provider text,
  provider_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  event_type text not null,
  metadata_json jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_updated_at on public.projects(updated_at desc);
create index if not exists idx_uploads_project_id_position on public.uploads(project_id, position);
create index if not exists idx_generations_project_id on public.generations(project_id);
create index if not exists idx_assets_generation_id on public.assets(generation_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_usage_events_user_id_created_at on public.usage_events(user_id, created_at desc);

create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger trg_generations_updated_at
before update on public.generations
for each row execute function public.set_updated_at();

create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.uploads enable row level security;
alter table public.generations enable row level security;
alter table public.assets enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_events enable row level security;

create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

create policy "Users can view own uploads" on public.uploads
for select using (exists (select 1 from public.projects p where p.id = uploads.project_id and p.user_id = auth.uid()));
create policy "Users can insert own uploads" on public.uploads
for insert with check (exists (select 1 from public.projects p where p.id = uploads.project_id and p.user_id = auth.uid()));
create policy "Users can update own uploads" on public.uploads
for update using (exists (select 1 from public.projects p where p.id = uploads.project_id and p.user_id = auth.uid()));
create policy "Users can delete own uploads" on public.uploads
for delete using (exists (select 1 from public.projects p where p.id = uploads.project_id and p.user_id = auth.uid()));

create policy "Users can view own generations" on public.generations
for select using (exists (select 1 from public.projects p where p.id = generations.project_id and p.user_id = auth.uid()));
create policy "Users can insert own generations" on public.generations
for insert with check (exists (select 1 from public.projects p where p.id = generations.project_id and p.user_id = auth.uid()));
create policy "Users can update own generations" on public.generations
for update using (exists (select 1 from public.projects p where p.id = generations.project_id and p.user_id = auth.uid()));

create policy "Users can view own assets" on public.assets
for select using (
  exists (
    select 1
    from public.generations g
    join public.projects p on p.id = g.project_id
    where g.id = assets.generation_id and p.user_id = auth.uid()
  )
);

create policy "Users can manage own subscriptions" on public.subscriptions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can view own usage_events" on public.usage_events
for select using (auth.uid() = user_id);
create policy "Users can insert own usage_events" on public.usage_events
for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('project-uploads-raw', 'project-uploads-raw', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-uploads-normalized', 'project-uploads-normalized', true)
on conflict (id) do nothing;

create policy "Users can manage raw uploads"
on storage.objects
for all
using (bucket_id = 'project-uploads-raw' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'project-uploads-raw' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can manage normalized uploads"
on storage.objects
for all
using (bucket_id = 'project-uploads-normalized' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'project-uploads-normalized' and auth.uid()::text = (storage.foldername(name))[1]);
