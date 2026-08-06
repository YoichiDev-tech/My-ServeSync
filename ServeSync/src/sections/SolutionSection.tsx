import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function SolutionSection() {
  const pillars = serveSync.pillars;

  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default" id="solutions">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-ember-dark">
          The five things ServeSync fixes
        </span>
        <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold mt-3">
          Five problems. One platform. No more spreadsheets.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.id}
            className={`slide-up delay-${Math.min(i + 1, 5)} bg-paper border border-espresso/10 rounded-lg p-7 flex flex-col gap-3 ${
              i === pillars.length - 1 ? "md:col-span-2" : ""
            }`}
          >
            <span className="text-xs font-mono uppercase tracking-wide text-ember-dark">
              {pillar.label}
            </span>
            <h3 className="font-display text-xl font-semibold">
              {pillar.title}
            </h3>
            <p className="text-espresso/75 leading-relaxed">
              {pillar.description}
            </p>
            <div className="mt-2 pt-4 receipt-dash flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-sage">
                {pillar.stat}
              </span>
              <span className="text-sm text-muted">{pillar.statLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}