import SectionWrapper from "../components/SectionWrapper";

export default function CTASection() {
  return (
    <SectionWrapper id="cta" className="bg-espresso text-cream text-center cursor-default">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up text-cream">
        Ready to streamline your operations?
      </h2>

      {/* Subtitle animation */}
      <p className="text-lg md:text-xl text-cream/80 fade-in mt-4">
        Join the first wave of hospitality operators using ServeSync.
      </p>

      {/* Button animation */}
      <a
        href="/trial"
        className="mt-6 inline-block w-fit mx-auto bg-ember text-cream font-semibold px-8 py-4 rounded-lg hover:bg-ember-dark transition slide-up cursor-pointer"
      >
        Get Started Today
      </a>
    </SectionWrapper>
  );
}