import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Trial from "./pages/Trial";
import TrialFree from "./pages/TrialFree";
import TrialPremium from "./pages/TrialPremium";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// App pages
import Dashboard from "./pages/dashboard/Dashboard";
import Scheduling from "./pages/dashboard/Scheduling";
import Inventory from "./pages/dashboard/Inventory";
import Staff from "./pages/dashboard/Staff";
import Reports from "./pages/dashboard/Reports";
import TrialExpired from "./pages/TrialExpired";
import Subscribe from "./pages/Subscribe";
import UserSettings from "./pages/settings/UserSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public/marketing pages — keep the marketing navbar + footer */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/trial/free" element={<TrialFree />} />
          <Route path="/trial/premium" element={<TrialPremium />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/trial-expired" element={<TrialExpired />} />
        </Route>

        {/* App/dashboard pages — own shell, no marketing chrome */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/scheduling" element={<Scheduling />} />
          <Route path="/dashboard/inventory" element={<Inventory />} />
          <Route path="/dashboard/staff" element={<Staff />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}