import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import useStore from '../store';
import FrictionOverlay from '../components/FrictionOverlay';

export default function BankScreen() {
  const { isScamActive, balance, setBalance } = useStore();
  const [showSend, setShowSend] = useState(false);

  // If scam is active, show friction overlay
  if (isScamActive) {
    return <FrictionOverlay />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bankName}>🏦 Aegis Bank</Text>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
      </View>

      <TouchableOpacity 
        style={styles.sendButton}
        onPress={() => {
          setShowSend(true);
          Alert.alert(
            "Send Money",
            "Enter recipient and amount",
            [
              { text: "Cancel", style: "cancel", onPress: () => setShowSend(false) },
              { 
                text: "Confirm", 
                onPress: () => {
                  Alert.alert("⚠️ Transaction Pending", "This would normally send money, but protection is active.");
                  setShowSend(false);
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.sendButtonText}>💸 Send Money</Text>
      </TouchableOpacity>

      <View style={styles.securityBadge}>
        <Text style={styles.securityText}>✅ Aegis Protection Active</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    padding: 20,
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A3A5C',
    textAlign: 'center',
    marginBottom: 40,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 40,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#6B8AAC',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A3A5C',
  },
  sendButton: {
    backgroundColor: '#4A90D9',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  },
  securityBadge: {
    alignItems: 'center',
  },
  securityText: {
    fontSize: 14,
    color: '#4CAF50',
  },
});