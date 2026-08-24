const mongoose = require("mongoose");

const CitizenReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    coordinates: [Number],
    region: { type: String, required: true },
    district: String,
    observationType: String,
    imageRef: { type: String, default: null },
    description: { type: String, default: "" },
    assessment: {
      status: String,
      summary: String,
      actions: [String]
    },
    validationStatus: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
    modelConfidenceBefore: Number,
    modelConfidenceAfter: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenReport", CitizenReportSchema);
