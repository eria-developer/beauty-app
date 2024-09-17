import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import {
  isLoggedIn,
  getUserData,
  getAuthenticatedAxiosInstance,
  logoutUser,
} from "@/utils/authHelpers";
import { API_URL } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { height, width } = Dimensions.get("window");

const HalfScreenBackgroundLayout = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const loggedInn = await isLoggedIn();
    setLoggedIn(loggedInn);
    if (loggedInn) {
      const userInfo = await getUserData();
      setUserData(userInfo);
      fetchUserOrders();
    }
  };

  const fetchUserOrders = async () => {
    if (!loggedIn) return;

    setLoading(true);
    try {
      const axiosInstance = await getAuthenticatedAxiosInstance();
      const response = await axiosInstance.get(
        `${API_URL}/products/user-orders/`
      );
      setUserOrders(response.data);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      // Handle error (e.g., show an alert)
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemText}>Order #{item.id}</Text>
      <Text style={styles.orderItemText}>
        Date: {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <Text style={styles.orderItemText}>
        Status: {item.is_paid ? "Paid" : "Unpaid"}
      </Text>
    </View>
  );
  return (
    <View style={styles.container}>
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
          style={styles.startOrderButton}
          onPress={() => router.push("/order")}
        >
          <AntDesign name="Safety" size={20} color={"#fff"} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>EXPLORE</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>

      <LinearGradient colors={["white", "#DFB7BF"]} style={styles.background}>
        <View style={styles.contentContainer}>
          {loggedIn && userData && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>User ID: {userData.id}</Text>
              <Text style={styles.userInfoText}>Email: {userData.email}</Text>
            </View>
          )}
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

          {/* login and register buttons  */}
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

          {/* recent orders section */}
          <View style={styles.recentOrders}>
            <Text style={styles.recentOrderTitle}>My Recent Orders</Text>
            {loggedIn ? (
              <FlatList
                data={userOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    {loading ? "Loading orders..." : "No recent orders"}
                  </Text>
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[Colors.light.primary]}
                  />
                }
              />
            ) : (
              <Text style={styles.loginPrompt}>
                Login to view your recent orders
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    color: Colors.light.primary,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  startOrderButton: {
    backgroundColor: "#AD2B08",
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
    backgroundColor: Colors.light.primary,
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
    backgroundColor: Colors.light.primary,
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
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
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
    color: Colors.light.primary,
  },
  orderItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  orderItemText: {
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default HalfScreenBackgroundLayout;
