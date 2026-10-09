import express, { Request, Response, NextFunction } from "express";
import { getStripe, getSiteUrl } from "./_lib/stripe";
import { getUserFromAuthHeader } from "./_lib/supabaseAdmin";

export const app = express();
app.use(express.json({ limit: "10kb" }));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLAN_KEYS = ["counter", "kitchen"] as const;
const CURRENCIES = ["usd", "eur", "gbp"] as const;
type PlanKey = (typeof PLAN_KEYS)[number];
type Currency = (typeof CURRENCIES)[number];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getPriceId(plan: PlanKey, currency: Currency): string | undefined {
  const envNames: Record<PlanKey, Record<Currency, string>> = {
    counter: {
      usd: "STRIPE_PRICE_ID_COUNTER",
      eur: "STRIPE_PRICE_ID_COUNTER_EUR",
      gbp: "STRIPE_PRICE_ID_COUNTER_GBP",
    },
    kitchen: {
      usd: "STRIPE_PRICE_ID_KITCHEN",
      eur: "STRIPE_PRICE_ID_KITCHEN_EUR",
      gbp: "STRIPE_PRICE_ID_KITCHEN_GBP",
    },
  };
  return process.env[envNames[plan][currency]];
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
  const rawCurrency = typeof body.currency === "string" ? body.currency.toLowerCase() : "usd";

  if (intent !== "new" && intent !== "upgrade") {
    return res.status(400).json({ success: false, error: "intent must be 'new' or 'upgrade'." });
  }
  if (typeof plan !== "string" || !PLAN_KEYS.includes(plan as PlanKey)) {
    return res.status(400).json({ success: false, error: `plan must be one of: ${PLAN_KEYS.join(", ")}.` });
  }
  if (!CURRENCIES.includes(rawCurrency as Currency)) {
    return res.status(400).json({ success: false, error: "currency must be usd, eur, or gbp." });
  }

  const currency = rawCurrency as Currency;
  const priceId = getPriceId(plan as PlanKey, currency);
  if (!priceId) {
    return res.status(503).json({
      success: false,
      error: `Checkout is not configured for ${currency.toUpperCase()} yet. Please choose another currency or contact ServeSync.`,
    });
  }

  let customerEmail: string | undefined;
  let metadata: Record<string, string> = { intent, plan, currency };
  let successUrl: string;
  let cancelUrl: string;

  try {
    const siteUrl = getSiteUrl();

    if (intent === "new") {
      if (isNonEmptyString(email) && EMAIL_PATTERN.test(email)) customerEmail = email;
      successUrl = `${siteUrl}/register?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`;
      cancelUrl = `${siteUrl}/trial/premium`;
    } else {
      const user = await getUserFromAuthHeader(req.headers.authorization);
      if (!user) {
        return res.status(401).json({ success: false, error: "Missing or invalid authentication." });
      }
      if (!user.email) {
        return res.status(400).json({ success: false, error: "Account has no email on file." });
      }
      customerEmail = user.email;
      metadata = { intent, plan, currency, user_id: user.id };
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
      return res.status(502).json({ success: false, error: "Could not start checkout session." });
    }
    return res.status(200).json({ success: true, url: session.url });
  } catch {
    return res.status(502).json({ success: false, error: "Could not start checkout session." });
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
