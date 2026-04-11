import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import useStore from "../store";
import {
  learnPatterns,
  sampleMessages,
  getLearningStatus,
  clearAllPatterns,
} from "../utils/patternLearner";

export default function SettingsScreen() {
  // Get all needed state and actions from store
  const {
    userSettings,
    updateSettings,
    privacySettings,
    setPersonalPatternsEnabled,
    updateLearningProgress,
    setPatternsLearned,
    clearLearnedPatterns,
    familyCircle,
    addFamilyContact,
    removeFamilyContact,
  } = useStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [isLearning, setIsLearning] = useState(false);
  const [learningStatus, setLearningStatus] = useState({
    familyLearned: false,
    bankLearned: false,
  });

  // Load learning status on mount
  useEffect(() => {
    loadStatus();
  }, [privacySettings.patternsLearned]);

  const loadStatus = async () => {
    const status = await getLearningStatus();
    setLearningStatus(status);
  };

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

  const handleLearnPatterns = async () => {
    if (!privacySettings.enablePersonalPatterns) {
      Alert.alert(
        "Enable First",
        "Please enable 'Personal Pattern Detection' above before learning patterns.",
      );
      return;
    }

    setIsLearning(true);
    updateLearningProgress(10);

    // Simulate learning family patterns
    updateLearningProgress(30);
    const familyPatterns = await learnPatterns(
      "family",
      sampleMessages.family.normal,
    );

    updateLearningProgress(60);
    const bankPatterns = await learnPatterns(
      "bank",
      sampleMessages.bank.normal,
    );

    updateLearningProgress(100);

    setPatternsLearned({ family: familyPatterns, bank: bankPatterns });
    await loadStatus();

    setIsLearning(false);

    Alert.alert(
      "✅ Patterns Learned",
      "KairoZero has learned how your family and bank normally communicate.\n\n" +
        "• Family: Never asks for money or uses urgent language\n" +
        "• Bank: Uses formal language, never demands immediate action\n\n" +
        "Your data never left your device.",
    );
  };

  const handleClearPatterns = async () => {
    Alert.alert(
      "Clear Learned Patterns",
      "This will delete all learned communication patterns from your device.\n\nYour privacy is respected — this data never leaves your phone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearAllPatterns();
            clearLearnedPatterns();
            await loadStatus();
            Alert.alert(
              "✅ Patterns Cleared",
              "All learned patterns have been deleted from your device.",
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
      <Text style={styles.title}>⚙️ Protection Settings</Text>
      <Text style={styles.subtitle}>You are in control</Text>

      {/* Enable Protection Toggle */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🛡️ Enable KairoZero Protection</Text>
          <Switch
            style={{ marginLeft: -30 }}
            value={userSettings.protectionEnabled}
            onValueChange={(value) =>
              updateSettings({ protectionEnabled: value })
            }
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={"#fff"}
          />
        </View>
        <Text style={styles.hint}>
          When ON, KairoZero monitors for scam patterns
        </Text>
      </View>

      {/* Personal Pattern Detection (Privacy-First) */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>🔐 Personal Pattern Detections</Text>
          <Switch
            style={{ marginLeft: -30 }}
            value={privacySettings.enablePersonalPatterns}
            onValueChange={(value) => setPersonalPatternsEnabled(value)}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={"#fff"}
          />
        </View>
        <Text style={styles.description}>
          Learn how your family and bank normally communicate. Detects
          impersonation by spotting deviations.
        </Text>
        <View style={styles.privacyBadge}>
          <Text style={styles.privacyBadgeText}>
            🔒 100% Local • No Cloud • Your Data Never Leaves Your Phone
          </Text>
        </View>

        {privacySettings.enablePersonalPatterns && (
          <View style={styles.learningSection}>
            <Text style={styles.learningTitle}>
              📖 Communication Pattern Learning
            </Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Family patterns:</Text>
              <Text
                style={[
                  styles.statusValue,
                  learningStatus.familyLearned && styles.statusLearned,
                ]}
              >
                {learningStatus.familyLearned ? "✅ Learned" : "❌ Not learned"}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Bank patterns:</Text>
              <Text
                style={[
                  styles.statusValue,
                  learningStatus.bankLearned && styles.statusLearned,
                ]}
              >
                {learningStatus.bankLearned ? "✅ Learned" : "❌ Not learned"}
              </Text>
            </View>

            {privacySettings.learningProgress > 0 &&
              privacySettings.learningProgress < 100 && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Learning: {privacySettings.learningProgress}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${privacySettings.learningProgress}%` },
                      ]}
                    />
                  </View>
                </View>
              )}

            <TouchableOpacity
              style={[
                styles.learnButton,
                isLearning && styles.learnButtonDisabled,
              ]}
              onPress={handleLearnPatterns}
              disabled={isLearning}
            >
              {isLearning ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.learnButtonText}>
                  {learningStatus.familyLearned
                    ? "🔄 Re-learn Patterns"
                    : "📖 Learn My Patterns"}
                </Text>
              )}
            </TouchableOpacity>

            {(learningStatus.familyLearned || learningStatus.bankLearned) && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearPatterns}
              >
                <Text style={styles.clearButtonText}>
                  🗑️ Clear Learned Patterns
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.hint}>
              {learningStatus.familyLearned
                ? "✓ KairoZero now knows how your family communicates. Impersonation attempts will be flagged."
                : "Learn your patterns to enable personalized scam detection."}
            </Text>
          </View>
        )}
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

      {/* Family Circle Section */}
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
              <TouchableOpacity onPress={() => removeFamilyContact(contact.id)}>
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
        <Text style={styles.infoTitle}>
          💡 How Personal Pattern Detection Works
        </Text>
        <Text style={styles.infoText}>
          • KairoZero learns how your family and bank normally communicate\n •
          All analysis happens on your device — no cloud, no data sharing\n •
          When a message deviates from normal patterns, we flag it\n • You're
          always in control — enable, disable, or clear patterns anytime
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
    justifyContent: "flex-start", // Changed from space-between
    alignItems: "center",
    // gap: -10, // Adds space between text and switch
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A3A5C",
    // marginRight: 20,
  },
  description: {
    fontSize: 14,
    color: "#8AA4BC",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 18,
  },
  privacyBadge: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  privacyBadgeText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
  learningSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8EDF2",
    paddingTop: 16,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A3A5C",
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6B8AAC",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF9800",
  },
  statusLearned: {
    color: "#4CAF50",
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressText: {
    fontSize: 12,
    color: "#6B8AAC",
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E8EDF2",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90D9",
    borderRadius: 3,
  },
  learnButton: {
    backgroundColor: "#4A90D9",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  learnButtonDisabled: {
    backgroundColor: "#8AA4BC",
  },
  learnButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "500",
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
