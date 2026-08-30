import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper";
import CookieConsentModal from "../components/CookieConsentModal";

const CONSENT_KEY = "servesync_cookie_consent";

export default function TrialFree() {
  const navigate = useNavigate();
  const [showConsent] = useState(
    () => localStorage.getItem(CONSENT_KEY) !== "accepted"
  );

  useEffect(() => {
    if (!showConsent) {
      navigate("/register?plan=trial", { replace: true });
    }
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