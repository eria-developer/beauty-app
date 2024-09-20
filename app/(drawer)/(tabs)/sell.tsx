import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import AddProductScreen from "@/components/AddProductScreen";
import AddServiceScreen from "@/components/AddServiceScreen";
import { isLoggedIn } from "@/utils/authHelpers";

const Tab = createMaterialTopTabNavigator();

const AddProductServiceScreen = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    const loggedIn = await isLoggedIn();
    setIsUserLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [checkLoginStatus])
  );

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isUserLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>
              You need to be logged in to access this screen.
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.royalBlue,
        tabBarInactiveTintColor: Colors.light.rearText,
        tabBarIndicatorStyle: { backgroundColor: Colors.light.royalBlue },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ tabBarLabel: "Add Product" }}
      />
      <Tab.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{ tabBarLabel: "Add Service" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddProductServiceScreen;
