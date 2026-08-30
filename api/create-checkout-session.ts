import express, { Request, Response, NextFunction } from "express";
import { getStripe, getSiteUrl } from "./_lib/stripe";
import { getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLAN_KEYS = ["counter", "kitchen"] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }
  next();
});

app.use(async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { intent, email, plan } = body;

  if (intent !== "new" && intent !== "upgrade") {
    return res.status(400).json({
      success: false,
      error: "intent must be 'new' or 'upgrade'.",
    });
  }

  if (typeof plan !== "string" || !PLAN_KEYS.includes(plan as any)) {
    return res.status(400).json({
      success: false,
      error: `plan must be one of: ${PLAN_KEYS.join(", ")}.`,
    });
  }

  // Read fresh on every request — never cache env-derived values at module
  // scope, since serverless/test environments can change env vars between
  // module load and request time
  const PLAN_PRICE_IDS: Record<string, string | undefined> = {
    counter: process.env.STRIPE_PRICE_ID_COUNTER,
    kitchen: process.env.STRIPE_PRICE_ID_KITCHEN,
  };

  const priceId = PLAN_PRICE_IDS[plan];
  if (!priceId) {
    return res.status(500).json({
      success: false,
      error: "Payments are not configured for this plan.",
    });
  }

  let customerEmail: string | undefined;
  let metadata: Record<string, string> = { intent, plan };
  let successUrl: string;
  let cancelUrl: string;

  try {
    const siteUrl = getSiteUrl();

    if (intent === "new") {
      if (isNonEmptyString(email) && EMAIL_PATTERN.test(email)) {
        customerEmail = email;
      }
      successUrl = `${siteUrl}/register?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${siteUrl}/trial/premium`;
    } else {
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
      customerEmail = user.email;
      metadata = { intent, plan, user_id: user.id };
      successUrl = `${siteUrl}/dashboard?upgraded=1&session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${siteUrl}/dashboard`;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });

    if (!session.url) {
      return res.status(502).json({
        success: false,
        error: "Could not start checkout session.",
      });
    }

    return res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: "Could not start checkout session.",
      details: err instanceof Error ? err.message : undefined,
    });
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