import SectionWrapper from "../components/SectionWrapper";

export default function Cookies() {
  return (
    <SectionWrapper className="bg-paper text-espresso cursor-default pt-16 pb-20">
      <h1 className="font-display text-4xl font-semibold">Cookie Policy</h1>
      <p className="text-espresso/70 mt-2">Last updated: September 2026</p>

      <div className="mt-10 flex flex-col gap-6 leading-relaxed text-espresso/80 max-w-3xl">
        <p>
          This Cookie Policy explains how ServeSync uses cookies and similar
          technologies to operate the platform, secure user accounts, enable
          subscription payments, and improve overall performance.
        </p>

        <h2 className="font-display text-2xl font-semibold">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device. They help websites
          remember information, keep sessions active, and ensure core features
          work correctly.
        </p>

        <h2 className="font-display text-2xl font-semibold">2. Cookies We Use</h2>
        <p>ServeSync uses the following categories of cookies:</p>

        <ul className="list-disc ml-6">
          <li>
            <strong>Essential authentication cookies</strong> — Required for
            logging in and keeping your Supabase session active. Without these,
            you cannot access your ServeSync dashboard.
          </li>

          <li>
            <strong>Session & security cookies</strong> — Used to maintain
            temporary session state (e.g., trial activation flow, onboarding
            steps, staff creation locks) and protect against abuse such as
            repeated trial attempts or rapid API calls.
          </li>

          <li>
            <strong>Stripe checkout cookies</strong> — Required when you start a
            premium subscription. Stripe uses cookies to maintain checkout
            integrity, prevent fraud, and return you to ServeSync after payment.
          </li>

          <li>
            <strong>Performance & analytics cookies</strong> — Anonymous usage
            data that helps us understand which pages are used most, detect
            broken flows, and improve reliability. No personal data is stored.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">3. No Advertising Cookies</h2>
        <p>
          ServeSync does not use advertising cookies, tracking pixels, or any
          third-party marketing technologies. We do not sell or share cookie
          data with advertisers.
        </p>

        <h2 className="font-display text-2xl font-semibold">4. Why We Use Cookies</h2>
        <p>Cookies are used to support essential ServeSync functionality, including:</p>

        <ul className="list-disc ml-6">
          <li>Keeping your account securely signed in</li>
          <li>Ensuring trial accounts cannot be created multiple times</li>
          <li>Remembering onboarding progress</li>
          <li>Maintaining session state during staff creation and admin actions</li>
          <li>Processing subscription payments through Stripe</li>
          <li>Improving platform stability and performance</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">5. Managing Cookies</h2>
        <p>
          You may disable cookies in your browser settings. However, essential
          cookies are required for ServeSync to function. If disabled, you will
          not be able to log in, activate trials, or complete subscription
          payments.
        </p>

        <h2 className="font-display text-2xl font-semibold">6. Contact</h2>
        <p>
          For questions about this Cookie Policy, contact:{" "}
          <strong>yoichi_dev@proton.me</strong>
        </p>
      </div>
    </SectionWrapper>
  );
}