import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DevPanel from "./screens/DevPanel";

// Hide debug warnings for cleaner demo
// LogBox.ignoreAllLogs();

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("Home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "Home":
        return <HomeScreen />;
      case "Settings":
        return <SettingsScreen />;
      case "DevPanel":
        return <DevPanel />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛡️ Aegis OS</Text>
        <Text style={styles.headerSubtitle}>
          Trust Architect • Dignity First
        </Text>
      </View>

      <View style={styles.screenContainer}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, currentScreen === "Home" && styles.activeTab]}
          onPress={() => setCurrentScreen("Home")}
        >
          <Text style={styles.tabIcon}>🏠</Text>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === "Home" && styles.activeTabLabel,
            ]}
          >
            Daily Apps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentScreen === "Settings" && styles.activeTab]}
          onPress={() => setCurrentScreen("Settings")}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === "Settings" && styles.activeTabLabel,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentScreen === "DevPanel" && styles.activeTab]}
          onPress={() => setCurrentScreen("DevPanel")}
        >
          <Text style={styles.tabIcon}>🎮</Text>
          <Text
            style={[
              styles.tabLabel,
              currentScreen === "DevPanel" && styles.activeTabLabel,
            ]}
          >
            Dev Panel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9FF",
  },
  header: {
    backgroundColor: "#1A3A5C",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#8AA4BC",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E8EDF2",
    paddingVertical: 10,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: "#F0F7FF",
    borderRadius: 20,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 12,
    color: "#8AA4BC",
    marginTop: 4,
  },
  activeTabLabel: {
    color: "#4A90D9",
    fontWeight: "600",
  },
});
