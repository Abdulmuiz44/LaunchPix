alter table public.subscriptions
  alter column credits_remaining set default 300;

update public.subscriptions
set
  plan = 'credits',
  status = 'active',
  credits_remaining = greatest(coalesce(credits_remaining, 0), 300),
  provider = coalesce(provider, 'lemon_squeezy'),
  updated_at = now()
where credits_remaining is null
   or credits_remaining < 300
   or plan is distinct from 'credits';

