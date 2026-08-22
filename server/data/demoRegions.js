// Deterministic demo dataset representing pre-processed satellite/environmental
// observations. These values are DEMO ESTIMATES for the SIH prototype and are
// intentionally fixed (not randomized) so the dashboard is stable across reloads.
// In LIVE mode, satelliteService.js would replace this with real Sentinel-1/2,
// SRTM, CHIRPS and SoilGrids derived values.

const demoRegions = [
  {
    id: "assam",
    name: "Assam",
    district: "Majuli",
    coordinates: [26.2006, 92.9376],
    bbox: [[25.9, 92.6], [26.5, 93.3]],
    rainfall: 2850, // mm/year
    rainfallAnomaly: 18, // % vs historical mean
    ndvi: 0.58,
    ndviTrend: -6, // % change over last 3 seasons
    soilMoisture: 0.71, // fraction, 0-1
    slope: 6.5, // degrees (floodplain, low slope)
    elevation: 62, // m
    flowAccumulation: "High",
    lowLyingTerrain: true,
    historicalFloodProne: true,
    rusle: { R: 800, K: 0.3, LS: 1.0, C: 0.15, P: 0.7 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  },
  {
    id: "bihar",
    name: "Bihar",
    district: "Sitamarhi",
    coordinates: [26.1197, 85.3910],
    bbox: [[25.7, 85.0], [26.5, 85.8]],
    rainfall: 1350,
    rainfallAnomaly: 9,
    ndvi: 0.52,
    ndviTrend: -3,
    soilMoisture: 0.55,
    slope: 4.2,
    elevation: 52,
    flowAccumulation: "High",
    lowLyingTerrain: true,
    historicalFloodProne: true,
    rusle: { R: 600, K: 0.28, LS: 0.9, C: 0.12, P: 0.75 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    district: "Chitrakoot",
    coordinates: [25.2100, 80.8500],
    bbox: [[24.8, 80.4], [25.6, 81.3]],
    rainfall: 980,
    rainfallAnomaly: -4,
    ndvi: 0.44,
    ndviTrend: -8,
    soilMoisture: 0.38,
    slope: 9.1,
    elevation: 180,
    flowAccumulation: "Moderate",
    lowLyingTerrain: false,
    historicalFloodProne: false,
    rusle: { R: 650, K: 0.3, LS: 1.2, C: 0.2, P: 0.75 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  },
  {
    id: "odisha",
    name: "Odisha",
    district: "Kalahandi",
    coordinates: [19.9137, 83.1650],
    bbox: [[19.5, 82.7], [20.3, 83.6]],
    rainfall: 1450,
    rainfallAnomaly: 6,
    ndvi: 0.49,
    ndviTrend: -5,
    soilMoisture: 0.46,
    slope: 12.4,
    elevation: 320,
    flowAccumulation: "High",
    lowLyingTerrain: false,
    historicalFloodProne: false,
    rusle: { R: 700, K: 0.34, LS: 1.6, C: 0.1, P: 0.73 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    district: "Barmer",
    coordinates: [25.7521, 71.3961],
    bbox: [[25.3, 70.9], [26.2, 71.9]],
    rainfall: 280,
    rainfallAnomaly: -32,
    ndvi: 0.21,
    ndviTrend: -14,
    soilMoisture: 0.14,
    slope: 3.0,
    elevation: 210,
    flowAccumulation: "Low",
    lowLyingTerrain: false,
    historicalFloodProne: false,
    rusle: { R: 180, K: 0.2, LS: 0.4, C: 0.35, P: 0.85 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    district: "Purulia",
    coordinates: [23.3320, 86.3650],
    bbox: [[22.9, 85.9], [23.7, 86.8]],
    rainfall: 1400,
    rainfallAnomaly: 3,
    ndvi: 0.47,
    ndviTrend: -4,
    soilMoisture: 0.41,
    slope: 8.3,
    elevation: 245,
    flowAccumulation: "Moderate",
    lowLyingTerrain: false,
    historicalFloodProne: false,
    rusle: { R: 620, K: 0.3, LS: 1.3, C: 0.1, P: 0.75 },
    dataSource: ["Sentinel-2 (demo)", "CHIRPS (demo)", "SRTM (demo)", "SoilGrids (demo)"]
  }
];

module.exports = demoRegions;
