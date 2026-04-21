

// src/utils/exploreApi.js
import api from "./api";

// GET all places
export async function fetchExplorePlaces() {
  const res = await api.get("/explore"); // or "/explorePlaces" depending on your backend
  return res.data;
}

// POST create place  ✅ IMPORTANT: return res.data
export async function createExplorePlace(payload) {
  const res = await api.post("/explore", payload);
  return res.data;
}

// PUT update place ✅ IMPORTANT: return res.data
export async function updateExplorePlace(id, payload) {
  const res = await api.put(`/explore/${id}`, payload);
  return res.data;
}

// DELETE place ✅ IMPORTANT: return res.data
export async function deleteExplorePlace(id) {
  const res = await api.delete(`/explore/${id}`);
  return res.data;
}