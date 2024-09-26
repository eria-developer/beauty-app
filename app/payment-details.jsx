import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/Colors";
import { getAccessToken, isLoggedIn } from "@/utils/authHelpers";
import { showToast } from "@/utils/toastConfig";

const PaymentDetailsScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirmPayment = async () => {
    if (
      paymentMethod === "visa" &&
      (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)
    ) {
      Alert.alert("Error", "Please fill in all card details.");
      return;
    }
    if (paymentMethod === "mobile" && mobileNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const cart = await AsyncStorage.getItem("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        `${API_URL}/products/checkout/`,
        {
          items: orderItems,
          redeemed_points: 0, // Assuming no points are redeemed in this step
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        await AsyncStorage.removeItem("cart");
        showToast("success", "Success", "Thank you for your purchase!");
        router.push("/(drawer)/(tabs)/home");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast(
        "error",
        "Error",
        "There was a problem processing your order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            paymentMethod === "visa" && styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod("visa")}
        >
          <Text style={styles.paymentMethodText}>Visa Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            paymentMethod === "mobile" && styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod("mobile")}
        >
          <Text style={styles.paymentMethodText}>Mobile Money</Text>
        </TouchableOpacity>
      </View>
      {paymentMethod === "visa" && (
        <View style={styles.cardDetailsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardDetails.number}
            onChangeText={(text) =>
              setCardDetails({ ...cardDetails, number: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            value={cardDetails.expiry}
            onChangeText={(text) =>
              setCardDetails({ ...cardDetails, expiry: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            value={cardDetails.cvv}
            onChangeText={(text) =>
              setCardDetails({ ...cardDetails, cvv: text })
            }
          />
        </View>
      )}
      {paymentMethod === "mobile" && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      )}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPayment}
        disabled={isLoading}
      >
        <Text style={styles.confirmButtonText}>
          {isLoading ? "Processing..." : "Confirm Payment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  paymentMethodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#4169e1",
  },
  paymentMethodText: {
    color: "#F79B00",
  },
  cardDetailsContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: "#4169e1",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default PaymentDetailsScreen;
