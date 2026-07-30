import serveSync from "../data/serveSync";
import SectionWrapper from "../components/SectionWrapper";

export default function FAQSection() {
  const faqs = serveSync.faqs;

  return (
    <SectionWrapper className="bg-paper text-espresso" tight id="faq">
      <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold">
        Questions, answered
      </h2>

      <div className="flex flex-col gap-6 mt-4">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="slide-up border-b border-espresso/10 pb-6"
          >
            <h3 className="font-display text-lg font-semibold">
              {faq.question}
            </h3>
            <p className="text-espresso/75 mt-2 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}