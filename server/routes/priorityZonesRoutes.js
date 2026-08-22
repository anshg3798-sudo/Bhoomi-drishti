const express = require("express");
const router = express.Router();
const { getPriorityZones } = require("../controllers/analysisController");

router.get("/", getPriorityZones);

module.exports = router;
