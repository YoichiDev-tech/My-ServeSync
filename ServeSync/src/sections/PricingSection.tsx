import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function PricingSection() {
  const tiers = serveSync.pricing;

  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default" id="pricing">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-ember-dark">
          Pricing
        </span>
        <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold mt-3">
          Priced by how many doors you run, not by guesswork.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`receipt flex flex-col px-6 pt-8 pb-6 font-body ${
              tier.highlight ? "md:-translate-y-3 ring-2 ring-ember" : ""
            }`}
          >
            {tier.highlight && (
              <span className="text-[11px] font-mono uppercase tracking-wide text-ember-dark text-center mb-2">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold text-center">
              {tier.name}
            </h3>
            <p className="text-muted text-sm text-center mt-1">
              {tier.audience}
            </p>

            <div className="text-center mt-4">
              <span className="font-mono text-3xl font-bold">
                {tier.price}
              </span>
              <span className="text-muted text-sm"> {tier.cadence}</span>
            </div>

            <ul className="receipt-dash mt-6 pt-5 flex flex-col gap-3 text-sm flex-1">
              {tier.lineItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-sage font-mono">✓</span>
                  <span className="text-espresso/85">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#cta"
              className={`mt-6 text-center font-semibold px-6 py-3 rounded-md transition ${
                tier.highlight
                  ? "bg-ember text-cream hover:bg-ember-dark"
                  : "border border-espresso/25 text-espresso hover:bg-espresso hover:text-cream"
              }`}
            >
              Start free trial
            </a>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}