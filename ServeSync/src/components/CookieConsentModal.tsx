import { Link } from "react-router-dom";

interface CookieConsentModalProps {
  onAccept: () => void;
}

export default function CookieConsentModal({ onAccept }: CookieConsentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/60 px-6">
      <div className="bg-cream text-espresso rounded-xl shadow-xl max-w-md w-full p-8 flex flex-col gap-4">
        <h2 className="font-display text-2xl font-semibold">Before you start</h2>

        <p className="text-espresso/80 leading-relaxed">
          ServeSync uses essential cookies to keep you signed in and to run
          your free trial. We don't use advertising cookies or sell your
          data. See our{" "}
          <Link to="/cookies" className="text-ember-dark underline">
            Cookie Policy
          </Link>{" "}
          for details.
        </p>

        <button
          type="button"
          onClick={onAccept}
          className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition mt-2"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}