import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import useStore from "../store";
import { getTrustedContacts } from "../utils/trustedContactsStorage";

export default function FrictionOverlay() {
  const {
    frictionTimer,
    scamType,
    resetScam,
    userSettings,
    familyCircle,
    notifyFamily,
  } = useStore();
  const [timeLeft, setTimeLeft] = useState(frictionTimer);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [overlayHeight, setOverlayHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [panelHeight, setPanelHeight] = useState(0);

  // Feature 2: Breathing exercise states
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("in");
  const [breathCounter, setBreathCounter] = useState(4);

  // Feature 4: Family notification state
  const [familyNotified, setFamilyNotified] = useState(false);

  // Timer logic
  useEffect(() => {
    setTimeLeft(frictionTimer);
  }, [frictionTimer]);

  useEffect(() => {
    const loadTrustedContacts = async () => {
      const contacts = await getTrustedContacts();
      setTrustedContacts(contacts);
    };
    loadTrustedContacts();
  }, []);

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

  // Feature 2: Breathing exercise animation
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

  // Feature 4: Handle family notification
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
              `Alert sent to ${contactNames}.\n\nIn production, this would send an actual SMS. For demo, we've simulated the notification.`,
              [{ text: "OK" }],
            );
          },
        },
      ],
    );
  };

  // Feature 1: Get scam explanation based on type
  const getScamExplanation = () => {
    switch (scamType) {
      case "whatsapp":
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Urgent request for money",
            "• Claiming to be a family member",
            "• Pressure to act quickly",
            "• Unusual payment method requested",
          ],
        };
      case "fake_call":
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Claiming to be official authority",
            "• Threats of legal consequences",
            "• Request for immediate payment",
            "• Unknown phone number",
          ],
        };
      case "payme_scam":
        return {
          title: "🔍 Why this was paused:",
          items: [
            "• Unusual payment request",
            "• Irreversible transaction type",
            "• Artificial time pressure",
            "• Suspicious link or QR code",
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

  // Feature 2: Breathing UI
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
        <Text style={styles.breathingHint}>
          {breathPhase === "in" && "Fill your lungs slowly"}
          {breathPhase === "hold" && "Relax your shoulders"}
          {breathPhase === "out" && "Release all tension"}
        </Text>
        <TouchableOpacity onPress={() => setShowBreathing(false)}>
          <Text style={styles.closeBreathing}>✕ Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    if (!showContactPanel) return;
    // #region agent log
    console.log("[dbg:H2] panel visible with layout snapshot", {
      overlayHeight,
      containerHeight,
      panelHeight,
      totalEstimate: containerHeight + panelHeight,
    });
    fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix-scroll",hypothesisId:"H2",location:"FrictionOverlay.js:97",message:"panel visible with layout snapshot",data:{overlayHeight,containerHeight,panelHeight,totalEstimate:containerHeight+panelHeight},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [showContactPanel, overlayHeight, containerHeight, panelHeight]);

  return (
    <ScrollView
      style={styles.overlayScroll}
      contentContainerStyle={styles.overlayContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
      onLayout={(event) => setOverlayHeight(event.nativeEvent.layout.height)}
      onScroll={(event) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y <= 0) return;
        // #region agent log
        console.log("[dbg:H4] overlay scroll", { y });
        fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"post-fix-scroll",hypothesisId:"H4",location:"FrictionOverlay.js:120",message:"overlay scroll",data:{y,showContactPanel},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }}
      scrollEventThrottle={16}
      onTouchMove={() => {
        // #region agent log
        console.log("[dbg:H3] overlay touch move");
        fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix-scroll",hypothesisId:"H3",location:"FrictionOverlay.js:111",message:"overlay touch move",data:{showContactPanel},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }}
    >
      <View
        style={styles.container}
        onLayout={(event) =>
          setContainerHeight(event.nativeEvent.layout.height)
        }
      >
        <Text style={styles.shieldIcon}>🛡️</Text>

        <Text style={styles.title}>System Security Check</Text>
        <Text style={styles.subtitle}>Verifying network safety</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Cooling-off Period</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Feature 1: Why This Was Paused */}
        <View style={styles.detectionBox}>
          <Text style={styles.detectionTitle}>{explanation.title}</Text>
          {explanation.items.map((item, index) => (
            <Text key={index} style={styles.detectionItem}>
              {item}
            </Text>
          ))}
        </View>

        {/* Main message */}
        <Text style={styles.message}>
          We are temporarily pausing this action for your safety — as you
          requested in your settings.
        </Text>

        {/* Educational Tip */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            {scamType === "whatsapp"
              ? "Hong Kong hospitals will never demand FPS transfers before admitting a patient."
              : scamType === "fake_call"
                ? "The Hong Kong Police will never ask for bail money over the phone."
                : "PayMe and FPS transfers are instant and irreversible. Always verify first."}
          </Text>
        </View>

        {/* Feature 2: Breathing Exercise */}
        {renderBreathingExercise()}

        {/* Feature 4: Family Notification Button */}
        {!familyNotified && familyCircle.length > 0 && (
          <TouchableOpacity
            style={styles.familyButton}
            onPress={handleNotifyFamily}
          >
            <Text style={styles.familyButtonText}>👨‍👩‍👧 Notify Family Circle</Text>
            <Text style={styles.familySubtext}>
              Alert your trusted contacts
            </Text>
          </TouchableOpacity>
        )}

        {familyNotified && (
          <View style={styles.notifiedBox}>
            <Text style={styles.notifiedText}>✅ Family has been alerted</Text>
          </View>
        )}

        {/* Trusted Contact Button */}
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            Alert.alert(
              "📞 Contact Trusted Member",
              `Call ${trustedContact} to verify this situation?`,
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
          <Text style={styles.contactButtonText}>📞 Call Trusted Contact</Text>
        </TouchableOpacity>

        {showContactPanel && (
          <View
            style={styles.contactPanel}
            onLayout={(event) => setPanelHeight(event.nativeEvent.layout.height)}
          >
            <Text style={styles.contactPanelTitle}>Select Trusted Contact</Text>
            {trustedContacts.length > 0 ? (
              trustedContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={styles.contactOption}
                  onPress={() => handleCallContact(contact)}
                >
                  <Text style={styles.contactOptionName}>{contact.name}</Text>
                  <Text style={styles.contactOptionPhone}>
                    {contact.phone || "No phone"}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noContactText}>
                No saved trusted contacts. Using default setting:
                {"\n"}
                {userSettings.trustedContact || "No contact selected"}
              </Text>
            )}
            <TouchableOpacity
              style={styles.closePanelButton}
              onPress={() => setShowContactPanel(false)}
            >
              <Text style={styles.closePanelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {timeLeft > 0 && (
          <Text style={styles.waitText}>
            Please wait {formatTime(timeLeft)} before continuing
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlayScroll: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E6F0FA",
    zIndex: 9999,
  },
  overlayContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 12,
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
  },
  shieldIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
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
  timerLabel: {
    fontSize: 12,
    color: "#8AA4BC",
    letterSpacing: 1,
    marginBottom: 4,
  },
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
  message: {
    fontSize: 14,
    color: "#1A3A5C",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    fontSize: 12,
    color: "#2E7D32",
    flex: 1,
    lineHeight: 18,
  },
  breathingButton: {
    backgroundColor: "#E8F0FE",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  breathingEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  breathingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A90D9",
  },
  breathingHint: {
    fontSize: 12,
    color: "#8AA4BC",
    marginTop: 6,
  },
  closeBreathing: {
    fontSize: 12,
    color: "#8AA4BC",
    marginTop: 8,
  },
  familyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  familySubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  notifiedBox: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  notifiedText: {
    fontSize: 12,
    color: "#2E7D32",
  },
  contactButton: {
    backgroundColor: "#4A90D9",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  waitText: {
    fontSize: 12,
    color: "#8AA4BC",
    textAlign: "center",
  },
  contactPanel: {
    width: "100%",
    backgroundColor: "#F8FAFD",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DCE7F3",
  },
  contactPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A3A5C",
    marginBottom: 10,
  },
  contactOption: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  contactOptionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A3A5C",
  },
  contactOptionPhone: {
    fontSize: 12,
    color: "#6B8AAC",
    marginTop: 2,
  },
  noContactText: {
    fontSize: 13,
    color: "#6B8AAC",
    lineHeight: 18,
    marginBottom: 10,
  },
  closePanelButton: {
    backgroundColor: "#E5ECF5",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  closePanelButtonText: {
    color: "#1A3A5C",
    fontWeight: "600",
  },
});
