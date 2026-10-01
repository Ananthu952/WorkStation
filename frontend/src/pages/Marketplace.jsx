import { useState, useMemo } from "react";
import { Search, Inbox } from "lucide-react";
import ProviderCard from "../components/client/ProviderCard";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning", "Appliance Repair"];

// Mock data — replace with a real fetchProviders() call once the endpoint exists
const ALL_PROVIDERS = [
  { id: "1", name: "Marcus Lee", profession: "Plumbing", rating: 4.9, jobsCompleted: 210 },
  { id: "2", name: "Priya Nair", profession: "Electrical", rating: 4.8, jobsCompleted: 175 },
  { id: "3", name: "David Ortiz", profession: "Painting", rating: 4.7, jobsCompleted: 98 },
  { id: "4", name: "Sarah Chen", profession: "Plumbing", rating: 4.8, jobsCompleted: 156 },
  { id: "5", name: "Tom Becker", profession: "Carpentry", rating: 4.6, jobsCompleted: 84 },
  { id: "6", name: "Maria Gomez", profession: "Cleaning", rating: 4.9, jobsCompleted: 240 },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProviders = useMemo(() => {
    return ALL_PROVIDERS.filter((provider) => {
      const matchesCategory = category === "All" || provider.profession === category;
      const matchesSearch = provider.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-500 mt-1">Browse trusted providers by service category.</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search providers by name..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} {...provider} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No providers found</h3>
          <p className="text-gray-500 text-sm max-w-[280px]">
            Try a different search term or category filter.
          </p>
        </div>
      )}
    </div>
  );
}
