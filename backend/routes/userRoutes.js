// backend/routes/userRoutes.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

module.exports = router;
