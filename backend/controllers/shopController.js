// backend/controllers/shopController.js
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

const COLLECTIONS = ["shop_items", "shop"]; // keep both

function getCols() {
  const db = getDb();
  return COLLECTIONS.map((name) => ({ name, col: db.collection(name) }));
}

function idQuery(id) {
  const idStr = String(id || "").trim();
  const or = [{ _id: idStr }];
  if (ObjectId.isValid(idStr)) or.unshift({ _id: new ObjectId(idStr) });
  return { $or: or };
}

function mapProduct(doc) {
  return {
    id: doc?._id?.toString?.() || String(doc?._id),
    name: doc?.name || "",
    price: Number(doc?.price ?? 0),
    category: doc?.category || "Merch",
    image: doc?.image || "",
    description: doc?.description || "",
  };
}

async function findOneAny(query) {
  for (const { name, col } of getCols()) {
    const doc = await col.findOne(query);
    if (doc) return { name, col, doc };
  }
  return null;
}

// ✅ SAFE update: updateOne + findOne (works in all driver versions)
async function updateAny(query, update) {
  for (const { name, col } of getCols()) {
    // first check if it exists in this collection
    const existing = await col.findOne(query);
    if (!existing) continue;

    await col.updateOne(query, { $set: update });

    // fetch updated doc
    const fresh = await col.findOne(query);
    if (fresh) return { name, doc: fresh };
  }
  return null;
}

async function deleteAny(query) {
  for (const { name, col } of getCols()) {
    const result = await col.deleteOne(query);
    if (result.deletedCount) return { name };
  }
  return null;
}

// GET /api/shop
async function getAllProducts(req, res) {
  try {
    for (const { col } of getCols()) {
      const arr = await col.find({}).toArray();
      if (arr.length > 0) return res.json(arr.map(mapProduct));
    }
    return res.json([]);
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/shop/:id
async function getProductById(req, res) {
  try {
    const found = await findOneAny(idQuery(req.params.id));
    if (!found) return res.status(404).json({ message: "Product not found" });
    res.json(mapProduct(found.doc));
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/shop
async function createProduct(req, res) {
  try {
    const { name, price, category, image, description } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = {
      name: String(name).trim(),
      price: Number(price),
      category: String(category || "Merch").trim(),
      image: image ? String(image).trim() : "",
      description: description ? String(description) : "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // insert into first collection
    const { col } = getCols()[0];
    const result = await col.insertOne(product);
    const created = await col.findOne({ _id: result.insertedId });

    res.status(201).json(mapProduct(created));
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/shop/:id
async function updateProduct(req, res) {
  try {
    const idStr = String(req.params.id || "").trim();

    const update = {};
    if (req.body.name != null) update.name = String(req.body.name).trim();
    if (req.body.category != null) update.category = String(req.body.category).trim();
    if (req.body.description != null) update.description = String(req.body.description);
    if (req.body.image != null) update.image = String(req.body.image).trim();
    if (req.body.price != null) update.price = Number(req.body.price);
    update.updatedAt = new Date();

    const updated = await updateAny(idQuery(idStr), update);

    if (!updated) {
      return res.status(404).json({
        message: "Product not found",
        idReceived: idStr,
        triedCollections: COLLECTIONS,
      });
    }

    res.json(mapProduct(updated.doc));
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/shop/:id
async function deleteProduct(req, res) {
  try {
    const idStr = String(req.params.id || "").trim();
    const deleted = await deleteAny(idQuery(idStr));

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found",
        idReceived: idStr,
        triedCollections: COLLECTIONS,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};