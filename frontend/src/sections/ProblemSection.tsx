import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function ProblemSection() {
  const problem = serveSync.landingPage.find(
    (section) => section.id === "problem"
  );

  if (!problem) return null;

  const painPoints = problem.painPoints || [];

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        {problem.title}
      </h2>

      {/* Content animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        {problem.content}
      </p>

      {/* List animation */}
      {painPoints.length > 0 && (
        <ul className="list-disc pl-6 text-brandBlue/90 space-y-2 slide-up">
          {painPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}