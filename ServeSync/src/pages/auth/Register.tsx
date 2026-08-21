// Creates a new user and profile row

import { useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = data.user;
    if(!user) return; // Runtime crash prevention

    // Inserts profile row
    await supabaseClient.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "user",
    });

    // Auto-login after registration
    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Create Account</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition"
          >
            Create Account
          </button>

        </form>

        <div className="text-sm mt-4">
          <a href="/login" className="text-ember-dark underline">
            Already have an account?
          </a>
        </div>

      </div>
    </SectionWrapper>
  );
}