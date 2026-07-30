import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function ValueSection() {
  const segments = serveSync.segments;

  return (
    <SectionWrapper className="bg-paper text-espresso">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-ember-dark">
          Built for hospitality, not adapted from it
        </span>
        <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold mt-3">
          Whoever's running the floor, ServeSync fits the operation.
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        {segments.map((segment) => (
          <div
            key={segment.name}
            className="slide-up flex-1 min-w-[220px] border border-espresso/10 rounded-lg p-6 bg-cream"
          >
            <h3 className="font-display font-semibold text-lg">
              {segment.name}
            </h3>
            <p className="text-espresso/70 text-sm mt-1">{segment.detail}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}