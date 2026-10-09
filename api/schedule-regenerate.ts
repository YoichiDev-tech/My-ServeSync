import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

function validMonday(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value && parsed.getUTCDay() === 1;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  next();
});

app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({ success: false, error: "Missing or invalid authentication." });

  const { week_start_date: weekStartDate } = req.body ?? {};
  if (!validMonday(weekStartDate)) {
    return res.status(400).json({ success: false, error: "week_start_date must be a valid Monday in YYYY-MM-DD format." });
  }

  const flowUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL;
  const flowSecret = process.env.SCHEDULE_WEBHOOK_SECRET;
  if (!flowUrl || !flowSecret) {
    return res.status(503).json({ success: false, error: "Scheduling automation is not configured yet." });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(flowUrl);
  } catch {
    return res.status(500).json({ success: false, error: "Scheduling automation URL is invalid." });
  }
  if (parsedUrl.protocol !== "https:") {
    return res.status(500).json({ success: false, error: "Scheduling automation must use HTTPS." });
  }

  const admin = getSupabaseAdmin();
  const { data: submissions, error } = await admin
    .from("staff_availability")
    .select("id, staff_id, week_start_date, availability")
    .eq("user_id", user.id)
    .eq("week_start_date", weekStartDate)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ success: false, error: "Could not load staff availability." });
  if (!submissions || submissions.length === 0) {
    return res.status(409).json({ success: false, error: "Save availability for at least one staff member before generating a schedule." });
  }

  const ids = submissions.map((item: any) => item.id);
  await admin.from("staff_availability")
    .update({ status: "processing", error_message: null })
    .in("id", ids)
    .eq("user_id", user.id);

  try {
    const response = await fetch(flowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-servesync-webhook-secret": flowSecret,
      },
      body: JSON.stringify({
        user_id: user.id,
        week_start_date: weekStartDate,
        availability_ids: ids,
        availability_submissions: submissions,
        callback_url: `${process.env.PUBLIC_SITE_URL?.replace(/\/+$/, "")}/api/schedule-result`,
        regeneration: true,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Automation returned a non-success response.");
    return res.status(202).json({ success: true, message: "Weekly schedule generation requested." });
  } catch {
    await admin.from("staff_availability")
      .update({ status: "failed", error_message: "Automation request failed." })
      .in("id", ids)
      .eq("user_id", user.id);
    return res.status(502).json({ success: false, error: "Could not reach scheduling automation." });
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
