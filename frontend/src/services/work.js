import api from "./api";

// payload: { title, description, budget, deadline, category_id }
// client_id is set server-side from the JWT — do not send it
export async function createWork(payload) {
  const { data } = await api.post("/works/", payload);
  return data; // { success, message, work? }
}

export async function fetchWorks() {
  const { data } = await api.get("/works/");
  return data; // { success, works: [{ id, title, budget, status, deadline, category_id, client_id }] }
}

export async function fetchWorkById(workId) {
  const { data } = await api.get(`/works/${workId}`);
  return data; // { success, work: { id, title, description, budget, deadline, status, client_id, category_id } }
}

export async function updateWork(workId, payload) {
  const { data } = await api.put(`/works/${workId}`, payload);
  return data;
}

export async function deleteWork(workId) {
  const { data } = await api.delete(`/works/${workId}`);
  return data;
}

// NOTE: the backend has no "/works/mine" endpoint. Until one exists,
// fetch the full list and filter client-side by the logged-in user's id.
export async function fetchMyWorks(currentUserId) {
  const { works } = await fetchWorks();
  return { works: works.filter((work) => work.client_id === currentUserId) };
}
