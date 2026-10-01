import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Inbox, Compass, Loader2 } from "lucide-react";
import ApplicationCard from "../../components/provider/ApplicationCard";
import Tabs from "../../components/common/Tabs";
import { fetchMyProviderProfile } from "../../services/provider";
import { fetchAllBids } from "../../services/bid";
import { fetchWorkById } from "../../services/work";

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchMyProviderProfile()
      .then(async (profileData) => {
        if (!profileData.success || !profileData.provider) {
          setError("No provider profile found for this account.");
          return;
        }

        const myProviderId = profileData.provider.id;
        const { biddings } = await fetchAllBids();
        const myBids = (biddings || []).filter((bid) => bid.provider_id === myProviderId);

        // Bid records only carry work_id — look up each job's title for display.
        const enriched = await Promise.all(
          myBids.map(async (bid) => {
            try {
              const workData = await fetchWorkById(bid.work_id);
              return { ...bid, jobTitle: workData.work?.title || "Untitled job" };
            } catch {
              return { ...bid, jobTitle: "Untitled job" };
            }
          })
        );

        setBids(enriched);
      })
      .catch(() => setError("Couldn't load your bids. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filteredBids = activeTab === "all" ? bids : bids.filter((bid) => bid.status === activeTab);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
        <p className="text-gray-500 mt-1">Track every bid you&apos;ve submitted, in one place.</p>
      </div>

      <div className="mb-6">
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      ) : filteredBids.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBids.map((bid) => (
            <ApplicationCard key={bid.id} jobTitle={bid.jobTitle} amount={bid.amount} status={bid.status} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No bids here yet</h3>
          <p className="text-gray-500 text-sm max-w-[280px] mb-6">
            {activeTab === "all"
              ? "Browse available jobs and submit your first bid."
              : `You don't have any ${activeTab} bids right now.`}
          </p>
          <Link
            to="/provider/browse-jobs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
          >
            <Compass className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
