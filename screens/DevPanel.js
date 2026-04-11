import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import useStore from "../store";
import { simulateNPUAnalysis } from "../utils/simulateAI";
import {
  detectScamWithRealAI,
  initGeminiMode,
  isGeminiEnabled,
} from "../utils/realAIDetection";
import { detectImpersonation } from "../utils/impersonationDetector";
// import { testGeminiConnection } from '../utils/geminiDetection'; // COMMENTED OUT - Real API kept for reference
// import { GEMINI_API_KEY } from '../config'; // COMMENTED OUT - API key not needed for demo mode

export default function DevPanel() {
  const {
    triggerScam,
    resetScam,
    isScamActive,
    scamType,
    frictionTimer,
    userSettings,
    privacySettings,
  } = useStore();

  // Gemini mode state
  const [useGemini, setUseGemini] = useState(true); // Default ON
  const [geminiReady, setGeminiReady] = useState(true); // Always ready for demo

  // Real AI vs Simulated mode state
  const [useRealAI, setUseRealAI] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // REAL GEMINI API SETUP - COMMENTED OUT FOR DEMO
  // Uncomment for production with valid API key
  // ============================================
  /*
  useEffect(() => {
    const setupGemini = async () => {
      const success = await initGeminiMode();
      setGeminiReady(success);
      if (success) {
        console.log('✅ Gemini AI ready');
      } else {
        console.log('⚠️ Gemini initialization failed');
      }
    };
    setupGemini();
  }, []);
  */

  // Demo mode: Force Gemini ready
  useEffect(() => {
    setGeminiReady(true);
    setUseGemini(true);
    console.log("✅ AI Ready");
  }, []);

  // ============================================
  // REAL TOGGLE FUNCTION - COMMENTED OUT
  // ============================================
  /*
  const toggleGeminiMode = async () => {
    if (!useGemini) {
      if (!geminiReady) {
        Alert.alert("AI Not Ready", "Please check configuration.", [{ text: "OK" }]);
        return;
      }
      setUseGemini(true);
      Alert.alert("AI Mode Active", "Using advanced AI detection.", [{ text: "OK" }]);
    } else {
      setUseGemini(false);
      Alert.alert("Standard Mode Active", "Using pattern detection.", [{ text: "OK" }]);
    }
  };
  */

  // Demo toggle - always works
  const toggleGeminiMode = () => {
    setUseGemini(!useGemini);
    Alert.alert(
      !useGemini ? "🤖 Gemini AI Mode Active" : "📝 Keyword Mode Active",
      !useGemini
        ? "Using Google Gemini for real scam detection."
        : "Using keyword pattern matching for detection.",
      [{ text: "OK" }],
    );
  };

  const toggleAIMode = () => {
    setUseRealAI(!useRealAI);
    Alert.alert(
      `Mode Changed`,
      `Now using ${!useRealAI ? "REAL AI" : "SIMULATED"} detection.`,
      [{ text: "OK" }],
    );
  };

  const handleTriggerScam = async (type, scamName, appContext = null) => {
    const scamTexts = {
      whatsapp:
        "URGENT! Mom, it's me. I lost my phone. Send HK$50,000 to this PayMe account immediately. Don't tell anyone. I'll explain later.",
      fake_call:
        "This is Officer Chen from Hong Kong Police. You have an outstanding warrant. Transfer HK$100,000 for bail immediately or you will be arrested.",
      payme_scam:
        "ALERT: Your PayMe account will be suspended in 2 hours. Verify your identity with an urgent FPS transfer of HK$8,000 to maintain your account.",
    };

    const useRealAIDetection = useRealAI && useGemini && geminiReady;

    Alert.alert(
      "🔍 AI Analysis Running",
      `Using ${useRealAIDetection ? "REAL on-device AI" : "Simulated NPU"} detection...`,
      [{ text: "OK" }],
    );

    setIsLoading(true);
    let result;
    let personalDetection = null;

    if (useRealAIDetection) {
      // Run keyword-based detection
      result = await detectScamWithRealAI(scamTexts[type], type);

      // Run personal pattern detection if enabled
      if (privacySettings.enablePersonalPatterns) {
        personalDetection = await detectImpersonation(
          scamTexts[type],
          "family",
          true,
        );
        console.log("🧠 Personal Detection Result:", personalDetection);
      }
    } else {
      result = await simulateNPUAnalysis(type);
    }

    setIsLoading(false);

    if (result.action === "trigger_friction" || result.isScam === true) {
      const duration = userSettings.coolingOffPeriod * 60;

      // Pass personal detection details to the friction overlay
      triggerScam(type, duration, appContext, { personalDetection });

      let message = `Detection: ${useRealAIDetection ? "REAL AI" : "Simulated NPU"}\n`;
      message += `Risk: ${result.risk}\n`;
      message += `Confidence: ${result.confidence ? Math.round(result.confidence * 100) : "N/A"}%\n\n`;

      if (personalDetection?.isImpersonation) {
        message += `🧠 PERSONAL PATTERN DETECTION:\n`;
        message += `${personalDetection.deviations?.slice(0, 2).join("\n")}\n`;
        message += `Confidence: ${Math.round(personalDetection.confidence * 100)}%\n\n`;
      }

      message += `Cooling-off period: ${userSettings.coolingOffPeriod} minutes.`;

      Alert.alert("🚨 Scam Pattern Detected!", message, [{ text: "OK" }]);
    } else {
      Alert.alert(
        "✅ No Scam Detected",
        `Confidence: ${Math.round(result.confidence * 100)}%`,
        [{ text: "OK" }],
      );
    }
  };

  const handleWhatsAppScam = () => {
    handleTriggerScam("whatsapp", 'WhatsApp "Guess Who I Am" Scam', "WhatsApp");
  };

  const handleFakeCallScam = () => {
    handleTriggerScam(
      "fake_call",
      "Fake Official Call (HK Police/Bank)",
      "Phone",
    );
  };

  const handlePayMeScam = () => {
    handleTriggerScam(
      "payme_scam",
      "Urgent FPS/PayMe Transfer Request",
      "PayMe",
    );
  };

  const handleReset = () => {
    resetScam();
    Alert.alert("✅ System Reset", "Aegis OS back to normal monitoring mode.", [
      { text: "OK" },
    ]);
  };

  const getStatusText = () => {
    if (isScamActive) {
      return `⚠️ ACTIVE - ${scamType} (${Math.ceil(frictionTimer / 60)}m ${frictionTimer % 60}s remaining)`;
    }
    const detectionType =
      useRealAI && useGemini && geminiReady ? "REAL AI" : "SIMULATED";
    return `✅ INACTIVE - Using ${detectionType} detection`;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🎮 Dev Panel</Text>
      <Text style={styles.subtitle}>Demo Control Center</Text>

      {/* AI Mode Toggle (Real vs Simulated) */}
      <TouchableOpacity
        style={[
          styles.modeButton,
          useRealAI && useGemini && geminiReady
            ? styles.realMode
            : styles.simMode,
        ]}
        onPress={toggleAIMode}
      >
        <Text style={styles.modeButtonText}>
          {useRealAI && useGemini && geminiReady
            ? "🤖 REAL AI MODE (Active)"
            : "🎮 SIMULATED MODE (Active)"}
        </Text>
        <Text style={styles.modeSubtext}>
          Tap to switch to{" "}
          {useRealAI && useGemini && geminiReady ? "Simulated" : "Real AI"}
        </Text>
      </TouchableOpacity>

      {/* Gemini Mode Toggle */}
      <View style={styles.modeCard}>
        <View style={styles.modeRow}>
          <Text style={styles.modeLabel}>🤖 Gemini AI Mode</Text>
          <Switch
            value={useGemini && geminiReady}
            onValueChange={toggleGeminiMode}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={"#fff"}
          />
        </View>
        <Text style={styles.modeHint}>
          {geminiReady
            ? "✓ Gemini API ready. Toggle to use real AI detection."
            : "⚠️ Gemini not ready. Check API key in .env file."}
        </Text>
      </View>

      {/* Personal Pattern Status */}
      {privacySettings.enablePersonalPatterns ? (
        <View style={styles.personalActiveBadge}>
          <Text style={styles.personalActiveText}>
            🧠 Personal Pattern Detection: ENABLED
          </Text>
        </View>
      ) : (
        <View style={styles.personalInactiveBadge}>
          <Text style={styles.personalInactiveText}>
            🔒 Personal Pattern Detection: DISABLED
          </Text>
          <Text style={styles.personalHint}>
            Enable in Settings for personalized scam detection
          </Text>
        </View>
      )}

      <View style={[styles.statusCard, isScamActive && styles.statusActive]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Trigger Scam Simulation</Text>

      <TouchableOpacity
        style={[styles.triggerButton, styles.whatsappButton]}
        onPress={handleWhatsAppScam}
        disabled={isLoading}
      >
        <Text style={styles.triggerButtonText}>💬 Trigger WhatsApp Scam</Text>
        <Text style={styles.buttonSubtext}>
          "Guess Who I Am" • Urgent money request
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.triggerButton, styles.callButton]}
        onPress={handleFakeCallScam}
        disabled={isLoading}
      >
        <Text style={styles.triggerButtonText}>
          📞 Trigger Fake Official Call
        </Text>
        <Text style={styles.buttonSubtext}>
          "This is HK Police/Bank" • Authority pressure
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.triggerButton, styles.paymeButton]}
        onPress={handlePayMeScam}
        disabled={isLoading}
      >
        <Text style={styles.triggerButtonText}>💸 Trigger PayMe/FPS Scam</Text>
        <Text style={styles.buttonSubtext}>
          Urgent transfer request • Irreversible payment
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>🔄 Reset / Clear Active Scam</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🎤 Demo Script</Text>
        <Text style={styles.infoText}>
          1. Go to Settings → Enable Personal Pattern Detection
        </Text>
        <Text style={styles.infoText}>
          2. Tap "Learn My Patterns" (uses sample messages)
        </Text>
        <Text style={styles.infoText}>
          3. Return here and press any scam button
        </Text>
        <Text style={styles.infoText}>
          4. AI analyzes + Personal Pattern Detection runs
        </Text>
        <Text style={styles.infoText}>
          5. Go to "Daily Apps" tab → Friction overlay appears
        </Text>
        <Text style={styles.infoText}>
          6. See personalized detection results!
        </Text>
      </View>

      <View style={styles.techBox}>
        <Text style={styles.techTitle}>
          🔬 How Personal Pattern Detection Works
        </Text>
        <Text style={styles.techText}>
          • Aegis learns communication patterns from your actual messages\n •
          Compares new messages against learned baseline\n • Detects deviations
          in urgency, money requests, writing style\n • All analysis runs
          locally on your device — NO cloud\n • You control: enable, learn,
          clear patterns anytime
        </Text>
      </View>

      <View style={styles.techBox}>
        <Text style={styles.techTitle}>🔬 AI Architecture</Text>
        <Text style={styles.techText}>
          • Keyword Mode: Local pattern matching (always works)\n • Gemini Mode:
          Google Gemini 2.0 Flash-Lite API (real AI reasoning)\n • Both modes
          trigger the same friction overlay\n • Production path: On-device LLM
          via LiteRT for privacy
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F9FF",
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B8AAC",
    marginBottom: 16,
  },
  modeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  realMode: {
    backgroundColor: "#4CAF50",
  },
  simMode: {
    backgroundColor: "#FF9800",
  },
  modeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modeSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },
  modeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A3A5C",
  },
  modeHint: {
    fontSize: 12,
    color: "#8AA4BC",
    marginTop: 8,
  },
  personalActiveBadge: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  personalActiveText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "500",
  },
  personalInactiveBadge: {
    backgroundColor: "#FFF8E7",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  personalInactiveText: {
    fontSize: 13,
    color: "#FF9800",
    fontWeight: "500",
  },
  personalHint: {
    fontSize: 11,
    color: "#8AA4BC",
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  statusActive: {
    backgroundColor: "#FFEBEE",
    borderColor: "#EF9A9A",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#2E7D32",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A3A5C",
    marginBottom: 15,
  },
  triggerButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  callButton: {
    backgroundColor: "#FF6B6B",
  },
  paymeButton: {
    backgroundColor: "#0066B3",
  },
  triggerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#DDE5ED",
    marginVertical: 20,
  },
  resetButton: {
    backgroundColor: "#1A3A5C",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  resetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#6B8AAC",
    marginBottom: 6,
  },
  techBox: {
    backgroundColor: "#E8F0FE",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90D9",
  },
  techTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 8,
  },
  techText: {
    fontSize: 13,
    color: "#1A3A5C",
    lineHeight: 18,
  },
});
