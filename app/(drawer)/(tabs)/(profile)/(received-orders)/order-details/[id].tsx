import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { API_URL, Colors } from "@/constants/Colors";
import { getAccessToken } from "@/utils/authHelpers";
import Toast from "react-native-toast-message";

interface OrderDetails {
  id: number;
  user: string;
  created_at: string;
  is_paid: boolean;
  status: string;
  items: Array<{
    id: number;
    product: number;
    quantity: number;
    price: string;
  }>;
  loyalty_points_earned: number;
  total_amount: number;
}

const statusColors = {
  pending: "#FFA500",
  processing: "#4169E1",
  shipped: "#32CD32",
  delivered: "#228B22",
  canceled: "#DC143C",
};

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/products/admin-orders/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrder(data);
      setStatus(data.status || "pending"); // Set a default status if not available
    } catch (error) {
      console.error("Error fetching order details:", error);
      setOrder(null); // Set order to null in case of an error
      setStatus("pending"); // Set a default status in case of an error
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    setUpdating(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `${API_URL}/products/admin-orders/${id}/update-status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: "Order status has been successfully updated.",
      });
      router.replace("/(drawer)/(tabs)/(profile)/(received-orders)");
    } catch (error) {
      console.error("Error updating status:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: `Failed to update status. ${error.message}`,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order?.id || "N/A"}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusColors[order?.status] || statusColors.pending,
            },
          ]}
        >
          <Text style={styles.statusText}>
            {(order?.status || "Unknown").toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <Text style={styles.infoText}>User: {order?.user || "N/A"}</Text>
        <Text style={styles.infoText}>
          Date:{" "}
          {order?.created_at
            ? new Date(order.created_at).toLocaleString()
            : "N/A"}
        </Text>
        <Text style={styles.infoText}>
          Payment Status: {order?.is_paid ? "Paid" : "Not Paid"}
        </Text>
        <Text style={styles.infoText}>
          Total Amount: ugx. 
          {order?.total_amount ? order.total_amount.toFixed(2) : "N/A"}
        </Text>
        <Text style={styles.infoText}>
          Loyalty Points Earned: {order?.loyalty_points_earned || "N/A"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order?.items && order.items.length > 0 ? (
          order.items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <Text style={styles.itemText}>Product ID: {item.product}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemText}>
                Price: ugx. {parseFloat(item.price).toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoText}>No items found</Text>
        )}
      </View>

      <View style={styles.updateStatusSection}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Processing" value="processing" />
          <Picker.Item label="Shipped" value="shipped" />
          <Picker.Item label="Delivered" value="delivered" />
          <Picker.Item label="Canceled" value="canceled" />
        </Picker>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateStatus}
          disabled={updating}
        >
          <Text style={styles.updateButtonText}>
            {updating ? "Updating..." : "Update Status"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.primary,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#ffffff",
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.light.primary,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 2,
  },
  updateStatusSection: {
    backgroundColor: "#ffffff",
    marginTop: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrderDetailsScreen;
