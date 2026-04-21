const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

const col = () => getDb().collection("diner_reviews");

function dinerIdQuery(dinerId) {
  const idStr = String(dinerId || "").trim();
  const or = [{ dinerId: idStr }, { productId: idStr }];

  if (ObjectId.isValid(idStr)) {
    const oid = new ObjectId(idStr);
    or.unshift({ dinerId: oid }, { productId: oid });
  }

  return { $or: or };
}

// ✅ POST /api/diner-reviews
async function createDinerReview(req, res) {
  try {
    const { dinerId, rating, text, comment, userEmail, userName } = req.body || {};

    const dinerIdStr = String(dinerId || "").trim();
    if (!dinerIdStr) return res.status(400).json({ message: "dinerId is required" });

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: "rating must be between 1 and 5" });
    }

    const doc = {
      dinerId: dinerIdStr, // store as string always
      rating: r,
      text: String(text ?? comment ?? "").trim(),
      userEmail: String(userEmail || "anonymous").trim(),
      userName: String(userName || "").trim(),
      createdAt: new Date(),
    };

    const result = await col().insertOne(doc);
    const saved = await col().findOne({ _id: result.insertedId });

    res.status(201).json({
      id: saved._id.toString(),
      dinerId: String(saved.dinerId),
      userName: saved.userName || saved.userEmail || "Anonymous",
      userEmail: saved.userEmail || "",
      rating: saved.rating,
      text: saved.text || "",
      createdAt: saved.createdAt,
    });
  } catch (e) {
    console.error("createDinerReview error:", e);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ GET /api/diner-reviews/diner/:dinerId
async function getReviewsByDiner(req, res) {
  try {
    const { dinerId } = req.params;

    const docs = await col()
      .find(dinerIdQuery(dinerId))
      .sort({ createdAt: -1 })
      .toArray();

    res.json(
      docs.map((d) => ({
        id: d._id.toString(),
        dinerId: String(d.dinerId || d.productId || ""),
        userName: d.userName || d.userEmail || "Anonymous",
        userEmail: d.userEmail || "",
        rating: d.rating,
        text: d.text || d.comment || "",
        createdAt: d.createdAt,
      }))
    );
  } catch (e) {
    console.error("getReviewsByDiner error:", e);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ DELETE /api/diner-reviews/:id
async function deleteDinerReview(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const r = await col().deleteOne({ _id: new ObjectId(id) });
    if (!r.deletedCount) return res.status(404).json({ message: "Review not found" });

    res.json({ success: true });
  } catch (e) {
    console.error("deleteDinerReview error:", e);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createDinerReview, getReviewsByDiner, deleteDinerReview };