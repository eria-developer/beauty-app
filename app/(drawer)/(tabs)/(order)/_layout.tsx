import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Colors } from "@/constants/Colors";

const _layout = () => {
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
          title: "MENU",
          headerLeft: () => <DrawerToggleButton tintColor="#FFF" />,
        }}
      />
      <Stack.Screen
        name="category-items"
        options={{
          headerShown: true,
          title: "Category Products",
        }}
      />
      <Stack.Screen
        name="product-details"
        options={{
          headerShown: true,
          title: "Product Details",
        }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
