require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDB, getDb } = require("../config/db");

(async () => {
  await connectDB();

  const db = getDb();
  const users = db.collection("users");

  const email = "admin@example.com";     // <-- put your admin email here
  const newPassword = "Admin@123";       // <-- your new password

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const result = await users.updateOne(
    { email: email.toLowerCase() },
    { $set: { passwordHash, role: "admin", updatedAt: new Date() } }
  );

  console.log("✅ modifiedCount:", result.modifiedCount);
  console.log("✅ Now login with:", email, newPassword);

  process.exit(0);
})();
