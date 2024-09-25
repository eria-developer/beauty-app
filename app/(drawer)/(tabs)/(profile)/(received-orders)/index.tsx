import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAccessToken,
  refreshAccessToken,
  logoutUser,
  getUserData,
} from "@/utils/authHelpers";
import Toast from "react-native-toast-message";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const ReceivedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const {} = getUserData()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userData = await getUserData();
        console.log("User Data:", userData); // Log user data

        if (!userData) {
          console.log("No user data found");
          setError("Unable to retrieve user data. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("User Role:", userData.role); // Log user role

        if (userData.role !== "admin" && userData.role !== "seller") {
          console.log("User does not have required role");
          setError("You don't have permission to view this page.");
          setLoading(false);
          return;
        }

        let token = await getAccessToken();
        console.log("Access Token:", token); // Log access token

        const fetchOrdersWithToken = async (accessToken) => {
          console.log("Fetching orders with token:", accessToken);
          const response = await fetch(`${API_URL}/products/admin-orders/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return await response.json();
        };

        try {
          const data = await fetchOrdersWithToken(token);
          console.log("Fetched Orders:", data); // Log fetched orders
          setOrders(data);
        } catch (error) {
          console.error("Error in fetchOrdersWithToken:", error);
          if (error.message.includes("401")) {
            console.log("Attempting to refresh token");
            const newToken = await refreshAccessToken();
            if (newToken) {
              console.log("Token refreshed, retrying fetch");
              const data = await fetchOrdersWithToken(newToken);
              setOrders(data);
            } else {
              console.log("Token refresh failed, logging out user");
              await logoutUser();
              setError("Session expired. Please log in again.");
            }
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() =>
        router.push(
          `/(drawer)/(tabs)/(profile)/(received-orders)/order-details/${item.id}`
        )
      }
    >
      <View style={styles.orderInfo}>
        <MaterialIcons name="receipt" size={24} color="#333" />
        <View style={styles.orderText}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={styles.orderDate}>
            Date: {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.orderAmount}>
            Amount: ugx. {item.total_amount.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
        <Text style={styles.orderStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "processing":
        return "#4169E1";
      case "shipped":
        return "#32CD32";
      case "delivered":
        return "#228B22";
      case "cancelled":
        return "#DC143C";
      default:
        return "#808080";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <MaterialIcons name="inbox" size={64} color="#ccc" />
          <Text style={styles.noOrdersText}>
            You have no received orders yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ReceivedOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderText: {
    marginLeft: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  loader: {
    flex: 1,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
});
