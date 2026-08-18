import SectionWrapper from "../components/SectionWrapper";

export default function Privacy() {
  return (
    <SectionWrapper className="bg-paper text-espresso cursor-default pt-16 pb-20">
      <h1 className="font-display text-4xl font-semibold">Privacy Policy</h1>
      <p className="text-espresso/70 mt-2">
        Last updated: August 2026
      </p>

      <div className="mt-10 flex flex-col gap-6 leading-relaxed text-espresso/80 max-w-3xl">
        <p>
          ServeSync is operated by BrightWave Studio. We are
          committed to protecting your privacy and handling your personal data
          responsibly. This Privacy Policy explains how we collect, use, store,
          and protect your information when you use ServeSync.
        </p>

        <h2 className="font-display text-2xl font-semibold">1. Data We Collect</h2>
        <p>We collect the following types of data:</p>
        <ul className="list-disc ml-6">
          <li>Account information (name, email)</li>
          <li>Business details (restaurant type, size, operations)</li>
          <li>Usage data (features used, interactions)</li>
          <li>Technical data (IP address, browser type, device)</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">2. How We Use Your Data</h2>
        <p>Your data is used to:</p>
        <ul className="list-disc ml-6">
          <li>Provide and improve ServeSync</li>
          <li>Respond to support requests</li>
          <li>Send important service updates</li>
          <li>Analyze platform performance</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">3. Legal Basis (GDPR)</h2>
        <p>Under GDPR, we process your data based on:</p>
        <ul className="list-disc ml-6">
          <li>Contractual necessity</li>
          <li>Legitimate interest</li>
          <li>Your consent (where required)</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">4. International Data Transfers</h2>
        <p>
          ServeSync may process data using services located outside the EU. When
          this happens, we ensure appropriate safeguards such as Standard
          Contractual Clauses (SCCs).
        </p>

        <h2 className="font-display text-2xl font-semibold">5. Data Retention</h2>
        <p>
          We retain your data only as long as necessary for service operation,
          legal compliance, or until you request deletion.
        </p>

        <h2 className="font-display text-2xl font-semibold">6. Your Rights (GDPR)</h2>
        <p>You have the right to:</p>
        <ul className="list-disc ml-6">
          <li>Access your data</li>
          <li>Correct your data</li>
          <li>Delete your data</li>
          <li>Export your data</li>
          <li>Withdraw consent</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">7. CCPA Notice (California)</h2>
        <p>
          If you are a California resident, you have additional rights including
          access, deletion, and opting out of data sale (ServeSync does not sell
          personal data).
        </p>

        <h2 className="font-display text-2xl font-semibold">8. Cookies</h2>
        <p>
          ServeSync uses essential cookies for authentication and platform
          functionality. We do not use advertising cookies.
        </p>

        <h2 className="font-display text-2xl font-semibold">9. Contact</h2>
        <p>
          For privacy questions or data requests, contact us at:{" "}
          <strong>yoichi_dev@proton.me</strong>
        </p>
      </div>
    </SectionWrapper>
  );
}