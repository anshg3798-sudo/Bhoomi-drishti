const mongoose = require("mongoose");

const CitizenReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    coordinates: [Number],
    region: { type: String, required: true },
    imageRef: { type: String, default: null },
    description: { type: String, default: "" },
    validationStatus: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
    modelConfidenceBefore: Number,
    modelConfidenceAfter: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenReport", CitizenReportSchema);
