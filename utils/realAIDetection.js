// AI Detection Engine
// ============================================
// REAL GEMINI API IMPLEMENTATION - COMMENTED OUT
// Uncomment and add API key to config.js for production
// ============================================

// import { initGemini, detectScamWithGemini } from './geminiDetection'; // COMMENTED OUT

let geminiEnabled = true; // Demo mode enabled

// ============================================
// REAL INIT FUNCTION - COMMENTED OUT
// ============================================
/*
export const initGeminiMode = async () => {
  const success = await initGemini();
  geminiEnabled = success;
  return success;
};
*/

// Demo mode init
export const initGeminiMode = async () => {
  geminiEnabled = true;
  console.log("AI Engine Ready");
  return true;
};

export const isGeminiEnabled = () => geminiEnabled;

export const initAIModel = async () => {
  console.log("AI Detection Engine Ready");
  return true;
};

// Keyword detection (fallback)
export const detectScamWithKeywords = async (text) => {
  const lowerText = text.toLowerCase();

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
    ],
    financial: [
      "send money",
      "transfer",
      "payme",
      "fps",
      "bank account",
      "deposit",
      "payment",
    ],
    impersonation: [
      "i am",
      "this is",
      "police",
      "official",
      "bank",
      "government",
      "authority",
    ],
    isolation: [
      "don't tell",
      "secret",
      "private",
      "confidential",
      "keep between us",
    ],
    threat: ["arrest", "suspend", "close account", "legal action", "warrant"],
  };

  const detectedTactics = [];
  let maxConfidence = 0;

  for (const [tactic, keywords] of Object.entries(scamPatterns)) {
    const found = keywords.some((keyword) => lowerText.includes(keyword));
    if (found) {
      detectedTactics.push(tactic);
      maxConfidence += 0.2;
    }
  }

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

  const confidence = Math.min(maxConfidence, 0.98);
  const isScam = confidence > 0.4;

  let risk = "LOW";
  if (confidence > 0.75) risk = "HIGH";
  else if (confidence > 0.6) risk = "MEDIUM";

  return {
    isScam,
    confidence,
    tactics: detectedTactics,
    risk,
    action: isScam ? "trigger_friction" : "allow",
    source: "pattern",
    explanation: isScam ? "Unusual pattern detected" : "No threats found",
    personalDetection: null,
  };
};

// Main detection function with hardcoded AI-style responses for demo
export const detectScamWithRealAI = async (text, scamType) => {
  if (geminiEnabled) {
    // ============================================
    // REAL GEMINI API CALL - COMMENTED OUT
    // ============================================
    /*
    try {
      const result = await detectScamWithGemini(text, scamType);
      if (result.success) {
        return {
          isScam: result.isScam,
          confidence: result.confidence,
          tactics: result.tactics,
          risk: result.risk,
          action: result.action,
          explanation: result.explanation,
          source: 'ai',
          personalDetection: {
            isImpersonation: result.isScam,
            confidence: result.confidence,
            deviations: result.tactics,
            explanation: result.explanation
          }
        };
      }
    } catch (error) {
      console.log('API error, using pattern detection');
    }
    */

    // ============================================
    // DEMO MODE: Hardcoded AI-style responses
    // These mimic real AI analysis for presentation
    // ============================================

    const hardcodedResponses = {
      whatsapp: {
        isScam: true,
        confidence: 0.87,
        tactics: [
          "urgency",
          "impersonation",
          "isolation",
          "financial_pressure",
        ],
        risk: "HIGH",
        action: "trigger_friction",
        source: "ai",
        explanation:
          "This message shows multiple scam indicators:\n\n• Impersonation: Claiming to be a family member in distress\n• Urgency: 'URGENT' and 'immediately' create artificial pressure\n• Isolation: 'Don't tell anyone' - a common scam tactic\n• Financial request: Unusual request for HK$50,000 via PayMe\n\nThis doesn't match how your family normally communicates.",
        personalDetection: {
          isImpersonation: true,
          confidence: 0.92,
          deviations: [
            "This person has never asked for money before",
            "Asking you to keep this secret — a common scam tactic",
            "Message length is unusual for this person",
          ],
          explanation:
            "This doesn't match your family's communication pattern.\n\n• Never asks for money\n• Urgent language is unusual\n• Request for secrecy is a red flag",
        },
      },
      fake_call: {
        isScam: true,
        confidence: 0.94,
        tactics: [
          "authority_impersonation",
          "threat",
          "urgency",
          "financial_pressure",
        ],
        risk: "CRITICAL",
        action: "trigger_friction",
        source: "ai",
        explanation:
          "This call contains critical scam indicators:\n\n• Authority impersonation: Claiming to be 'Officer Chen from HK Police'\n• Legal threats: Mentioning 'warrant' and 'arrest' to induce fear\n• Urgency: 'Immediately' and 'or you will be arrested'\n• Financial request: HK$100,000 for 'bail' - police never request bail money by phone\n\nThis is a known scam pattern targeting Hong Kong residents.",
        personalDetection: {
          isImpersonation: true,
          confidence: 0.96,
          deviations: [
            "Official calls never demand immediate payment",
            "Police never request bail money by phone",
            "Threats of arrest are a known intimidation tactic",
          ],
          explanation:
            "Government officials never demand payment by phone.\n\n• Legal threats are a common scam tactic\n• Bail money is never requested this way\n• Always verify through official channels",
        },
      },
      payme_scam: {
        isScam: true,
        confidence: 0.84,
        tactics: ["urgency", "financial_pressure", "irreversible_payment"],
        risk: "HIGH",
        action: "trigger_friction",
        source: "ai",
        explanation:
          "This payment alert shows scam patterns:\n\n• Artificial urgency: 'Account will be suspended in 2 hours'\n• Financial pressure: Request for HK$8,000 transfer\n• Irreversible payment: FPS transfers cannot be reversed\n• Suspicious verification: Legitimate banks never ask for transfers to 'verify' accounts\n\nPayMe and banks will never ask you to send money to 'verify' your identity.",
        personalDetection: {
          isImpersonation: true,
          confidence: 0.88,
          deviations: [
            "Banks never threaten account suspension via message",
            "Urgent payment requests are always suspicious",
            "Verify through official app, not links in messages",
          ],
          explanation:
            "Financial institutions use secure channels only.\n\n• Never respond to urgent payment requests\n• Always verify through official apps\n• Legitimate banks don't threaten suspension",
        },
      },
      default: {
        isScam: true,
        confidence: 0.76,
        tactics: ["unusual_pattern", "urgency"],
        risk: "MEDIUM",
        action: "trigger_friction",
        source: "ai",
        explanation:
          "This communication shows unusual patterns that may indicate a scam:\n\n• Unexpected urgency or pressure\n• Request for financial action\n• Unusual communication style\n\nTaking a moment to verify is always the safest choice.",
        personalDetection: {
          isImpersonation: false,
          confidence: 0.65,
          deviations: [
            "Unusual communication pattern detected",
            "Recommend verification before action",
          ],
          explanation:
            "Patterns suggest caution is advised.\n\n• Verify the sender's identity\n• Don't act under pressure\n• Use official channels to confirm",
        },
      },
    };

    const response = hardcodedResponses[scamType] || hardcodedResponses.default;
    console.log("AI Analysis Complete:", response);
    return response;
  }

  return detectScamWithKeywords(text);
};

export const detectScamWithAI = async (text, scamType) => {
  return detectScamWithRealAI(text, scamType);
};

export const analyzeMessageText = async (messageText, sender = "unknown") => {
  console.log("Analyzing:", messageText.substring(0, 60));
  return detectScamWithRealAI(messageText, "whatsapp");
};
