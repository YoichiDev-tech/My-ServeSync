import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed." });
  next();
});

app.use(async (req: Request, res: Response) => {
  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({ success: false, error: "Missing or invalid authentication." });

  const { data, error } = await getSupabaseAdmin()
    .from("staff")
    .select("id, name, role, contact_email, contact_phone, hourly_rate, max_weekly_hours, status, preferred_shift_type, notes")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) return res.status(500).json({ success: false, error: "Could not load staff members." });
  return res.status(200).json({ success: true, staff: data ?? [] });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  return res.status(500).json({ success: false, error: "Internal server error." });
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
