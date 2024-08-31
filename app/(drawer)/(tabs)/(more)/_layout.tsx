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
        headerStyle: { backgroundColor: Colors.light.primary },
        // headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "MORE",
          headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
        }}
      />
      <Stack.Screen
        name="e-gift-card"
        options={{ headerShown: true, title: "E-GIFT CARD" }}
      />
      <Stack.Screen
        name="track-order"
        options={{ headerShown: true, title: "TRACK-ORDER" }}
      />
      <Stack.Screen
        name="deals"
        options={{ headerShown: true, title: "DEALS" }}
      />
      <Stack.Screen
        name="terms-and-conditions"
        options={{ headerShown: true, title: "TERMS & CONDITIONS" }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{ headerShown: true, title: "PRIVACY POLICY" }}
      />
      <Stack.Screen name="(about-us)" options={{ headerShown: false }} />
      <Stack.Screen
        name="gallery"
        options={{ headerShown: true, title: "GALLERY" }}
      />
      <Stack.Screen
        name="contact-support"
        options={{ headerShown: true, title: "CONTACT SUPPORT" }}
      />
    </Stack>
  );
};

export default MoreLayout;

const styles = StyleSheet.create({});
