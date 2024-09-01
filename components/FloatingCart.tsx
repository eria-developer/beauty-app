import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const FloatingCartIcon = ({ onPress }: any) => {
  return (
    <TouchableOpacity style={styles.floatingCart} onPress={onPress}>
      <Ionicons name="cart-outline" size={28} color="white" />
    </TouchableOpacity>
  );
};

export default FloatingCartIcon;

const styles = StyleSheet.create({
  floatingCart: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: Colors.light.primary,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
});
