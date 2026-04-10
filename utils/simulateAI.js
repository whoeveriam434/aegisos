// Simulated NPU scam detection engine
// FALLBACK when real AI is not available
// In production: This would be replaced by actual on-device model

export const simulateNPUAnalysis = async (scamType) => {
  // Simulate NPU processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const responses = {
    whatsapp: {
      risk: "CRITICAL",
      tactic: ["urgency", "impersonation", "family_emergency"],
      action: "trigger_friction",
      confidence: 0.94,
    },
    fake_call: {
      risk: "CRITICAL",
      tactic: ["urgency", "impersonation", "authority_figure"],
      action: "trigger_friction",
      confidence: 0.91,
    },
    payme_scam: {
      risk: "HIGH",
      tactic: ["urgency", "financial_pressure", "irreversible_payment"],
      action: "trigger_friction",
      confidence: 0.88,
    },
    default: {
      risk: "MEDIUM",
      tactic: ["unusual_pattern"],
      action: "trigger_friction",
      confidence: 0.75,
    },
  };

  return responses[scamType] || responses.default;
};

// For demo compatibility
export const simulateNPUAnalysisWithCallback = async (scamType, callback) => {
  const result = await simulateNPUAnalysis(scamType);
  if (callback) callback(result);
  return result;
};
