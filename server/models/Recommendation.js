const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema(
  {
    region: { type: String, required: true },
    title: String,
    reason: String,
    expectedImpact: String,
    expectedSoilLossReduction: String,
    priority: String,
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", RecommendationSchema);
