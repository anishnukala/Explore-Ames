import api from "./api";

export const getFaqs = () => api.get("/api/faqs");
export const createFaq = (data) => api.post("/api/faqs", data);
export const updateFaq = (id, data) => api.put(`/api/faqs/${id}`, data);
export const deleteFaq = (id) => api.delete(`/api/faqs/${id}`);