/**
 * RUSLE (Revised Universal Soil Loss Equation) service.
 * A = R x K x LS x C x P
 *   R  - Rainfall erosivity factor
 *   K  - Soil erodibility factor
 *   LS - Slope length & steepness factor
 *   C  - Cover-management factor
 *   P  - Conservation-practice factor
 *
 * This calculation is fully deterministic. AI is never used to derive
 * scientific values - only to phrase explanations (see aiService.js).
 */

function classifyRisk(soilLoss) {
  if (soilLoss < 5) return "Very Low";
  if (soilLoss < 10) return "Low";
  if (soilLoss < 20) return "Moderate";
  if (soilLoss < 40) return "High";
  return "Very High";
}

function calculateRUSLE({ R, K, LS, C, P }) {
  const factors = { R, K, LS, C, P };
  const missing = Object.entries(factors).filter(([, v]) => typeof v !== "number" || Number.isNaN(v));
  if (missing.length) {
    throw new Error(`Invalid or missing RUSLE factor(s): ${missing.map(([k]) => k).join(", ")}`);
  }

  const soilLoss = R * K * LS * C * P;
  const riskCategory = classifyRisk(soilLoss);

  return {
    factors,
    formula: "A = R x K x LS x C x P",
    breakdown: `${R} x ${K} x ${LS} x ${C} x ${P} = ${soilLoss.toFixed(2)} t/ha/year`,
    soilLoss: Number(soilLoss.toFixed(2)),
    unit: "t/ha/year",
    riskCategory,
    isEstimate: true
  };
}

module.exports = { calculateRUSLE, classifyRisk };
