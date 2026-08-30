import Stripe from "stripe";

let cached: Stripe | null = null;

/** Returns a memoized Stripe client built from STRIPE_SECRET_KEY */
export function getStripe(): Stripe {
  if (cached) return cached;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY must be set.");
  }

  cached = new Stripe(secretKey);
  return cached;
}

/**
 * Base URL used to build Stripe success/cancel URLs. Read from an env var
 * rather than the incoming request's Host header, since the Host header is
 * attacker-controllable and Stripe URLs must be trustworthy
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("PUBLIC_SITE_URL must be set.");
  }
  return siteUrl.replace(/\/+$/, "");
}