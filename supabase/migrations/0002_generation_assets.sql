alter table public.generations
  alter column status set default 'queued';

alter table public.generations
  drop constraint if exists generations_project_id_key;

create index if not exists idx_generations_project_id_created_at on public.generations(project_id, created_at desc);
create index if not exists idx_generations_status on public.generations(status);

insert into storage.buckets (id, name, public)
values ('launchpix-assets', 'launchpix-assets', true)
on conflict (id) do nothing;

create policy "Users can manage launchpix assets"
on storage.objects
for all
using (bucket_id = 'launchpix-assets' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'launchpix-assets' and auth.uid()::text = (storage.foldername(name))[1]);
