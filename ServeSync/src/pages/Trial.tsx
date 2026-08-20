import SectionWrapper from "../components/SectionWrapper";

export default function Trial() {
  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default pt-20 pb-24">

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Left side */}
        <div>
          <h1 className="font-display text-4xl font-semibold slide-up">
            Start Your ServeSync Free Trial
          </h1>

          <p className="text-lg text-espresso/75 mt-3 fade-in max-w-xl">
            Your 14-day free trial begins once you create your account. No credit
            card required — just real tools built to save time, reduce waste, and
            simplify your back-office operations.
          </p>

          <a
            href="/register"
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit inline-block mt-10 slide-up"
          >
            Create Account
          </a>

          <p className="text-sm text-ember-dark underline mt-4">
            <a href="/login">Already have an account?</a>
          </p>
        </div>

        {/* Right side */}
        <div className="bg-paper border border-espresso/10 rounded-xl p-8 shadow-sm slide-up">
          <h3 className="font-display text-xl font-semibold mb-4">
            What You'll Unlock
          </h3>

          <ul className="space-y-3 text-espresso/75">
            <li>✔ Smart scheduling tools</li>
            <li>✔ Inventory tracking</li>
            <li>✔ Waste reduction insights</li>
            <li>✔ Clear business reporting</li>
            <li>✔ Priority support</li>
          </ul>
        </div>

      </div>

      {/* Feature grid */}
      <div className="mt-20 grid md:grid-cols-3 gap-8 slide-up">
        <div className="border border-espresso/10 rounded-xl p-6 bg-paper">
          <h3 className="font-display text-xl font-semibold">Scheduling</h3>
          <p className="text-espresso/70 mt-2">
            Build smarter schedules, reduce last-minute changes, and keep your
            team aligned.
          </p>
        </div>

        <div className="border border-espresso/10 rounded-xl p-6 bg-paper">
          <h3 className="font-display text-xl font-semibold">Inventory</h3>
          <p className="text-espresso/70 mt-2">
            Track stock levels, reduce waste, and avoid costly re-orders.
          </p>
        </div>

        <div className="border border-espresso/10 rounded-xl p-6 bg-paper">
          <h3 className="font-display text-xl font-semibold">Reporting</h3>
          <p className="text-espresso/70 mt-2">
            Understand your business at a glance with clear, actionable reports.
          </p>
        </div>
      </div>

      <p className="mt-12 text-espresso/70 max-w-xl">
        Need help or want to extend your trial? Contact us at{" "}
        <strong>yoichi_dev@proton.me</strong>.
      </p>

    </SectionWrapper>
  );
}