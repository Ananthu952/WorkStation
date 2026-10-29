import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Inbox, Loader2 } from "lucide-react";
import WorkCard from "../../components/client/WorkCard";
import Tabs from "../../components/common/Tabs";
import { useAuth } from "../../context/AuthContext";
import { fetchMyWorks } from "../../services/work";
import { fetchCategories } from "../../services/category";

const TABS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Assigned", value: "assigned" },
  { label: "Completed", value: "completed" },
];

export default function MyWorks() {
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    Promise.all([fetchMyWorks(user.id), fetchCategories()])
      .then(([worksData, categoriesData]) => {
        setWorks(worksData.works || []);
        const map = {};
        (categoriesData.categories || []).forEach((cat) => {
          map[cat.id] = cat.name;
        });
        setCategoryMap(map);
      })
      .catch(() => setError("Couldn't load your jobs. Please try again."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filteredWorks =
    activeTab === "all" ? works : works.filter((work) => work.status === activeTab);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Works</h1>
          <p className="text-gray-500 mt-1">All the jobs you&apos;ve posted, in one place.</p>
        </div>
        <Link
          to="/client/create-work"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </Link>
      </div>

      {/* Tabs */}
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
      ) : filteredWorks.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredWorks.map((work) => (
            <Link key={work.id} to={`/client/works/${work.id}`}>
              <WorkCard
                title={work.title}
                categoryName={categoryMap[work.category_id]}
                budget={work.budget}
                deadline={work.deadline}
                status={work.status}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No jobs here yet</h3>
          <p className="text-gray-500 text-sm max-w-[280px] mb-6">
            {activeTab === "all"
              ? "Post your first job and start getting bids from local pros."
              : `You don't have any ${activeTab.replace("_", " ")} jobs right now.`}
          </p>
          <Link
            to="/client/create-work"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
          >
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
}