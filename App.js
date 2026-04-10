import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { enableScreens } from "react-native-screens";

// Import screens
import BankScreen from "./screens/BankScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DevPanel from "./screens/DevPanel";

const Tab = createBottomTabNavigator();
enableScreens(false);

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
  // #region agent log
  fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H2",location:"App.js:25",message:"App render start",data:{tabNames:["Bank","Settings","DevPanel"]},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return (
    <NavigationContainer>
      <Tab.Navigator
        detachInactiveScreens={false}
        screenListeners={{
          state: () => {
            // #region agent log
            console.log("[dbg:H2] Tab navigator state event fired");
            // #endregion
          },
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            // #region agent log
            fetch("http://127.0.0.1:7760/ingest/512bbc58-7e90-47ef-b694-c8795338be2f",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"146840"},body:JSON.stringify({sessionId:"146840",runId:"pre-fix",hypothesisId:"H2",location:"App.js:31",message:"tabBarIcon focused type",data:{routeName:route.name,focusedValue:focused,focusedType:typeof focused},timestamp:Date.now()})}).catch(()=>{})
            // #endregion
            &&
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
