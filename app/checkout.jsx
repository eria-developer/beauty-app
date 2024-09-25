import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { getAccessToken, isLoggedIn } from "@/utils/authHelpers";
import { showToast } from "@/utils/toastConfig";

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const loggedIn = await isLoggedIn();
    setIsUserLoggedIn(loggedIn);
  };

  const fetchCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      const parsedCart = cart ? JSON.parse(cart) : [];
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const calculateTotal = (cart) => {
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(totalPrice.toFixed(2));
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (!isUserLoggedIn) {
        // Alert.alert("Error", "You need to be logged in to checkout.");
        showToast("error", "Error", "You need to be logged in to checkout.");
        router.push("/(auth)/login");
        return;
      }

      const token = await getAccessToken();
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        `${API_URL}/products/checkout/`,
        { items: orderItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        await AsyncStorage.removeItem("cart");
        setCartItems([]);
        setTotal(0);
        Alert.alert("Success", "Thank you for your purchase!", [
          {
            text: "OK",
            onPress: () => router.push("/(drawer)/(tabs)/home"),
          },
        ]);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      //   Alert.alert(
      // "Error",
      // "There was a problem processing your order. Please try again."
      //   );
      showToast(
        "error",
        "Error",
        "There was a problem processing your order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.productPrice}>ugx. {item.product.price}</Text>
      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Your cart is empty. Add some items!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderCartItem}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ugx. {total}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          disabled={isLoading}
        >
          <Text style={styles.checkoutButtonText}>
            {isLoading ? "Processing..." : "Confirm Checkout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  cartItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#e91e63",
  },
  quantity: {
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  totalContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});

export default CheckoutScreen;
