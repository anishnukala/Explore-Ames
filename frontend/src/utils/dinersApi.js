// src/utils/dinersApi.js
import api from "./api";

// DINERS CRUD
export const fetchDiners = async () => (await api.get("/diners")).data;

export const createDiner = async (payload) => (await api.post("/diners", payload)).data;

export const updateDiner = async (id, payload) =>
  (await api.put(`/diners/${id}`, payload)).data;

export const deleteDiner = async (id) => (await api.delete(`/diners/${id}`)).data;

export const fetchDinerById = async (id) => (await api.get(`/diners/${id}`)).data;


// CREATE review for a diner
export const createDinerReview = async (dinerId, payload) =>
  (
    await api.post("/diner-reviews", {
      dinerId: String(dinerId),
      rating: Number(payload?.rating || 0),
      text: payload?.text ?? payload?.comment ?? "",
      userEmail: payload?.userEmail || "anonymous",
      userName: payload?.userName || payload?.user || "",
    })
  ).data;

// GET reviews for a diner
export const fetchDinerReviews = async (dinerId) =>
  (await api.get(`/diner-reviews/diner/${dinerId}`)).data;

// DELETE a diner review (admin)
export const deleteDinerReviewApi = async (reviewId) =>
  (await api.delete(`/diner-reviews/${reviewId}`)).data;