// Creates a new user + profile row, then activates either a 14-day trial
// or a premium subscription depending on which flow the person came from
// (see /trial/free and /trial/premium)

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

type Plan = "trial" | "premium";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawPlan = searchParams.get("plan");
  const sessionId = searchParams.get("session_id");
  const plan: Plan | null = rawPlan === "trial" || rawPlan === "premium" ? rawPlan : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Registration is always tied to a plan choice. Anyone landing here
    // without one (or a premium link missing its payment proof) gets sent
    // back to pick a plan rather than silently defaulting to something
    if (!plan || (plan === "premium" && !sessionId)) {
      navigate("/trial", { replace: true });
    }
  }, [plan, sessionId, navigate]);

  if (!plan || (plan === "premium" && !sessionId)) {
    return null;
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      setError("Could not create account. Please try again.");
      setSubmitting(false);
      return;
    }

    // Inserts profile row
    await supabaseClient.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "user",
    });

    // Ensure we have a live session, regardless of whether signUp already
    // returned one (depends on Supabase's email-confirmation setting)
    const { data: signInData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setSubmitting(false);
      return;
    }

    const accessToken = signInData.session?.access_token;
    if (!accessToken) {
      setError("Could not start a session. Please try logging in.");
      setSubmitting(false);
      return;
    }

    // Server-side activation: starts the trial (enforcing "no second
    // trial" via a permanent per-email ledger) or verifies the Stripe
    // payment and marks the account premium. Neither of these is safe to
    // do from the client, so this call is what actually grants access
    const res = await fetch("/api/complete-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan,
        session_id: plan === "premium" ? sessionId : undefined,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Could not finish setting up your account.");
      setSubmitting(false);
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">
          {plan === "premium" ? "Create Your Premium Account" : "Create Your Free Trial Account"}
        </h1>

        {plan === "premium" && (
          <p className="text-sm text-sage bg-sage/10 border border-sage/30 rounded-md px-4 py-2">
            Payment received — finish creating your account to unlock access.
          </p>
        )}

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
            disabled={submitting}
            className="bg-ember text-cream font-semibold px-7 py-3.5 rounded-md hover:bg-ember-dark transition disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>

        </form>

        <div className="text-sm mt-4">
          <Link to="/login" className="text-ember-dark underline">
            Already have an account?
          </Link>
        </div>

      </div>
    </SectionWrapper>
  );
}