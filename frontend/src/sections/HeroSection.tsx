import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";
import SavingsReceipt from "../components/SavingsReceipt";

export default function HeroSection() {
  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24 cursor-default" id="hero">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <span className="slide-up inline-block w-fit text-xs font-mono uppercase tracking-[0.25em] text-ember-dark bg-ember/10 px-3 py-1 rounded-full">
            For hospitality operators
          </span>

          <h1 className="slide-up delay-1 font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-espresso">
            {serveSync.brand.tagline}
          </h1>

          <p className="slide-up delay-2 text-lg md:text-xl text-espresso/80 max-w-xl">
            {serveSync.mission.text}
          </p>

          <div className="slide-up delay-3 flex flex-wrap gap-4 mt-2">
            <a
              href="#cta"
              className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition"
            >
              Start free 14-day trial
            </a>
            <a
              href="#solutions"
              className="border border-espresso/25 text-espresso font-semibold px-7 py-3.5 rounded-md hover:bg-espresso hover:text-cream transition"
            >
              See how it works
            </a>
          </div>

          <p className="slide-up delay-4 text-sm text-muted">
            No credit card required · Live schedule running in under 15 minutes
          </p>
        </div>

        <div className="fade-in delay-2">
          <SavingsReceipt />
        </div>
      </div>
    </SectionWrapper>
  );
}