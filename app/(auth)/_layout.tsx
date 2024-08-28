import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "Register",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          headerTitle: "Login",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="add-number"
        options={{
          headerShown: true,
          headerTitle: "Add Number",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
