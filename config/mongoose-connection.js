const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
require("dotenv").config();

const uri = process.env.MONGO_DB_URI;

if (!uri) {
  dbgr("❌ MONGO_DB_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => dbgr("✅ Connected to MongoDB"))
  .catch((err) => dbgr("❌ MongoDB connection error:", err));

module.exports = mongoose.connection;
