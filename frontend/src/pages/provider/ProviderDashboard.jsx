import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Clock, CheckCircle2, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/client/StatCard";
import AvailableJobCard from "../../components/provider/AvailableJobCard";
import ApplicationCard from "../../components/provider/ApplicationCard";
import { fetchWorks } from "../../services/work";
import { fetchCategories } from "../../services/category";
import { fetchMyProviderProfile } from "../../services/provider";
import { fetchAllBids } from "../../services/bid";

export default function ProviderDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openJobs, setOpenJobs] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([fetchWorks(), fetchCategories(), fetchMyProviderProfile()])
      .then(async ([worksData, categoriesData, profileData]) => {
        const myCategoryId = profileData.success ? profileData.provider?.category_id : null;

        // Only show jobs matching this provider's own category, same rule as Browse Jobs.
        const open = (worksData.works || []).filter(
          (w) => w.status === "open" && (myCategoryId == null || w.category_id === myCategoryId)
        );
        setOpenJobs(open);

        const map = {};
        (categoriesData.categories || []).forEach((cat) => {
          map[cat.id] = cat.name;
        });
        setCategoryMap(map);

        if (profileData.success && profileData.provider) {
          const myProviderId = profileData.provider.id;
          const { biddings } = await fetchAllBids();
          const mine = (biddings || []).filter((b) => b.provider_id === myProviderId);

          const enriched = await Promise.all(
            mine.map(async (bid) => {
              const workMatch = (worksData.works || []).find((w) => w.id === bid.work_id);
              return { ...bid, jobTitle: workMatch?.title || "Untitled job" };
            })
          );
          setMyBids(enriched);
        }
      })
      .catch(() => setError("Couldn't load your dashboard. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const pendingCount = myBids.filter((b) => b.status === "pending").length;
  const acceptedCount = myBids.filter((b) => b.status === "accepted").length;

  const stats = [
    { icon: Briefcase, label: "Available Jobs", value: openJobs.length, accent: "blue" },
    { icon: Clock, label: "Pending Bids", value: pendingCount, accent: "amber" },
    { icon: CheckCircle2, label: "Accepted Bids", value: acceptedCount, accent: "green" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName ?? "there"} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s how your provider business is doing.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Available Jobs</h2>
          <Link
            to="/provider/browse-jobs"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Browse all
          </Link>
        </div>
        {openJobs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {openJobs.slice(0, 3).map((job) => (
              <Link key={job.id} to={`/provider/jobs/${job.id}`}>
                <AvailableJobCard
                  title={job.title}
                  categoryName={categoryMap[job.category_id]}
                  budget={job.budget}
                  deadline={job.deadline}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            No open jobs right now.
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
          <Link
            to="/provider/my-bids"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        {myBids.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {myBids.slice(0, 3).map((bid) => (
              <ApplicationCard key={bid.id} jobTitle={bid.jobTitle} amount={bid.amount} status={bid.status} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            You haven&apos;t submitted any bids yet.
          </p>
        )}
      </section>
    </div>
  );
}
