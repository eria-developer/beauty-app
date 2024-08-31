import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { DrawerToggleButton } from "@react-navigation/drawer";

const MyAccountLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold" },
        headerStyle: { backgroundColor: Colors.light.primary },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="change-password"
        options={{ title: "CHANGE PASSWORD" }}
      />
      <Stack.Screen name="edit-profile" options={{ title: "EDIT PROFILE" }} />
      <Stack.Screen
        name="index"
        options={{
          title: "PROFILE",
          headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
        }}
      />
    </Stack>
  );
};

export default MyAccountLayout;

const styles = StyleSheet.create({});
