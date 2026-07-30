import SectionWrapper from "../components/SectionWrapper";

export default function PricingSection() {
  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        Pricing
      </h2>

      {/* Description animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        Simple pricing designed for hospitality operators.
      </p>

      {/* Cards animation */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white text-brandBrown p-6 rounded-lg slide-up">
          <h3 className="text-xl font-bold">Starter</h3>
          <p className="mt-2 text-brandBrown/80">$35 / month</p>
          <ul className="mt-4 space-y-2">
            <li>Basic Scheduling</li>
            <li>Inventory Tracking</li>
            <li>Daily Checklists</li>
          </ul>
        </div>

        <div className="bg-white text-brandBrown p-6 rounded-lg slide-up">
          <h3 className="text-xl font-bold">Pro</h3>
          <p className="mt-2 text-brandBrown/80">$99 / month</p>
          <ul className="mt-4 space-y-2">
            <li>AI Scheduling</li>
            <li>Predictive Inventory Alerts</li>
            <li>Smart Communication</li>
          </ul>
        </div>

        <div className="bg-white text-brandBrown p-6 rounded-lg slide-up">
          <h3 className="text-xl font-bold">Enterprise</h3>
          <p className="mt-2 text-brandBrown/80">Custom</p>
          <ul className="mt-4 space-y-2">
            <li>Full Automation Suite</li>
            <li>Dedicated Support</li>
            <li>Custom Integrations</li>
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}