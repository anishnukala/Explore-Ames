// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  me,
  createAdmin,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login); // ✅ lowercase
router.get("/me", me);

router.post("/create-admin", createAdmin);
router.post("/reset-password", resetPassword); // ✅ NEW

module.exports = router;
