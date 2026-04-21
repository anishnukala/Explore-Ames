// backend/controllers/reviewsController.js
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

function reviewsCol() {
  return getDb().collection("shop_reviews");
}

function mapReview(doc) {
  return {
    id: doc._id.toString(),
    productId: doc.productId.toString(),
    userName: doc.userName,
    rating: doc.rating,
    text: doc.text,
    createdAt: doc.createdAt,
  };
}

// GET /api/reviews/product/:productId
async function getReviewsByProduct(req, res) {
  try {
    const { productId } = req.params;
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const docs = await reviewsCol()
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(docs.map(mapReview));
  } catch (err) {
    console.error("getReviewsByProduct error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/reviews
// body: { productId, userName, rating, text }
async function createReview(req, res) {
  try {
    const { productId, userName, rating, text } = req.body || {};

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }
    if (!userName || !String(userName).trim()) {
      return res.status(400).json({ message: "userName is required" });
    }
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: "rating must be 1-5" });
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    const review = {
      productId: new ObjectId(productId),
      userName: String(userName).trim(),
      rating: r,
      text: String(text).trim(),
      createdAt: new Date(),
    };

    const result = await reviewsCol().insertOne(review);

    res.status(201).json({
      id: result.insertedId.toString(),
      productId,
      userName: review.userName,
      rating: review.rating,
      text: review.text,
      createdAt: review.createdAt,
    });
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/reviews/:id   (admin moderation)
async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const result = await reviewsCol().deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return res.status(404).json({ message: "Review not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("deleteReview error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};