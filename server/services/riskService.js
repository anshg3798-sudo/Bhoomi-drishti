/**
 * Transparent, rule-based flood and drought risk indicators.
 * These are NOT official/validated hydrological or meteorological models.
 * They combine normalized environmental proxies into a demo risk score so
 * judges can see how flood/drought risk could extend the erosion platform.
 */

function scoreToCategory(score) {
  if (score < 25) return "Low";
  if (score < 50) return "Moderate";
  if (score < 75) return "High";
  return "Very High";
}

function calculateFloodRisk(region) {
  const { rainfallAnomaly, slope, flowAccumulation, lowLyingTerrain, soilMoisture } = region;

  const anomalyScore = Math.max(0, Math.min(40, rainfallAnomaly)); // 0-40
  const slopeScore = Math.max(0, 20 - slope) / 20 * 20; // gentler slope -> higher flood score, 0-20
  const flowScoreMap = { Low: 0, Moderate: 10, High: 20 };
  const flowScore = flowScoreMap[flowAccumulation] ?? 0;
  const terrainScore = lowLyingTerrain ? 10 : 0;
  const moistureScore = soilMoisture * 10; // 0-10

  const total = Math.round(anomalyScore + slopeScore + flowScore + terrainScore + moistureScore);
  const score = Math.max(0, Math.min(100, total));

  return {
    score,
    category: scoreToCategory(score),
    reasons: [
      `Rainfall anomaly ${rainfallAnomaly >= 0 ? "+" : ""}${rainfallAnomaly}%`,
      lowLyingTerrain ? "Low-lying terrain" : "Elevated terrain",
      `${flowAccumulation} flow accumulation`,
      `Soil moisture proxy ${(soilMoisture * 100).toFixed(0)}%`
    ],
    isEstimate: true,
    disclaimer: "Demo indicator - not an official flood prediction system."
  };
}

function calculateDroughtRisk(region) {
  const { rainfallAnomaly, ndviTrend, ndvi, soilMoisture } = region;

  const rainfallDeficitScore = Math.max(0, -rainfallAnomaly); // negative anomaly = deficit
  const ndviDeclineScore = Math.max(0, -ndviTrend) * 1.5;
  const vegetationHealthScore = Math.max(0, (0.6 - ndvi) * 100); // lower ndvi -> higher score
  const moistureDeficitScore = Math.max(0, (0.5 - soilMoisture) * 100);

  const total = Math.round(
    rainfallDeficitScore * 0.35 +
    ndviDeclineScore * 0.25 +
    vegetationHealthScore * 0.2 +
    moistureDeficitScore * 0.2
  );
  const score = Math.max(0, Math.min(100, total));

  return {
    score,
    category: scoreToCategory(score),
    reasons: [
      `Rainfall trend ${rainfallAnomaly >= 0 ? "+" : ""}${rainfallAnomaly}%`,
      `NDVI trend ${ndviTrend >= 0 ? "+" : ""}${ndviTrend}%`,
      `Vegetation health NDVI ${ndvi}`,
      `Soil moisture proxy ${(soilMoisture * 100).toFixed(0)}%`
    ],
    isEstimate: true,
    disclaimer: "Demo index - weighted combination of rainfall deficit, NDVI decline and moisture deficit. Not a scientifically validated drought index."
  };
}

module.exports = { calculateFloodRisk, calculateDroughtRisk, scoreToCategory };
