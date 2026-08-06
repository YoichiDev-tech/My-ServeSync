import SectionWrapper from "../components/SectionWrapper";

export default function AboutPage() {
  return (
    <>
      <SectionWrapper className="bg-cream text-espresso pt-16 pb-14 cursor-default" tight>
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-ember-dark">
          About ServeSync
        </span>
        <h1 className="slide-up font-display text-4xl md:text-5xl font-semibold mt-3 leading-tight">
          Built by people who used to run the floor, not just study it.
        </h1>
      </SectionWrapper>

      <SectionWrapper className="bg-paper text-espresso" tight>
        <h2 className="font-display text-2xl font-semibold">Where we came from</h2>
        <p className="text-espresso/80 leading-relaxed">
          Before ServeSync, we spent years working inside hospitality
          businesses ourselves — 5+ years on the floor, in the back office,
          and everywhere in between. That's where we saw the problems
          customers never see and never need to: the schedule re-typed for
          the third time that week, the stockroom count that never quite
          adds up, the invoice nobody had time to check properly.
        </p>
        <p className="text-espresso/80 leading-relaxed">
          Those years gave us something most software teams building for
          this industry don't have: we've lived the exact hours we're now
          trying to give back.
        </p>
        <p className="text-espresso/80 leading-relaxed">
          Our path changed since — we're web developers now, building
          software instead of running shifts. But that's exactly what makes
          ServeSync possible: we understand the inside of this business,
          and we now have the skills to actually fix the parts of it that
          quietly wear operators down.
        </p>
      </SectionWrapper>

      <SectionWrapper className="bg-espresso text-cream tile-texture" tight>
        <h2 className="font-display text-2xl font-semibold">Our mission</h2>
        <p className="text-cream/80 leading-relaxed text-lg">
          Give hospitality operators their time, their margin, and their
          evenings back — by automating the admin nobody has time for.
          Every hour spent re-typing a schedule or re-counting a stockroom
          is an hour that didn't go toward the business, the food, or the
          people running it. We want the people doing this work to get
          their work-life balance back, the way we once wished someone had
          given it to us.
        </p>
      </SectionWrapper>

      <SectionWrapper className="bg-cream text-espresso" tight>
        <h2 className="font-display text-2xl font-semibold">Where we're headed</h2>
        <p className="text-espresso/80 leading-relaxed">
          ServeSync starts with the five things that eat the most time in a
          hospitality business: scheduling, inventory, waste, admin, and
          reporting. As the platform grows, the goal stays the same — every
          new feature has to give an operator back time, money, or peace of
          mind. Nothing gets added just because it's possible to build.
        </p>
        <p className="text-espresso/80 leading-relaxed">
          We're a small team building this because we lived it, not because
          we studied it from the outside. If you're one of the businesses
          this is for, your feedback shapes what we build next.
        </p>
      </SectionWrapper>
    </>
  );
}