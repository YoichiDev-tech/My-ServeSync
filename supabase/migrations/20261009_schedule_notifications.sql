alter table public.generated_schedules
  add column if not exists notification_sent_at timestamptz;
