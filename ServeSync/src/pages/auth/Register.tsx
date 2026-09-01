import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabaseClient } from "../../utils/supabaseClient";
import SectionWrapper from "../../components/SectionWrapper";

type Plan = "trial" | "counter" | "kitchen" | "group";

const PLAN_LABELS: Record<Plan, string> = {
  trial: "Free Trial",
  counter: "Counter",
  kitchen: "Kitchen",
  group: "Group",
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawPlan = searchParams.get("plan");
  const sessionId = searchParams.get("session_id");

  const plan: Plan | null =
    rawPlan === "trial" ||
    rawPlan === "counter" ||
    rawPlan === "kitchen" ||
    rawPlan === "group"
      ? rawPlan
      : null;

  const isPaidPlan =
    plan === "counter" || plan === "kitchen" || plan === "group";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Trial reuse + expiration enforcement
  useEffect(() => {
    async function enforceTrialRules() {
      if (!plan || (isPaidPlan && !sessionId)) {
        navigate("/trial", { replace: true });
        return;
      }

      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      // If user is logged in, check if they already used trial
      if (session) {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("has_used_trial, subscription_status, trial_ends_at")
          .eq("id", session.user.id)
          .single();

        if (!profile) return;

        const { has_used_trial, subscription_status, trial_ends_at } = profile;

        // If user already used trial and is not premium -> block
        if (plan === "trial" && has_used_trial && subscription_status !== "active") {
          navigate("/trial-expired", { replace: true });
          return;
        }

        // If trial expired -> block
        if (
          plan === "trial" &&
          subscription_status === "trialing" &&
          trial_ends_at &&
          new Date(trial_ends_at) < new Date()
        ) {
          navigate("/trial-expired", { replace: true });
          return;
        }
      }
    }

    enforceTrialRules();
  }, [plan, isPaidPlan, sessionId, navigate]);

  if (!plan || (isPaidPlan && !sessionId)) {
    return null;
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { data: signUpData, error: signUpError } =
      await supabaseClient.auth.signUp({
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

    await supabaseClient.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "user",
    });

    const { data: signInData, error: loginError } =
      await supabaseClient.auth.signInWithPassword({
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

    const res = await fetch("/api/complete-onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan,
        session_id: isPaidPlan ? sessionId : undefined,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(
        data.error || "Could not finish setting up your account."
      );
      setSubmitting(false);
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <h1 className="text-4xl font-semibold">
          {isPaidPlan
            ? `Create Your ${PLAN_LABELS[plan]} Account`
            : "Create Your Free Trial Account"}
        </h1>

        {isPaidPlan && (
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