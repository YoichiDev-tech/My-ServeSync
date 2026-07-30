import SectionWrapper from "../components/SectionWrapper";

export default function ContactSection() {
  return (
    <SectionWrapper className="bg-cream text-espresso cursor-default" tight id="contact">
      <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold">
        Talk to us
      </h2>
      <p className="fade-in text-lg text-espresso/75">
        Tell us about your business and we'll show you exactly what ServeSync
        automates for you first.
      </p>

      <form className="slide-up flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Your name"
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <input
          type="email"
          placeholder="Work email"
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <input
          type="text"
          placeholder="Business type (e.g. family restaurant, multi-location group)"
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <textarea
          placeholder="What's eating the most time right now?"
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted h-28 focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <button
          type="button"
          className="bg-ember text-cream font-semibold px-6 py-3 rounded-md hover:bg-ember-dark transition w-fit"
        >
          Send message
        </button>
      </form>
    </SectionWrapper>
  );
}