// Sends a password reset email

import { useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();

    await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setMessage("Password reset email sent.");
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Reset Password</h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition"
          >
            Send Reset Email
          </button>

          {message && <p className="text-green-700">{message}</p>}

        </form>

        <div className="text-sm mt-4">
          <a href="/login" className="text-ember-dark underline">Back to login</a>
        </div>

      </div>
    </SectionWrapper>
  );
}