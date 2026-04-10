// Simulated NPU scam detection engine
// This is a HARD-CODED prototype for hackathon demo purposes only
// In production: Runs locally on device via Android Private Compute Core / Apple Intelligence

export const simulateNPUAnalysis = async (scamType) => {
  // Simulate NPU processing delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Hard-coded responses based on scam type
  const responses = {
    whatsapp: {
      risk: "CRITICAL",
      tactic: [
        "urgency",
        "impersonation",
        "social_engineering",
        "family_emergency",
      ],
      action: "trigger_friction",
      confidence: 0.94,
    },
    fake_call: {
      risk: "CRITICAL",
      tactic: [
        "urgency",
        "impersonation",
        "authority_figure",
        "official_threat",
      ],
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

  const result = responses[scamType] || responses.default;

  console.log("🤖 [SIMULATED] NPU Analysis Complete:", result);
  console.log(
    "📍 In production, this runs locally on device NPU - zero cloud data",
  );

  return result;
};

// For demo: Different scam variants
export const simulateUrgentFamilyScam = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    risk: "CRITICAL",
    tactic: ["urgency", "family_impersonation", "financial_request"],
    action: "trigger_friction",
    confidence: 0.96,
  };
};

export const simulateOfficialImpersonation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    risk: "CRITICAL",
    tactic: ["authority_impersonation", "threat", "urgency"],
    action: "trigger_friction",
    confidence: 0.93,
  };
};
