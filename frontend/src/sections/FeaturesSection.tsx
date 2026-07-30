import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function FeaturesSection() {
  const features = serveSync.landingPage.find(
    (section) => section.id === "features"
  );

  if (!features) return null;

  const featureList = features.featureList || [];

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        {features.title}
      </h2>

      {/* Content animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        {features.content}
      </p>

      {/* List animation */}
      {featureList.length > 0 && (
        <ul className="list-disc pl-6 text-brandBlue/90 space-y-2 slide-up">
          {featureList.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      )}
    </SectionWrapper>
  );
}