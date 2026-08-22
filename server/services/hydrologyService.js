/**
 * Hydrological prioritization service.
 * For the prototype this uses precomputed/demo flow-path GeoJSON rather than
 * a full flow-direction/flow-accumulation raster engine, since that requires
 * DEM raster processing (Python/GDAL) that is out of scope for MERN.
 */

function buildFlowPaths(region) {
  const [lat, lng] = region.coordinates;
  // Small synthetic dendritic flow network around the region centroid.
  const offsets = [
    [0, 0], [0.05, 0.03], [0.09, 0.08], [0.13, 0.11],
    [0.05, -0.04], [0.1, -0.07]
  ];
  const flowScoreMap = { Low: 0.3, Moderate: 0.6, High: 0.9 };
  const intensity = flowScoreMap[region.flowAccumulation] ?? 0.5;

  const mainChannel = {
    type: "Feature",
    properties: { type: "flow-channel", intensity, label: "Primary runoff channel" },
    geometry: {
      type: "LineString",
      coordinates: offsets.map(([dy, dx]) => [lng + dx, lat + dy])
    }
  };

  const tributary = {
    type: "Feature",
    properties: { type: "flow-channel", intensity: intensity * 0.6, label: "Tributary channel" },
    geometry: {
      type: "LineString",
      coordinates: [
        [lng - 0.06, lat + 0.02],
        [lng - 0.02, lat + 0.05],
        [lng, lat]
      ]
    }
  };

  return { type: "FeatureCollection", features: [mainChannel, tributary] };
}

function buildPriorityZone(region, soilLoss, floodScore) {
  const [lat, lng] = region.coordinates;
  const size = 0.06 + Math.min(soilLoss / 100, 0.08);
  const polygon = {
    type: "Feature",
    properties: {
      type: "priority-zone",
      reason: "High runoff concentration + steep/low slope + elevated erosion",
      priority: soilLoss > 20 || floodScore > 60 ? "Critical" : soilLoss > 10 ? "High" : "Moderate"
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [lng - size, lat - size * 0.6],
        [lng + size, lat - size * 0.6],
        [lng + size * 1.1, lat + size * 0.7],
        [lng - size * 0.9, lat + size * 0.8],
        [lng - size, lat - size * 0.6]
      ]]
    }
  };
  return { type: "FeatureCollection", features: [polygon] };
}

function analyzeHydrology(region, soilLoss, floodScore) {
  return {
    flowPaths: buildFlowPaths(region),
    priorityZone: buildPriorityZone(region, soilLoss, floodScore),
    explanation: "High runoff concentration + steep slope + high erosion = priority conservation zone",
    flowAccumulation: region.flowAccumulation,
    isEstimate: true
  };
}

module.exports = { analyzeHydrology, buildFlowPaths, buildPriorityZone };
