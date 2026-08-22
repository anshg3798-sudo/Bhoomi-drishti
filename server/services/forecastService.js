const { classifyRisk } = require("./rusleService");

/**
 * Transparent JS trend-based forecast (NOT a trained ML model).
 * Projects next-season soil loss using recent historical growth rate,
 * adjusted by rainfall anomaly and NDVI trend direction.
 */
function forecastErosion({ historicalSoilLoss, rainfallAnomaly, ndviTrend }) {
  if (!Array.isArray(historicalSoilLoss) || historicalSoilLoss.length < 2) {
    throw new Error("At least two historical soil-loss data points are required");
  }

  const recent = historicalSoilLoss.slice(-3);
  const growthRates = [];
  for (let i = 1; i < recent.length; i++) {
    growthRates.push((recent[i] - recent[i - 1]) / recent[i - 1]);
  }
  const avgGrowthRate = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  // Adjust growth rate using rainfall anomaly (wetter -> more erosion) and
  // NDVI trend (declining vegetation -> less protection -> more erosion).
  const rainfallAdj = (rainfallAnomaly / 100) * 0.4;
  const ndviAdj = (-ndviTrend / 100) * 0.3;
  const adjustedGrowthRate = avgGrowthRate + rainfallAdj + ndviAdj;

  const current = historicalSoilLoss[historicalSoilLoss.length - 1];
  const nextSeasonEstimate = Number((current * (1 + adjustedGrowthRate)).toFixed(2));

  // Confidence shrinks as growth rate volatility increases.
  const volatility = Math.abs(growthRates[growthRates.length - 1] - avgGrowthRate);
  const confidence = Math.max(55, Math.round(90 - volatility * 200));

  return {
    currentRisk: classifyRisk(current),
    currentSoilLoss: current,
    nextSeasonRisk: classifyRisk(nextSeasonEstimate),
    nextSeasonSoilLoss: nextSeasonEstimate,
    confidence,
    contributingFactors: [
      `Historical soil-loss growth trend (${(avgGrowthRate * 100).toFixed(1)}%/season)`,
      `Rainfall anomaly adjustment (${rainfallAnomaly >= 0 ? "+" : ""}${rainfallAnomaly}%)`,
      `NDVI trend adjustment (${ndviTrend >= 0 ? "+" : ""}${ndviTrend}%)`
    ],
    method: "Trend-based projection (transparent JS model, not a trained ML model)",
    isEstimate: true
  };
}

module.exports = { forecastErosion };
