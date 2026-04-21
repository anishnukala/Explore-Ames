const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "diners";

function idQuery(id) {
  const idStr = String(id).trim();
  const or = [{ _id: idStr }];

  if (ObjectId.isValid(idStr)) {
    or.unshift({ _id: new ObjectId(idStr) });
  }
  return { $or: or };
}

// GET /api/diners
exports.getAllDiners = async (req, res) => {
  try {
    const db = getDb();
    const diners = await db.collection(COLLECTION).find({}).toArray();
    res.json(diners);
  } catch (err) {
    res.status(500).json({ message: "Failed to load diners" });
  }
};

// GET /api/diners/:id
exports.getDinerById = async (req, res) => {
  try {
    const db = getDb();
    const diner = await db.collection(COLLECTION).findOne(idQuery(req.params.id));
    if (!diner) return res.status(404).json({ message: "Diner not found" });
    res.json(diner);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch diner" });
  }
};

// POST /api/diners
exports.createDiner = async (req, res) => {
  try {
    const db = getDb();
    const payload = req.body;

    if (!payload?.name || !payload?.cuisine || !payload?.address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    payload.createdAt = new Date();

    const result = await db.collection(COLLECTION).insertOne(payload);
    const created = await db
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
};

// PUT /api/diners/:id  ✅ FIXED
exports.updateDiner = async (req, res) => {
  try {
    const db = getDb();
    const idStr = String(req.params.id || "").trim();

    // Try multiple match styles (covers ObjectId and string ids)
    const candidates = [];
    if (ObjectId.isValid(idStr)) candidates.push({ _id: new ObjectId(idStr) });
    candidates.push({ _id: idStr });
    candidates.push({ id: idStr });
    const asNum = Number(idStr);
    if (!Number.isNaN(asNum)) candidates.push({ id: asNum });

    // ✅ find which one matches FIRST (debug)
    let matched = null;
    for (const q of candidates) {
      const found = await db.collection(COLLECTION).findOne(q);
      if (found) {
        matched = q;
        break;
      }
    }

    if (!matched) {
      return res.status(404).json({
        message: "Diner not found",
        idReceived: idStr,
        tried: candidates,
      });
    }

    // ✅ update using the matched query
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      matched,
      { $set: req.body },
      { returnDocument: "after" }
    );

    res.json(result.value);
  } catch (err) {
    console.error("updateDiner error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// DELETE /api/diners/:id
exports.deleteDiner = async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .collection(COLLECTION)
      .deleteOne(idQuery(req.params.id));

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Diner not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};