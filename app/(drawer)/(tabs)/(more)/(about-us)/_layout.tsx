import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
// IMPORT Colors

const AboutUsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerStyle: { backgroundColor: Colors.light.primary },
        // headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "ABOUT US" }}
      />
      <Stack.Screen
        name="map"
        options={{ headerShown: true, title: "BRANCHES" }}
      />
    </Stack>
  );
};

export default AboutUsLayout;

const styles = StyleSheet.create({});
