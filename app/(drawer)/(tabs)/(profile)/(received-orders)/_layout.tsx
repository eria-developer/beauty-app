import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerStyle: { backgroundColor: Colors.light.primary },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "RECEIVED ORDERS",
        }}
      />
      <Stack.Screen
        name="order-details/[id]"
        options={{
          headerShown: true,
          title: "Order Details",
        }}
      />
    </Stack>
  );
};

export default _layout;
