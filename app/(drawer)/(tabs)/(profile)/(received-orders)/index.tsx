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

interface Order {
  id: string;
  status: string;
}

const ReceivedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/products/seller-orders/`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push(`order-details/${item.id}`)}
    >
      <View style={styles.orderInfo}>
        <MaterialIcons name="receipt" size={24} color="#333" />
        <View style={styles.orderText}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={styles.orderStatus}>Status: {item.status}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <MaterialIcons name="inbox" size={64} color="#ccc" />
          <Text style={styles.noOrdersText}>You have no received orders.</Text>
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
});
