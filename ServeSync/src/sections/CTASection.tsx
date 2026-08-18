import SectionWrapper from "../components/SectionWrapper";

export default function CTASection() {
  return (
    <SectionWrapper id="cta" className="bg-brandBrown text-white text-center cursor-default">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up text-black">
        Ready to streamline your operations?
      </h2>

      {/* Subtitle animation */}
      <p className="text-lg md:text-xl text-black fade-in mt-4">
        Join the first wave of hospitality operators using ServeSync.
      </p>

      {/* Button animation */}
      <a
        href="/trial"
        className="mt-6 bg-brandBlue text-black font-semibold px-8 py-4 rounded-lg hover:bg-brandBlue/80 transition slide-up"
      >
        Get Started Today
      </a>
    </SectionWrapper>
  );
}