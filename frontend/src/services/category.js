import api from "./api";

export async function fetchCategories() {
  const { data } = await api.get("/categories/");
  return data; // { success, categories: [{ id, name, description }] }
}

export async function fetchCategoryById(categoryId) {
  const { data } = await api.get(`/categories/${categoryId}`);
  return data; // { success, category: { id, name, description } }
}

// Admin only (requires JWT with role "admin")
export async function createCategory(payload) {
  // payload: { name, description }
  const { data } = await api.post("/categories/", payload);
  return data; // { success, message, category? }
}

// Admin only
export async function updateCategory(categoryId, payload) {
  // payload: { name, description }
  const { data } = await api.put(`/categories/${categoryId}`, payload);
  return data;
}

// Admin only
export async function deleteCategory(categoryId) {
  const { data } = await api.delete(`/categories/${categoryId}`);
  return data;
}
