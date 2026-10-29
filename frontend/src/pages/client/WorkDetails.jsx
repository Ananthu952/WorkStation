import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, Star, CheckCircle2, MoreVertical, Loader2 } from "lucide-react";
import StatusChip from "../../components/ui/StatusChip";
import { fetchWorkById, updateWork } from "../../services/work";
import { fetchCategoryById } from "../../services/category";
import { fetchBidsForWork, acceptBid, rejectBid } from "../../services/bid";
import { fetchProviderById } from "../../services/provider";
import { useToast } from "../../context/ToastContext";

export default function WorkDetails() {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [work, setWork] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [actioningBidId, setActioningBidId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchWorkById(workId)
      .then(async (data) => {
        setWork(data.work);
        if (data.work?.category_id) {
          try {
            const catData = await fetchCategoryById(data.work.category_id);
            setCategoryName(catData.category?.name || "");
          } catch {
            setCategoryName("");
          }
        }
      })
      .catch(() => setError("Couldn't load this job."))
      .finally(() => setLoading(false));
  }, [workId]);

  useEffect(() => {
    setBidsLoading(true);

    fetchBidsForWork(Number(workId))
      .then(async (data) => {
        // Bid records only carry provider_id — look up each provider's
        // business name and rating to display alongside the bid.
        const enriched = await Promise.all(
          (data.bids || []).map(async (bid) => {
            try {
              const providerData = await fetchProviderById(bid.provider_id);
              return {
                ...bid,
                providerName: providerData.provider?.business_name || "Unknown Provider",
                rating: providerData.provider?.rating,
              };
            } catch {
              return { ...bid, providerName: "Unknown Provider", rating: null };
            }
          })
        );
        setBids(enriched);
      })
      .catch(() => setBids([]))
      .finally(() => setBidsLoading(false));
  }, [workId]);

  const handleAccept = async (bidId) => {
    setActioningBidId(bidId);
    try {
      await acceptBid(bidId);
      setBids((prev) =>
        prev.map((bid) =>
          bid.id === bidId ? { ...bid, status: "accepted" } : { ...bid, status: "rejected" }
        )
      );

      // Explicitly flip the job to "assigned" so it drops out of Browse Jobs
      // for other providers — not assumed to happen automatically on accept.
      try {
        await updateWork(work.id, { status: "assigned" });
        setWork((prev) => ({ ...prev, status: "assigned" }));
      } catch {
        // Bid acceptance still succeeded even if this follow-up call fails
      }

      showToast("Bid accepted", "success");
    } catch {
      showToast("Couldn't accept this bid. Please try again.", "error");
    } finally {
      setActioningBidId(null);
    }
  };

  const handleReject = async (bidId) => {
    setActioningBidId(bidId);
    try {
      await rejectBid(bidId);
      setBids((prev) =>
        prev.map((bid) => (bid.id === bidId ? { ...bid, status: "rejected" } : bid))
      );
      showToast("Bid declined", "success");
    } catch {
      showToast("Couldn't decline this bid. Please try again.", "error");
    } finally {
      setActioningBidId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !work) {
    return (
      <div className="max-w-[720px] mx-auto text-center py-24">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!work) return null;

  const formattedDeadline = work.deadline
    ? new Date(work.deadline).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="max-w-[880px] mx-auto">
      <button
        onClick={() => navigate("/client/my-works")}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Works
      </button>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {categoryName && (
              <p className="text-sm font-medium text-blue-600 mb-1">{categoryName}</p>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{work.title}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusChip status={work.status} />
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6">{work.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">${work.budget}</span>
          </div>
          {formattedDeadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Due {formattedDeadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bids */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Bids Received{" "}
          <span className="text-gray-400 font-normal">({bidsLoading ? "…" : bids.length})</span>
        </h2>
      </div>

      {bidsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : bids.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-12 text-center text-gray-500 text-sm">
          No bids yet on this job.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
                    {bid.providerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{bid.providerName}</p>
                    {bid.rating && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-500">{bid.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gray-900">${bid.amount}</p>
                  <StatusChip status={bid.status} />
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">{bid.message}</p>

              {bid.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(bid.id)}
                    disabled={actioningBidId === bid.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Bid
                  </button>
                  <button
                    onClick={() => handleReject(bid.id)}
                    disabled={actioningBidId === bid.id}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}