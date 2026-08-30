import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin } from "./_lib/supabaseAdmin";

export const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

// Vercel Cron calls this on a schedule (see vercel.json) and automatically
// sends `Authorization: Bearer ${CRON_SECRET}`. Reject anything else so
// this destructive endpoint can't be triggered by an outside request
app.use((req: Request, res: Response, next: NextFunction) => {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, error: "Unauthorized." });
  }
  next();
});

app.use(async (_req: Request, res: Response) => {
  const admin = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data: expired, error: queryError } = await admin
    .from("profiles")
    .select("id")
    .eq("subscription_status", "trialing")
    .lt("trial_ends_at", nowIso);

  if (queryError) {
    return res.status(500).json({
      success: false,
      error: "Could not query expired trials.",
      details: queryError.message,
    });
  }

  const ids = (expired ?? []).map((row: { id: string }) => row.id);
  const failures: string[] = [];

  for (const id of ids) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(id);
    if (deleteError) failures.push(id);
  }

  return res.status(200).json({
    success: failures.length === 0,
    deleted: ids.length - failures.length,
    failed: failures.length,
  });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}