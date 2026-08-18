import SectionWrapper from "../components/SectionWrapper";

export default function Cookies() {
  return (
    <SectionWrapper className="bg-paper text-espresso cursor-default pt-16 pb-20">
      <h1 className="font-display text-4xl font-semibold">Cookie Policy</h1>
      <p className="text-espresso/70 mt-2">Last updated: August 2026</p>

      <div className="mt-10 flex flex-col gap-6 leading-relaxed text-espresso/80 max-w-3xl">
        <p>
          ServeSync uses cookies to ensure the platform works correctly. This
          Cookie Policy explains what cookies we use and why.
        </p>

        <h2 className="font-display text-2xl font-semibold">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device to help websites
          function and improve user experience.
        </p>

        <h2 className="font-display text-2xl font-semibold">2. Cookies We Use</h2>
        <ul className="list-disc ml-6">
          <li>Authentication cookies (required)</li>
          <li>Session cookies (required)</li>
          <li>Performance cookies (anonymous analytics)</li>
        </ul>

        <h2 className="font-display text-2xl font-semibold">3. No Advertising Cookies</h2>
        <p>
          ServeSync does not use advertising cookies or sell cookie data to
          third parties.
        </p>

        <h2 className="font-display text-2xl font-semibold">4. Managing Cookies</h2>
        <p>
          You can disable cookies in your browser settings, but some features of
          ServeSync may stop working.
        </p>

        <h2 className="font-display text-2xl font-semibold">5. Contact</h2>
        <p>
          For cookie-related questions, contact:{" "}
          <strong>yoichi_dev@proton.me</strong>
        </p>
      </div>
    </SectionWrapper>
  );
}