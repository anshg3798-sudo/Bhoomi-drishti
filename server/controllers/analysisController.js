const demoRegions = require("../data/demoRegions");
const { getHistoricalSeries } = require("../data/demoAnalysis");
const { calculateRUSLE, classifyRisk } = require("../services/rusleService");
const { calculateFloodRisk, calculateDroughtRisk } = require("../services/riskService");
const { forecastErosion } = require("../services/forecastService");
const { analyzeHydrology } = require("../services/hydrologyService");
const { generateRecommendations } = require("../services/recommendationService");
const { generateAIExplanation } = require("../services/aiService");
const { getDataMode } = require("../services/satelliteService");
const Analysis = require("../models/Analysis");
const { dbIsConnected } = require("../config/db");

function findRegion(idOrName) {
  return demoRegions.find(
    (r) => r.id === idOrName || r.name.toLowerCase() === String(idOrName).toLowerCase()
  );
}

function runRUSLE(req, res) {
  try {
    const { region: regionId, R, K, LS, C, P } = req.body;
    let factors = { R, K, LS, C, P };

    if (regionId && [R, K, LS, C, P].some((v) => v === undefined)) {
      const region = findRegion(regionId);
      if (!region) return res.status(404).json({ success: false, message: `Region '${regionId}' not found` });
      factors = { ...region.rusle, ...Object.fromEntries(Object.entries({ R, K, LS, C, P }).filter(([, v]) => v !== undefined)) };
    }

    const result = calculateRUSLE(factors);
    return res.json({ success: true, region: regionId || null, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

function runForecast(req, res) {
  try {
    const { region: regionId } = req.body;
    const region = findRegion(regionId);
    if (!region) return res.status(404).json({ success: false, message: `Region '${regionId}' not found` });

    const series = getHistoricalSeries(region.id, region.rainfall);
    const historicalSoilLoss = series.map((s) => s.soilLoss);
    const forecast = forecastErosion({
      historicalSoilLoss,
      rainfallAnomaly: region.rainfallAnomaly,
      ndviTrend: region.ndviTrend
    });

    return res.json({ success: true, region: region.name, series, forecast });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

function runRisk(req, res) {
  try {
    const { region: regionId } = req.body;
    const region = findRegion(regionId);
    if (!region) return res.status(404).json({ success: false, message: `Region '${regionId}' not found` });

    const floodRisk = calculateFloodRisk(region);
    const droughtRisk = calculateDroughtRisk(region);
    return res.json({ success: true, region: region.name, floodRisk, droughtRisk });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

// Main orchestration endpoint for the demo flow.
async function runFullAnalysis(req, res) {
  try {
    const { region: regionId } = req.body;
    const region = findRegion(regionId);
    if (!region) return res.status(404).json({ success: false, message: `Region '${regionId}' not found` });

    const rusleResult = calculateRUSLE(region.rusle);
    const floodRisk = calculateFloodRisk(region);
    const droughtRisk = calculateDroughtRisk(region);
    const series = getHistoricalSeries(region.id, region.rainfall);
    const forecast = forecastErosion({
      historicalSoilLoss: series.map((s) => s.soilLoss),
      rainfallAnomaly: region.rainfallAnomaly,
      ndviTrend: region.ndviTrend
    });
    const hydrology = analyzeHydrology(region, rusleResult.soilLoss, floodRisk.score);
    const recommendations = generateRecommendations({
      region,
      soilLoss: rusleResult.soilLoss,
      riskCategory: rusleResult.riskCategory,
      floodRisk,
      droughtRisk
    });
    const aiExplanation = await generateAIExplanation({
      region,
      soilLoss: rusleResult.soilLoss,
      riskCategory: rusleResult.riskCategory,
      floodRisk,
      droughtRisk,
      topRecommendation: recommendations[0]
    });

    const result = {
      region: { id: region.id, name: region.name, district: region.district, coordinates: region.coordinates },
      dataMode: getDataMode(),
      dataSource: region.dataSource,
      rusle: rusleResult,
      floodRisk,
      droughtRisk,
      ndvi: region.ndvi,
      ndviTrend: region.ndviTrend,
      rainfall: region.rainfall,
      rainfallAnomaly: region.rainfallAnomaly,
      historicalSeries: series,
      forecast,
      hydrology,
      recommendations,
      aiExplanation,
      lastUpdated: new Date().toISOString()
    };

    if (dbIsConnected()) {
      try {
        await Analysis.create({
          region: region.name,
          coordinates: region.coordinates,
          rusleFactors: region.rusle,
          soilLoss: rusleResult.soilLoss,
          erosionRisk: rusleResult.riskCategory,
          floodRisk: floodRisk.category,
          droughtRisk: droughtRisk.category,
          ndvi: region.ndvi,
          rainfall: region.rainfall,
          forecast: {
            nextSeasonRisk: forecast.nextSeasonRisk,
            nextSeasonSoilLoss: forecast.nextSeasonSoilLoss,
            confidence: forecast.confidence
          },
          recommendations: recommendations.map((r) => ({
            title: r.title, reason: r.reason, priority: r.priority, expectedSoilLossReduction: r.expectedSoilLossReduction
          })),
          dataMode: getDataMode()
        });
      } catch (persistErr) {
        console.warn("[analysis] Failed to persist analysis (continuing anyway):", persistErr.message);
      }
    }

    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

function getPriorityZones(req, res) {
  const ranked = demoRegions
    .map((region) => {
      const rusleResult = calculateRUSLE(region.rusle);
      const floodRisk = calculateFloodRisk(region);
      const droughtRisk = calculateDroughtRisk(region);

      let priority = "Low";
      if (rusleResult.soilLoss > 20 || floodRisk.category === "Very High") priority = "Critical";
      else if (rusleResult.soilLoss > 12 || floodRisk.category === "High" || droughtRisk.category === "High") priority = "High";
      else if (rusleResult.soilLoss > 6 || droughtRisk.category === "Moderate") priority = "Moderate";

      let priorityReason = "Erosion risk";
      if (droughtRisk.score > floodRisk.score && droughtRisk.category !== "Low") priorityReason = "Drought Priority";

      return {
        id: region.id,
        name: region.name,
        district: region.district,
        coordinates: region.coordinates,
        soilLoss: rusleResult.soilLoss,
        erosionRisk: rusleResult.riskCategory,
        floodRisk: floodRisk.category,
        droughtRisk: droughtRisk.category,
        priority,
        priorityReason: priority === "Critical" || priority === "High" ? priorityReason : undefined,
        rankScore: rusleResult.soilLoss + floodRisk.score * 0.3 + droughtRisk.score * 0.2
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore)
    .map((r, i) => ({ rank: i + 1, ...r }));

  return res.json({ success: true, dataMode: getDataMode(), zones: ranked });
}

module.exports = { runRUSLE, runForecast, runRisk, runFullAnalysis, getPriorityZones };
