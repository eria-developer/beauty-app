import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/providers/AuthProvider";
// import { logoutUser, isLoggedIn } from "@/utils/authUtils";
import { logoutUser, isLoggedIn } from "@/utils/authHelpers";
import { showToast } from "@/utils/toastConfig";

const More = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const loggedIn = await isLoggedIn();
    setUserLoggedIn(loggedIn);
  };

  const handleLogOut = async () => {
    try {
      await logoutUser();
      console.log("Logged out successfully");
      setUserLoggedIn(false);
      router.replace("/(drawer)/(tabs)/home");
      showToast("success", "Logged out", "You have logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert(
        "Logout Error",
        "An error occurred while logging out. Please try again."
      );
    }
  };

  const linkItems = [
    { href: "/(drawer)/(more)/e-gift-card", text: "E-Gift card" },
    { href: "/(drawer)/(more)/track-order", text: "Track Order" },
    { href: "/(drawer)/(more)/deals", text: "Deals" },
    {
      href: "/(drawer)/(more)/terms-and-conditions",
      text: "Terms & Conditions",
    },
    { href: "/(drawer)/(more)/privacy-policy", text: "Privacy Policy" },
    { href: "/(drawer)/(more)/(about-us)", text: "About Us" },
    { href: "/(drawer)/(more)/gallery", text: "Gallery" },
    { href: "/(drawer)/(more)/contact-support", text: "Contact Support" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {linkItems.map((item, index) => (
        <Link href={item.href} key={index} style={styles.linkWrapper}>
          <View style={styles.linkItemCard}>
            <Text style={styles.linkText}>{item.text}</Text>
          </View>
        </Link>
      ))}

      {userLoggedIn && (
        <View style={styles.linkWrapper}>
          <TouchableOpacity onPress={handleLogOut}>
            <View style={styles.linkItemCard}>
              <Text style={styles.linkText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  linkWrapper: {
    marginVertical: 5,
    width: Dimensions.get("window").width,
    marginHorizontal: 10,
  },
  linkItemCard: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.95,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.rearText,
  },
});
