// backend/controllers/exoreController.js
const { ObjectId } = require("mongodb");
const { exploreCollection } = require("../models/explore");

const toClient = (doc) => {
  if (!doc) return doc;
  return { ...doc, _id: String(doc._id) };
};

async function getAllPlaces(req, res) {
  try {
    const places = await exploreCollection().find({}).toArray();
    return res.json(places.map(toClient));
  } catch (err) {
    console.error("getAllPlaces error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createPlace(req, res) {
  try {
    const place = {
      name: req.body.name || "",
      category: req.body.category || "",
      location: req.body.location || "",
      description: req.body.description || "",
      image: req.body.image || "",
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!place.name) return res.status(400).json({ message: "name is required" });

    const result = await exploreCollection().insertOne(place);
    return res.status(201).json(toClient({ _id: result.insertedId, ...place }));
  } catch (err) {
    console.error("createPlace error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updatePlace(req, res) {
  try {
    const { id } = req.params;

    // ✅ must be a valid ObjectId string
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // ✅ never allow _id overwrite
    const { _id, id: ignoredId, createdAt, ...update } = req.body || {};
    update.updatedAt = new Date();

    const col = exploreCollection();

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Place not found" });
    }

    const updatedDoc = await col.findOne({ _id: new ObjectId(id) });
    return res.json(toClient(updatedDoc));
  } catch (err) {
    console.error("updatePlace error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deletePlace(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const result = await exploreCollection().deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return res.status(404).json({ message: "Place not found" });

    return res.json({ success: true });
  } catch (err) {
    console.error("deletePlace error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllPlaces, createPlace, updatePlace, deletePlace };