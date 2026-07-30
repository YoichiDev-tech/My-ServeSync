import SectionWrapper from "../components/SectionWrapper";

export default function ContactSection() {
  return (
    <SectionWrapper className="bg-brandBrown text-white">
      {/* Title animation */}
      <h2 className="text-3xl md:text-4xl font-bold slide-up">
        Contact Us
      </h2>

      {/* Description animation */}
      <p className="text-lg md:text-xl text-brandBlue/90 fade-in">
        Have questions? Want a demo? Reach out and we'll get back to you.
      </p>

      {/* Form animation */}
      <form className="flex flex-col gap-4 mt-6 slide-up">
        <input
          type="text"
          placeholder="Your Name"
          className="px-4 py-3 rounded bg-white text-brandBrown"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="px-4 py-3 rounded bg-white text-brandBrown"
        />

        <textarea
          placeholder="Your Message"
          className="px-4 py-3 rounded bg-white text-brandBrown h-32"
        />

        <button className="bg-brandBlue text-brandBrown font-semibold px-6 py-3 rounded hover:bg-brandBlue/80 transition">
          Send Message
        </button>
      </form>
    </SectionWrapper>
  );
}