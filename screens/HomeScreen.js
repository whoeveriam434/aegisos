import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import useStore from "../store";
import FrictionOverlay from "../components/FrictionOverlay";

export default function HomeScreen() {
  const { isScamActive, triggerScam } = useStore();

  // If scam is active, show friction overlay
  if (isScamActive) {
    return <FrictionOverlay />;
  }

  const handleAppPress = (appName, appIcon) => {
    Alert.alert(
      `Open ${appName}`,
      `This would open ${appName}. In production, KairoZero OS monitors activity here.`,
      [{ text: "OK" }],
    );
  };

  // Feature 3: Emergency Button handler
  const handleEmergencyPress = () => {
    Alert.alert(
      "🛡️ Emergency Protection",
      "You're feeling pressured. KairoZero will activate a 5-minute cooling-off period to give you time to think clearly.\n\nYou can also notify a family member during this time.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Activate Protection",
          onPress: () => {
            triggerScam("user_activated", 300); // 5 minutes
            Alert.alert(
              "✅ Protection Active",
              "Take a moment to breathe. You're in control.\n\nThe cooling-off period has started.",
              [{ text: "OK" }],
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Good day, 👋</Text>
      <Text style={styles.subtitle}>
        Your daily apps are protected by KairoZero OS
      </Text>

      {/* Feature 3: Emergency Button - Prominent placement */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyPress}
      >
        <Text style={styles.emergencyButtonText}>🛡️ I'm Being Pressured</Text>
        <Text style={styles.emergencySubtext}>
          Activate safety mode immediately
        </Text>
      </TouchableOpacity>

      {/* Apps */}
      <TouchableOpacity
        style={styles.appCard}
        onPress={() => handleAppPress("WhatsApp", "💬")}
      >
        <Text style={styles.appIcon}>💬</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>WhatsApp</Text>
          <Text style={styles.appMessage}>3 unread messages</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.appCard}
        onPress={() => handleAppPress("Phone", "📞")}
      >
        <Text style={styles.appIcon}>📞</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Phone Calls</Text>
          <Text style={styles.appMessage}>No missed calls</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.appCard}
        onPress={() => handleAppPress("PayMe", "💸")}
      >
        <Text style={styles.appIcon}>💸</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>PayMe (HSBC)</Text>
          <Text style={styles.appMessage}>FPS ready • Balance: HK$12,480</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.appCard}
        onPress={() => handleAppPress("HSBC HK", "🏦")}
      >
        <Text style={styles.appIcon}>🏦</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>HSBC Hong Kong</Text>
          <Text style={styles.appMessage}>Last login: Today</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.appCard}
        onPress={() => handleAppPress("Messages", "✉️")}
      >
        <Text style={styles.appIcon}>✉️</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Messages (SMS)</Text>
          <Text style={styles.appMessage}>2 new messages</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Protection Status */}
      <View style={styles.protectionCard}>
        <Text style={styles.protectionIcon}>🛡️</Text>
        <Text style={styles.protectionTitle}>KairoZero OS Active</Text>
        <Text style={styles.protectionText}>
          Monitoring for urgency patterns, impersonation, and financial pressure
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
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8AA4BC",
    marginBottom: 20,
  },
  emergencyButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  emergencySubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 4,
  },
  appCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A3A5C",
  },
  appMessage: {
    fontSize: 13,
    color: "#8AA4BC",
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: "#C5D3E8",
  },
  protectionCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  protectionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  protectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  protectionText: {
    fontSize: 13,
    color: "#1B5E20",
    textAlign: "center",
    lineHeight: 18,
  },
});
