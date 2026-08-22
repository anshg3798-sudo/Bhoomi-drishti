// Deterministic historical series used to power Recharts visualizations.
// Represents 6 pre-processed seasons of demo satellite/rainfall observations.

const seasons = ["S1", "S2", "S3", "S4", "S5", "S6 (Current)"];

// Multiplier curves are fixed per region so results never change between reloads.
const regionCurves = {
  assam: { rainfall: [0.82, 0.88, 0.95, 1.02, 1.1, 1.18], ndvi: [0.68, 0.66, 0.64, 0.62, 0.6, 0.58], soilLoss: [16.4, 17.8, 19.3, 21.0, 23.0, 25.2] },
  bihar: { rainfall: [0.9, 0.93, 0.97, 1.0, 1.05, 1.09], ndvi: [0.6, 0.58, 0.56, 0.55, 0.53, 0.52], soilLoss: [9.8, 10.4, 11.1, 11.9, 12.7, 13.6] },
  "uttar-pradesh": { rainfall: [1.08, 1.05, 1.02, 0.99, 0.97, 0.96], ndvi: [0.53, 0.51, 0.49, 0.47, 0.45, 0.44], soilLoss: [23.7, 25.5, 27.5, 29.7, 32.3, 35.1] },
  odisha: { rainfall: [0.9, 0.94, 0.98, 1.02, 1.05, 1.06], ndvi: [0.57, 0.55, 0.53, 0.51, 0.5, 0.49], soilLoss: [18.4, 19.9, 21.6, 23.5, 25.5, 27.7] },
  rajasthan: { rainfall: [1.25, 1.15, 1.05, 0.95, 0.85, 0.68], ndvi: [0.31, 0.29, 0.27, 0.25, 0.23, 0.21], soilLoss: [2.9, 3.1, 3.4, 3.6, 3.9, 4.3] },
  "west-bengal": { rainfall: [0.94, 0.96, 0.99, 1.01, 1.03, 1.03], ndvi: [0.54, 0.52, 0.51, 0.49, 0.48, 0.47], soilLoss: [12.7, 13.6, 14.6, 15.7, 16.9, 18.1] }
};

function getHistoricalSeries(regionId, baseRainfall) {
  const curve = regionCurves[regionId] || regionCurves.assam;
  return seasons.map((season, i) => ({
    season,
    rainfall: Math.round(baseRainfall * curve.rainfall[i]),
    ndvi: Number(curve.ndvi[i].toFixed(2)),
    soilLoss: Number(curve.soilLoss[i].toFixed(1))
  }));
}

module.exports = { seasons, regionCurves, getHistoricalSeries };
