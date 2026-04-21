import api from "./api";

// GET reviews for a product
export const fetchReviewsByProduct = (productId) =>
  api.get(`/reviews/product/${productId}`).then((r) => r.data);

// POST a review
export const createReview = (payload) =>
  api.post("/reviews", payload).then((r) => r.data);

// DELETE a review (admin)
export const deleteReviewApi = (reviewId) =>
  api.delete(`/reviews/${reviewId}`).then((r) => r.data);