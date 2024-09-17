import React, { useState, useEffect } from "react";
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
import { getUserData, logoutUser } from "@/utils/authHelpers";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUserData();
      setUserData(user);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/(drawer)/(tabs)/home");
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    router.push("/edit-profile");
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.profileInfoContainer}>
          <Image
            source={{
              uri: userData.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.userName}>
            {userData.full_name || "User Name"}
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
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="calendar" size={24} color="#4169e1" />
            <Text style={styles.optionText}>My Appointments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="heart" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Favorite Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="card" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Payment Methods</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="notifications" size={24} color="#4169e1" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
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
    backgroundColor: "#4169e1", // Royal Blue for status bar area
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Light blue background
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
});

export default ProfileScreen;
