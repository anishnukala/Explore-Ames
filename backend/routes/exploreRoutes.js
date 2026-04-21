const express = require("express");
const router = express.Router();

const {
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/exploreController");

router.get("/_debug", (req, res) => {
  res.json({ ok: true, route: "explore", method: "ALL" });
});

router.get("/", getAllPlaces);
router.post("/", createPlace);
router.put("/:id", updatePlace);
router.delete("/:id", deletePlace);

module.exports = router;