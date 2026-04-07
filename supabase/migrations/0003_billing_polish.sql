alter table public.subscriptions
  add column if not exists provider_reference text,
  add column if not exists last_payment_at timestamptz,
  add column if not exists renewal_due_at timestamptz;

create index if not exists idx_subscriptions_plan_status on public.subscriptions(plan, status);
create index if not exists idx_usage_events_event_type on public.usage_events(event_type);
