import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main className="pt-20 max-w-[1280px] mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}