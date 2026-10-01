import api from "./api";

export async function fetchProviders() {
  const { data } = await api.get("/providers/");
  return data; // { success, providers: [{ id, business_name, city, state, experience, hourly_rate, rating, verified, category_id, category_name }] }
}

export async function fetchProviderById(providerId) {
  const { data } = await api.get(`/providers/${providerId}`);
  return data; // { success, provider: { id, business_name, bio, experience, hourly_rate, phone, city, state, rating, verified, category_id, category_name } }
}

// The logged-in provider's own profile — resolves provider_id server-side from the JWT
export async function fetchMyProviderProfile() {
  const { data } = await api.get("/providers/me");
  return data; // { success, provider: {...} } or { success: false, message } if no profile exists yet
}

// Requires the logged-in user's JWT to already carry the "provider" role
export async function createProviderProfile(payload) {
  // payload: { business_name, bio, experience, hourly_rate, phone, city, state }
  const { data } = await api.post("/providers/", payload);
  return data;
}

// NOTE: backend takes provider_id, not "me" — see flagged issue below
export async function updateProviderProfile(providerId, payload) {
  const { data } = await api.put(`/providers/${providerId}`, payload);
  return data;
}

export async function deleteProviderProfile(providerId) {
  const { data } = await api.delete(`/providers/${providerId}`);
  return data;
}
