// backend/controllers/userController.js
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

function usersCol() {
  return getDb().collection("users");
}

async function getAllUsers(req, res) {
  try {
    const list = await usersCol()
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();

    res.json(list);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const user = await usersCol().findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const result = await usersCol().deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
};
