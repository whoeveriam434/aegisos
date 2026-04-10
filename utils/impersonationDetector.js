// Impersonation Detector - Uses learned patterns to detect scams
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractFeatures, compareAgainstPatterns } from "./patternLearner";

// Main detection function
export const detectImpersonation = async (
  message,
  claimedIdentity,
  isEnabled,
) => {
  // If user hasn't enabled personal patterns, return null
  if (!isEnabled) {
    return {
      enabled: false,
      detectionAvailable: false,
      message:
        "Personal pattern detection is disabled. Enable in Settings to personalize protection.",
    };
  }

  // Load learned patterns for this identity
  const patternsKey = `patterns_${claimedIdentity === "family" ? "family" : "bank"}`;
  const storedPatterns = await AsyncStorage.getItem(patternsKey);

  if (!storedPatterns) {
    return {
      enabled: true,
      detectionAvailable: false,
      message: `No patterns learned for ${claimedIdentity} yet. The system needs to learn normal communication first.`,
    };
  }

  const learnedPatterns = JSON.parse(storedPatterns);

  // Compare message against learned patterns
  const result = compareAgainstPatterns(message, learnedPatterns);

  if (!result.canCompare) {
    return {
      enabled: true,
      detectionAvailable: false,
      message: result.reason,
    };
  }

  // Generate human-readable explanation
  let explanation = "";
  if (result.isImpersonation) {
    explanation = `⚠️ This doesn't sound like ${claimedIdentity === "family" ? "your family member" : "your bank"}.\n\n`;
    explanation += result.deviations.slice(0, 2).join("\n");
    explanation += `\n\nConfidence: ${Math.round(result.confidence * 100)}%`;
  } else {
    explanation = `✓ This message matches normal patterns.\nConfidence: ${Math.round((1 - result.confidence) * 100)}%`;
  }

  return {
    enabled: true,
    detectionAvailable: true,
    isImpersonation: result.isImpersonation,
    confidence: result.confidence,
    deviations: result.deviations,
    explanation,
    severity: result.severity,
  };
};

// Quick detection for demo (uses hardcoded scam message)
export const demoImpersonationDetection = async (isEnabled) => {
  const scamMessage =
    "URGENT! Mom, it's me. I lost my phone. Send HK$50,000 to this PayMe account immediately. Don't tell anyone.";

  return await detectImpersonation(scamMessage, "family", isEnabled);
};
