import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import useStore from "../store";

export default function FrictionOverlay() {
  const {
    frictionTimer,
    scamType,
    resetScam,
    userSettings,
    familyCircle,
    notifyFamily,
    privacySettings,
    activeDetectionDetails,
  } = useStore();

  const [timeLeft, setTimeLeft] = useState(frictionTimer);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("in");
  const [breathCounter, setBreathCounter] = useState(4);
  const [familyNotified, setFamilyNotified] = useState(false);
  const timerRef = useRef(null); // ADD THIS LINE
  const isMountedRef = useRef(true); // ADD THIS LINE

  // Timer logic
  // Set up mounted ref cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update timeLeft when frictionTimer changes
  useEffect(() => {
    setTimeLeft(frictionTimer);
  }, [frictionTimer]);

  // Timer logic - FIXED
  useEffect(() => {
    if (timeLeft <= 0) {
      if (isMountedRef.current) {
        resetScam();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, resetScam]);

  // Breathing exercise animation
  useEffect(() => {
    if (!showBreathing) return;

    const interval = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev === 1) {
          if (breathPhase === "in") setBreathPhase("hold");
          else if (breathPhase === "hold") setBreathPhase("out");
          else if (breathPhase === "out") {
            setBreathPhase("in");
            return 4;
          }
          return breathPhase === "hold" ? 4 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBreathing, breathPhase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNotifyFamily = () => {
    if (familyCircle.length === 0) {
      Alert.alert(
        "👨‍👩‍👧 No Family Contacts",
        "You haven't added any family contacts in Settings. Add one first.",
        [{ text: "OK" }],
      );
      return;
    }

    const contactNames = familyCircle.map((c) => c.name).join(", ");

    Alert.alert(
      "📱 Notify Family Circle",
      `Send alert to: ${contactNames}?\n\nMessage: "A scam attempt was detected. Please check in."`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          onPress: () => {
            familyCircle.forEach((contact) => {
              notifyFamily(
                `Scam attempt detected. Please check on the user.`,
                contact.name,
              );
            });
            setFamilyNotified(true);
            Alert.alert(
              "✅ Family Notified",
              `Alert sent to ${contactNames}.`,
              [{ text: "OK" }],
            );
          },
        },
      ],
    );
  };

  const getScamExplanation = () => {
    switch (scamType) {
      case "whatsapp":
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Urgent request for money",
            "• Claiming to be a family member",
            "• Pressure to act quickly",
          ],
        };
      case "fake_call":
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Claiming to be official authority",
            "• Threats of legal consequences",
            "• Request for immediate payment",
          ],
        };
      default:
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Unusual activity detected",
            "• Pattern matches known scams",
            "• Taking precaution for your safety",
          ],
        };
    }
  };

  const explanation = getScamExplanation();
  const trustedContact = userSettings.trustedContact || "No contact added";
  const personalDetectionMessage =
    activeDetectionDetails?.personalDetection?.explanation;

  const renderBreathingExercise = () => {
    if (!showBreathing) {
      return (
        <TouchableOpacity
          style={styles.breathingButton}
          onPress={() => setShowBreathing(true)}
        >
          <Text style={styles.breathingButtonText}>
            🌿 Take a calming breath
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.breathingContainer}>
        <Text style={styles.breathingEmoji}>
          {breathPhase === "in" && "🌬️"}
          {breathPhase === "hold" && "😌"}
          {breathPhase === "out" && "🌊"}
        </Text>
        <Text style={styles.breathingText}>
          {breathPhase === "in" && `Breathe in... ${breathCounter}`}
          {breathPhase === "hold" && `Hold... ${breathCounter}`}
          {breathPhase === "out" && `Breathe out... ${breathCounter}`}
        </Text>
        <TouchableOpacity onPress={() => setShowBreathing(false)}>
          <Text style={styles.closeBreathing}>✕ Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.shieldIcon}>🛡️</Text>

          <Text style={styles.title}>System Security Check</Text>
          <Text style={styles.subtitle}>Verifying network safety</Text>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Cooling-off Period</Text>
            <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
          </View>

          <View style={styles.detectionBox}>
            <Text style={styles.detectionTitle}>{explanation.title}</Text>
            {explanation.items.map((item, index) => (
              <Text key={index} style={styles.detectionItem}>
                {item}
              </Text>
            ))}
          </View>

          {privacySettings.enablePersonalPatterns &&
            personalDetectionMessage && (
              <View style={styles.personalDetectionBox}>
                <Text style={styles.personalDetectionTitle}>
                  🧠 Personal Pattern Analysis
                </Text>
                <Text style={styles.personalDetectionText}>
                  {personalDetectionMessage}
                </Text>
                <Text style={styles.personalDetectionNote}>
                  🔒 Analysis done locally on your device
                </Text>
              </View>
            )}

          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              {scamType === "whatsapp"
                ? "Hong Kong hospitals never demand FPS transfers before admission."
                : "The HK Police never ask for bail money over the phone."}
            </Text>
          </View>

          {renderBreathingExercise()}

          {!familyNotified && familyCircle.length > 0 && (
            <TouchableOpacity
              style={styles.familyButton}
              onPress={handleNotifyFamily}
            >
              <Text style={styles.familyButtonText}>👨‍👩‍👧 Notify Family</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {
              Alert.alert(
                "📞 Contact Trusted Member",
                `Call ${trustedContact}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Call",
                    onPress: () =>
                      Alert.alert(
                        "Calling",
                        `Connecting to ${trustedContact}...`,
                      ),
                  },
                ],
              );
            }}
          >
            <Text style={styles.contactButtonText}>
              📞 Call Trusted Contact
            </Text>
          </TouchableOpacity>

          {timeLeft > 0 && (
            <Text style={styles.waitText}>
              Wait {formatTime(timeLeft)} before continuing
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#E6F0FA",
    zIndex: 9999,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginVertical: 20,
    alignSelf: "center",
    minHeight: 500,
  },
  shieldIcon: { fontSize: 50, marginBottom: 15 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A3A5C",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B8AAC",
    textAlign: "center",
    marginBottom: 20,
  },
  timerContainer: {
    backgroundColor: "#F0F7FF",
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  timerLabel: { fontSize: 12, color: "#8AA4BC", marginBottom: 4 },
  timerValue: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#4A90D9",
    fontFamily: "monospace",
  },
  detectionBox: {
    backgroundColor: "#FFF8E7",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#FFB347",
  },
  detectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B6914",
    marginBottom: 8,
  },
  detectionItem: {
    fontSize: 12,
    color: "#8B6914",
    marginLeft: 8,
    marginBottom: 4,
  },
  personalDetectionBox: {
    backgroundColor: "#E8F0FE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#4A90D9",
  },
  personalDetectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 8,
  },
  personalDetectionText: {
    fontSize: 13,
    color: "#1A3A5C",
    lineHeight: 20,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  personalDetectionNote: {
    fontSize: 11,
    color: "#6B8AAC",
    marginTop: 8,
    fontStyle: "italic",
  },
  tipBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
  },
  tipIcon: { fontSize: 20, marginRight: 10 },
  tipText: { fontSize: 12, color: "#2E7D32", flex: 1, lineHeight: 18 },
  breathingButton: {
    backgroundColor: "#E8F0FE",
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 12,
    width: "100%",
  },
  breathingButtonText: {
    fontSize: 15,
    color: "#4A90D9",
    textAlign: "center",
    fontWeight: "500",
  },
  breathingContainer: {
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F0F7FF",
    borderRadius: 25,
    width: "100%",
  },
  breathingEmoji: { fontSize: 40, marginBottom: 8 },
  breathingText: { fontSize: 18, fontWeight: "600", color: "#4A90D9" },
  closeBreathing: { fontSize: 12, color: "#8AA4BC", marginTop: 8 },
  familyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 10,
    width: "100%",
  },
  familyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  contactButton: {
    backgroundColor: "#4A90D9",
    paddingVertical: 14,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  contactButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  waitText: {
    fontSize: 12,
    color: "#8AA4BC",
    textAlign: "center",
    marginBottom: 10,
  },
});