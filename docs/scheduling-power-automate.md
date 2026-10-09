# ServeSync scheduling: Power Automate setup

ServeSync's scheduling feature intentionally delegates schedule generation to Microsoft Power Automate. The repository provides authenticated staff availability intake, persistence, generation triggers, callback validation, schedule review/publishing, and staff notifications. The actual flow must be created in the connected Microsoft account.

## Required environment variables

Configure these in the server environment (Vercel project settings), never in frontend variables prefixed with VITE_:

- POWER_AUTOMATE_WEBHOOK_URL: HTTPS URL for the flow's "When an HTTP request is received" trigger.
- SCHEDULE_WEBHOOK_SECRET: long random shared secret. Configure the same value in the flow's callback action.
- PUBLIC_SITE_URL: deployed ServeSync origin, used to construct the callback URL.
- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY: existing server-only Supabase credentials.
- RESEND_API_KEY and optionally SCHEDULE_FROM_EMAIL (or existing CONTACT_FROM_EMAIL): required for manager publication notifications.

## Database setup

Apply these migrations in order:

1. supabase/migrations/20261009_scheduling_pipeline.sql
2. supabase/migrations/20261009_schedule_notifications.sql

The existing public.staff table must already exist. Availability is stored per staff member and week. Both new tables enable RLS; users can only read rows whose user_id matches auth.uid(). Server writes use the service-role client only after validating a user token or the shared flow secret.

## Flow contract

1. Create a Power Automate cloud flow with the HTTP request trigger. The trigger receives:
   - user_id (UUID for the restaurant account)
   - week_start_date (Monday, YYYY-MM-DD)
   - availability_ids (array of submission UUIDs)
   - availability_submissions (array of objects with id, staff_id, week_start_date, and availability)
   - callback_url (ServeSync callback endpoint)
   - regeneration (boolean)
2. Copy the trigger's HTTPS URL into POWER_AUTOMATE_WEBHOOK_URL.
3. The trigger receives the x-servesync-webhook-secret header. Configure the flow to validate this shared secret before processing any payload. Do not log or expose the secret.
4. Generate the schedule using the complete availability_submissions array for the requested week. Each staff submission includes availability slots with day, start, and end. The generated output should be a JSON array of shift objects with a staff identifier/name, day, start time, and end time. Do not generate separate partial schedules from each individual staff submission.
5. POST the result to callback_url with header x-servesync-webhook-secret: <SCHEDULE_WEBHOOK_SECRET> and JSON body:

    {
      "availability_ids": ["the-original-availability-id-1", "the-original-availability-id-2"],
      "user_id": "the-original-user-id",
      "week_start_date": "2026-10-12",
      "schedule": [
        { "staff_name": "Example", "day": "monday", "start": "09:00", "end": "17:00" }
      ]
    }

6. The callback validates the shared secret and verifies that every supplied availability ID belongs to the supplied user and week before saving the result as a draft.
7. The manager reviews the draft in Dashboard → Scheduling and publishes it. ServeSync sends each staff member with a saved contact email a notification through Resend, then marks the schedule published.

## Endpoints

- POST /api/staff-create: requires Authorization: Bearer <Supabase access token>; creates a staff record owned by the verified user.
- GET /api/staff-list: requires Authorization: Bearer <Supabase access token>; returns the current user's team.
- POST /api/schedule-availability: requires Authorization: Bearer <Supabase access token>; upserts one staff member's availability for a Monday-starting week.
- POST /api/schedule-regenerate: requires Authorization: Bearer <Supabase access token> and { "week_start_date": "YYYY-MM-DD" }; sends all saved availability for that user/week to Power Automate.
- POST /api/schedule-result: requires x-servesync-webhook-secret; stores a generated draft schedule.
- GET /api/schedule-list: requires Authorization: Bearer <Supabase access token>; returns the current user's latest schedules.
- POST /api/schedule-publish: requires Authorization: Bearer <Supabase access token> and { "schedule_id": "..." }; publishes a draft and notifies staff.

## Verification checklist

- Apply the SQL migrations before testing.
- Add staff members with valid contact email addresses.
- Save availability for at least one staff member, then request generation for that week.
- Confirm the flow run is triggered and sees all availability submissions for that week.
- Confirm an invalid/missing user token returns 401.
- Confirm an incorrect callback secret returns 401.
- Confirm the callback refuses availability IDs belonging to another user or week.
- Confirm a valid callback creates a draft visible only to the owning user.
- Confirm staff with email addresses receive the publication notification.
- Confirm missing flow or Resend configuration returns a clear error rather than claiming the workflow succeeded.
