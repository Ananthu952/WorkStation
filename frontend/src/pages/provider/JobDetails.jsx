import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { fetchWorkById } from "../../services/work";
import { fetchCategoryById } from "../../services/category";
import { createBid } from "../../services/bid";

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [bidData, setBidData] = useState({ amount: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError("");

    fetchWorkById(jobId)
      .then(async (data) => {
        setJob(data.work);
        if (data.work?.category_id) {
          try {
            const catData = await fetchCategoryById(data.work.category_id);
            setCategoryName(catData.category?.name || "");
          } catch {
            setCategoryName("");
          }
        }
      })
      .catch(() => setLoadError("Couldn't load this job."))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBidData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    try {
      setSubmitting(true);
      await createBid(Number(jobId), {
        amount: Number(bidData.amount),
        message: bidData.message,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Couldn't submit your bid. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (loadError || !job) {
    return (
      <div className="max-w-[720px] mx-auto text-center py-24">
        <p className="text-gray-500">{loadError || "Job not found."}</p>
      </div>
    );
  }

  const formattedDeadline = job.deadline
    ? new Date(job.deadline).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-[720px] mx-auto">
      <button
        onClick={() => navigate("/provider/browse-jobs")}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse Jobs
      </button>

      {/* Job header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        {categoryName && <p className="text-sm font-medium text-blue-600 mb-1">{categoryName}</p>}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h1>

        <p className="text-gray-600 leading-relaxed mb-6">{job.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">${job.budget}</span>
          </div>
          {formattedDeadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Due {formattedDeadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bid form */}
      {submitted ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="font-bold text-gray-900 mb-1">Bid submitted</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-[360px]">
            Your bid has been sent. You&apos;ll be notified if it&apos;s accepted.
          </p>
          <button
            onClick={() => navigate("/provider/my-bids")}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
          >
            View My Bids
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5"
        >
          <h2 className="font-bold text-gray-900">Submit Your Bid</h2>

          {submitError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="amount"
                required
                min="0"
                value={bidData.amount}
                onChange={handleChange}
                placeholder="120"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Client
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={bidData.message}
              onChange={handleChange}
              placeholder="Introduce yourself and explain your approach to this job..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Bid...
              </>
            ) : (
              "Submit Bid"
            )}
          </button>
        </form>
      )}
    </div>
  );
}