import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuthGuard from "../../hooks/useAuthGuard";
import useProfile from "../../hooks/useProfile";
import { supabaseClient } from "../../utils/supabaseClient";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/scheduling", label: "Scheduling" },
  { to: "/dashboard/inventory", label: "Inventory" },
  { to: "/dashboard/staff", label: "Staff" },
  { to: "/dashboard/reports", label: "Reports" },
  { to: "/subscribe", label: "Subscription" },
  { to: "/settings", label: "Settings" },
];

export default function DashboardLayout() {
  useAuthGuard();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    navigate("/", { replace: true });
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 rounded-md font-medium transition ${
      isActive ? "bg-ember text-cream" : "text-espresso/80 hover:bg-espresso/5"
    }`;

  return (
    <div className="min-h-screen flex bg-cream text-espresso">

      <aside className="hidden md:flex md:flex-col w-64 border-r border-espresso/10 bg-paper shrink-0">
        <div className="px-5 py-6 font-display text-xl font-semibold">ServeSync</div>
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
          {profile?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </nav>
        <div className="px-4 py-5 border-t border-espresso/10">
          <p className="text-xs text-espresso/60 truncate">{profile?.email}</p>
          <button type="button" onClick={handleLogout} className="mt-2 text-sm text-ember-dark underline">
            Log out
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-paper border-b border-espresso/10 flex items-center justify-between px-4 py-3">
        <span className="font-display text-lg font-semibold">ServeSync</span>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="border border-espresso/25 rounded-md px-3 py-1.5"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 z-20 bg-paper border-b border-espresso/10 px-3 py-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          {profile?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Admin
            </NavLink>
          )}
          <button type="button" onClick={handleLogout} className="text-left px-4 py-2.5 text-sm text-ember-dark underline">
            Log out
          </button>
        </div>
      )}

      <main className="flex-1 px-6 py-8 md:py-8 pt-20 md:pt-8 max-w-5xl">
        <Outlet />
      </main>

    </div>
  );
}