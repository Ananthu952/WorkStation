import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Briefcase, MapPin, Phone, Inbox, Loader2 } from "lucide-react";
import StatusChip from "../../components/ui/StatusChip";
import Tabs from "../../components/common/Tabs";
import { useToast } from "../../context/ToastContext";
import {
  fetchAllApplications,
  approveApplication,
  rejectApplication,
} from "../../services/providerApplication";

const TABS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminProviders() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [actioningId, setActioningId] = useState(null);

  const loadApplications = () => {
    setLoading(true);
    setLoadError("");

    fetchAllApplications()
      .then((data) => setApplications(data.applications || []))
      .catch(() => setLoadError("Couldn't load provider applications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filtered = applications.filter((app) => app.status === activeTab);

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "approved" } : app))
      );
      showToast("Provider application approved", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't approve this application.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await rejectApplication(id);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: "rejected" } : app))
      );
      showToast("Provider application rejected", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't reject this application.", "error");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Provider Applications</h1>
        <p className="text-gray-500 mt-1">
          Review applications and grant the provider role once verified.
        </p>
      </div>

      <div className="mb-6">
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shrink-0">
                    {(app.fullname || "?")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{app.fullname}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {app.business_name} · {app.category_name} · {app.experience} yrs
                    </p>
                  </div>
                </div>
                <StatusChip status={app.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {app.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {app.address}
                </span>
              </div>

              {app.skills && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {app.skills.split(",").map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {app.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={actioningId === app.id}
                    className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={actioningId === app.id}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Nothing here</h3>
          <p className="text-gray-500 text-sm max-w-[280px]">
            There are no {activeTab} applications right now.
          </p>
        </div>
      )}
    </div>
  );
}