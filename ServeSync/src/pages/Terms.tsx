import SectionWrapper from "../components/SectionWrapper";

export default function Terms() {
  return (
    <SectionWrapper className="bg-paper text-espresso cursor-default pt-16 pb-20">
      <h1 className="font-display text-4xl font-semibold">Terms of Service</h1>
      <p className="text-espresso/70 mt-2">Last updated: August 2026</p>

      <div className="mt-10 flex flex-col gap-6 leading-relaxed text-espresso/80 max-w-3xl">
        <p>
          These Terms govern your use of ServeSync, operated by BrightWave
          Studio. By using ServeSync, you agree to these
          Terms.
        </p>

        <h2 className="font-display text-2xl font-semibold">1. Using ServeSync</h2>
        <p>
          You must be at least 16 years old to use ServeSync. You agree not to
          misuse the platform or attempt unauthorized access.
        </p>

        <h2 className="font-display text-2xl font-semibold">2. Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activity under your account.
        </p>

        <h2 className="font-display text-2xl font-semibold">3. Payments</h2>
        <p>
          ServeSync offers paid plans. Prices may change, but you will always be
          notified in advance.
        </p>

        <h2 className="font-display text-2xl font-semibold">4. Trial Period</h2>
        <p>
          Trials provide temporary access to paid features. We may limit or
          revoke trial access if misuse is detected.
        </p>

        <h2 className="font-display text-2xl font-semibold">5. Intellectual Property</h2>
        <p>
          ServeSync, its design, and its content are owned by BrightWave Studio.
          You may not copy, modify, or redistribute the platform.
        </p>

        <h2 className="font-display text-2xl font-semibold">6. Termination</h2>
        <p>
          We may suspend or terminate accounts that violate these Terms or
          engage in harmful activity.
        </p>

        <h2 className="font-display text-2xl font-semibold">7. Liability</h2>
        <p>
          ServeSync is provided "as is". We are not liable for indirect or
          consequential damages.
        </p>

        <h2 className="font-display text-2xl font-semibold">8. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Poland and the European Union.
        </p>

        <h2 className="font-display text-2xl font-semibold">9. Contact</h2>
        <p>
          For questions about these Terms, contact:{" "}
          <strong>yoichi_dev@proton.me</strong>
        </p>
      </div>
    </SectionWrapper>
  );
}