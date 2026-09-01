import { useEffect, useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

type SubscriptionStatus = "none" | "trialing" | "active";

interface TrialInfo {
  trialEndsAt: string | null;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
  isTrialExpired: boolean;
}

export default function useTrialActivation(): TrialInfo {
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    trialEndsAt: null,
    subscriptionStatus: "none",
    loading: true,
    isTrialExpired: false,
  });

  useEffect(() => {
    async function loadTrialInfo() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setTrialInfo({
          trialEndsAt: null,
          subscriptionStatus: "none",
          loading: false,
          isTrialExpired: false,
        });
        return;
      }

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", session.user.id)
        .single();

      const trialEndsAt = profile?.trial_ends_at ?? null;
      const subscriptionStatus =
        (profile?.subscription_status as SubscriptionStatus) ?? "none";

      const now = new Date();
      const expired =
        subscriptionStatus === "trialing" &&
        trialEndsAt &&
        new Date(trialEndsAt) < now;

      // If expired - delete + logout + redirect
      if (expired) {
        try {
          // Delete profile row (auth deletion must be done server-side)
          await supabaseClient
            .from("profiles")
            .delete()
            .eq("id", session.user.id);

          // Sign out user
          await supabaseClient.auth.signOut();

          // Redirect
          window.location.href = "/trial-expired";
          return; // stop further state updates
        } catch (err) {
          console.error("Failed to clean up expired trial user:", err);
        }
      }

      setTrialInfo({
        trialEndsAt,
        subscriptionStatus,
        loading: false,
        isTrialExpired: expired,
      });
    }

    loadTrialInfo();
  }, []);

  return trialInfo;
}