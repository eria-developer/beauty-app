import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const more = () => {
  const { session } = useAuth();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully");
      router.push("/(drawer)/(tabs)/home");
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

      {session && (
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

export default more;

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
