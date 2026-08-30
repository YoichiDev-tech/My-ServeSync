import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import useTrialActivation from "../../hooks/useTrialActivation";
import useTrialLock from "../../hooks/useTrialLock";
import SectionWrapper from "../../components/SectionWrapper";
import LogoutButton from "../../components/LogoutButton";
import { supabaseClient } from "../../utils/supabaseClient";

export default function Dashboard() {
  useAuthGuard();
  useTrialLock();

  const [searchParams] = useSearchParams();
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const { trialEndsAt, subscriptionStatus } = useTrialActivation();

  // Handles the redirect back from Stripe after a trial user upgrades
  // (see Subscribe.tsx). The session_id is verified server-side before
  // the account is actually marked premium.
  useEffect(() => {
    const upgraded = searchParams.get("upgraded");
    const sessionId = searchParams.get("session_id");
    if (upgraded !== "1" || !sessionId) return;

    async function finalizeUpgrade() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return;

      const res = await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan: "premium", session_id: sessionId }),
      });

      const data = await res.json();

      if (data.success) {
        // Clean URL + refresh subscription status.
        window.location.href = "/dashboard";
      } else {
        setUpgradeMessage(data.error || "Could not confirm your upgrade.");
      }
    }

    finalizeUpgrade();
  }, [searchParams]);

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Dashboard</h1>
          <LogoutButton />
        </div>

        {upgradeMessage && (
          <p className="text-red-600 text-sm">{upgradeMessage}</p>
        )}

        {subscriptionStatus === "trialing" && trialEndsAt && (
          <div className="bg-ember/10 border border-ember/40 text-espresso px-4 py-3 rounded-md text-sm">
            <p className="font-semibold">Your 14-day trial is active.</p>
            <p className="text-espresso/80">
              Trial ends on{" "}
              {new Date(trialEndsAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              .{" "}
              <a href="/subscribe" className="text-ember-dark underline">
                Upgrade to premium
              </a>{" "}
              any time to keep your account after the trial ends.
            </p>
          </div>
        )}

        <p className="text-lg text-espresso/80">
          Welcome to your ServeSync dashboard.
        </p>

      </div>
    </SectionWrapper>
  );
}