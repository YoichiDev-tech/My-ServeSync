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
        .select("trial_ends_at")
        .eq("id", userId)
        .single();

      if (!profile || !profile.trial_ends_at) return;

      const now = new Date();
      const trialEnd = new Date(profile.trial_ends_at);

      if (now > trialEnd) {
        window.location.href = "/trial-expired";
      }
    }

    checkTrial();
  }, []);
}