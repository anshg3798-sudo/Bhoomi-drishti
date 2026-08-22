const express = require("express");
const router = express.Router();
const { submitReport, listReports, validateReport } = require("../controllers/citizenController");

router.post("/", submitReport);
router.get("/", listReports);
router.patch("/:id/validate", validateReport);

module.exports = router;
