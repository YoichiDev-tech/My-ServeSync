// Allows user to set a new password

import { useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabaseClient.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated. You can now log in.");
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Set New Password</h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">

          <input
            type="password"
            placeholder="New password"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition"
          >
            Update Password
          </button>

          {message && <p className="text-green-700">{message}</p>}

        </form>

        <div className="text-sm mt-4">
          <a href="/login" className="text-ember-dark underline">Go to login</a>
        </div>

      </div>
    </SectionWrapper>
  );
}