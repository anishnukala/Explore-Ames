const express = require("express");
const {
  getAllDiners,
  getDinerById,
  createDiner,
  updateDiner,
  deleteDiner,
} = require("../controllers/dinersController");

const router = express.Router();

// ✅ MUST be above "/:id"
router.get("/_debug", (req, res) => {
  res.json({ ok: true, route: "diners", version: "v3" });
});

// /api/diners
router.get("/", getAllDiners);

// ⚠️ keep this BELOW _debug
router.get("/:id", getDinerById);

router.post("/", createDiner);
router.put("/:id", updateDiner);
router.delete("/:id", deleteDiner);

module.exports = router;