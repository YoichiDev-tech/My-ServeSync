-- ServeSync scheduling pipeline: availability submissions and generated weekly schedules.
-- Apply this migration in the Supabase SQL editor or your migration runner.

create table if not exists public.staff_availability (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start_date date not null,
  availability jsonb not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'processing', 'generated', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists staff_availability_user_week_idx
  on public.staff_availability (user_id, week_start_date desc);

create table if not exists public.generated_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  availability_id uuid references public.staff_availability(id) on delete set null,
  week_start_date date not null,
  schedule jsonb not null,
  status text not null default 'published'
    check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

create index if not exists generated_schedules_user_week_idx
  on public.generated_schedules (user_id, week_start_date desc);

alter table public.staff_availability enable row level security;
alter table public.generated_schedules enable row level security;

drop policy if exists "Users can read their own staff availability" on public.staff_availability;
create policy "Users can read their own staff availability"
  on public.staff_availability for select
  using (auth.uid() = user_id);

drop policy if exists "Users can read their own generated schedules" on public.generated_schedules;
create policy "Users can read their own generated schedules"
  on public.generated_schedules for select
  using (auth.uid() = user_id);

-- Writes are performed by authenticated server endpoints using the Supabase
-- service-role client after validating the user's access token or flow secret.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in browser code.
