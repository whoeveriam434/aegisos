import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Slider,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import useStore from "../store";

export default function SettingsScreen() {
  const { userSettings, updateSettings } = useStore();
  const [trustedContactInput, setTrustedContactInput] = useState("");
  // #region agent log
  fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H1",location:"SettingsScreen.js:17",message:"Settings render types",data:{protectionEnabledValue:userSettings?.protectionEnabled,protectionEnabledType:typeof userSettings?.protectionEnabled,coolingOffPeriodType:typeof userSettings?.coolingOffPeriod,trustedContactType:typeof userSettings?.trustedContact},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.subtitle}>Protection Preferences</Text>

      {/* Enable Protection Toggle */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🔒 Enable Protection</Text>
          <Switch
            value={userSettings.protectionEnabled}
            onValueChange={(value) =>
              // #region agent log
              (fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H1",location:"SettingsScreen.js:31",message:"Switch onValueChange type",data:{value,valueType:typeof value},timestamp:Date.now()})}).catch(()=>{}),
              // #endregion
              updateSettings({ protectionEnabled: value }))
            }
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={"#fff"}
          />
        </View>
        <Text style={styles.hint}>When ON, scam detection is active</Text>
      </View>

      {/* Cooling-off Slider */}
      <View style={styles.card}>
        <Text style={styles.label}>⏱️ Cooling-off Duration</Text>
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
          Time delay before suspicious transactions
        </Text>
      </View>

      {/* Trusted Contact */}
      <View style={styles.card}>
        <Text style={styles.label}>👤 Trusted Contact</Text>
        <Text style={styles.contactDisplay}>
          {userSettings.trustedContact || "No contact added"}
        </Text>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Contact</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          Someone you trust to verify transactions
        </Text>
      </View>

      <Text style={styles.footer}>🛡️ Your safety is our priority</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontSize: 18,
    color: "#6B8AAC",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
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
    marginBottom: 8,
  },
  valueDisplay: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90D9",
    textAlign: "center",
    marginVertical: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  hint: {
    fontSize: 14,
    color: "#8AA4BC",
    marginTop: 8,
  },
  contactDisplay: {
    fontSize: 18,
    color: "#1A3A5C",
    backgroundColor: "#F0F4F9",
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    fontSize: 14,
    color: "#8AA4BC",
    marginTop: 20,
    marginBottom: 40,
  },
});
