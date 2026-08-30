import { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";

export default function TrialPremium() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [email, setEmail] = useState("");

  async function handlePayment() {
    setStatus("loading");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "new", email: email || undefined }),
      });

      const data = await res.json();

      if (!data.success || !data.url) {
        setStatus("error");
        return;
      }

      // Stripe hosts the actual card entry. On success it redirects back
      // to /register?plan=premium&session_id=..., which is verified
      // server-side in api/complete-onboarding.ts before any account is
      // marked premium.
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Go Premium</h1>

        <p className="text-lg text-espresso/80">
          Subscribe now for full access to ServeSync — no trial needed.
          You'll create your account right after payment.
        </p>

        <input
          type="email"
          placeholder="Email (optional, pre-fills checkout)"
          className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="button"
          onClick={handlePayment}
          disabled={status === "loading"}
          className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit disabled:opacity-60"
        >
          {status === "loading" ? "Redirecting to payment…" : "Proceed to Payment"}
        </button>

        {status === "error" && (
          <p className="text-red-600">
            Something went wrong starting checkout. Please try again.
          </p>
        )}

      </div>
    </SectionWrapper>
  );
}