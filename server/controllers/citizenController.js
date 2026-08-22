const CitizenReport = require("../models/CitizenReport");
const { dbIsConnected } = require("../config/db");

// In-memory fallback store so citizen validation works even without MongoDB.
const memoryStore = [
  {
    _id: "seed-1",
    userName: "Ramesh Kalita",
    region: "Assam",
    coordinates: [26.21, 92.95],
    imageRef: null,
    description: "Possible gully erosion observed near riverbank field",
    validationStatus: "Pending",
    modelConfidenceBefore: 82,
    modelConfidenceAfter: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    _id: "seed-2",
    userName: "Sunita Devi",
    region: "Bihar",
    coordinates: [26.12, 85.4],
    imageRef: null,
    description: "Visible topsoil loss after recent heavy rainfall",
    validationStatus: "Confirmed",
    modelConfidenceBefore: 75,
    modelConfidenceAfter: 91,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
  }
];

function submitReport(req, res) {
  const { region, latitude, longitude, description, userName } = req.body;
  if (!region || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ success: false, message: "region, latitude and longitude are required" });
  }

  const baseConfidence = 70 + Math.round(Math.random() * 10); // demo baseline before ground validation

  const reportData = {
    userName: userName || req.user?.name || "Anonymous Farmer",
    user: req.user?.id && req.user.id !== "demo-farmer" && req.user.id !== "demo-officer" ? req.user.id : undefined,
    region,
    coordinates: [Number(latitude), Number(longitude)],
    imageRef: req.body.imageRef || null,
    description: description || "",
    validationStatus: "Pending",
    modelConfidenceBefore: baseConfidence,
    modelConfidenceAfter: null
  };

  if (dbIsConnected()) {
    CitizenReport.create(reportData)
      .then((doc) => res.status(201).json({ success: true, report: doc }))
      .catch((err) => res.status(500).json({ success: false, message: err.message }));
    return;
  }

  const doc = { _id: `mem-${Date.now()}`, ...reportData, createdAt: new Date().toISOString() };
  memoryStore.unshift(doc);
  return res.status(201).json({ success: true, report: doc, note: "Stored in-memory (no database configured)" });
}

async function listReports(req, res) {
  if (dbIsConnected()) {
    try {
      const reports = await CitizenReport.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ success: true, reports });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  return res.json({ success: true, reports: memoryStore });
}

// Simulates the satellite-prediction vs ground-observation validation loop.
function validateReport(req, res) {
  const { id } = req.params;
  const { status } = req.body; // "Confirmed" | "Rejected"

  const applyUpdate = (report) => {
    const confidenceDelta = status === "Confirmed" ? 8 + Math.round(Math.random() * 6) : -(4 + Math.round(Math.random() * 4));
    const before = report.modelConfidenceBefore ?? 75;
    const after = Math.max(40, Math.min(99, before + confidenceDelta));
    return { validationStatus: status, modelConfidenceAfter: after };
  };

  if (dbIsConnected() && !String(id).startsWith("mem-") && !String(id).startsWith("seed-")) {
    CitizenReport.findById(id)
      .then(async (report) => {
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        const update = applyUpdate(report);
        Object.assign(report, update);
        await report.save();
        return res.json({ success: true, report });
      })
      .catch((err) => res.status(500).json({ success: false, message: err.message }));
    return;
  }

  const report = memoryStore.find((r) => r._id === id);
  if (!report) return res.status(404).json({ success: false, message: "Report not found" });
  Object.assign(report, applyUpdate(report));
  return res.json({ success: true, report });
}

module.exports = { submitReport, listReports, validateReport };
