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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";

const { height, width } = Dimensions.get("window");

const HalfScreenBackgroundLayout = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  const fetchUserOrders = async () => {
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
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    const loggedInn = await isLoggedIn();
    setLoggedIn(loggedInn);
    if (loggedInn) {
      const userInfo = await getUserData();
      setUserData(userInfo);
      await fetchUserOrders();
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
  }, [loggedIn]);

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

  //   return (
  //     <ScrollView
  //       style={styles.container}
  //       refreshControl={
  //         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  //       }
  //     >
  //       <ImageBackground
  //         source={{
  //           uri: "https://img.freepik.com/free-photo/front-view-smiley-woman-holding-hair-products_23-2149635003.jpg?ga=GA1.1.476787416.1724867277&semt=ais_hybrid",
  //         }}
  //         style={styles.backgroundImage}
  //       >
  //         <View style={styles.imageOverlay} />
  //         <View style={styles.overlay}>
  //           <Text style={styles.overlayText}>WELCOME TO</Text>
  //           <Text style={styles.secondOverlayText}>BEAUTY PARLOUR!!</Text>
  //         </View>
  //         <TouchableOpacity
  //           style={styles.startOrderButton}
  //           onPress={() => router.push("/order")}
  //         >
  //           <AntDesign name="Safety" size={20} color={"#fff"} />
  //           <View style={styles.buttonTextContainer}>
  //             <Text style={styles.buttonText}>EXPLORE</Text>
  //           </View>
  //         </TouchableOpacity>
  //       </ImageBackground>

  //       <LinearGradient colors={["white", "#DFB7BF"]} style={styles.background}>
  //         <View style={styles.contentContainer}>
  //           {loggedIn && userData && (
  //             <View style={styles.userInfoContainer}>
  //               <Text style={styles.userInfoText}>User ID: {userData.id}</Text>
  //               <Text style={styles.userInfoText}>Email: {userData.email}</Text>
  //             </View>
  //           )}
  //           <Text style={styles.contentText}>
  //             ORDER FIRST FROM YOUR FAVORITES
  //           </Text>
  //           <TouchableOpacity
  //             style={styles.branchesButton}
  //             onPress={() => router.push("/(drawer)/(tabs)/(order)/")}
  //           >
  //             <Text style={styles.buttonText}>
  //               View All Saloons, Services and Products
  //             </Text>
  //           </TouchableOpacity>

  //           {!loggedIn && (
  //             <View style={styles.registerAndLoginButtons}>
  //               <TouchableOpacity
  //                 style={styles.authButton}
  //                 onPress={() => router.push("/(auth)/login")}
  //               >
  //                 <Text style={styles.buttonText}>LOGIN</Text>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 style={styles.authButton}
  //                 onPress={() => router.push("/(auth)")}
  //               >
  //                 <Text style={styles.buttonText}>REGISTER</Text>
  //               </TouchableOpacity>
  //             </View>
  //           )}

  //           <View style={styles.recentOrders}>
  //             <Text style={styles.recentOrderTitle}>My Recent Orders</Text>
  //             {loggedIn ? (
  //               <FlatList
  //                 data={userOrders}
  //                 renderItem={renderOrderItem}
  //                 keyExtractor={(item) => item.id.toString()}
  //                 ListEmptyComponent={
  //                   <Text style={styles.emptyListText}>
  //                     {loading ? "Loading orders..." : "No recent orders"}
  //                   </Text>
  //                 }
  //               />
  //             ) : (
  //               <Text style={styles.loginPrompt}>
  //                 Login to view your recent orders
  //               </Text>
  //             )}
  //           </View>
  //         </View>
  //       </LinearGradient>
  //     </ScrollView>
  //   );
  // };

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //   },
  //   background: {
  //     flex: 1,
  //   },
  //   backgroundImage: {
  //     height: height / 3,
  //     width: width,
  //     justifyContent: "space-between",
  //     alignItems: "center",
  //     paddingVertical: 20,
  //   },
  //   imageOverlay: {
  //     ...StyleSheet.absoluteFillObject,
  //     backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay to enhance text visibility
  //   },
  //   overlay: {
  //     padding: 20,
  //   },
  //   overlayText: {
  //     color: "white", // Maintain white text for contrast
  //     fontSize: 24,
  //     fontWeight: "bold",
  //     textAlign: "center",
  //   },
  //   secondOverlayText: {
  //     color: Colors.light.primary, // Use primary color for secondary text
  //     fontSize: 20,
  //     fontWeight: "bold",
  //     textAlign: "center",
  //   },
  //   contentContainer: {
  //     flex: 1,
  //     padding: 20,
  //   },
  //   contentText: {
  //     fontSize: 18,
  //     fontWeight: "bold",
  //     marginBottom: 20,
  //     textAlign: "center",
  //     color: "#333", // Darker text for better readability on lighter backgrounds
  //   },
  //   startOrderButton: {
  //     backgroundColor: "#AD2B08", // Maintain vibrant red for emphasis
  //     paddingVertical: 12,
  //     paddingHorizontal: 20,
  //     borderRadius: 8,
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     elevation: 3,
  //     shadowColor: "#000",
  //     shadowOffset: { width: 0, height: 2 },
  //     shadowOpacity: 0.25,
  //     shadowRadius: 3.84,
  //   },
  //   buttonText: {
  //     color: "#fff", // White text on red button
  //     fontWeight: "bold",
  //     fontSize: 16,
  //   },
  //   buttonTextContainer: {
  //     borderLeftWidth: 2,
  //     borderLeftColor: "#fff", // White border for contrast
  //     paddingLeft: 10,
  //     marginLeft: 10,
  //   },
  //   branchesButton: {
  //     backgroundColor: Colors.light.primary, // Use primary color for call-to-action button
  //     paddingHorizontal: 15,
  //     paddingVertical: 12,
  //     borderRadius: 8,
  //     marginVertical: 15,
  //     alignItems: "center",
  //     elevation: 2,
  //     shadowColor: "#000",
  //     shadowOffset: { width: 0, height: 1 },
  //     shadowOpacity: 0.22,
  //     shadowRadius: 2.22,
  //   },
  //   registerAndLoginButtons: {
  //     flexDirection: "row",
  //     marginVertical: 10,
  //     justifyContent: "space-between",
  //   },
  //   authButton: {
  //     backgroundColor: Colors.light.primary, // Primary color for auth buttons
  //     paddingVertical: 12,
  //     borderRadius: 8,
  //     marginVertical: 5,
  //     alignItems: "center",
  //     elevation: 2,
  //     shadowColor: "#000",
  //     shadowOffset: { width: 0, height: 1 },
  //     shadowOpacity: 0.22,
  //     shadowRadius: 2.22,
  //     paddingHorizontal: 20,
  //     width: Dimensions.get("window").width * 0.42,
  //   },
  //   recentOrders: {
  //     marginTop: 25,
  //     marginBottom: 15,
  //   },
  //   recentOrderTitle: {
  //     fontSize: 22,
  //     fontWeight: "bold",
  //     color: Colors.light.primary, // Consistent use of primary color for titles
  //   },
  //   loginPrompt: {
  //     fontSize: 16,
  //     textAlign: "center",
  //     color: "#555", // Neutral tone for login prompts
  //   },
  //   userInfoContainer: {
  //     backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background to make user info stand out
  //     padding: 10,
  //     borderRadius: 8,
  //     marginBottom: 20,
  //   },
  //   userInfoText: {
  //     fontSize: 16,
  //     fontWeight: "bold",
  //     color: Colors.light.primary, // Primary color for user info text
  //   },
  //   orderItem: {
  //     backgroundColor: "#f0f0f0", // Light gray for order items
  //     padding: 10,
  //     marginVertical: 5,
  //     borderRadius: 5,
  //   },
  //   orderItemText: {
  //     fontSize: 14,
  //     color: "#333", // Dark text for readability
  //   },
  //   emptyListText: {
  //     textAlign: "center",
  //     marginTop: 20,
  //     fontSize: 16,
  //     color: "#666", // Slightly lighter tone for empty list text
  //   },
  // });

  // export default HalfScreenBackgroundLayout;

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
            onPress={() => router.push("/order")}
          >
            <AntDesign name="Safety" size={20} color={"#fff"} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonText}>EXPLORE</Text>
            </View>
          </TouchableOpacity>
        </ImageBackground>

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
              <FlatList
                data={userOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    {loading ? "Loading orders..." : "No recent orders"}
                  </Text>
                }
              />
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
    borderColor: "#C65200",
    borderWidth: 1,
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
});

export default HalfScreenBackgroundLayout;