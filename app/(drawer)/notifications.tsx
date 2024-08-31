import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="notifications-outline"
        color={Colors.light.primary}
        size={80}
        style={styles.icon}
      />
      <Text style={styles.noNotifications}>No Notifications</Text>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignSelf: "center",
  },
  noNotifications: {
    textAlign: "center",
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
