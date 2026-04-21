// backend/routes/faqRoutes.js
const express = require("express");
const {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faqController");

const router = express.Router();

router.get("/", getAllFaqs);
router.post("/", createFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

module.exports = router;
