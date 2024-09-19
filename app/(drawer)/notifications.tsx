import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const NotificationsScreen = ({ navigation }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Ionicons
        name="notifications-outline"
        color={Colors.light.primary}
        size={80}
        style={styles.icon}
      />
      <Text style={styles.noNotifications}>No Notifications</Text>
      <Button
        title="Go to Home"
        onPress={() => router.push("/(drawer)/(tabs)/home/")}
      />
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
