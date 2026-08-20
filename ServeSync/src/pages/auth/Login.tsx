import { useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

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

        <h1 className="text-4xl font-semibold">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

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
            Login
          </button>

        </form>

        <div className="flex gap-4 text-sm mt-4">
          <a href="/register" className="text-ember-dark underline">Create account</a>
          <a href="/forgot-password" className="text-ember-dark underline">Forgot password?</a>
        </div>

      </div>
    </SectionWrapper>
  );
}