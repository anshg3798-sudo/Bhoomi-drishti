const demoRegions = require("../data/demoRegions");
const { getDataMode } = require("../services/satelliteService");

function getAllRegions(req, res) {
  return res.json({
    success: true,
    dataMode: getDataMode(),
    count: demoRegions.length,
    regions: demoRegions.map(({ id, name, district, coordinates, bbox }) => ({ id, name, district, coordinates, bbox }))
  });
}

function getRegionById(req, res) {
  const region = demoRegions.find(
    (r) => r.id === req.params.id || r.name.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!region) {
    return res.status(404).json({ success: false, message: `Region '${req.params.id}' not found` });
  }
  return res.json({ success: true, dataMode: getDataMode(), region });
}

module.exports = { getAllRegions, getRegionById };
