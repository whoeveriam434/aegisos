import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import useStore from "../store";
import { simulateNPUAnalysis } from "../utils/simulateAI";

export default function DevPanel() {
  const { triggerScam, resetScam, isScamActive, scamType, frictionTimer } =
    useStore();

  const handleTriggerScam = async (type, scamName) => {
    // Show loading alert
    Alert.alert(
      "🔍 AI Analysis Running",
      `Simulating NPU scam detection for ${scamName}...`,
      [{ text: "OK" }],
    );

    // Call simulated AI analysis
    const analysis = await simulateNPUAnalysis(type);

    if (analysis.action === "trigger_friction") {
      triggerScam(type, analysis.duration);
      Alert.alert(
        "🚨 Scam Detected!",
        `Risk: ${analysis.risk}\nTactic: ${analysis.tactic.join(", ")}\n\nFriction mode activated for ${analysis.duration} seconds.`,
        [{ text: "OK" }],
      );
    }
  };

  const handleWhatsAppScam = () => {
    handleTriggerScam("whatsapp", "WhatsApp Urgent Family Scam");
  };

  const handleFakeCallScam = () => {
    handleTriggerScam("fake_call", "Fake Bank Official Call");
  };

  const handleReset = () => {
    resetScam();
    Alert.alert(
      "✅ System Reset",
      "Scam protection disabled. App back to normal.",
      [{ text: "OK" }],
    );
  };

  // Status indicator
  const getStatusText = () => {
    if (isScamActive) {
      return `⚠️ ACTIVE - ${scamType} (${frictionTimer}s remaining)`;
    }
    return "✅ INACTIVE - No scam detected";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Dev Panel</Text>
      <Text style={styles.subtitle}>Demo Control Center</Text>

      {/* Status Card */}
      <View style={[styles.statusCard, isScamActive && styles.statusActive]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {/* Trigger Buttons */}
      <Text style={styles.sectionTitle}>Trigger Scam Simulation</Text>

      <TouchableOpacity
        style={[styles.triggerButton, styles.whatsappButton]}
        onPress={handleWhatsAppScam}
      >
        <Text style={styles.triggerButtonText}>📱 Trigger WhatsApp Scam</Text>
        <Text style={styles.buttonSubtext}>"Urgent! Send money now"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.triggerButton, styles.callButton]}
        onPress={handleFakeCallScam}
      >
        <Text style={styles.triggerButtonText}>
          📞 Trigger Fake Official Call
        </Text>
        <Text style={styles.buttonSubtext}>
          "This is your bank. Verify OTP."
        </Text>
      </TouchableOpacity>


      {/* Reset Button */}
      <View style={styles.divider} />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>🔄 Reset / Clear Scam</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>🎤 Demo Instructions:</Text>
        <Text style={styles.instructionsText}>
          1. Press any scam button above
        </Text>
        <Text style={styles.instructionsText}>
          2. AI will "analyze" for 2 seconds
        </Text>
        <Text style={styles.instructionsText}>3. Go to BankScreen tab</Text>
        <Text style={styles.instructionsText}>
          4. See Friction Overlay appear
        </Text>
        <Text style={styles.instructionsText}>
          5. Timer counts down from 180s
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B8AAC",
    marginBottom: 30,
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
    backgroundColor: "#4A90D9",
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
  triggerButtonText: {
    color: "white",
    fontSize: 20,
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
  instructionsBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 13,
    color: "#6B8AAC",
    marginBottom: 6,
  },
});
