const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("[db] MONGO_URI not set - running in DEMO MODE without persistence.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log("[db] MongoDB connected.");
    return true;
  } catch (err) {
    console.warn(`[db] MongoDB connection failed (${err.message}) - continuing in DEMO MODE without persistence.`);
    isConnected = false;
    return false;
  }
}

function dbIsConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = { connectDB, dbIsConnected };
