import api from "./api";

// payload: { amount, message } — provider_id is set server-side from the JWT
export async function createBid(workId, payload) {
  const { data } = await api.post("/biddings/", { work_id: workId, ...payload });
  return data; // { success, message, bidding? }
}

export async function fetchAllBids() {
  const { data } = await api.get("/biddings/");
  return data; // { success, biddings: [{ id, work_id, provider_id, amount, message, status }] }
}

export async function fetchBidById(bidId) {
  const { data } = await api.get(`/biddings/${bidId}`);
  return data; // { success, bidding }
}

// NOTE: no "/works/:id/bids" endpoint exists — fetches everything and filters client-side.
export async function fetchBidsForWork(workId) {
  const { biddings } = await fetchAllBids();
  return { bids: biddings.filter((bid) => bid.work_id === workId) };
}

// NOTE: no "/biddings/mine" endpoint, and there's currently no reliable way to
// resolve the logged-in provider's own provider_id from existing endpoints
// (get_providers/get_provider don't return user_id). Pass providerId in once
// you have a way to obtain it — see the flagged gap below.
export async function fetchMyBids(providerId) {
  const { biddings } = await fetchAllBids();
  return { bids: biddings.filter((bid) => bid.provider_id === providerId) };
}

export async function updateBid(bidId, payload) {
  const { data } = await api.put(`/biddings/${bidId}`, payload);
  return data;
}

export async function deleteBid(bidId) {
  const { data } = await api.delete(`/biddings/${bidId}`);
  return data;
}

export async function acceptBid(bidId) {
  const { data } = await api.put(`/biddings/${bidId}/accept`);
  return data;
}

// NOTE: no dedicated reject endpoint on the backend — uses the generic
// update endpoint to set status to "rejected" instead.
export async function rejectBid(bidId) {
  const { data } = await api.put(`/biddings/${bidId}`, { status: "rejected" });
  return data;
}
