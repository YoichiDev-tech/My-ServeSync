import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "25kb" }));

type AvailabilitySlot = { day: string; start: string; end: string };
const DAYS = new Set(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && parsed.getUTCDay() === 1;
}

function isAvailability(value: unknown): value is AvailabilitySlot[] {
  return Array.isArray(value) && value.length > 0 && value.length <= 21 &&
    value.every((slot) =>
      slot && typeof slot === "object" &&
      typeof slot.day === "string" && DAYS.has(slot.day.toLowerCase()) &&
      typeof slot.start === "string" && TIME.test(slot.start) &&
      typeof slot.end === "string" && TIME.test(slot.end) &&
      slot.start < slot.end
    );
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  next();
});

app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({ success: false, error: "Missing or invalid authentication." });

  const { staff_id: staffId, week_start_date: weekStartDate, availability } = req.body ?? {};
  if (typeof staffId !== "string" || !UUID.test(staffId) || !validDate(weekStartDate) || !isAvailability(availability)) {
    return res.status(400).json({
      success: false,
      error: "Provide a valid staff_id, a Monday week_start_date (YYYY-MM-DD), and availability slots with day, start, and end.",
    });
  }

  const supabase = getSupabaseAdmin();
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select("id")
    .eq("id", staffId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (staffError || !staff) {
    return res.status(404).json({ success: false, error: "Staff member not found for this account." });
  }

  const { data, error } = await supabase
    .from("staff_availability")
    .upsert({
      user_id: user.id,
      staff_id: staffId,
      week_start_date: weekStartDate,
      availability: availability.map((slot: AvailabilitySlot) => ({
        day: slot.day.toLowerCase(), start: slot.start, end: slot.end,
      })),
      status: "submitted",
      error_message: null,
    }, { onConflict: "user_id,staff_id,week_start_date" })
    .select("id")
    .single();

  if (error || !data) {
    return res.status(500).json({ success: false, error: "Could not save staff availability." });
  }

  return res.status(200).json({
    success: true,
    availability_id: data.id,
    message: "Availability saved. Enter availability for the rest of the team, then generate the weekly schedule.",
  });
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
