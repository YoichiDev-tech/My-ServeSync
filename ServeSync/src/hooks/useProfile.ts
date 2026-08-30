import { useEffect, useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export interface Profile {
  id: string;
  email: string;
  role: string;
  subscription_status: string | null;
  subscription_plan: string | null;
  trial_ends_at: string | null;
}

export default function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (active) setLoading(false);
        return;
      }

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("id, email, role, subscription_status, subscription_plan, trial_ends_at")
        .eq("id", user.id)
        .single();

      if (active) {
        if (!error && data) setProfile(data as Profile);
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
}