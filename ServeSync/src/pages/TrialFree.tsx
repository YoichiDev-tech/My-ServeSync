import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper";
import CookieConsentModal from "../components/CookieConsentModal";
import { supabaseClient } from "../utils/supabaseClient";

const CONSENT_KEY = "servesync_cookie_consent";

export default function TrialFree() {
  const navigate = useNavigate();
  const [showConsent] = useState(
    () => localStorage.getItem(CONSENT_KEY) !== "accepted"
  );

  useEffect(() => {
    async function checkTrialReuse() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      // If logged in, check if user already used trial
      if (session) {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("has_used_trial, subscription_status")
          .eq("id", session.user.id)
          .single();

        if (!profile) return;

        // If user already used trial -> block access
        if (profile.has_used_trial && profile.subscription_status !== "active") {
          navigate("/trial-expired", { replace: true });
          return;
        }
      }

      // If consent already accepted -> go to registration
      if (!showConsent) {
        navigate("/register?plan=trial", { replace: true });
      }
    }

    checkTrialReuse();
  }, [showConsent, navigate]);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    navigate("/register?plan=trial", { replace: true });
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-20 pb-24">
      <div className="max-w-md mx-auto text-center">
        <h1 className="font-display text-3xl font-semibold">
          Setting up your free trial…
        </h1>
      </div>

      {showConsent && <CookieConsentModal onAccept={handleAccept} />}
    </SectionWrapper>
  );
}