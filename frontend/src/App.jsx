import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import VerifyOtp from "./pages/public/VerifyOtp";
import ResetPassword from "./pages/public/ResetPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import CreateWork from "./pages/client/CreateWork";
import MyWorks from "./pages/client/MyWorks";
import WorkDetails from "./pages/client/WorkDetails";
import ClientProfile from "./pages/client/ClientProfile";
import BecomeProvider from "./pages/client/BecomeProvider";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import BrowseJobs from "./pages/provider/BrowseJobs";
import JobDetails from "./pages/provider/JobDetails";
import MyBids from "./pages/provider/MyBids";
import ProviderProfile from "./pages/provider/ProviderProfile";
import PublicProviderProfile from "./pages/PublicProviderProfile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Marketplace from "./pages/Marketplace";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            {/* Client + provider routes share the standard dashboard shell */}
            <Route element={<DashboardLayout />}>
              {/* Every logged-in user has the "client" role, so these just need ProtectedRoute */}
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/client/create-work" element={<CreateWork />} />
              <Route path="/client/my-works" element={<MyWorks />} />
              <Route path="/client/works/:workId" element={<WorkDetails />} />
              <Route path="/client/profile" element={<ClientProfile />} />
              <Route path="/become-provider" element={<BecomeProvider />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:providerId" element={<ProviderProfile />} />
              {/* Provider-only routes — requires the "provider" role, granted
                  after admin approves a Provider Application. */}
              <Route element={<RoleRoute allowedRoles={["provider"]} />}>
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/provider/browse-jobs" element={<BrowseJobs />} />
                <Route path="/provider/jobs/:jobId" element={<JobDetails />} />
                <Route path="/provider/my-bids" element={<MyBids />} />
                <Route path="/provider/profile" element={<ProviderProfile />} />
              </Route>
            </Route>

            {/* Admin routes get their own layout/nav, separate from the client/provider shell */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/providers" element={<AdminProviders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route
  path="/marketplace/:providerId"
  element={<PublicProviderProfile />}
/>
<Route path="/marketplace" element={<Marketplace />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
