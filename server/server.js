require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, dbIsConnected } = require("./config/db");
const { getDataMode, isLiveModeConfigured } = require("./services/satelliteService");
const { isAIConfigured } = require("./services/aiService");

const authRoutes = require("./routes/authRoutes");
const regionRoutes = require("./routes/regionRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const priorityZonesRoutes = require("./routes/priorityZonesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    dataMode: getDataMode(),
    geeConfigured: isLiveModeConfigured(),
    aiConfigured: isAIConfigured(),
    databaseConnected: dbIsConnected(),
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/citizen-reports", citizenRoutes);
app.use("/api/priority-zones", priorityZonesRoutes);

// Central error handler - the application must never crash or return a blank page.
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error", detail: err.message });
});

async function start() {
  await connectDB(); // non-blocking: continues in demo mode if this fails
  app.listen(PORT, () => {
    console.log(`\nBhoomi-Drishti API running on http://localhost:${PORT}`);
    console.log(`Data mode: ${getDataMode()} | AI: ${isAIConfigured() ? "enabled" : "disabled (rule-based fallback)"} | DB: ${dbIsConnected() ? "connected" : "not connected (demo mode)"}\n`);
  });
}

start();

process.on("unhandledRejection", (err) => console.error("[server] Unhandled rejection:", err));

module.exports = app;
