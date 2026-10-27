import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Inbox,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import ProviderCard from "../components/client/ProviderCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const CATEGORIES = [
  "All",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Appliance Repair",
];

const categoryAliases = {
  Plumber: ["plumber", "plumbing"],
  Electrician: ["electrician", "electrical"],
  Carpenter: ["carpenter", "carpentry"],
  Painter: ["painter", "painting"],
  Cleaner: ["cleaner", "cleaning"],
  "Appliance Repair": [
    "appliance repair",
    "appliance technician",
  ],
};

export default function Marketplace() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real providers from the Flask backend
  async function loadProviders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/v1/providers/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load providers (${response.status}).`
        );
      }

      const result = await response.json();

      if (
        result.success !== true ||
        !Array.isArray(result.providers)
      ) {
        throw new Error(
          "The server returned an invalid providers response."
        );
      }

      setProviders(result.providers);
    } catch (err) {
      setError(
        err.message || "Unable to load service providers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProviders();
  }, []);

  // Search and category filtering
  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return providers.filter((provider) => {
      const profession = String(
        provider.category_name || ""
      )
        .trim()
        .toLowerCase();

      const allowedCategories =
        categoryAliases[category] || [
          category.toLowerCase(),
        ];

      const matchesCategory =
        category === "All" ||
        allowedCategories.includes(profession);

      const searchableText = [
        provider.business_name,
        profession,
        provider.city,
        provider.state,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [providers, search, category]);

  return (
    <div className="min-h-full">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Marketplace
        </h1>

        <p className="mt-1 text-gray-500">
          Browse service providers and find the right
          professional for your work.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by business name, service, or location..."
          aria-label="Search service providers"
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center py-16 text-gray-500">
          <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-blue-600" />

          <p>Loading service providers...</p>
        </div>
      ) : error ? (
        /* Error state */
        <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
          <h3 className="mb-2 font-semibold text-gray-900">
            Unable to load providers
          </h3>

          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadProviders}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      ) : filteredProviders.length > 0 ? (
        /* Real provider cards */
        <>
          <p className="mb-4 text-sm text-gray-500">
            {filteredProviders.length}{" "}
            {filteredProviders.length === 1
              ? "provider"
              : "providers"}{" "}
            found
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
              />
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Inbox className="h-6 w-6 text-blue-600" />
          </div>

          <h3 className="mb-1 font-semibold text-gray-900">
            No providers found
          </h3>

          <p className="max-w-sm text-sm text-gray-500">
            {providers.length === 0
              ? "No service providers have registered yet."
              : "Try another search term or category."}
          </p>

          {search || category !== "All" ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
