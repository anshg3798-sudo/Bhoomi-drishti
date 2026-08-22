const demoRegions = require("../data/demoRegions");
const { calculateRUSLE } = require("../services/rusleService");
const { calculateFloodRisk, calculateDroughtRisk } = require("../services/riskService");
const { generateRecommendations } = require("../services/recommendationService");

function findRegion(idOrName) {
  return demoRegions.find(
    (r) => r.id === idOrName || r.name.toLowerCase() === String(idOrName).toLowerCase()
  );
}

function generate(req, res) {
  const { region: regionId } = req.body;
  const region = findRegion(regionId);
  if (!region) return res.status(404).json({ success: false, message: `Region '${regionId}' not found` });

  const rusleResult = calculateRUSLE(region.rusle);
  const floodRisk = calculateFloodRisk(region);
  const droughtRisk = calculateDroughtRisk(region);
  const recommendations = generateRecommendations({
    region, soilLoss: rusleResult.soilLoss, riskCategory: rusleResult.riskCategory, floodRisk, droughtRisk
  });

  return res.json({ success: true, region: region.name, recommendations });
}

function getForRegion(req, res) {
  const region = findRegion(req.params.regionId);
  if (!region) return res.status(404).json({ success: false, message: `Region '${req.params.regionId}' not found` });

  const rusleResult = calculateRUSLE(region.rusle);
  const floodRisk = calculateFloodRisk(region);
  const droughtRisk = calculateDroughtRisk(region);
  const recommendations = generateRecommendations({
    region, soilLoss: rusleResult.soilLoss, riskCategory: rusleResult.riskCategory, floodRisk, droughtRisk
  });

  return res.json({ success: true, region: region.name, recommendations });
}

module.exports = { generate, getForRegion };
