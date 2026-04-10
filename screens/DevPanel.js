import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import useStore from "../store";
import { simulateNPUAnalysis } from "../utils/simulateAI";
import {
  detectScamWithAI,
  analyzeMessageText,
  initAIModel,
} from "../utils/realAIDetection";

export default function DevPanel() {
  const {
    triggerScam,
    resetScam,
    isScamActive,
    scamType,
    frictionTimer,
    userSettings,
  } = useStore();
  const [useRealAI, setUseRealAI] = useState(true); // Toggle between real and simulated

  const handleTriggerScam = async (type, scamName, appContext = null) => {
    // Create sample scam text based on type
    const scamTexts = {
      whatsapp:
        "URGENT! Mom, it's me. I lost my phone. Send HK$50,000 to this PayMe account immediately. Don't tell anyone. I'll explain later.",
      fake_call:
        "This is Officer Chen from Hong Kong Police. You have an outstanding warrant. Transfer HK$100,000 for bail immediately or you will be arrested.",
      payme_scam:
        "ALERT: Your PayMe account will be suspended in 2 hours. Verify your identity with an urgent FPS transfer of HK$8,000 to maintain your account.",
    };

    Alert.alert(
      "🔍 AI Analysis Running",
      `Using ${useRealAI ? "REAL on-device AI" : "Simulated NPU"} detection for ${scamName}...`,
      [{ text: "OK" }],
    );

    let result;

    if (useRealAI) {
      // REAL AI detection
      result = await detectScamWithAI(scamTexts[type], type);
      console.log("🤖 REAL AI Result:", result);
    } else {
      // Simulated fallback
      result = await simulateNPUAnalysis(type);
      console.log("🎮 Simulated Result:", result);
    }

    if (result.action === "trigger_friction" || result.isScam === true) {
      const duration = userSettings.coolingOffPeriod * 60;
      triggerScam(type, duration, appContext);

      const confidencePercent = result.confidence
        ? Math.round(result.confidence * 100)
        : "N/A";

      Alert.alert(
        "🚨 Scam Pattern Detected!",
        `Detection: ${useRealAI ? "REAL AI (keyword-based)" : "Simulated NPU"}\n` +
          `Risk: ${result.risk}\n` +
          `Confidence: ${confidencePercent}%\n` +
          `Tactics: ${result.tactic || result.tactics?.join(", ") || "detected"}\n\n` +
          `Algorithmic friction activated for ${userSettings.coolingOffPeriod} minutes.`,
        [{ text: "OK" }],
      );
    } else {
      Alert.alert(
        "✅ No Scam Detected",
        `AI analysis found no scam patterns.\nConfidence: ${Math.round(result.confidence * 100)}%`,
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

  const toggleAIMode = async () => {
    if (!useRealAI) {
      // Switching to real AI - test if it works
      const success = await initAIModel();
      if (success) {
        setUseRealAI(true);
        Alert.alert(
          "✅ Real AI Active",
          "Using keyword-based scam detection on device.",
        );
      } else {
        Alert.alert("⚠️ AI Not Ready", "Staying on simulated mode.");
      }
    } else {
      setUseRealAI(false);
      Alert.alert("🎮 Simulated Mode Active", "Using simulated NPU responses.");
    }
  };

  const getStatusText = () => {
    if (isScamActive) {
      return `⚠️ ACTIVE - ${scamType} (${Math.ceil(frictionTimer / 60)}m ${frictionTimer % 60}s remaining)`;
    }
    return `✅ INACTIVE - Using ${useRealAI ? "REAL AI" : "SIMULATED"} detection`;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🎮 Dev Panel</Text>
      <Text style={styles.subtitle}>Demo Control Center</Text>

      {/* AI Mode Toggle */}
      <TouchableOpacity
        style={[
          styles.modeButton,
          useRealAI ? styles.realMode : styles.simMode,
        ]}
        onPress={toggleAIMode}
      >
        <Text style={styles.modeButtonText}>
          {useRealAI
            ? "🤖 REAL AI MODE (Active)"
            : "🎮 SIMULATED MODE (Active)"}
        </Text>
        <Text style={styles.modeSubtext}>
          Tap to switch to {useRealAI ? "Simulated" : "Real AI"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.statusCard, isScamActive && styles.statusActive]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Trigger Scam Simulation</Text>

      <TouchableOpacity
        style={[styles.triggerButton, styles.whatsappButton]}
        onPress={handleWhatsAppScam}
      >
        <Text style={styles.triggerButtonText}>💬 Trigger WhatsApp Scam</Text>
        <Text style={styles.buttonSubtext}>
          "Guess Who I Am" • Urgent money request
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.triggerButton, styles.callButton]}
        onPress={handleFakeCallScam}
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
          1. Choose AI mode (Real or Simulated)
        </Text>
        <Text style={styles.infoText}>2. Press any scam button above</Text>
        <Text style={styles.infoText}>3. AI analyzes scam text patterns</Text>
        <Text style={styles.infoText}>4. Go to "Daily Apps" tab</Text>
        <Text style={styles.infoText}>5. Friction overlay appears</Text>
        <Text style={styles.infoText}>
          6. Timer counts down (your preset duration)
        </Text>
      </View>

      <View style={styles.techBox}>
        <Text style={styles.techTitle}>🔬 How Real AI Detection Works</Text>
        <Text style={styles.techText}>
          • Keyword-based pattern matching runs entirely on-device • Detects
          urgency, impersonation, financial pressure • Zero data leaves your
          phone • Can be upgraded to actual ML model (TensorFlow Lite /
          ExecuTorch)
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
    marginBottom: 20,
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
    marginBottom: 40,
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
