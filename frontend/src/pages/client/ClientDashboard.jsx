import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Compass,
  FolderOpen,
  Bell,
  FileText,
  MessageSquare,
  UserCheck,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/client/StatCard";
import WorkCard from "../../components/client/WorkCard";
import BidCard from "../../components/client/BidCard";
import ProviderCard from "../../components/client/ProviderCard";
import { fetchWorks } from "../../services/work";


const QUICK_ACTIONS = [
  { icon: Plus, label: "Post a Job", to: "/client/create-work" },
  { icon: Compass, label: "Browse Marketplace", to: "/marketplace" },
  { icon: FolderOpen, label: "My Works", to: "/client/my-works" },
  { icon: UserCheck, label: "Become a Provider", to: "/become-provider" },
];

export default function ClientDashboard() {
  const { user } = useAuth();

  const [recentWorks, setRecentWorks] = useState([]);
  const [worksLoading, setWorksLoading] = useState(true);
  const [worksError, setWorksError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentWorks() {
      try {
        setWorksLoading(true);
        setWorksError("");

        const response = await fetchWorks();

        // Support common API response formats.
        const works = Array.isArray(response)
  ? response
  : Array.isArray(response?.works)
    ? response.works
    : Array.isArray(response?.data)
      ? response.data
      : [];

        if (cancelled) return;

        const sortedWorks = [...works].sort((a, b) => {
          const dateA = new Date(
            a.created_at ?? a.createdAt ?? 0
          ).getTime();

          const dateB = new Date(
            b.created_at ?? b.createdAt ?? 0
          ).getTime();

          return dateB - dateA;
        });

        setRecentWorks(sortedWorks.slice(0, 3));
      } catch (error) {
        console.error("Failed to load recent works:", error);

        if (!cancelled) {
          setWorksError(
            "We couldn't load your recent work requests. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setWorksLoading(false);
        }
      }
    }

    loadRecentWorks();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const filteredWorks = recentWorks.filter((work) =>
    work.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.firstName ?? "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your jobs.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search your recent jobs..."
            aria-label="Search recent jobs"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Recent Works */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Works
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your latest service requests
                </p>
              </div>

              <Link
                to="/client/my-works"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {worksLoading ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Loading your recent works...
                  </p>
                </div>
              ) : worksError ? (
                <div className="bg-white border border-red-100 rounded-2xl p-6 text-center">
                  <p className="text-sm text-red-600">{worksError}</p>
                  <button
                    type="button"
                    onClick={() => setRetryCount((count) => count + 1)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try again
                  </button>
                </div>
              ) : filteredWorks.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                  <FolderOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />

                  <h3 className="font-semibold text-gray-900">
                    {searchTerm
                      ? "No matching work requests"
                      : "No work requests yet"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {searchTerm
                      ? "Try a different search term."
                      : "Create your first service request to see it here."}
                  </p>

                  {!searchTerm && (
                    <Link
                      to="/client/create-work"
                      className="inline-flex mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
                    >
                      Post a Job
                    </Link>
                  )}
                </div>
              ) : (
                filteredWorks.map((work) => (
  <Link
    key={work.id}
    to={`/client/works/${work.id}`}
    className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <WorkCard
      {...work}
      categoryName={
        work.categoryName ?? work.category_name ?? "General"
      }
    />
  </Link>
))
              )}
            </div>
          </section>

          {/* Recent Bids: connect to real bid API separately */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Recent Bids
              </h2>

              <Link
                to="/client/my-works"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View works
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-sm text-gray-500">
                Your bid activity will appear here when connected to the bid API.
              </p>
            </div>
          </section>

          {/* Recommended Providers */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Recommended Providers
            </h2>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-sm text-gray-500">
                Recommended providers will appear here when provider data is connected.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Notifications */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-gray-900">Notifications</h2>
            </div>

            <p className="text-sm text-gray-500">
              Notifications will appear here when notification data is connected.
            </p>
          </section>

          {/* Activity Timeline */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">
              Activity Timeline
            </h2>

            <p className="text-sm text-gray-500">
              Your recent activity will appear here when connected to real activity data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}