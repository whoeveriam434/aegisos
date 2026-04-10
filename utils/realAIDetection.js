// REAL AI Detection using keyword pattern matching
// Runs entirely on-device, no external packages needed

let modelReady = true; // Always ready since we're using pure JS

export const initAIModel = async () => {
  // No external dependencies needed
  console.log("✅ AI Scam Detector ready (pure JS)");
  return true;
};

export const detectScamWithAI = async (text, context = "message") => {
  // REAL keyword-based detection (this runs entirely on-device)

  const scamPatterns = {
    urgency: [
      "urgent",
      "immediately",
      "asap",
      "right now",
      "quickly",
      "hurry",
      "act now",
      "emergency",
      "send now",
    ],
    financial: [
      "send money",
      "transfer",
      "payme",
      "fps",
      "bank account",
      "deposit",
      "payment",
      "money",
      "pay",
      "hk$",
      "dollar",
    ],
    impersonation: [
      "i am",
      "this is",
      "police",
      "official",
      "bank",
      "government",
      "authority",
      "officer",
    ],
    isolation: [
      "don't tell",
      "secret",
      "private",
      "confidential",
      "keep between us",
      "alone",
    ],
    threat: [
      "arrest",
      "suspend",
      "close account",
      "legal action",
      "warrant",
      "jail",
      "court",
    ],
  };

  const lowerText = text.toLowerCase();
  const detectedTactics = [];
  let maxConfidence = 0;

  // Detect tactics
  for (const [tactic, keywords] of Object.entries(scamPatterns)) {
    const found = keywords.some((keyword) => lowerText.includes(keyword));
    if (found) {
      detectedTactics.push(tactic);
      maxConfidence += 0.2;
    }
  }

  // Hong Kong specific scam detection
  if (
    lowerText.includes("hk police") ||
    lowerText.includes("hong kong police")
  ) {
    detectedTactics.push("authority_impersonation");
    maxConfidence += 0.3;
  }
  if (lowerText.includes("bail") || lowerText.includes("court")) {
    detectedTactics.push("legal_threat");
    maxConfidence += 0.3;
  }
  if (
    lowerText.includes("grandson") ||
    lowerText.includes("daughter") ||
    lowerText.includes("relative")
  ) {
    detectedTactics.push("family_impersonation");
    maxConfidence += 0.25;
  }
  if (lowerText.includes("payme") || lowerText.includes("fps")) {
    detectedTactics.push("payment_pressure");
    maxConfidence += 0.2;
  }

  const confidence = Math.min(maxConfidence, 0.98);
  const isScam = confidence > 0.4;

  let risk = "LOW";
  if (confidence > 0.75) risk = "CRITICAL";
  else if (confidence > 0.6) risk = "HIGH";
  else if (confidence > 0.4) risk = "MEDIUM";

  return {
    isScam,
    confidence: Math.round(confidence * 100) / 100,
    tactics: detectedTactics,
    risk,
    action: isScam ? "trigger_friction" : "allow",
  };
};

// Analyze message text
export const analyzeMessageText = async (messageText, sender = "unknown") => {
  console.log("🤖 AI analyzing:", messageText.substring(0, 60));
  const result = await detectScamWithAI(messageText);

  if (result.isScam) {
    console.log("🚨 SCAM DETECTED! Confidence:", result.confidence);
  }

  return result;
};
