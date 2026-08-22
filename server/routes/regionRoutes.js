const express = require("express");
const router = express.Router();
const { getAllRegions, getRegionById } = require("../controllers/regionController");

router.get("/", getAllRegions);
router.get("/:id", getRegionById);

module.exports = router;
