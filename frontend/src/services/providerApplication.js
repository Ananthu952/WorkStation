import api from "./api";

// payload: { category_id, business_name, experience, phone, address,
//            government_id, license_number, skills, availability, hourly_rate }
export async function submitApplication(payload) {
  const { data } = await api.post("/provider-applications/", payload);
  return data; // { success, message, application_id }
}

export async function fetchMyApplication() {
  const { data } = await api.get("/provider-applications/mine");
  return data; // { success, application: { id, status } | null }
}

// Admin only
export async function fetchAllApplications(status) {
  const { data } = await api.get("/provider-applications/", {
    params: status ? { status } : {},
  });
  return data; // { success, applications: [...] }
}

// Admin only
export async function approveApplication(applicationId) {
  const { data } = await api.post(`/provider-applications/${applicationId}/approve`);
  return data;
}

// Admin only
export async function rejectApplication(applicationId) {
  const { data } = await api.post(`/provider-applications/${applicationId}/reject`);
  return data;
}
