const dns = require("dns");
const mongoose = require("mongoose");

// Use a reliable public DNS resolver for MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "1.1.1.1"]);

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      "[db] MONGO_URI not set - running in DEMO MODE without persistence."
    );
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    isConnected = true;

    console.log("[db] MongoDB connected.");
    return true;
  } catch (err) {
    console.warn(
      `[db] MongoDB connection failed (${err.message}) - continuing in DEMO MODE without persistence.`
    );

    isConnected = false;
    return false;
  }
}

function dbIsConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  dbIsConnected
};