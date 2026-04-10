import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import useStore from "../store";

export default function FrictionOverlay() {
  const { frictionTimer, scamType, resetScam, userSettings } = useStore();
  const [timeLeft, setTimeLeft] = useState(frictionTimer);

  useEffect(() => {
    setTimeLeft(frictionTimer);
  }, [frictionTimer]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetScam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, resetScam]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContactTrusted = () => {
    const contact = userSettings.trustedContact || "your trusted contact";
    Alert.alert(
      "📞 Contact Trusted Member",
      `Would you like to call ${contact} to verify this transaction?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => Alert.alert("Calling", `Connecting to ${contact}...`),
        },
      ],
    );
  };

  // HK-specific educational tips based on scam type
  const getEducationalTip = () => {
    switch (scamType) {
      case "whatsapp":
        return "Did you know? Hong Kong hospitals will never demand FPS transfers before admitting a patient. If someone claims to be a relative, hang up and call them directly.";
      case "fake_call":
        return "Did you know? The Hong Kong Police will never ask for bail money or personal banking details over the phone. Legitimate officials will never pressure you to act immediately.";
      case "payme_scam":
        return "Did you know? PayMe and FPS transfers are instant and irreversible. Always verify the recipient's identity before sending money — even if they seem urgent.";
      default:
        return "Did you know? Scammers create artificial urgency to bypass your rational thinking. Taking a pause is the most powerful defense against fraud.";
    }
  };

  const getScamMessage = () => {
    switch (scamType) {
      case "whatsapp":
        return "⚠️ Detected: Urgent 'family member' message requesting money via WhatsApp";
      case "fake_call":
        return "⚠️ Detected: Call claiming to be from official source with authority pressure";
      case "payme_scam":
        return "⚠️ Detected: Unusual FPS/PayMe transfer request with urgency patterns";
      default:
        return "⚠️ Unusual activity detected: High-pressure financial request";
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.shieldIcon}>🛡️</Text>

        <Text style={styles.title}>System Security Check</Text>
        <Text style={styles.subtitle}>Verifying network safety</Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Cooling-off Period</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.detectionBox}>
          <Text style={styles.detectionText}>{getScamMessage()}</Text>
        </View>

        <Text style={styles.message}>
          We are temporarily pausing this action for your safety — as you
          requested in your settings.
        </Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>{getEducationalTip()}</Text>
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactTrusted}
        >
          <Text style={styles.contactButtonText}>
            👥 Contact Trusted Member
          </Text>
        </TouchableOpacity>

        {timeLeft > 0 && (
          <Text style={styles.waitText}>
            Please wait {formatTime(timeLeft)} before continuing
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E6F0FA",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  shieldIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A3A5C",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B8AAC",
    textAlign: "center",
    marginBottom: 30,
  },
  timerContainer: {
    backgroundColor: "#F0F7FF",
    borderRadius: 60,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  timerLabel: {
    fontSize: 14,
    color: "#8AA4BC",
    letterSpacing: 1,
    marginBottom: 5,
  },
  timerValue: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#4A90D9",
    fontFamily: "monospace",
  },
  detectionBox: {
    backgroundColor: "#FFF8E7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#FFB347",
  },
  detectionText: {
    fontSize: 14,
    color: "#8B6914",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#1A3A5C",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  tipBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 25,
    width: "100%",
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#2E7D32",
    flex: 1,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: "#4A90D9",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  contactButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  waitText: {
    fontSize: 14,
    color: "#8AA4BC",
    textAlign: "center",
  },
});
