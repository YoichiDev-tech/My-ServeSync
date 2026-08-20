import { useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";
import useAuthGuard from "../../hooks/useAuthGuard";

export default function UserSettings() {
  useAuthGuard();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function updateEmail() {
    const { error } = await supabaseClient.auth.updateUser({ email });
    setMessage(error ? error.message : "Email updated.");
  }

  async function updatePassword() {
    const { error } = await supabaseClient.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated.");
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">User Settings</h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="New email"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={updateEmail}
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit"
          >
            Update Email
          </button>

          <input
            type="password"
            placeholder="New password"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={updatePassword}
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition w-fit"
          >
            Update Password
          </button>

          {message && <p className="text-green-700">{message}</p>}

        </div>

      </div>
    </SectionWrapper>
  );
}