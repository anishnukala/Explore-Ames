// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, getDb } = require("./config/db");
const reviewsRoutes = require("./routes/reviewsRoutes");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const dinersRoutes = require("./routes/dinersRoutes");
const exploreRoutes = require("./routes/exploreRoutes");
const faqRoutes = require("./routes/faqRoutes");
const dinerReviewsRoutes = require("./routes/dinerReviewsRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Explore Ames API" });
});

// Debug DB
app.get("/debug-db", (req, res) => {
  try {
    const db = getDb();
    res.json({ ok: true, db: db.databaseName });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ✅ Route mounting (CONSISTENT)
app.use("/api/auth", authRoutes); // ✅ /api/auth/login, /api/auth/signup, /api/auth/me
app.use("/api/users", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/diners", dinersRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/diner-reviews", dinerReviewsRoutes);
app.use("/api/reviews", reviewsRoutes);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`🔎 DB check: http://localhost:${PORT}/debug-db`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
