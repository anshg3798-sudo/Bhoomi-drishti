const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    district: String,
    coordinates: [Number],
    rainfall: Number,
    rainfallAnomaly: Number,
    ndvi: Number,
    ndviTrend: Number,
    soilMoisture: Number,
    slope: Number,
    elevation: Number,
    flowAccumulation: String,
    lowLyingTerrain: Boolean,
    historicalFloodProne: Boolean,
    rusle: {
      R: Number,
      K: Number,
      LS: Number,
      C: Number,
      P: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Region", RegionSchema);
