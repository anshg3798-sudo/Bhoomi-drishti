/**
 * AI explanation service. AI is ONLY used to phrase natural-language
 * explanations of already-computed scientific results - it never calculates
 * soil loss, risk categories, or recommendations. If no API key is
 * configured, a deterministic rule-based explanation is used instead so the
 * application works fully without any AI credentials.
 */

function isAIConfigured() {
  return Boolean(process.env.AI_API_KEY && process.env.AI_API_KEY.trim().length > 0);
}

function ruleBasedExplanation({ region, soilLoss, riskCategory, floodRisk, droughtRisk, topRecommendation }) {
  const parts = [];
  parts.push(
    `${region.name} shows an estimated soil loss of ${soilLoss} t/ha/year, placing it in the "${riskCategory}" erosion risk category.`
  );
  if (floodRisk) parts.push(`Flood risk is currently assessed as "${floodRisk.category}", driven mainly by ${floodRisk.reasons[0].toLowerCase()} and ${floodRisk.reasons[1].toLowerCase()}.`);
  if (droughtRisk) parts.push(`Drought risk is assessed as "${droughtRisk.category}" based on rainfall and vegetation trends.`);
  if (topRecommendation) {
    parts.push(
      `The top recommended intervention is ${topRecommendation.title} (${topRecommendation.priority} priority) because ${topRecommendation.reason.toLowerCase()}, with an expected soil-loss reduction of ${topRecommendation.expectedSoilLossReduction}.`
    );
  }
  return {
    explanation: parts.join(" "),
    mode: "RULE_BASED",
    label: "Rule-based Demo Explanation"
  };
}

async function generateAIExplanation(context) {
  if (!isAIConfigured()) {
    return ruleBasedExplanation(context);
  }

  try {
    const { region, soilLoss, riskCategory, floodRisk, droughtRisk, topRecommendation } = context;
    const prompt = `You are an agricultural soil-conservation assistant. Using ONLY the following pre-computed
scientific values (do not invent new numbers), write a short, farmer-friendly explanation (3-4 sentences)
of the erosion situation and the top recommendation.

Region: ${region.name}
Estimated soil loss: ${soilLoss} t/ha/year
Erosion risk category: ${riskCategory}
Flood risk: ${floodRisk?.category ?? "N/A"}
Drought risk: ${droughtRisk?.category ?? "N/A"}
Top recommendation: ${topRecommendation?.title ?? "N/A"} - ${topRecommendation?.reason ?? ""}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.AI_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`AI API responded with status ${response.status}`);

    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join(" ").trim();

    if (!text) throw new Error("Empty AI response");

    return { explanation: text, mode: "AI", label: "AI Explanation" };
  } catch (err) {
    console.warn("[aiService] AI explanation failed, falling back to rule-based:", err.message);
    return ruleBasedExplanation(context);
  }
}

module.exports = { generateAIExplanation, isAIConfigured };
