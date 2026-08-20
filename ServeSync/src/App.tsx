import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Trial from "./pages/Trial";
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
import TrialExpired from "./pages/TrialExpired";
import Subscribe from "./pages/Subscribe";
import UserSettings from "./pages/settings/UserSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* Public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* App pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trial-expired" element={<TrialExpired />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}