# ServeSync scheduling: Power Automate setup

ServeSync's scheduling feature intentionally delegates schedule generation to Microsoft Power Automate. The repository provides the authenticated intake endpoint, persistence, callback endpoint, and manager UI; the actual flow must be created in the connected Microsoft account.

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

Both tables enable RLS. User access is scoped by auth.uid() = user_id; server writes use the service-role client only after validating a user token or the shared flow secret.

## Flow contract

1. Create a Power Automate cloud flow with the HTTP request trigger. Use a request schema that accepts:
   - availability_id (UUID)
   - user_id (UUID)
   - week_start_date (YYYY-MM-DD)
   - availability (array of { day, start, end })
   - callback_url (ServeSync callback endpoint)
2. Copy the trigger's HTTPS URL into POWER_AUTOMATE_WEBHOOK_URL.
3. The trigger receives the x-servesync-webhook-secret header. Configure the flow to validate this shared secret before processing any payload. Do not log or expose the secret.
4. Implement the schedule-generation actions in the flow. Use the availability payload as input and produce a JSON array of shift objects. Each shift should include enough information for a manager to understand who is assigned, the day, start time, and end time.
5. POST the result to the supplied callback_url with header x-servesync-webhook-secret: <SCHEDULE_WEBHOOK_SECRET> and JSON body:

    {
      "availability_id": "the-original-availability-id",
      "user_id": "the-original-user-id",
      "week_start_date": "2026-10-12",
      "schedule": [
        { "staff_name": "Example", "day": "monday", "start": "09:00", "end": "17:00" }
      ]
    }

6. The callback validates the shared secret and confirms the availability record belongs to the supplied user before upserting a draft schedule. The manager reviews the draft in Dashboard → Scheduling.
7. The manager publishes the schedule. ServeSync sends each staff member with a saved contact email a notification through Resend, then marks the schedule published.

## Endpoints

- POST /api/schedule-availability: requires Authorization: Bearer <Supabase access token>; stores availability and triggers the flow.
- POST /api/schedule-result: requires x-servesync-webhook-secret; stores a generated draft schedule.
- GET /api/schedule-list: requires Authorization: Bearer <Supabase access token>; returns the current user's latest schedules.
- POST /api/schedule-publish: requires Authorization: Bearer <Supabase access token> and { "schedule_id": "..." }; publishes a draft and notifies staff.

## Verification checklist

- Submit availability while signed in and confirm the flow run is triggered.
- Confirm an invalid/missing user token returns 401.
- Confirm an incorrect callback secret returns 401.
- Confirm the callback refuses an availability ID that belongs to another user.
- Confirm a valid callback creates a draft visible only to the owning user.
- Confirm staff with email addresses receive the publish notification.
- Confirm missing flow or Resend configuration returns a clear error rather than claiming the workflow succeeded.
