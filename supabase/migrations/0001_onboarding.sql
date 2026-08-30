import express, { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin, getUserFromAuthHeader } from "./_lib/supabaseAdmin";
import { getStripe } from "./_lib/stripe";

export const app = express();
app.use(express.json({ limit: "10kb" }));

const TRIAL_LENGTH_MS = 14 * 24 * 60 * 60 * 1000;
const PAID_PLANS = ["counter", "kitchen"] as const;
type PaidPlan = (typeof PAID_PLANS)[number];

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

app.use(async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { plan, session_id: sessionId } = body;

  const isTrial = plan === "trial";
  const isPaid = PAID_PLANS.includes(plan);

  if (!isTrial && !isPaid) {
    return res.status(400).json({
      success: false,
      error: `plan must be 'trial' or one of: ${PAID_PLANS.join(", ")}.`,
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

  if (isTrial) {
    const { error: usageError } = await admin
      .from("trial_usage")
      .insert([{ email: normalizedEmail }]);

    if (usageError) {
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

  // isPaid: plan is "counter" or "kitchen"
  const paidPlan = plan as PaidPlan;

  if (typeof sessionId !== "string" || sessionId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "session_id is required to activate a paid account.",
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
    return res.status(403).json({
      success: false,
      error: "Payment session does not match this account's email.",
    });
  }

  // Cross-check the plan the client claims against what was actually paid
  // for, using the metadata set server-side in create-checkout-session —
  // never trust the client's own `plan` value alone for something that
  // grants access.
  const paidPlanFromSession = session.metadata?.plan;
  if (paidPlanFromSession !== paidPlan) {
    return res.status(403).json({
      success: false,
      error: "Requested plan does not match the completed payment.",
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
      subscription_plan: paidPlan,
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