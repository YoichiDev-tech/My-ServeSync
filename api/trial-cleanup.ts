import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

// Called by the client (useTrialLock) the moment it notices the signed-in
// user's trial has ended. This only ever deletes the caller's own account —
// it authenticates via the caller's own access token, never a user id from
// the request body. The scheduled sweep in cleanup-expired-trials.ts is
// what catches expired trials for people who never come back to trigger
// this endpoint themselves
app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authentication.",
    });
  }

  const admin = getSupabaseAdmin();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("trial_ends_at, subscription_status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ success: false, error: "Profile not found." });
  }

  if (profile.subscription_status === "active") {
    return res.status(200).json({ success: true, deleted: false });
  }

  if (!profile.trial_ends_at || new Date(profile.trial_ends_at) > new Date()) {
    return res.status(200).json({ success: true, deleted: false });
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return res.status(500).json({
      success: false,
      error: "Could not delete expired trial account.",
      details: deleteError.message,
    });
  }

  return res.status(200).json({ success: true, deleted: true });
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