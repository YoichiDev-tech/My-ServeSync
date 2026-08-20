import SectionWrapper from "../components/SectionWrapper";

export default function Subscribe() {
  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Subscribe to ServeSync</h1>

        <p className="text-lg text-espresso/80">
          Unlock full access to ServeSync with a monthly subscription.
        </p>

        <a
          href="YOUR_STRIPE_CHECKOUT_URL"
          className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit"
        >
          Proceed to Payment
        </a>

      </div>
    </SectionWrapper>
  );
}