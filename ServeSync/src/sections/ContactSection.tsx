import { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, businessType, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setBusinessType("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <SectionWrapper
      className="bg-cream text-espresso cursor-default"
      tight
      id="contact"
    >
      <h2 className="slide-up font-display text-3xl md:text-4xl font-semibold">
        Talk to us
      </h2>
      <p className="fade-in text-lg text-espresso/75">
        Tell us about your business and we'll show you exactly what ServeSync
        automates for you first.
      </p>

      <form
        className="slide-up flex flex-col gap-4 mt-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <input
          type="text"
          placeholder="Business type (e.g. family restaurant, multi-location group)"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <textarea
          placeholder="What's eating the most time right now?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-4 py-3 rounded-md bg-paper border border-espresso/15 text-espresso placeholder:text-muted h-28 focus:outline-none focus:ring-2 focus:ring-ember"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="bg-ember text-cream font-semibold px-6 py-3 rounded-md hover:bg-ember-dark transition w-fit disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="text-sage text-sm">
            Thanks — we'll get back to you shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-ember-dark text-sm">
            Something went wrong. Please check the required fields and try
            again.
          </p>
        )}
      </form>
    </SectionWrapper>
  );
}