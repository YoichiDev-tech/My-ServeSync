import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });
  next();
});

app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({ success: false, error: "Missing or invalid authentication." });

  const { availability_id: availabilityId } = req.body ?? {};
  if (typeof availabilityId !== "string" || !/^[0-9a-f-]{36}$/i.test(availabilityId)) {
    return res.status(400).json({ success: false, error: "A valid availability_id is required." });
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
  const { data: submission, error } = await admin
    .from("staff_availability")
    .select("id, user_id, week_start_date, availability")
    .eq("id", availabilityId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !submission) {
    return res.status(404).json({ success: false, error: "Availability submission not found." });
  }

  await admin.from("staff_availability")
    .update({ status: "processing", error_message: null })
    .eq("id", submission.id)
    .eq("user_id", user.id);

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
        regeneration: true,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Automation returned a non-success response.");
    return res.status(202).json({ success: true, message: "Schedule regeneration requested." });
  } catch {
    await admin.from("staff_availability")
      .update({ status: "failed", error_message: "Automation request failed." })
      .eq("id", submission.id)
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
