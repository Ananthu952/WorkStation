import api from "./api";

export async function fetchAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data; // { success, totalUsers, totalProviders, totalWorks, pendingApplications }
}

// Provider application approve/reject now live in services/providerApplication.js
// (real endpoints — see fetchAllApplications, approveApplication, rejectApplication)

export async function fetchAllUsers() {
  const { data } = await api.get("/admin/users");
  return data; // expected shape: { users: [...] }
}

export async function suspendUser(userId) {
  const { data } = await api.post(`/admin/users/${userId}/suspend`);
  return data;
}

export async function reactivateUser(userId) {
  const { data } = await api.post(`/admin/users/${userId}/reactivate`);
  return data;
}
