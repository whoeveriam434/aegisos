// Pattern Learner - Analyzes communication patterns locally
// This is REAL algorithmic analysis, not random simulation

import AsyncStorage from "@react-native-async-storage/async-storage";

// Sample message patterns for learning (user would provide real messages in production)
export const sampleMessages = {
  family: {
    normal: [
      "Hi mom, how are you today?",
      "Love you, see you on Sunday for dinner",
      "Can you send me the recipe for that soup?",
      "I'm coming home late tonight, don't wait up",
      "Happy birthday! Hope you have a great day",
      "What time should I pick you up tomorrow?",
      "The weather is so nice today, going for a walk",
      "Did you see that show last night? It was good",
      "I miss you, let's talk soon",
      "Just checking in, hope everything is okay",
    ],
    // These would never appear in normal conversation
    neverContains: [
      "send money",
      "urgent transfer",
      "payme immediately",
      "don't tell anyone",
      "secret",
    ],
  },
  bank: {
    normal: [
      "Your account balance is $12,480 as of today",
      "Your statement is ready to view online",
      "Thank you for using our services",
      "Please verify your recent transaction",
      "For security, we never ask for your password",
      "You have a new message in your secure inbox",
      "Your bill payment has been scheduled",
      "Thank you for being a valued customer",
    ],
    neverContains: [
      "transfer immediately",
      "urgent payment",
      "send to this account",
      "don't tell anyone",
    ],
  },
};

// Extract features from a message
export const extractFeatures = (message) => {
  const lowerMsg = message.toLowerCase();

  return {
    length: message.length,
    wordCount: message.split(" ").length,
    hasUrgency: containsPattern(lowerMsg, [
      "urgent",
      "immediately",
      "asap",
      "right now",
      "quickly",
      "hurry",
    ]),
    hasMoneyRequest: containsPattern(lowerMsg, [
      "money",
      "send",
      "pay",
      "transfer",
      "payme",
      "fps",
      "hk$",
    ]),
    hasIsolation: containsPattern(lowerMsg, [
      "don't tell",
      "secret",
      "private",
      "confidential",
      "alone",
    ]),
    hasAuthority: containsPattern(lowerMsg, [
      "police",
      "official",
      "bank",
      "government",
      "authority",
    ]),
    exclamationCount: (message.match(/!/g) || []).length,
    questionCount: (message.match(/\?/g) || []).length,
    capitalRatio: message.replace(/[^A-Z]/g, "").length / message.length || 0,
    emojiCount: (message.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length,
  };
};

// Helper: Check if message contains any pattern
const containsPattern = (text, patterns) => {
  return patterns.some((pattern) => text.includes(pattern));
};

// Learn patterns from message history
export const learnPatterns = async (contactType, messages) => {
  console.log(
    `📖 Learning patterns for ${contactType} from ${messages.length} messages`,
  );

  // Simulate processing time (real ML would take time)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Analyze all messages to build baseline
  const allFeatures = messages.map((msg) => extractFeatures(msg));

  // Calculate average features (baseline)
  const baseline = {
    avgLength: average(allFeatures.map((f) => f.length)),
    avgWordCount: average(allFeatures.map((f) => f.wordCount)),
    urgencyScore: average(allFeatures.map((f) => (f.hasUrgency ? 1 : 0))),
    moneyRequestScore: average(
      allFeatures.map((f) => (f.hasMoneyRequest ? 1 : 0)),
    ),
    isolationScore: average(allFeatures.map((f) => (f.hasIsolation ? 1 : 0))),
    authorityScore: average(allFeatures.map((f) => (f.hasAuthority ? 1 : 0))),
    avgExclamations: average(allFeatures.map((f) => f.exclamationCount)),
    avgQuestions: average(allFeatures.map((f) => f.questionCount)),
    avgCapitalRatio: average(allFeatures.map((f) => f.capitalRatio)),
    avgEmojiCount: average(allFeatures.map((f) => f.emojiCount)),
    totalMessages: messages.length,
  };

  // Calculate standard deviations for anomaly detection
  const stdDev = {
    length: standardDeviation(
      allFeatures.map((f) => f.length),
      baseline.avgLength,
    ),
    urgency: baseline.urgencyScore * 0.5, // Smaller std for binary features
    moneyRequest: baseline.moneyRequestScore * 0.5,
  };

  const patterns = {
    contactType,
    baseline,
    stdDev,
    lastUpdated: new Date().toISOString(),
    // Store what this contact NEVER does (zero occurrences)
    neverAsksForMoney: baseline.moneyRequestScore === 0,
    neverUsesUrgency: baseline.urgencyScore === 0,
    neverUsesIsolation: baseline.isolationScore === 0,
  };

  // Save to local storage
  await AsyncStorage.setItem(
    `patterns_${contactType}`,
    JSON.stringify(patterns),
  );

  console.log(`✅ Learned patterns for ${contactType}`, patterns);
  return patterns;
};

// Helper: Calculate average
const average = (arr) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);

// Helper: Calculate standard deviation
const standardDeviation = (arr, mean) => {
  const squaredDiffs = arr.map((value) => Math.pow(value - mean, 2));
  const avgSquaredDiff = average(squaredDiffs);
  return Math.sqrt(avgSquaredDiff);
};

// Compare new message against learned patterns
export const compareAgainstPatterns = (newMessage, learnedPatterns) => {
  if (!learnedPatterns || !learnedPatterns.baseline) {
    return { canCompare: false, reason: "No patterns learned yet" };
  }

  const features = extractFeatures(newMessage);
  const baseline = learnedPatterns.baseline;
  const stdDev = learnedPatterns.stdDev;

  const deviations = [];

  // Check 1: Money request anomaly
  if (features.hasMoneyRequest && learnedPatterns.neverAsksForMoney) {
    deviations.push({
      type: "behavioral",
      severity: 0.9,
      message: `This person has NEVER asked for money in ${baseline.totalMessages} previous messages`,
    });
  }

  // Check 2: Urgency anomaly
  if (features.hasUrgency && learnedPatterns.neverUsesUrgency) {
    deviations.push({
      type: "emotional",
      severity: 0.85,
      message: `This person has NEVER used urgent language before`,
    });
  }

  // Check 3: Isolation tactic (scammer telling victim to keep secret)
  if (features.hasIsolation && learnedPatterns.neverUsesIsolation) {
    deviations.push({
      type: "tactical",
      severity: 0.95,
      message: `Asking you to keep this secret — a common scam tactic`,
    });
  }

  // Check 4: Message length anomaly (Z-score > 2 = unusual)
  const lengthZScore =
    Math.abs(features.length - baseline.avgLength) / (stdDev.length || 1);
  if (lengthZScore > 2) {
    deviations.push({
      type: "stylistic",
      severity: Math.min(0.7, lengthZScore / 10),
      message: `Message length is unusual for this person`,
    });
  }

  // Check 5: Capitalization anomaly
  if (
    features.capitalRatio > baseline.avgCapitalRatio * 3 &&
    baseline.avgCapitalRatio < 0.1
  ) {
    deviations.push({
      type: "stylistic",
      severity: 0.6,
      message: `Unusual use of capital letters`,
    });
  }

  // Calculate overall confidence
  let totalSeverity = 0;
  deviations.forEach((d) => {
    totalSeverity += d.severity;
  });
  const confidence = Math.min(
    totalSeverity / Math.max(deviations.length, 1),
    0.98,
  );
  const isImpersonation = deviations.length >= 1 && confidence > 0.5;

  return {
    canCompare: true,
    isImpersonation,
    confidence,
    deviations: deviations.map((d) => d.message),
    severity: confidence,
  };
};

// Get learning status
export const getLearningStatus = async () => {
  const familyPatterns = await AsyncStorage.getItem("patterns_family");
  const bankPatterns = await AsyncStorage.getItem("patterns_bank");

  return {
    familyLearned: !!familyPatterns,
    bankLearned: !!bankPatterns,
  };
};

// Clear learned patterns (user privacy)
export const clearAllPatterns = async () => {
  await AsyncStorage.removeItem("patterns_family");
  await AsyncStorage.removeItem("patterns_bank");
  console.log("🗑️ All learned patterns cleared");
  return true;
};
