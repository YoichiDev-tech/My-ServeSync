import Layout from "./components/Layout";

import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import SolutionSection from "./sections/SolutionSection";
import FeaturesSection from "./sections/FeaturesSection";
import ValueSection from "./sections/ValueSection";
import PricingSection from "./sections/PricingSection";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";
import ContactSection from "./sections/ContactSection";

export default function App() {
  return (
    <Layout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ValueSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </Layout>
  );
}