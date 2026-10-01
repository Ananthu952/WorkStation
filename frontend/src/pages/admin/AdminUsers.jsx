import { useState, useEffect, useMemo } from "react";
import { Search, Ban, RotateCcw, Inbox, Loader2 } from "lucide-react";
import StatusChip from "../../components/ui/StatusChip";
import { useToast } from "../../context/ToastContext";
import { fetchAllUsers, suspendUser, reactivateUser } from "../../services/admin";

const ROLE_FILTERS = ["All", "Client", "Provider", "Admin"];

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    fetchAllUsers()
      .then((data) => setUsers(data.users || []))
      .catch(() => setLoadError("Couldn't load users."))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullname.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleSuspend = async (id) => {
    setActioningId(id);
    try {
      await suspendUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: false } : u)));
      showToast("User suspended", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't suspend this user.", "error");
    } finally {
      setActioningId(null);
    }
  };

  const handleReactivate = async (id) => {
    setActioningId(id);
    try {
      await reactivateUser(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: true } : u)));
      showToast("User reactivated", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't reactivate this user.", "error");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">Manage every account on the platform.</p>
      </div>

      {/* Search + role filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                roleFilter === role
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
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
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{user.fullname}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusChip status={user.is_active ? "active" : "suspended"} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.is_active ? (
                      <button
                        onClick={() => handleSuspend(user.id)}
                        disabled={actioningId === user.id}
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(user.id)}
                        disabled={actioningId === user.id}
                        className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 text-sm max-w-[280px]">
            Try a different search term or role filter.
          </p>
        </div>
      )}
    </div>
  );
}
