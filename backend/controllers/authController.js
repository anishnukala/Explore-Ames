// backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE || "";

function looksLikeBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET missing in .env");
  }
  return jwt.sign(
    { uid: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/signup
 * Body: { firstName, lastName, email, password }
 * All signups become "user"
 */
async function signup(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const rawPassword = String(password); // ✅ don't trim

    const db = getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    const newUser = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      role: "user",
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const created = { _id: result.insertedId, ...newUser };
    const token = signToken(created);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: created._id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        role: created.role,
      },
    });
  } catch (err) {
    console.error("❌ Error in signup:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Supports bcrypt + legacy plaintext (auto-migrates to bcrypt)
 */
async function login(req, res) {
  try {
    let { email, password } = req.body || {};

    email = String(email || "").trim().toLowerCase();
    password = String(password || ""); // ✅ don't trim

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const db = getDb();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const stored = user.passwordHash;

    if (looksLikeBcryptHash(stored)) {
      const ok = await bcrypt.compare(password, stored);
      if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // plaintext legacy support
      if (String(stored || "") !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // migrate to bcrypt on successful login
      const newHash = await bcrypt.hash(password, SALT_ROUNDS);
      await users.updateOne(
        { _id: user._id },
        { $set: { passwordHash: newHash, updatedAt: new Date() } }
      );
      user.passwordHash = newHash;
    }

    const token = signToken(user);

    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error in login:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}

/**
 * POST /api/auth/create-admin
 * Body: { firstName, lastName, email, password, adminInviteCode }
 */
async function createAdmin(req, res) {
  try {
    const { firstName, lastName, email, password, adminInviteCode } = req.body || {};

    if (!ADMIN_INVITE_CODE) {
      return res.status(500).json({ message: "ADMIN_INVITE_CODE is not set on the server" });
    }

    if (String(adminInviteCode || "") !== ADMIN_INVITE_CODE) {
      return res.status(403).json({ message: "Invalid admin invite code" });
    }

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const rawPassword = String(password);

    const db = getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    const newAdmin = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      role: "admin",
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newAdmin);
    const created = { _id: result.insertedId, ...newAdmin };
    const token = signToken(created);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: created._id,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        role: created.role,
      },
    });
  } catch (err) {
    console.error("❌ Error in createAdmin:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}

/**
 * ✅ NEW: POST /api/auth/reset-password
 * Body: { email, newPassword, adminInviteCode }
 * Use this when you don't know the bcrypt password in DB.
 */
async function resetPassword(req, res) {
  try {
    const { email, newPassword, adminInviteCode } = req.body || {};

    if (!ADMIN_INVITE_CODE) {
      return res.status(500).json({ message: "ADMIN_INVITE_CODE is not set on the server" });
    }

    if (String(adminInviteCode || "") !== ADMIN_INVITE_CODE) {
      return res.status(403).json({ message: "Invalid admin invite code" });
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const rawPassword = String(newPassword || "");

    if (!normalizedEmail || !rawPassword) {
      return res.status(400).json({ message: "Email and newPassword are required" });
    }

    const db = getDb();
    const users = db.collection("users");

    const passwordHash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

    const result = await users.updateOne(
      { email: normalizedEmail },
      { $set: { passwordHash, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Error in resetPassword:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!ObjectId.isValid(payload.uid)) {
      return res.status(401).json({ message: "Bad token" });
    }

    const db = getDb();
    const users = db.collection("users");

    const user = await users.findOne(
      { _id: new ObjectId(payload.uid) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { signup, login, me, createAdmin, resetPassword };
