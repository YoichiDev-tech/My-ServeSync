import { useEffect, useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

interface TrialInfo {
  trialStartedAt: string | null;
  trialEndsAt: string | null;
}

export default function useTrialActivation() {
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    trialStartedAt: null,
    trialEndsAt: null,
  });

  useEffect(() => {
    async function ensureTrial() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      if (!session) return;

      const userId = session.user.id;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_started_at, trial_ends_at")
        .eq("id", userId)
        .single();

      if (!profile) return;

      // If trial already exists, just store it
      if (profile.trial_started_at && profile.trial_ends_at) {
        setTrialInfo({
          trialStartedAt: profile.trial_started_at,
          trialEndsAt: profile.trial_ends_at,
        });
        return;
      }

      // Otherwise, start a new 14-day trial
      const start = new Date();
      const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);

      const startIso = start.toISOString();
      const endIso = end.toISOString();

      await supabaseClient
        .from("profiles")
        .update({
          trial_started_at: startIso,
          trial_ends_at: endIso,
        })
        .eq("id", userId);

      setTrialInfo({
        trialStartedAt: startIso,
        trialEndsAt: endIso,
      });
    }

    ensureTrial();
  }, []);

  return trialInfo;
}