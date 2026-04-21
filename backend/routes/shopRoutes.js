// backend/routes/shopRoutes.js
const express = require("express");
const router = express.Router();
const c = require("../controllers/shopController");

// /api/shop
router.get("/", c.getAllProducts);
router.get("/:id", c.getProductById);
router.post("/", c.createProduct);
router.put("/:id", c.updateProduct);
router.delete("/:id", c.deleteProduct);

module.exports = router;