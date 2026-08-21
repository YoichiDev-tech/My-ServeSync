import useAuthGuard from "../../hooks/useAuthGuard";
import useTrialActivation from "../../hooks/useTrialActivation";
import SectionWrapper from "../../components/SectionWrapper";
import LogoutButton from "../../components/LogoutButton";

export default function Dashboard() {
  useAuthGuard();

  const { trialEndsAt } = useTrialActivation();

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Dashboard</h1>
          <LogoutButton />
        </div>

        {trialEndsAt && (
          <div className="bg-ember/10 border border-ember/40 text-espresso px-4 py-3 rounded-md text-sm">
            <p className="font-semibold">Your 14-day trial is active.</p>
            <p className="text-espresso/80">
              Trial ends on{" "}
              {new Date(trialEndsAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              .
            </p>
          </div>
        )}

        <p className="text-lg text-espresso/80">
          Welcome to your ServeSync dashboard.
        </p>

      </div>
    </SectionWrapper>
  );
}