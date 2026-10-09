import { Link } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper";

export default function Trial() {
  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default pt-20 pb-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-semibold slide-up">
          Get Started With ServeSync
        </h1>
        <p className="text-lg text-espresso/75 mt-3 fade-in">
          Try it free for 14 days, or choose a plan that fits your operation.
          Group pricing is tailored to your locations and needs.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <Link
            to="/trial/free"
            className="border border-espresso/10 rounded-xl p-6 bg-paper hover:border-ember transition slide-up flex flex-col gap-2"
          >
            <h3 className="font-display text-xl font-semibold">Free Trial</h3>
            <p className="text-espresso/70">14 days, full access, no credit card required.</p>
            <span className="mt-4 bg-ember text-cream font-semibold px-6 py-3 rounded-md text-center hover:bg-ember-dark transition">
              Start Free Trial
            </span>
          </Link>

          <Link
            to="/trial/premium"
            className="border border-espresso/10 rounded-xl p-6 bg-paper hover:border-ember transition slide-up flex flex-col gap-2"
          >
            <h3 className="font-display text-xl font-semibold">Counter & Kitchen</h3>
            <p className="text-espresso/70">
              Choose a paid plan and continue straight to secure Stripe Checkout.
            </p>
            <span className="mt-4 border border-espresso/25 text-espresso font-semibold px-6 py-3 rounded-md text-center hover:bg-espresso hover:text-cream transition">
              View Paid Plans
            </span>
          </Link>

          <a
            href="mailto:yoichi_dev@proton.me?subject=ServeSync%20Group%20pricing&body=Hi%20ServeSync%2C%0A%0AI%27d%20like%20to%20discuss%20Group-tier%20pricing.%0A%0ANumber%20of%20locations%3A%0ACurrent%20tools%3A%0AMain%20operational%20challenge%3A%0A"
            className="border border-espresso/10 rounded-xl p-6 bg-paper hover:border-ember transition slide-up flex flex-col gap-2"
          >
            <h3 className="font-display text-xl font-semibold">Group</h3>
            <p className="text-espresso/70">
              Custom pricing for multi-location hospitality groups. Tell us about your operation.
            </p>
            <span className="mt-4 bg-espresso text-cream font-semibold px-6 py-3 rounded-md text-center hover:bg-espresso/80 transition">
              Contact Us for Group Pricing
            </span>
          </a>
        </div>

        <p className="text-sm text-ember-dark underline mt-8">
          <Link to="/login">Already have an account?</Link>
        </p>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8 slide-up">
        <div className="border border-espresso/10 rounded-xl p-6 bg-paper">
          <h3 className="font-display text-xl font-semibold">Scheduling</h3>
          <p className="text-espresso/70 mt-2">
            Build smarter schedules, reduce last-minute changes, and keep your team aligned.
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
        <a className="underline" href="mailto:yoichi_dev@proton.me">yoichi_dev@proton.me</a>.
      </p>
    </SectionWrapper>
  );
}
