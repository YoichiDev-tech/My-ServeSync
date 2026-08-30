import { Link } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper";

export default function Trial() {
  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default pt-20 pb-24">

      {/* Plan choice */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-semibold slide-up">
          Get Started With ServeSync
        </h1>

        <p className="text-lg text-espresso/75 mt-3 fade-in">
          Try it free for 14 days, or go straight to a paid plan — either way
          you'll have an account and a live dashboard in minutes.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-6 text-left">
          <Link
            to="/trial/free"
            className="border border-espresso/10 rounded-xl p-6 bg-paper hover:border-ember transition slide-up flex flex-col gap-2"
          >
            <h3 className="font-display text-xl font-semibold">Free Trial</h3>
            <p className="text-espresso/70">
              14 days, full access, no credit card required.
            </p>
            <span className="mt-4 bg-ember text-cream font-semibold px-6 py-3 rounded-md text-center hover:bg-ember-dark transition">
              Start Free Trial
            </span>
          </Link>

          <Link
            to="/trial/premium"
            className="border border-espresso/10 rounded-xl p-6 bg-paper hover:border-ember transition slide-up flex flex-col gap-2"
          >
            <h3 className="font-display text-xl font-semibold">Premium Version</h3>
            <p className="text-espresso/70">
              Skip the trial and subscribe now — full access from day one.
            </p>
            <span className="mt-4 border border-espresso/25 text-espresso font-semibold px-6 py-3 rounded-md text-center hover:bg-espresso hover:text-cream transition">
              Go Premium
            </span>
          </Link>
        </div>

        <p className="text-sm text-ember-dark underline mt-8">
          <Link to="/login">Already have an account?</Link>
        </p>
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
        Need help choosing a plan? Contact us at{" "}
        <strong>yoichi_dev@proton.me</strong>.
      </p>

    </SectionWrapper>
  );
}