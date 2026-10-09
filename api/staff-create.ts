import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

const MAX_LENGTHS = {
  name: 100,
  role: 100,
  hourly_rate: 9999,
  max_weekly_hours: 168,
  contact_email: 254,
  contact_phone: 50,
  preferred_shift_type: 100,
  notes: 2000,
} as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: "Missing or invalid authentication." });
  }

  const body = req.body ?? {};
  const {
    name, role, hourly_rate, max_weekly_hours, contact_email, contact_phone,
    status, preferred_shift_type, notes,
  } = body;

  if (
    !isNonEmptyString(name) || !isNonEmptyString(role) ||
    typeof hourly_rate !== "number" || !Number.isFinite(hourly_rate) ||
    typeof max_weekly_hours !== "number" || !Number.isFinite(max_weekly_hours)
  ) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  if (
    hourly_rate < 0 || hourly_rate > MAX_LENGTHS.hourly_rate ||
    max_weekly_hours < 0 || max_weekly_hours > MAX_LENGTHS.max_weekly_hours
  ) {
    return res.status(400).json({
      success: false,
      error: "hourly_rate or max_weekly_hours is out of the allowed range.",
    });
  }

  if (
    name.length > MAX_LENGTHS.name || role.length > MAX_LENGTHS.role ||
    (isNonEmptyString(contact_email) && contact_email.length > MAX_LENGTHS.contact_email) ||
    (isNonEmptyString(contact_phone) && contact_phone.length > MAX_LENGTHS.contact_phone) ||
    (isNonEmptyString(preferred_shift_type) && preferred_shift_type.length > MAX_LENGTHS.preferred_shift_type) ||
    (isNonEmptyString(notes) && notes.length > MAX_LENGTHS.notes)
  ) {
    return res.status(400).json({
      success: false,
      error: "One or more fields exceed maximum allowed length.",
    });
  }

  if (status !== undefined && status !== "active" && status !== "inactive") {
    return res.status(400).json({ success: false, error: "status must be active or inactive." });
  }

  const { error } = await getSupabaseAdmin().from("staff").insert({
    user_id: user.id,
    name: name.trim(),
    role: role.trim(),
    hourly_rate,
    max_weekly_hours,
    contact_email: isNonEmptyString(contact_email) ? contact_email.trim() : null,
    contact_phone: isNonEmptyString(contact_phone) ? contact_phone.trim() : null,
    status: status || "active",
    preferred_shift_type: isNonEmptyString(preferred_shift_type) ? preferred_shift_type.trim() : null,
    notes: isNonEmptyString(notes) ? notes.trim() : null,
  });

  if (error) {
    return res.status(500).json({ success: false, error: "Could not create staff member." });
  }

  return res.status(201).json({ success: true, message: "Staff member created successfully." });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ success: false, error: "Invalid JSON body." });
  }
  return res.status(500).json({ success: false, error: "Internal server error." });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
