import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "25kb" }));

type AvailabilitySlot = { day: string; start: string; end: string };
const DAYS = new Set(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
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

  const { week_start_date, availability } = req.body ?? {};
  if (!validDate(week_start_date) || !isAvailability(availability)) {
    return res.status(400).json({
      success: false,
      error: "Provide a valid week_start_date (YYYY-MM-DD) and at least one availability slot with day, start, and end.",
    });
  }

  const flowUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
  const flowSecret = process.env.SCHEDULE_WEBHOOK_SECRET;
  if (!flowUrl || !flowSecret) {
    return res.status(503).json({
      success: false,
      error: "Scheduling automation is not configured yet. Please contact your ServeSync administrator.",
    });
  }

  let parsedFlowUrl: URL;
  try {
    parsedFlowUrl = new URL(flowUrl);
  } catch {
    return res.status(500).json({ success: false, error: "Scheduling automation URL is invalid." });
  }
  if (parsedFlowUrl.protocol !== "https:") {
    return res.status(500).json({ success: false, error: "Scheduling automation must use HTTPS." });
  }

  const supabase = getSupabaseAdmin();
  const { data: submission, error: insertError } = await supabase
    .from("staff_availability")
    .insert({
      user_id: user.id,
      week_start_date,
      availability: availability.map((slot: AvailabilitySlot) => ({
        day: slot.day.toLowerCase(), start: slot.start, end: slot.end,
      })),
      status: "processing",
    })
    .select("id, user_id, week_start_date, availability")
    .single();

  if (insertError || !submission) {
    return res.status(500).json({ success: false, error: "Could not save staff availability." });
  }

  try {
    const response = await fetch(flowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-servesync-webhook-secret": flowSecret,
      },
      body: JSON.stringify({
        availability_id: submission.id,
        user_id: submission.user_id,
        week_start_date: submission.week_start_date,
        availability: submission.availability,
        callback_url: `${process.env.PUBLIC_SITE_URL?.replace(/\/+$/, "")}/api/schedule-result`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error("Automation returned a non-success response.");
    return res.status(202).json({
      success: true,
      message: "Availability submitted. ServeSync will show the generated schedule when the automation finishes.",
      availability_id: submission.id,
    });
  } catch {
    await supabase.from("staff_availability")
      .update({ status: "failed", error_message: "Automation request failed." })
      .eq("id", submission.id)
      .eq("user_id", user.id);
    return res.status(502).json({ success: false, error: "Availability was saved, but scheduling automation could not be reached." });
  }
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
