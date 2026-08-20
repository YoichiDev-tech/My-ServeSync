import useAdminGuard from "../../hooks/useAdminGuard";
import SectionWrapper from "../../components/SectionWrapper";

export default function AdminDashboard() {
  useAdminGuard();

  return (
    <SectionWrapper className="bg-cream text-espresso pt-16 pb-24">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        <h1 className="text-4xl font-semibold">Admin Dashboard</h1>

        <p className="text-lg text-espresso/80">
          Manage users, view analytics, and control ServeSync settings.
        </p>

      </div>
    </SectionWrapper>
  );
}