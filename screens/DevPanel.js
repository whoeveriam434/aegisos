import React from "react";
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

export default function DevPanel() {
  const {
    triggerScam,
    resetScam,
    isScamActive,
    scamType,
    frictionTimer,
    userSettings,
  } = useStore();

  const handleTriggerScam = async (type, scamName, appContext = null) => {
    Alert.alert(
      "🔍 NPU Analysis Running",
      `Simulating on-device AI detection for ${scamName}...`,
      [{ text: "OK" }],
    );

    const analysis = await simulateNPUAnalysis(type);

    if (analysis.action === "trigger_friction") {
      const duration = userSettings.coolingOffPeriod * 60; // Convert minutes to seconds
      triggerScam(type, duration, appContext);
      Alert.alert(
        "🚨 Scam Pattern Detected!",
        `Risk: ${analysis.risk}\nTactics: ${analysis.tactic.join(", ")}\n\nAlgorithmic friction activated for ${userSettings.coolingOffPeriod} minutes (your preset cooling-off period).`,
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
    return "✅ INACTIVE - Monitoring for scam patterns";
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>🎮 Dev Panel</Text>
      <Text style={styles.subtitle}>Demo Control Center (Wizard of Oz)</Text>

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
        <Text style={styles.infoText}>1. Press any scam button above</Text>
        <Text style={styles.infoText}>2. AI "analyzes" for 2 seconds</Text>
        <Text style={styles.infoText}>3. Go to "Daily Apps" tab</Text>
        <Text style={styles.infoText}>4. Friction overlay appears</Text>
        <Text style={styles.infoText}>
          5. Timer counts down (your preset duration)
        </Text>
        <Text style={styles.infoText}>
          6. Educational tip shows HK-specific facts
        </Text>
      </View>

      <View style={styles.techBox}>
        <Text style={styles.techTitle}>🔬 Technical Note for Judges</Text>
        <Text style={styles.techText}>
          In production, detection runs locally via Android Private Compute Core
          / Apple Intelligence NPU. No data leaves the device. This prototype
          simulates that detection.
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
    marginBottom: 24,
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
