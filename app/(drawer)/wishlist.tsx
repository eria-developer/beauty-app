import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const WishListScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="heart-outline"
        color={Colors.light.primary}
        size={80}
        style={styles.icon}
      />
      <Text style={styles.noNotifications}>Ohh Noo 😭</Text>
      <Text style={styles.otherText}>
        You dont have any products in your wish list!!
      </Text>
    </View>
  );
};

export default WishListScreen;

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
  otherText: {
    fontSize: 12,
  },
});
