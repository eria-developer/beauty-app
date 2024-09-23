import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import {
  isLoggedIn,
  getUserData,
  getAuthenticatedAxiosInstance,
  logoutUser,
  refreshAccessToken,
} from "@/utils/authHelpers";
import { API_URL } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

const { height, width } = Dimensions.get("window");

const HalfScreenBackgroundLayout = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const fetchUserOrders = useCallback(async () => {
    if (!loggedIn) return;

    setLoading(true);
    try {
      const axiosInstance = await getAuthenticatedAxiosInstance();
      const response = await axiosInstance.get(
        `${API_URL}/products/user-orders/`
      );

      if (response.data && Array.isArray(response.data)) {
        setUserOrders(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setUserOrders([]);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);

      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access, attempting to refresh token...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          const newAxiosInstance = await getAuthenticatedAxiosInstance();
          const retryResponse = await newAxiosInstance.get(
            `${API_URL}/products/user-orders/`
          );
          setUserOrders(retryResponse.data);
        } else {
          console.log("Token refresh failed, logging out user");
          await logoutUser();
          setLoggedIn(false);
          setUserData(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [loggedIn]);

  const checkAuthStatus = useCallback(async () => {
    const loggedInn = await isLoggedIn();
    setLoggedIn(loggedInn);
    if (loggedInn) {
      const userInfo = await getUserData();
      setUserData(userInfo);
      await fetchUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [fetchUserOrders]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [checkAuthStatus])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkAuthStatus();
    setRefreshing(false);
  }, [checkAuthStatus]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View>
        <Text style={styles.orderItemText}>Order #{item.id}</Text>
        <Text style={styles.orderItemText}>
          Date: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.orderItemText}>
          Points:
          {item.loyalty_points_earned}
        </Text>
      </View>
      <View style={[styles.statusBadge, styles[`status${item.status}`]]}>
        <Text style={styles.statusText}>{item.status}</Text>
        <Text>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={{
            uri: "https://img.freepik.com/free-photo/front-view-smiley-woman-holding-hair-products_23-2149635003.jpg?ga=GA1.1.476787416.1724867277&semt=ais_hybrid",
          }}
          style={styles.backgroundImage}
        >
          <View style={styles.imageOverlay} />
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>WELCOME TO</Text>
            <Text style={styles.secondOverlayText}>BEAUTY PARLOUR!!</Text>
          </View>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(drawer)/(tabs)/(order)/")}
          >
            <AntDesign name="Safety" size={20} color={"#fff"} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>EXPLORE</Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            ORDER FIRST FROM YOUR FAVORITES
          </Text>

          <TouchableOpacity
            style={styles.branchesButton}
            onPress={() => router.push("/(drawer)/(tabs)/(order)/")}
          >
            <Text style={styles.buttonText}>
              View All Saloons, Services and Products
            </Text>
          </TouchableOpacity>

          {!loggedIn && (
            <View style={styles.registerAndLoginButtons}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => router.push("/(auth)/login")}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => router.push("/(auth)")}
              >
                <Text style={styles.buttonText}>REGISTER</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.recentOrders}>
            <Text style={styles.recentOrderTitle}>My Recent Orders</Text>
            {loggedIn ? (
              loading ? (
                <Text style={styles.emptyListText}>Loading orders...</Text>
              ) : (
                <FlatList
                  data={userOrders}
                  renderItem={renderOrderItem}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <Text style={styles.emptyListText}>No recent orders</Text>
                  }
                />
              )
            ) : (
              <Text style={styles.loginPrompt}>
                Login to view your recent orders
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C65200", // Royal Blue for status bar area
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Light blue background
  },
  backgroundImage: {
    height: height / 3,
    width: width,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(198, 82, 0, 0.2)", // Royal Blue with opacity
  },
  overlay: {
    padding: 20,
  },
  overlayText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondOverlayText: {
    color: "#f0f8ff", // Light blue to complement the theme
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff", // Light blue background
  },
  userInfoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4169e1", // Royal Blue
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4169e1", // Royal Blue
  },
  exploreButton: {
    backgroundColor: "#4169e1", // Royal Blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#fff",
    paddingLeft: 10,
    marginLeft: 10,
  },
  branchesButton: {
    backgroundColor: "#4169e1", // Royal Blue
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  registerAndLoginButtons: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  authButton: {
    backgroundColor: "#4169e1", // Royal Blue
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: 20,
    width: Dimensions.get("window").width * 0.42,
  },
  recentOrders: {
    marginTop: 25,
    marginBottom: 15,
  },
  recentOrderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4169e1", // Royal Blue
  },
  orderItem: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#4169e1",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 14,
    color: "#333",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statusPending: {
    backgroundColor: "#ffa500", // Orange
  },
  statusProcessing: {
    backgroundColor: "#4169e1", // Royal Blue
  },
  statusCompleted: {
    backgroundColor: "#32cd32", // Lime Green
  },
  statusCancelled: {
    backgroundColor: "#dc143c", // Crimson
  },
});

export default HalfScreenBackgroundLayout;
