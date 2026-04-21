// backend/controllers/faqController.js
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

function faqCol() {
  return getDb().collection("faqs");
}

async function getAllFaqs(req, res) {
  try {
    const faqs = await faqCol().find({}).toArray();
    res.json(faqs);
  } catch (err) {
    console.error("getAllFaqs error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createFaq(req, res) {
  try {
    const faq = {
      question: req.body.question || "",
      answer: req.body.answer || "",
      category: req.body.category || "",
      isPublished: req.body.isPublished ?? true,
      createdAt: new Date(),
    };

    if (!faq.question || !faq.answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const result = await faqCol().insertOne(faq);
    res.status(201).json({ _id: result.insertedId, ...faq });
  } catch (err) {
    console.error("createFaq error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateFaq(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const update = { ...req.body };

    const result = await faqCol().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(result.value);
  } catch (err) {
    console.error("updateFaq error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteFaq(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const result = await faqCol().deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteFaq error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
