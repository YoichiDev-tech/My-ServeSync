-- Onboarding system: trial + premium signup, expiration, and cleanup.
-- Run this against your Supabase project (SQL editor or `supabase db push`).

-- 1. Extra columns on profiles ------------------------------------------------
alter table public.profiles
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists subscription_status text not null default 'none',
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

alter table public.profiles
  add constraint profiles_subscription_status_check
  check (subscription_status in ('none', 'trialing', 'active'));

-- profiles.id should already reference auth.users(id) with
-- `on delete cascade`, so deleting the auth user (see api/trial-cleanup.ts
-- and api/cleanup-expired-trials.ts) automatically removes the profile row.
-- If that FK isn't in place yet:
-- alter table public.profiles
--   add constraint profiles_id_fkey
--   foreign key (id) references auth.users(id) on delete cascade;

-- 2. Permanent trial ledger ---------------------------------------------------
-- Keyed by email (not user id) and never deleted, even when the trial
-- account itself is removed. This is what actually enforces "no user can
-- start a second trial" across account deletion/re-registration.
create table if not exists public.trial_usage (
  email text primary key,
  used_at timestamptz not null default now()
);

-- 3. Row Level Security --------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.trial_usage enable row level security;

-- Users may read their own profile row...
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = id);

-- ...but trial/subscription fields are only ever written by server code
-- using the service-role key (which bypasses RLS entirely), so there is
-- intentionally no client-facing UPDATE policy for trial_started_at,
-- trial_ends_at, or subscription_status. This closes the gap where a
-- signed-in user could otherwise call `supabase.from('profiles').update(...)`
-- directly from the browser and grant themselves an active subscription.

-- trial_usage is never read or written by client code at all — only by
-- api/complete-onboarding.ts via the service-role key — so no client
-- policies are defined for it (RLS with zero policies denies all access
-- from the anon/authenticated roles by default).
