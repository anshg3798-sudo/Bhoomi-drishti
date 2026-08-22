/**
 * Satellite / environmental data abstraction layer.
 *
 * DEMO MODE (default): returns seeded, pre-processed demo observations so the
 * application works immediately without any external credentials.
 *
 * LIVE MODE: if GEE_PROJECT_ID (and related credentials) are configured, this
 * is where a real Google Earth Engine / Sentinel / CHIRPS / SoilGrids call
 * would be wired in. The functions below are intentionally named to mirror
 * what a real GEE service module would expose, so swapping in a real
 * implementation later requires no changes to controllers.
 */

const demoRegions = require("../data/demoRegions");

function isLiveModeConfigured() {
  return Boolean(process.env.GEE_PROJECT_ID && process.env.GEE_PROJECT_ID.trim().length > 0);
}

function findRegion(regionId) {
  const region = demoRegions.find(
    (r) => r.id === regionId || r.name.toLowerCase() === String(regionId).toLowerCase()
  );
  if (!region) return null;
  return region;
}

function getDataMode() {
  return isLiveModeConfigured() ? "LIVE" : "DEMO";
}

// --- Below: functions mirroring a future real GEE-backed service ---

async function getSentinelData(regionId) {
  const region = findRegion(regionId);
  if (!region) return null;
  if (isLiveModeConfigured()) {
    // TODO: replace with real Sentinel-1/2 GEE query when credentials exist.
    console.warn("[satelliteService] GEE_PROJECT_ID set but live Sentinel integration not implemented - falling back to demo data.");
  }
  return { ndvi: region.ndvi, ndviTrend: region.ndviTrend, source: "Sentinel-2 (demo)", mode: "DEMO" };
}

async function getRainfallData(regionId) {
  const region = findRegion(regionId);
  if (!region) return null;
  return { rainfall: region.rainfall, rainfallAnomaly: region.rainfallAnomaly, source: "CHIRPS (demo)", mode: "DEMO" };
}

async function getElevationData(regionId) {
  const region = findRegion(regionId);
  if (!region) return null;
  return { elevation: region.elevation, slope: region.slope, source: "SRTM (demo)", mode: "DEMO" };
}

async function getSoilData(regionId) {
  const region = findRegion(regionId);
  if (!region) return null;
  return { K: region.rusle.K, soilMoisture: region.soilMoisture, source: "SoilGrids (demo)", mode: "DEMO" };
}

async function getNDVIData(regionId) {
  return getSentinelData(regionId);
}

module.exports = {
  isLiveModeConfigured,
  getDataMode,
  findRegion,
  getSentinelData,
  getRainfallData,
  getElevationData,
  getSoilData,
  getNDVIData
};
