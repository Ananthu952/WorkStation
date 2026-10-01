import api from "./api";

export async function updateProfile(payload) {
  // payload: { fullname, phone, address }
  const { data } = await api.patch("/users/me", payload);
  return data; // { success, user: { id, fullname, email, phone, address, role } }
}

export async function changePassword(payload) {
  // payload: { currentPassword, newPassword }
  const { data } = await api.post("/users/me/change-password", payload);
  return data;
}

export async function fetchNotificationSettings() {
  const { data } = await api.get("/users/me/settings");
  return data; // { success, settings: { emailNotifications, smsNotifications, pushNotifications, marketingEmails } }
}

export async function updateNotificationSettings(payload) {
  // payload: { emailNotifications, smsNotifications, pushNotifications, marketingEmails }
  const { data } = await api.patch("/users/me/settings", payload);
  return data;
}

export async function deleteAccount() {
  const { data } = await api.delete("/users/me");
  return data;
}
