import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";

// Import screens
import BankScreen from "./screens/BankScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DevPanel from "./screens/DevPanel";

const Tab = createBottomTabNavigator();

// Simple custom tab bar icons
const getTabIcon = (routeName, focused) => {
  const icons = {
    Bank: focused ? "🏦" : "🏦",
    Settings: focused ? "⚙️" : "⚙️",
    DevPanel: focused ? "🎮" : "🎮",
  };
  return icons[routeName] || "📱";
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Text style={styles.tabIcon}>
              {getTabIcon(route.name, focused)}
            </Text>
          ),
          tabBarActiveTintColor: "#4A90D9",
          tabBarInactiveTintColor: "#8AA4BC",
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
      >
        <Tab.Screen
          name="Bank"
          component={BankScreen}
          options={{ title: "🏦 Aegis Bank" }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "⚙️ Protection Settings" }}
        />
        <Tab.Screen
          name="DevPanel"
          component={DevPanel}
          options={{ title: "🎮 Demo Control (Dev Panel)" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E8EDF2",
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#1A3A5C",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
