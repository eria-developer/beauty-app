import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@/constants/Colors";

interface OrderDetails {
  id: string;
  status: string;
  // Add other relevant fields
}

const OrderDetailsScreen = () => {
  const { id } = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/seller-orders/${id}/`
        );
        const data = await response.json();
        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch(
        `${API_URL}/products/seller-orders/${id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        alert("Status updated successfully.");
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.orderHeader}>
        <MaterialIcons name="receipt" size={48} color="#333" />
        <Text style={styles.orderId}>Order ID: {order.id}</Text>
      </View>
      {/* Display other order details here */}
      <View style={styles.detailSection}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.statusText}>{order.status}</Text>
      </View>

      <View style={styles.updateSection}>
        <Text style={styles.label}>Update Status:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Processing" value="Processing" />
            <Picker.Item label="Completed" value="Completed" />
            <Picker.Item label="Cancelled" value="Cancelled" />
          </Picker>
        </View>
        <Button
          title="Update Status"
          onPress={updateStatus}
          disabled={updating}
          color="#007BFF"
        />
      </View>
    </ScrollView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    marginTop: 20,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333",
  },
  detailSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#666",
  },
  updateSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});
