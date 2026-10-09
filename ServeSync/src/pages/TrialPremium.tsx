import { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";

type PlanKey = "counter" | "kitchen";
type Currency = "usd" | "eur" | "gbp";

const PLANS: { key: PlanKey; name: string; price: string; audience: string }[] = [
  { key: "counter", name: "Counter", price: "$39/mo", audience: "Family restaurants & single-site cafés" },
  { key: "kitchen", name: "Kitchen", price: "$99/mo", audience: "Full-service restaurants & QSR" },
];

const CURRENCIES: { key: Currency; label: string }[] = [
  { key: "usd", label: "USD — US Dollar" },
  { key: "eur", label: "EUR — Euro" },
  { key: "gbp", label: "GBP — British Pound" },
];

export default function TrialPremium() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("counter");
  const [currency, setCurrency] = useState<Currency>("usd");

  async function handlePayment() {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "new",
          plan: selectedPlan,
          currency,
          email: email || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success || !data.url) {
        setErrorMessage(data.error || "Something went wrong starting checkout. Please try again.");
        setStatus("error");
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMessage("We couldn't reach checkout. Please check your connection and try again.");
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

        <div className="grid grid-cols-2 gap-3">
          {PLANS.map((p) => (
            <button
              type="button"
              key={p.key}
              onClick={() => setSelectedPlan(p.key)}
              aria-pressed={selectedPlan === p.key}
              className={`text-left p-4 rounded-md border transition ${
                selectedPlan === p.key
                  ? "border-ember ring-2 ring-ember bg-ember/5"
                  : "border-espresso/25 hover:border-espresso/50"
              }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="font-mono text-lg">{currency === "usd" ? p.price : "Price shown at checkout"}</div>
              <div className="text-xs text-espresso/60 mt-1">{p.audience}</div>
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Billing currency
          <select
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            {CURRENCIES.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>
        <p className="text-xs text-espresso/65">
          EUR and GBP checkout are available when the matching Stripe prices are configured.
          The final recurring amount is always shown by Stripe before you pay.
        </p>

        <input
          type="email"
          placeholder="Email (optional, pre-fills checkout)"
          aria-label="Email address (optional)"
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

        {status === "error" && <p role="alert" className="text-red-600">{errorMessage}</p>}
      </div>
    </SectionWrapper>
  );
}
