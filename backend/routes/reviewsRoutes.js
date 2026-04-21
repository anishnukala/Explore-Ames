// backend/routes/reviewsRoutes.js
const express = require("express");
const router = express.Router();

const {
  getReviewsByProduct,
  createReview,
  deleteReview,
} = require("../controllers/reviewsController");

// list reviews for a product
router.get("/product/:productId", getReviewsByProduct);

// add a review
router.post("/", createReview);

// admin delete review
router.delete("/:id", deleteReview);

module.exports = router;