import api from "./api";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // expected shape: { token, user: { id, firstName, lastName, email, roles: ["client"] } }
}

export async function register(payload) {
  // payload: { firstName, lastName, email, password }
  // No role is sent — the backend always creates the account with roles: ["client"]
  const { data } = await api.post("/auth/register", payload);
  return data; // expected shape: { token, user }
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data; // expected shape: { user }
}

export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function verifyOtp(email, otp) {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data; // expected shape: { resetToken }
}

export async function resendOtp(email) {
  const { data } = await api.post("/auth/resend-otp", { email });
  return data;
}

export async function resetPassword(resetToken, password) {
  const { data } = await api.post("/auth/reset-password", { resetToken, password });
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}
