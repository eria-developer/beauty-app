import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const SettingItem = ({ icon, title, value, onPress, isSwitch = false }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingItemLeft}>
      <Ionicons
        name={icon}
        size={24}
        color={Colors.light.primary}
        style={styles.icon}
      />
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    {isSwitch ? (
      <Switch
        value={value}
        onValueChange={onPress}
        trackColor={{ false: "#d1d5db", true: Colors.light.primary }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
      />
    ) : (
      <View style={styles.settingItemRight}>
        <Text style={styles.settingValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={20} color="#a0aec0" />
      </View>
    )}
  </TouchableOpacity>
);

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Customize your app experience
          </Text>
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            value=""
            onPress={() => {}}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            value=""
            onPress={() => {}}
          />
          <SettingItem
            icon="mail-outline"
            title="Email"
            value="user@example.com"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
            isSwitch
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            value={darkMode}
            onPress={() => setDarkMode(!darkMode)}
            isSwitch
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            value="English"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            value=""
            onPress={() => {}}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Us"
            value=""
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            value=""
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-outline"
            title="Privacy Policy"
            value=""
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: Colors.light.primary,
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: "#2d3748",
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontSize: 16,
    color: "#718096",
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: Colors.light.primary,
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Settings;
