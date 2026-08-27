import SectionWrapper from "../components/SectionWrapper";
import { Link } from "react-router-dom";

export default function Trial() {
  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center">

        <h1 className="text-4xl font-semibold">Choose Your Plan</h1>
        <p className="text-lg text-espresso/80">
          Start with a free 14-day trial or unlock the full ServeSync experience.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* Free trial */}
          <Link
            to="/trial/free"
            className="inline-block bg-ember text-cream font-semibold px-8 py-6 rounded-lg shadow-md hover:bg-ember-dark transition"
          >
            Start Free Trial
          </Link>

          {/* Premium */}
          <Link
            to="/trial/premium"
            className="inline-block bg-steam text-espresso font-semibold px-8 py-6 rounded-lg shadow-md hover:bg-steam-dark transition"
          >
            Get Full Version
          </Link>

        </div>

      </div>
    </SectionWrapper>
  );
}