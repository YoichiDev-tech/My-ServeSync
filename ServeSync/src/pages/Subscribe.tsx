import { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import useAuthGuard from "../hooks/useAuthGuard";
import { supabaseClient } from "../utils/supabaseClient";

export default function Subscribe() {
  useAuthGuard();

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleUpgrade() {
    setStatus("loading");

    const { data: sessionData } = await supabaseClient.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ intent: "upgrade" }),
      });

      const data = await res.json();

      if (!data.success || !data.url) {
        setStatus("error");
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Subscribe to ServeSync</h1>

        <p className="text-lg text-espresso/80">
          Unlock full access to ServeSync with a monthly subscription.
        </p>

        <button
          type="button"
          onClick={handleUpgrade}
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