// Reads the signed-in user's trial/subscription status for display (e.g.
// the "your trial ends on..." banner on the dashboard).

// This hook is intentionally read-only. Trials are started exactly once,
// server-side, in api/complete-onboarding.ts during registration — never
// here. The previous version of this hook auto-started a new trial for any
// signed-in user who didn't have one yet, which meant deleting an expired
// trial account and registering again with the same flow could hand out a
// second trial. Enforcement now lives in a permanent per-email ledger on
// the server (see supabase/migrations/0001_onboarding.sql)

import { useEffect, useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

type SubscriptionStatus = "none" | "trialing" | "active";

interface TrialInfo {
  trialEndsAt: string | null;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
}

export default function useTrialActivation(): TrialInfo {
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    trialEndsAt: null,
    subscriptionStatus: "none",
    loading: true,
  });

  useEffect(() => {
    async function loadTrialInfo() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setTrialInfo({ trialEndsAt: null, subscriptionStatus: "none", loading: false });
        return;
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", session.user.id)
        .single();

      setTrialInfo({
        trialEndsAt: profile?.trial_ends_at ?? null,
        subscriptionStatus: (profile?.subscription_status as SubscriptionStatus) ?? "none",
        loading: false,
      });
    }

    loadTrialInfo();
  }, []);

  return trialInfo;
}