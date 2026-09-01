import useAdminGuard from "../../hooks/useAdminGuard";
import StaffCreation from "../../sections/StaffCreation";

export default function AdminDashboard() {
  useAdminGuard();

  return (
    <div className="flex flex-col gap-8">

      <div>
        <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
        <p className="text-lg text-espresso/80 mt-2">
          Manage users, view analytics, and control ServeSync settings.
        </p>
      </div>

      <StaffCreation />

    </div>
  );
}