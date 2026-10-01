import api from "./api";

// Uploads a single image file, returns its served URL (e.g. "/uploads/abc123.jpg").
// Call this first, then attach the returned url to whatever record you're saving
// (e.g. avatar_url on your profile, photo_urls on a work, portfolio_urls on a provider).
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/uploads/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { success, url }
}

// Convenience helper for uploading several files at once, returning an array of URLs
export async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    const result = await uploadFile(file);
    urls.push(result.url);
  }
  return urls;
}
