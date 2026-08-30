// Enforces trial expiration on any page that calls this hook (e.g. the
// dashboard). If the signed-in user's trial has ended and they never
// upgraded, this deletes their account server-side (via
// api/trial-cleanup.ts, which re-checks expiration itself before deleting
// anything) and sends them to /trial-expired. Premium accounts
// (subscription_status === "active") are never affected, even if they
// still have old trial dates on their profile

import { useEffect } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function useTrialLock() {
  useEffect(() => {
    async function checkTrial() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const userId = session.user.id;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", userId)
        .single();

      if (!profile || !profile.trial_ends_at) return;
      if (profile.subscription_status === "active") return;

      const now = new Date();
      const trialEnd = new Date(profile.trial_ends_at);

      if (now <= trialEnd) return;

      // Trial is over — ask the server to delete the account (it
      // re-verifies expiration itself before doing anything destructive)
      await fetch("/api/trial-cleanup", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      await supabaseClient.auth.signOut();
      window.location.href = "/trial-expired";
    }

    checkTrial();
  }, []);
}