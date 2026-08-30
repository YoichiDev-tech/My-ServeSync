# Overview (architecture)

ServeSync uses: 
- `Express` for routing and middleware
- `Vercel serverless functions` as the execution environment 
- `Supabase` for database + authentication
- `Resend` for transactional email
- `TypeScript` for type safety

## How the API works

- Create an Express app
- Add middleware (JSON parsing, validation, error handling)
- Define a POST handler
- Export a vercel-compatible handler function

Which ensures:
- Consistent structure across all endpoints
- Isolated serverless execution
- Automatic routing based on filenames
- Easy addition of new API routes
- Predictable error handling and validation

## Authentication

The backend uses the user's ID to:
- Associate data with the correct manager
- Enforce multi‑tenant isolation
- Comply with supabase RLS
- Ensure each manager only accesses their own staff and scheduling data
## Endpoints

api/contact handles form submission and:
- Validates input
- Enforces max lengths
- Sends email via resend
- Returns JSON success/error response

api/staff-create develops a new staff member authenticated and:
- Validates required fields
- Enforces max lengths
- Extracts `x-user-id` from headers
- Inserts into supabase with correct user_id
- Returns JSON success/error response

## Onboarding & billing

api/create-checkout-session starts a Stripe Checkout session:
- `intent: "new"` — guest checkout ahead of account creation (from `/trial/premium`), no auth required
- `intent: "upgrade"` — for an already-authenticated trial user (from `/subscribe`); resolves the user from the `Authorization: Bearer <token>` header, never from the request body

api/complete-onboarding finalizes a freshly-registered account, called from `/register` right after sign-up:
- `plan: "trial"` — inserts the user's email into the permanent `trial_usage` ledger (409 if already present, which is what enforces "no second trial" even after an account is deleted) and sets `trial_started_at` / `trial_ends_at` (+14 days) / `subscription_status: "trialing"`
- `plan: "premium"` — verifies the given Stripe `session_id` is paid and that the session's email matches the account's email, then sets `subscription_status: "active"`
- Also used by `/dashboard` to finalize an in-app upgrade (`plan: "premium"` with the session_id from the upgrade redirect)

api/trial-cleanup — called reactively by the client (`useTrialLock`) the moment it notices the signed-in user's trial has ended:
- Authenticates via the caller's own access token and only ever deletes that caller's own account
- Re-checks expiration server-side before deleting anything
- No-ops for `subscription_status: "active"` accounts

api/cleanup-expired-trials — scheduled sweep (see `vercel.json` → `crons`) for expired trial accounts that never come back to trigger `trial-cleanup` themselves:
- Requires `Authorization: Bearer ${CRON_SECRET}`
- Deletes every profile with `subscription_status: "trialing"` and `trial_ends_at` in the past

None of the trial/subscription fields on `profiles` are writable by the client — see `supabase/migrations/0001_onboarding.sql` for the RLS policy that enforces this. All writes to those fields go through the endpoints above using the service-role key.

## Author

Yoichi dev