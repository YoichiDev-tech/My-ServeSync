import SectionWrapper from "../components/SectionWrapper";

export default function TrialExpired() {
  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-4xl font-semibold">Trial Ended</h1>
        <p className="text-lg text-espresso/80">
          Your free trial has expired. Please subscribe to continue using ServeSync.
        </p>
        <a
          href="/subscribe"
          className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit"
        >
          Subscribe Now
        </a>
      </div>
    </SectionWrapper>
  );
}