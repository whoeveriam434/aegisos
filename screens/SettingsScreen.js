import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import useStore from "../store";
import {
  getTrustedContacts,
  addTrustedContact,
  removeTrustedContact,
} from "../utils/trustedContactsStorage";

export default function SettingsScreen() {
  const { userSettings, updateSettings } = useStore();
  const [trustedContactName, setTrustedContactName] = useState("");
  const [trustedContactPhone, setTrustedContactPhone] = useState("");
  const [trustedContacts, setTrustedContacts] = useState([]);

  useEffect(() => {
    const loadContacts = async () => {
      const contacts = await getTrustedContacts();
      setTrustedContacts(contacts);
    };
    loadContacts();
  }, []);

  const handleAddContact = async () => {
    const name = trustedContactName.trim();
    const phone = trustedContactPhone.trim();
    if (!name || !phone) {
      Alert.alert("Missing details", "Please enter both contact name and phone.");
      return;
    }

    const updated = await addTrustedContact({ name, phone });
    setTrustedContacts(updated);
    updateSettings({ trustedContact: `${name}: ${phone}` });
    setTrustedContactName("");
    setTrustedContactPhone("");
    Alert.alert("Saved", "Trusted contact added locally on this device.");
  };

  const handleRemoveContact = async (contact) => {
    const updated = await removeTrustedContact(contact.id);
    setTrustedContacts(updated);
    if (userSettings.trustedContact === `${contact.name}: ${contact.phone}`) {
      const next = updated[0];
      updateSettings({
        trustedContact: next ? `${next.name}: ${next.phone}` : null,
      });
    }
  };

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
        <View style={styles.contactInputRow}>
          <TextInput
            style={styles.contactInput}
            placeholder="Contact Name"
            value={trustedContactName}
            onChangeText={setTrustedContactName}
          />
        </View>
        <View style={styles.contactInputRow}>
          <TextInput
            style={styles.contactInput}
            placeholder="Phone Number"
            value={trustedContactPhone}
            onChangeText={setTrustedContactPhone}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {trustedContacts.map((contact) => (
          <View key={contact.id} style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactSelectButton}
              onPress={() =>
                updateSettings({
                  trustedContact: `${contact.name}: ${contact.phone}`,
                })
              }
            >
              <Text style={styles.contactSelectText}>{contact.name}</Text>
              <Text style={styles.contactPhoneText}>{contact.phone}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactDeleteButton}
              onPress={() => handleRemoveContact(contact)}
            >
              <Text style={styles.contactDeleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  contactInputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  contactInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D5E1EC",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
    color: "#1A3A5C",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  contactSelectButton: {
    flex: 1,
    backgroundColor: "#F0F4F9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  contactSelectText: {
    color: "#1A3A5C",
    fontSize: 14,
    fontWeight: "600",
  },
  contactPhoneText: {
    color: "#6B8AAC",
    fontSize: 12,
    marginTop: 2,
  },
  contactDeleteButton: {
    backgroundColor: "#FCE8E8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  contactDeleteText: {
    color: "#A94442",
    fontSize: 13,
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
