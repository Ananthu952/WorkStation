import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, ClipboardList, UserCheck, ArrowRight, Loader2 } from "lucide-react";
import StatCard from "../../components/client/StatCard";
import { fetchAdminStats } from "../../services/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats()
      .then((data) => setStats(data))
      .catch(() => setError("Couldn't load platform stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-[720px] mx-auto text-center py-24">
        <p className="text-gray-500">{error || "Couldn't load stats."}</p>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers, accent: "blue" },
    { icon: UserCheck, label: "Total Providers", value: stats.totalProviders, accent: "green" },
    { icon: Briefcase, label: "Total Works Posted", value: stats.totalWorks, accent: "purple" },
    {
      icon: ClipboardList,
      label: "Pending Applications",
      value: stats.pendingApplications,
      accent: "amber",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Pending applications callout */}
      {stats.pendingApplications > 0 && (
        <Link
          to="/admin/providers"
          className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between hover:bg-amber-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {stats.pendingApplications} provider application
                {stats.pendingApplications === 1 ? "" : "s"} need review
              </p>
              <p className="text-sm text-gray-500">
                Review and approve or reject pending applicants.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-600" />
        </Link>
      )}
    </div>
  );
}
