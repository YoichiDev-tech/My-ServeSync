import express, { Request, Response, NextFunction } from "express";
import { Resend } from "resend";
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

  const { schedule_id: scheduleId } = req.body ?? {};
  if (typeof scheduleId !== "string" || scheduleId.trim().length === 0) {
    return res.status(400).json({ success: false, error: "schedule_id is required." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.SCHEDULE_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "ServeSync <onboarding@resend.dev>";
  if (!apiKey) {
    return res.status(503).json({ success: false, error: "Team notifications are not configured yet." });
  }

  const admin = getSupabaseAdmin();
  const { data: schedule, error: scheduleError } = await admin
    .from("generated_schedules")
    .select("id, week_start_date, schedule, status, notification_sent_at")
    .eq("id", scheduleId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (scheduleError || !schedule) {
    return res.status(404).json({ success: false, error: "Schedule not found." });
  }
  if (schedule.status === "published" && schedule.notification_sent_at) {
    return res.status(200).json({ success: true, message: "This schedule is already published and the team was notified." });
  }

  const { data: staff, error: staffError } = await admin
    .from("staff")
    .select("name, contact_email")
    .eq("user_id", user.id)
    .not("contact_email", "is", null);

  if (staffError) return res.status(500).json({ success: false, error: "Could not load staff notification recipients." });
  const recipients = (staff ?? []).filter((person: any) =>
    typeof person.contact_email === "string" && person.contact_email.trim().length > 0
  );
  if (recipients.length === 0) {
    return res.status(409).json({
      success: false,
      error: "Add staff contact email addresses before publishing so ServeSync can notify the team.",
    });
  }

  const resend = new Resend(apiKey);
  const scheduleText = JSON.stringify(schedule.schedule, null, 2);
  const deliveryResults = await Promise.all(recipients.map(async (person: any) => {
    try {
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: person.contact_email,
        subject: `ServeSync: schedule for week of ${schedule.week_start_date}`,
        text: [
          `Hi ${person.name || "there"},`,
          "",
          `The schedule for the week starting ${schedule.week_start_date} has been published.`,
          "",
          "Schedule details:",
          scheduleText,
          "",
          "Sent by ServeSync.",
        ].join("\n"),
      });
      return !error;
    } catch {
      return false;
    }
  }));

  const sentCount = deliveryResults.filter(Boolean).length;
  if (sentCount !== recipients.length) {
    return res.status(502).json({
      success: false,
      error: `Only ${sentCount} of ${recipients.length} staff notifications were sent. Retry after checking the email configuration.`,
    });
  }

  const now = new Date().toISOString();
  const { error: updateError } = await admin
    .from("generated_schedules")
    .update({ status: "published", notification_sent_at: now, updated_at: now })
    .eq("id", scheduleId)
    .eq("user_id", user.id);

  if (updateError) {
    return res.status(500).json({
      success: false,
      error: "Staff were notified, but ServeSync could not mark the schedule as published. Refresh before retrying.",
    });
  }

  return res.status(200).json({
    success: true,
    message: `Schedule published and ${sentCount} staff member(s) notified.`,
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
