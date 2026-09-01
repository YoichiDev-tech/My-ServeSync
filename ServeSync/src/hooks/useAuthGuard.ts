// Redirects user to /login if not authenticated
// AND enforces trial expiration on login

import { useEffect } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function useAuthGuard() {
  useEffect(() => {
    async function check() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      // If no session - redirect to login
      if (!session) {
        window.location.href = "/login";
        return;
      }

      // Fetch profile to check trial status
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", session.user.id)
        .single();

      if (!profile) return;

      const trialEndsAt = profile.trial_ends_at;
      const subscriptionStatus = profile.subscription_status;

      const now = new Date();
      const isExpired =
        subscriptionStatus === "trialing" &&
        trialEndsAt &&
        new Date(trialEndsAt) < now;

      if (isExpired) {
        try {
          // Delete profile row (auth deletion must be server-side)
          await supabaseClient
            .from("profiles")
            .delete()
            .eq("id", session.user.id);

          // Log out user
          await supabaseClient.auth.signOut();

          // Redirect to trial-expired page
          window.location.href = "/trial-expired";
          return;
        } catch (err) {
          console.error("Failed to clean up expired trial user:", err);
        }
      }
    }

    check();
  }, []);
}