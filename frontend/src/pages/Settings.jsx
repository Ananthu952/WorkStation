import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Smartphone, Megaphone, Bell, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updateNotificationSettings, fetchNotificationSettings, deleteAccount } from "../services/user";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const PREFERENCE_ITEMS = [
  {
    key: "emailNotifications",
    icon: Mail,
    label: "Email Notifications",
    description: "Bid updates, job status changes, and account activity.",
  },
  {
    key: "smsNotifications",
    icon: Smartphone,
    label: "SMS Notifications",
    description: "Text alerts for time-sensitive updates.",
  },
  {
    key: "pushNotifications",
    icon: Bell,
    label: "Push Notifications",
    description: "Real-time alerts in your browser or app.",
  },
  {
    key: "marketingEmails",
    icon: Megaphone,
    label: "Marketing Emails",
    description: "Product updates, tips, and promotional offers.",
  },
];

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  });
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  useEffect(() => {
    fetchNotificationSettings()
      .then((data) => {
        if (data.success && data.settings) {
          setPreferences(data.settings);
        }
      })
      .catch(() => {
        // Falls back to the defaults above if this fails
      })
      .finally(() => setPrefsLoading(false));
  }, []);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleToggle = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    setSavedPrefs(false);

    try {
      setSavingPrefs(true);
      await updateNotificationSettings(updated);
      setSavedPrefs(true);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    try {
      setDeleting(true);
      await deleteAccount();
      logout();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Couldn't delete your account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[640px] mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage how FixHive communicates with you.</p>
      </div>

      {/* Notification preferences */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900">Notification Preferences</h2>
          {savedPrefs && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {prefsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          ) : (
            PREFERENCE_ITEMS.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              <Toggle
                checked={preferences[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            </div>
            ))
          )}
        </div>

        {savingPrefs && (
          <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving preference...
          </p>
        )}
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="font-bold text-gray-900">Danger Zone</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Deleting your account is permanent. All your jobs, bids, and history will be removed
          and cannot be recovered.
        </p>

        {deleteError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {deleteError}
          </div>
        )}

        {!deleteConfirmOpen ? (
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition-all"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-900">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 transition-all"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete My Account"
                )}
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}