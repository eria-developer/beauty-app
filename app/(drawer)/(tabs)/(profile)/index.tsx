import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { logoutUser, isLoggedIn, getAccessToken } from "@/utils/authHelpers";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { useAuth } from "@/providers/AuthProvider";

const ProfileScreen = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    const loggedIn = await isLoggedIn();
    setIsUserLoggedIn(loggedIn);
    if (loggedIn) {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`${API_URL}/accounts/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        // console.log("USer", response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Handle error (e.g., show error message to user)
      }
    }
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  // console.log("USer", user);

  const handleLogout = async () => {
    await logoutUser();
    setIsUserLoggedIn(false);
    setUserData(null);
    router.replace("/(drawer)/(tabs)/home");
  };

  const handleEditProfile = () => {
    router.push("edit-profile");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  const handleNavigation = (screen: string) => {
    router.push(screen);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isUserLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInText}>
              You need to be logged in to access this screen.
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.profileInfoContainer}>
          <Image
            source={{
              uri:
                userData.profile_picture || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>
            {`${userData.first_name} ${userData.last_name}` || "User Name"}
          </Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          {userData.role === "admin" && (
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() =>
                handleNavigation("/(drawer)/(tabs)/(profile)/(received-orders)")
              }
            >
              <Ionicons name="list" size={24} color="#4169e1" />
              <Text style={styles.optionText}>Received Orders</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => handleNavigation("/(drawer)/(tabs)/favorites")}
          >
            <Ionicons name="heart" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Favorites</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.optionItem}
            onPress={() =>
              handleNavigation("/(drawer)/(tabs)/(profile)/(my-products)/")
            }
          >
            <Ionicons name="cube" size={24} color="#4169e1" />
            <Text style={styles.optionText}>My Products</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() =>
              handleNavigation("/(drawer)/(tabs)/(profile)/notifications")
            }
          >
            <Ionicons name="notifications" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() =>
              handleNavigation("/(drawer)/(tabs)/(profile)/settings")
            }
          >
            <Ionicons name="settings" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <AntDesign name="logout" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4169e1",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  header: {
    backgroundColor: "#4169e1",
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileInfoContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#4169e1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  optionsContainer: {
    padding: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4169e1",
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
