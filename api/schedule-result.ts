import express, { Request, Response, NextFunction } from "express";
import { timingSafeEqual } from "node:crypto";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "100kb" }));

function safeSecretMatch(received: string | undefined, expected: string | undefined): boolean {
  if (!received || !expected) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  next();
});

app.use(async (req: Request, res: Response) => {
  if (!safeSecretMatch(req.headers["x-servesync-webhook-secret"] as string | undefined, process.env.SCHEDULE_WEBHOOK_SECRET)) {
    return res.status(401).json({ success: false, error: "Invalid automation credentials." });
  }

  const { availability_id, user_id, week_start_date, schedule } = req.body ?? {};
  if (
    typeof availability_id !== "string" || typeof user_id !== "string" ||
    !validDate(week_start_date) ||
    !Array.isArray(schedule) || schedule.length > 500
  ) {
    return res.status(400).json({ success: false, error: "Invalid generated schedule payload." });
  }

  const supabase = getSupabaseAdmin();
  const { data: availability, error: availabilityError } = await supabase
    .from("staff_availability")
    .select("id, user_id, week_start_date")
    .eq("id", availability_id)
    .eq("user_id", user_id)
    .eq("week_start_date", week_start_date)
    .maybeSingle();

  if (availabilityError || !availability) {
    return res.status(404).json({ success: false, error: "Matching availability submission was not found." });
  }

  const { error: scheduleError } = await supabase
    .from("generated_schedules")
    .upsert({
      user_id,
      availability_id,
      week_start_date,
      schedule,
      status: "draft",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,week_start_date" });

  if (scheduleError) {
    return res.status(500).json({ success: false, error: "Could not save the generated schedule." });
  }

  await supabase.from("staff_availability")
    .update({ status: "generated", error_message: null })
    .eq("id", availability_id)
    .eq("user_id", user_id);

  return res.status(200).json({ success: true, message: "Generated schedule saved." });
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
