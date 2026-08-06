import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function ProblemSection() {
  const { reality, consequence } = serveSync.coreProblem;

  return (
    <SectionWrapper className="bg-paper text-espresso cursor-default" tight>
      <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold">
        You didn't open a restaurant to become a data-entry clerk.
      </h2>
      <p className="fade-in text-lg text-espresso/80 leading-relaxed">
        {reality}
      </p>
      <p className="fade-in text-lg text-espresso/80 leading-relaxed">
        {consequence}
      </p>
    </SectionWrapper>
  );
}