const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
  {
    region: { type: String, required: true },
    coordinates: [Number],
    date: { type: Date, default: Date.now },
    rusleFactors: {
      R: Number, K: Number, LS: Number, C: Number, P: Number
    },
    soilLoss: Number,
    erosionRisk: String,
    floodRisk: String,
    droughtRisk: String,
    ndvi: Number,
    rainfall: Number,
    forecast: {
      nextSeasonRisk: String,
      nextSeasonSoilLoss: Number,
      confidence: Number
    },
    recommendations: [
      {
        title: String,
        reason: String,
        priority: String,
        expectedSoilLossReduction: String
      }
    ],
    dataMode: { type: String, enum: ["DEMO", "LIVE"], default: "DEMO" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
