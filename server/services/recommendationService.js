/**
 * Rule-based conservation recommendation engine.
 * Generates ranked interventions from erosion severity, slope, rainfall,
 * flow concentration, vegetation cover, flood and drought risk.
 */

function generateRecommendations({ region, soilLoss, riskCategory, floodRisk, droughtRisk }) {
  const { slope, ndvi, flowAccumulation, rainfall } = region;
  const recs = [];

  const highRunoff = flowAccumulation === "High";
  const highErosion = riskCategory === "High" || riskCategory === "Very High";
  const moderateHighSlope = slope >= 5;
  const poorVegetation = ndvi < 0.45;
  const seasonalRainfall = rainfall > 800;

  if (highRunoff && highErosion) {
    recs.push({
      title: "Check Dams",
      reason: "High runoff + drainage concentration + high erosion",
      expectedImpact: "Reduces peak runoff velocity and traps sediment at drainage points",
      expectedSoilLossReduction: "25-35%",
      priority: "High",
      category: "Structural intervention"
    });
  }

  if (moderateHighSlope && highErosion) {
    recs.push({
      title: "Contour Bunding",
      reason: `${slope >= 8 ? "High" : "Moderate"} slope + sheet erosion risk on agricultural land`,
      expectedImpact: "Breaks slope length and reduces sheet/rill erosion on farmland",
      expectedSoilLossReduction: "18-25%",
      priority: highErosion ? "High" : "Moderate",
      category: "Agronomic measure"
    });
  }

  if (seasonalRainfall && highRunoff) {
    recs.push({
      title: "Farm Ponds",
      reason: "Significant seasonal water runoff suitable for harvesting",
      expectedImpact: "Captures runoff for irrigation and reduces downstream flow volume",
      expectedSoilLossReduction: "8-15%",
      priority: "Moderate",
      category: "Water harvesting"
    });
  }

  if (poorVegetation && highErosion) {
    recs.push({
      title: "Agroforestry",
      reason: "Poor vegetation cover + high erosion risk requiring long-term stabilization",
      expectedImpact: "Improves canopy cover, root binding and long-term soil stability",
      expectedSoilLossReduction: "20-30%",
      priority: "High",
      category: "Long-term vegetative measure"
    });
  }

  if (poorVegetation && (riskCategory === "Moderate" || riskCategory === "Low")) {
    recs.push({
      title: "Vegetative Barriers",
      reason: "Reduced vegetation cover with moderate erosion risk",
      expectedImpact: "Slows overland flow and filters sediment along contours",
      expectedSoilLossReduction: "10-18%",
      priority: "Moderate",
      category: "Vegetative measure"
    });
  }

  if (["Moderate", "High", "Very High"].includes(droughtRisk?.category)) {
    const droughtSeverity = droughtRisk.category === "Moderate" ? "Moderate" : "High";
    recs.push({
      title: "Farm Ponds & Moisture Conservation",
      reason: `${droughtSeverity} drought risk with declining soil moisture and NDVI`,
      expectedImpact: "Improves water availability during dry spells and supports vegetation recovery",
      expectedSoilLossReduction: "5-10% (secondary benefit)",
      priority: droughtSeverity === "High" ? "High" : "Moderate",
      category: "Water harvesting"
    });
  }

  if (poorVegetation && droughtRisk?.category !== "Low" && !recs.some((r) => r.title === "Agroforestry")) {
    recs.push({
      title: "Agroforestry & Drought-Resilient Cover",
      reason: "Sparse vegetation cover under drought stress reduces long-term land resilience",
      expectedImpact: "Rebuilds vegetative cover and root structure to buffer against future dry spells",
      expectedSoilLossReduction: "10-15%",
      priority: "Moderate",
      category: "Long-term vegetative measure"
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Routine Monitoring",
      reason: "Current risk indicators are within acceptable range",
      expectedImpact: "Maintain periodic satellite and ground monitoring to detect early change",
      expectedSoilLossReduction: "N/A",
      priority: "Low",
      category: "Monitoring"
    });
  }

  const priorityOrder = { High: 0, Moderate: 1, Low: 2 };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recs;
}

module.exports = { generateRecommendations };
