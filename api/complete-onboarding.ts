import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";
import { getStripe } from "./_lib/stripe";

export const app = express();
app.use(express.json({ limit: "10kb" }));

const TRIAL_LENGTH_MS = 14 * 24 * 60 * 60 * 1000;

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

app.use(async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { plan, session_id: sessionId } = body;

  if (plan !== "trial" && plan !== "premium") {
    return res.status(400).json({
      success: false,
      error: "plan must be 'trial' or 'premium'.",
    });
  }

  const user = await getUserFromAuthHeader(req.headers.authorization);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authentication.",
    });
  }
  if (!user.email) {
    return res.status(400).json({
      success: false,
      error: "Account has no email on file.",
    });
  }

  const admin = getSupabaseAdmin();
  const normalizedEmail = user.email.trim().toLowerCase();

  if (plan === "trial") {
    // The trial_usage table has a primary key on email, so this insert is
    // the single source of truth for "has this email ever had a trial" —
    // it stays in place even after the trial account itself is deleted,
    // which is what actually enforces "no second trial"
    const { error: usageError } = await admin
      .from("trial_usage")
      .insert([{ email: normalizedEmail }]);

    if (usageError) {
      // Unique violation => this email already used its trial
      if (usageError.code === "23505") {
        return res.status(409).json({
          success: false,
          error: "This email has already used its free trial.",
        });
      }
      return res.status(500).json({
        success: false,
        error: "Could not start trial.",
        details: usageError.message,
      });
    }

    const start = new Date();
    const end = new Date(start.getTime() + TRIAL_LENGTH_MS);

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        trial_started_at: start.toISOString(),
        trial_ends_at: end.toISOString(),
        subscription_status: "trialing",
      })
      .eq("id", user.id);

    if (profileError) {
      return res.status(500).json({
        success: false,
        error: "Could not activate trial.",
        details: profileError.message,
      });
    }

    return res.status(200).json({
      success: true,
      trialEndsAt: end.toISOString(),
    });
  }

  // plan === "premium"
  if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "session_id is required to activate a premium account.",
    });
  }

  let session;
  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });
  } catch {
    return res.status(400).json({
      success: false,
      error: "Could not verify payment session.",
    });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return res.status(402).json({
      success: false,
      error: "Payment has not completed for this session.",
    });
  }

  const sessionEmail = session.customer_details?.email?.trim().toLowerCase();
  if (!sessionEmail || sessionEmail !== normalizedEmail) {
    // Prevents someone from reusing another shopper's session_id to unlock
    // premium on an unrelated account
    return res.status(403).json({
      success: false,
      error: "Payment session does not match this account's email.",
    });
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      subscription_status: "active",
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      stripe_subscription_id: subscriptionId,
      trial_started_at: null,
      trial_ends_at: null,
    })
    .eq("id", user.id);

  if (profileError) {
    return res.status(500).json({
      success: false,
      error: "Could not activate premium account.",
      details: profileError.message,
    });
  }

  return res.status(200).json({ success: true });
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