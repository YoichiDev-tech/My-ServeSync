import SectionWrapper from "../components/SectionWrapper";

export default function FAQSection() {
  // Basic FAQ data (you can expand later)
  const faqs = [
    {
      question: "What is ServeSync?",
      answer:
        "ServeSync is an AI-powered back-office system that automates scheduling, inventory, daily tasks, and communication for hospitality operators.",
    },
    {
      question: "Who is ServeSync for?",
      answer:
        "Independent restaurants, boutique hotels, cafés, bars, and multi-location hospitality businesses.",
    },
    {
      question: "Do I need technical experience?",
      answer:
        "No. ServeSync is designed for busy operators and managers — everything works out of the box.",
    },
    {
      question: "Does ServeSync support multiple locations?",
      answer:
        "Yes. You can manage multiple sites from one dashboard with unified reporting.",
    },
    {
      question: "Is onboarding difficult?",
      answer:
        "Setup takes less than 10 minutes. You can upload your staff list, inventory, and daily tasks instantly.",
    },
  ];

  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">FAQ</h2>

      {/* FAQ List */}
      <div className="flex flex-col gap-6 mt-6">
        {faqs.map((faq, index) => (
          <div key={index} className="slide-up">
            <h3 className="text-xl font-semibold">{faq.question}</h3>
            <p className="text-brandBlue/90 mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}