import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider"
import useStore from "../store";

export default function SettingsScreen() {
  const { userSettings, updateSettings } = useStore();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>⚙️ Protection Settings</Text>
      <Text style={styles.subtitle}>You are in control</Text>

      {/* Enable Protection Toggle */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🛡️ Enable Aegis Protection</Text>
          <Switch
            value={userSettings.protectionEnabled}
            onValueChange={(value) =>
              updateSettings({ protectionEnabled: value })
            }
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={"#fff"}
          />
        </View>
        <Text style={styles.hint}>
          When ON, Aegis monitors for scam patterns
        </Text>
      </View>

      {/* Cooling-off Slider - Pre-commitment */}
      <View style={styles.card}>
        <Text style={styles.label}>⏱️ Cooling-off Duration</Text>
        <Text style={styles.description}>
          Time delay before sensitive actions
        </Text>
        <Text style={styles.valueDisplay}>
          {userSettings.coolingOffPeriod} minutes
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={userSettings.coolingOffPeriod}
          onValueChange={(value) => updateSettings({ coolingOffPeriod: value })}
          minimumTrackTintColor="#4A90D9"
          maximumTrackTintColor="#ccc"
        />
        <Text style={styles.hint}>
          Longer delays = more protection against urgency scams
        </Text>
      </View>

      {/* Trusted Contact - Warm handoff */}
      <View style={styles.card}>
        <Text style={styles.label}>👤 Trusted Contact</Text>
        <Text style={styles.description}>
          Someone you trust to verify suspicious requests
        </Text>
        <Text style={styles.contactDisplay}>
          {userSettings.trustedContact || "No contact added yet"}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            Alert.alert("Add Trusted Contact", "Enter name and phone number", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Save",
                onPress: () => {
                  // For demo, we'll use a predefined contact
                  updateSettings({
                    trustedContact: "Daughter: +852 9123 4567",
                  });
                  Alert.alert(
                    "✅ Contact Saved",
                    "You can now call them from the safety screen.",
                  );
                },
              },
            ]);
          }}
        >
          <Text style={styles.addButtonText}>+ Add / Edit Contact</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          You can call them directly from the safety screen
        </Text>
      </View>

      {/* Explanation Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 How Pre-Commitment Works</Text>
        <Text style={styles.infoText}>
          You set your boundaries now, when you're calm. If a scammer tries to
          pressure you later, Aegis enforces YOUR rules — not ours. You stay in
          control.
        </Text>
      </View>

      <Text style={styles.footer}>
        🛡️ Your safety. Your dignity. Your control.
      </Text>
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
    fontSize: 16,
    color: "#6B8AAC",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A3A5C",
  },
  description: {
    fontSize: 14,
    color: "#8AA4BC",
    marginTop: 4,
    marginBottom: 12,
  },
  valueDisplay: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4A90D9",
    textAlign: "center",
    marginVertical: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  hint: {
    fontSize: 13,
    color: "#8AA4BC",
    marginTop: 12,
    lineHeight: 18,
  },
  contactDisplay: {
    fontSize: 16,
    color: "#1A3A5C",
    backgroundColor: "#F0F4F9",
    padding: 14,
    borderRadius: 12,
    marginVertical: 12,
    fontFamily: "monospace",
  },
  addButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#E8F0FE",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90D9",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1A3A5C",
    lineHeight: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#8AA4BC",
    marginTop: 10,
    marginBottom: 40,
  },
});
