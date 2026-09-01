// Enforces trial expiration on any page that calls this hook.
// If the signed-in user's trial has ended and they never upgraded,
// this deletes their account server-side (via /api/trial-cleanup)
// and redirects them to /trial-expired

import { useEffect } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function useTrialLock() {
  useEffect(() => {
    async function checkTrial() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      // Not logged in -> redirect to login
      if (!session) {
        window.location.href = "/login";
        return;
      }

      const userId = session.user.id;

      // Load profile
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", userId)
        .single();

      if (!profile) return;

      const { trial_ends_at, subscription_status } = profile;

      // Premium users are never affected
      if (subscription_status === "active") return;

      // If no trial date -> nothing to enforce
      if (!trial_ends_at) return;

      const now = new Date();
      const trialEnd = new Date(trial_ends_at);

      // Trial still active -> allow access
      if (now <= trialEnd) return;

      // Trial expired → cleanup + logout + redirect
      try {
        await fetch("/api/trial-cleanup", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        await supabaseClient.auth.signOut();
        window.location.href = "/trial-expired";
      } catch (err) {
        console.error("Trial cleanup failed:", err);
        // Fallback: still redirect
        window.location.href = "/trial-expired";
      }
    }

    checkTrial();
  }, []);
}