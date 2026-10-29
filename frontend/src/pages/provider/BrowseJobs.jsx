import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Inbox, Loader2, Briefcase } from "lucide-react";
import AvailableJobCard from "../../components/provider/AvailableJobCard";
import Dropdown from "../../components/common/Dropdown";
import { fetchWorks } from "../../services/work";
import { fetchMyProviderProfile } from "../../services/provider";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "budget_high", label: "Budget: High to low" },
  { value: "budget_low", label: "Budget: Low to high" },
];

export default function BrowseJobs() {
  const [works, setWorks] = useState([]);
  const [myCategoryName, setMyCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchMyProviderProfile()
      .then(async (profileData) => {
        if (!profileData.success || !profileData.provider) {
          setError("No provider profile found for this account.");
          return;
        }

        const myCategoryId = profileData.provider.category_id;
        setMyCategoryName(profileData.provider.category_name || "");

        const worksData = await fetchWorks();

        // Only show open jobs that match this provider's own category —
        // an electrician should never see plumbing jobs, and vice versa.
        const matchingOpenWorks = (worksData.works || []).filter(
          (work) => work.status === "open" && work.category_id === myCategoryId
        );

        setWorks(matchingOpenWorks);
      })
      .catch(() => setError("Couldn't load available jobs. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filteredWorks = useMemo(() => {
    let result = works.filter((work) => work.title.toLowerCase().includes(search.toLowerCase()));

    if (sort === "newest") {
      result = [...result].sort((a, b) => b.id - a.id);
    } else if (sort === "budget_high") {
      result = [...result].sort((a, b) => b.budget - a.budget);
    } else if (sort === "budget_low") {
      result = [...result].sort((a, b) => a.budget - b.budget);
    }

    return result;
  }, [works, search, sort]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        {myCategoryName ? (
          <p className="text-gray-500 mt-1 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            Showing open <span className="font-medium text-gray-700">{myCategoryName}</span> jobs
            that match your profession.
          </p>
        ) : (
          <p className="text-gray-500 mt-1">Find jobs that match your skills.</p>
        )}
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by title..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="sm:w-56">
          <Dropdown options={SORT_OPTIONS} value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      ) : filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWorks.map((work) => (
            <Link key={work.id} to={`/provider/jobs/${work.id}`}>
              <AvailableJobCard
                title={work.title}
                categoryName={myCategoryName}
                budget={work.budget}
                deadline={work.deadline}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No open jobs right now</h3>
          <p className="text-gray-500 text-sm max-w-[280px]">
            {myCategoryName
              ? `There are no open ${myCategoryName} jobs at the moment. Check back later.`
              : "Try a different search term."}
          </p>
        </div>
      )}
    </div>
  );
}