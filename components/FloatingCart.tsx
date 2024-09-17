import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FloatingCartIcon = () => {
  const router = useRouter();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const updateCartCount = async () => {
      const cart = await AsyncStorage.getItem("cart");
      const parsedCart = cart ? JSON.parse(cart) : [];
      const uniqueProductCount = parsedCart.length;
      setProductCount(uniqueProductCount);
    };

    updateCartCount();

    // Set up an interval to periodically check for cart updates
    const intervalId = setInterval(updateCartCount, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <TouchableOpacity
      style={styles.floatingCart}
      onPress={() => router.push("/cart")}
    >
      <Ionicons name="cart-outline" size={28} color="white" />
      {productCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{productCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingCart: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: Colors.light.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default FloatingCartIcon;
