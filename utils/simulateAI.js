// Simulated AI scam detection engine
// This is a HARD-CODED prototype for demo purposes only

export const simulateNPUAnalysis = async (scamType) => {
  // Simulate NPU processing delay (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Hard-coded responses based on scam type
  const responses = {
    whatsapp: {
      risk: "HIGH",
      tactic: ["urgency", "impersonation", "social_engineering"],
      action: "trigger_friction",
      duration: 180,
    },
    fake_call: {
      risk: "HIGH",
      tactic: ["urgency", "impersonation", "authority_figure"],
      action: "trigger_friction",
      duration: 180,
    },
    default: {
      risk: "MEDIUM",
      tactic: ["unusual_pattern"],
      action: "trigger_friction",
      duration: 90,
    },
  };

  // Return the appropriate response or default
  const result = responses[scamType] || responses.default;

  // Log to console for debugging
  console.log("🤖 NPU Analysis Complete:", result);

  return result;
};

// Optional: Simulate different risk levels for variety
export const simulateQuickAnalysis = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    risk: "HIGH",
    tactic: ["urgency"],
    action: "trigger_friction",
    duration: 180,
  };
};

// Optional: Simulate false positive (low risk)
export const simulateLowRiskAnalysis = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    risk: "LOW",
    tactic: [],
    action: "allow",
    duration: 0,
  };
};
