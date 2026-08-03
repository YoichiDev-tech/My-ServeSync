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

## Author

Yoichi dev