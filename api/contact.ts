import express, { Request, Response, NextFunction } from "express";
import { Resend } from "resend";

export const app = express();

// Cap body size so oversized payloads are rejected before they even reach
// our validation logic
app.use(express.json({ limit: "10kb" }));

const MAX_LENGTH = {
  name: 100,
  email: 254,
  businessType: 100,
  message: 2000,
} as const;

// Simple, permissive email shape check — this is NOT trying to fully
// validate RFC 5322 email addresses (nothing short of sending a
// verification email actually does that). It just rejects obviously
// malformed input
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Only POST is allowed on this endpoint
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
  }
  next();
});

app.use(async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const { name, email, businessType, message } = body;

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(message)
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields.",
    });
  }

  if (businessType !== undefined && typeof businessType !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid business type.",
    });
  }

  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    message.length > MAX_LENGTH.message ||
    (typeof businessType === "string" &&
      businessType.length > MAX_LENGTH.businessType)
  ) {
    return res.status(400).json({
      success: false,
      error: "One or more fields exceed the maximum allowed length.",
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format.",
    });
  }

  // Read env vars per-request (not at module load) so a missing config
  // fails clearly at request time rather than crashing the whole function
  // on cold start
  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL;
  const fromAddress =
    process.env.CONTACT_FROM_EMAIL || "ServeSync <onboarding@resend.dev>";

  if (!apiKey || !toAddress) {
    return res.status(500).json({
      success: false,
      error: "Email service is not configured.",
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `New ServeSync inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Business type: ${businessType || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      return res.status(502).json({
        success: false,
        error: "Could not send message. Please try again later.",
      });
    }
  } catch {
    return res.status(502).json({
      success: false,
      error: "Could not send message. Please try again later.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Contact form received.",
  });
});

// Error-handling middleware — MUST be defined last, and MUST take 4
// arguments for Express to recognize it as an error handler. Without this,
// a malformed JSON body (bad request) crashes with Express's
// default HTML error page instead of JSON — which is exactly what broke
// the frontend's res.json() call and showed as "Something went wrong"
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON body.",
    });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request body too large.",
    });
  }
  // Never leak internals (stack traces, file paths) to the client
  return res.status(500).json({
    success: false,
    error: "Internal server error.",
  });
});

// Vercel-compatible handler
export default function handler(req: any, res: any) {
  return app(req, res);
}