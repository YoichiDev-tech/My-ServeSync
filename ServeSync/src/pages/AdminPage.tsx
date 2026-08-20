import useAdminGuard from "../hooks/useAdminGuard";

export default function AdminPage() {
  useAdminGuard();

  return <div>Admin content here</div>;
}