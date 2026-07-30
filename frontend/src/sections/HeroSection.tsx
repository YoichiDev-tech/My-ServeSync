import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function HeroSection() {
  const hero = serveSync.landingPage.find((section) => section.id === "hero");

  if (!hero) return null;

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h1 className="text-4xl md:text-5xl font-bold leading-tight slide-up">
        {hero.title}
      </h1>

      {/* Content animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        {hero.content}
      </p>

      {/* Button animation */}
      <button className="mt-4 inline-block bg-brandBlue text-brandBrown font-semibold px-6 py-3 rounded-lg hover:bg-brandBlue/80 transition slide-up">
        Get Started
      </button>
    </SectionWrapper>
  );
}