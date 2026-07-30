import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function SolutionSection() {
  const solution = serveSync.landingPage.find(
    (section) => section.id === "solution"
  );

  if (!solution) return null;

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        {solution.title}
      </h2>

      {/* Content animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        {solution.content}
      </p>
    </SectionWrapper>
  );
}