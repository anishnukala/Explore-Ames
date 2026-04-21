// backend/config/db.js
const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing in .env");

  // if you kept DB_NAME separate, use it; otherwise URI db name will be used
  const dbName = process.env.DB_NAME || process.env.DB_NAM || process.env.DBNAME || process.env.DB || undefined;

  const client = new MongoClient(uri);
  await client.connect();

  // If your URI already includes /explore_ames, dbName can be undefined and this still works.
  db = dbName ? client.db(dbName) : client.db();

  console.log("✅ MongoDB connected to:", db.databaseName);
}

function getDb() {
  if (!db) throw new Error("DB not initialized (connectDB was not called or failed)");
  return db;
}

module.exports = { connectDB, getDb };