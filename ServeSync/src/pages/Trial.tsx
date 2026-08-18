import SectionWrapper from "../components/SectionWrapper";

export default function Trial() {
  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default pt-20 pb-24">
      <h1 className="font-display text-4xl font-semibold slide-up">
        Your ServeSync Trial Is Active
      </h1>

      <p className="text-lg text-espresso/75 mt-3 fade-in max-w-2xl">
        Welcome to ServeSync — operated by BrightWave Studio. Your free trial
        gives you access to core features designed to save time, reduce waste,
        and simplify your back-office operations.
      </p>

      <div className="mt-10 grid md:grid-cols-3 gap-8 slide-up">
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