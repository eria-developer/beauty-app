import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { DrawerToggleButton } from "@react-navigation/drawer";

const MoreLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#FFF",
        headerTitleStyle: { fontWeight: "bold" },
        headerStyle: { backgroundColor: Colors.light.royalBlue },
        // headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "PROFILE",
          // headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{ headerShown: false, title: "EDIT PROFILE" }}
      />
    </Stack>
  );
};

export default MoreLayout;

const styles = StyleSheet.create({});
