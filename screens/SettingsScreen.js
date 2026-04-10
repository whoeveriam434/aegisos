import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import useStore from "../store";

export default function SettingsScreen() {
  const {
    userSettings,
    updateSettings,
    familyCircle,
    addFamilyContact,
    removeFamilyContact,
  } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert("Error", "Please enter both name and phone number");
      return;
    }
    addFamilyContact(newContactName, newContactPhone);
    setNewContactName("");
    setNewContactPhone("");
    setModalVisible(false);
    Alert.alert(
      "✅ Contact Added",
      `${newContactName} will be notified during scam attempts.`,
    );
  };

  const handleRemoveContact = (id, name) => {
    Alert.alert("Remove Contact", `Remove ${name} from your family circle?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => removeFamilyContact(id) },
    ]);
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

      {/* Cooling-off Slider */}
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

      {/* Trusted Contact */}
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

      {/* Feature 4: Family Circle Section */}
      <View style={styles.card}>
        <Text style={styles.label}>👨‍👩‍👧 Family Circle</Text>
        <Text style={styles.description}>
          Family members who will be notified when a scam is detected
        </Text>

        {familyCircle.length === 0 ? (
          <Text style={styles.emptyText}>No family contacts added yet</Text>
        ) : (
          familyCircle.map((contact) => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveContact(contact.id, contact.name)}
              >
                <Text style={styles.removeText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addFamilyButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addFamilyButtonText}>+ Add Family Member</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          They'll receive alerts when you're being targeted
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

      {/* Modal for adding family contact */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Family Contact</Text>

            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Daughter, Son"
              value={newContactName}
              onChangeText={setNewContactName}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+852 9123 4567"
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={handleAddContact}
              >
                <Text style={styles.modalSaveText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyText: {
    fontSize: 14,
    color: "#8AA4BC",
    textAlign: "center",
    marginVertical: 12,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F4F9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A3A5C",
  },
  contactPhone: {
    fontSize: 13,
    color: "#8AA4BC",
    marginTop: 2,
  },
  removeText: {
    fontSize: 20,
    padding: 8,
  },
  addFamilyButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addFamilyButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A3A5C",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDE5ED",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F9FBFF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#F0F4F9",
  },
  modalCancelText: {
    color: "#666",
    fontSize: 16,
  },
  modalSave: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#4A90D9",
  },
  modalSaveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
