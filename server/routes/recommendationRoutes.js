const express = require("express");
const router = express.Router();
const { generate, getForRegion } = require("../controllers/recommendationController");

router.post("/generate", generate);
router.get("/:regionId", getForRegion);

module.exports = router;
