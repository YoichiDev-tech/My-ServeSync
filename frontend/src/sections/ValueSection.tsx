import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function ValueSection() {
  const value = serveSync.landingPage.find(
    (section) => section.id === "value"
  );

  if (!value) return null;

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        {value.title}
      </h2>

      {/* Content animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        {value.content}
      </p>
    </SectionWrapper>
  );
}