import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function FeaturesSection() {
  const extras = serveSync.extraAutomations;

  return (
    <SectionWrapper className="bg-espresso text-cream tile-texture cursor-default" id="features">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-steam">
          Runs quietly in the background
        </span>
        <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold mt-3">
          And once the essentials are covered, we keep going.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {extras.map((extra) => (
          <div
            key={extra.title}
            className="slide-up bg-cream/5 border border-cream/10 rounded-lg p-6 flex flex-col gap-2"
          >
            <h3 className="font-display text-lg font-semibold text-cream">
              {extra.title}
            </h3>
            <p className="text-cream/70 leading-relaxed text-sm">
              {extra.description}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}