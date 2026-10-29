import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, DollarSign, Calendar, Loader2 } from "lucide-react";

import { createWork } from "../../services/work";
import { fetchCategories } from "../../services/category";

export default function CreateWork() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    budget: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setError("Couldn't load categories. Please refresh and try again."))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const result = await createWork({
        title: formData.title,
        description: formData.description,
        category_id: Number(formData.categoryId),
        budget: Number(formData.budget),
        deadline: formData.deadline,
      });

      if (result.work?.id) {
        navigate(`/client/works/${result.work.id}`, { replace: true });
      } else {
        navigate("/client/my-works", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't post your job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>
        <p className="text-gray-500 mt-1">
          Describe what you need done and start receiving bids from local pros.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <div className="relative">
            <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Fix leaking kitchen faucet"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          {categoriesLoading ? (
            <p className="text-sm text-gray-400">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, categoryId: cat.id }))}
                  className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.categoryId === cat.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Give as much detail as you can — what needs fixing, any relevant measurements, materials, or access notes."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="budget"
              required
              min="0"
              value={formData.budget}
              onChange={handleChange}
              placeholder="120"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.categoryId}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Posting Job...
            </>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
}