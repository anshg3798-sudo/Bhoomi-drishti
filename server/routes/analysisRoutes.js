const express = require("express");
const router = express.Router();
const { runRUSLE, runForecast, runRisk, runFullAnalysis, getPriorityZones } = require("../controllers/analysisController");

router.post("/rusle", runRUSLE);
router.post("/forecast", runForecast);
router.post("/risk", runRisk);
router.post("/run", runFullAnalysis);

module.exports = router;
