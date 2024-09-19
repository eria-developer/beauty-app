import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { getUserData, updateUserData } from "@/utils/authHelpers";
import { showToast } from "@/utils/toastConfig";
import * as ImagePicker from "expo-image-picker";

const EditProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [dateJoined, setDateJoined] = useState("");
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setProfilePic(userData.profilePicture);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
        setLoyaltyPoints(userData.loyalty_points);
        setDateJoined(new Date(userData.date_joined).toLocaleDateString());
        setLastLogin(new Date(userData.last_login).toLocaleDateString());
      }
    };
    fetchUserData();
  }, []);

  const handleProfilePicSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setProfilePic(pickerResult.uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        profilePicture: profilePic,
      };
      const result = await updateUserData(updatedData);
      if (result) {
        showToast("success", "Success", "Profile updated successfully!");
        router.back();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showToast(
        "error",
        "Error",
        "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={handleProfilePicSelect}
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <AntDesign
                  name="camerao"
                  size={40}
                  color={Colors.light.primary}
                />
                <Text style={styles.profilePicText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#a9a9a9"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#a9a9a9"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Loyalty Points:</Text>
            <Text style={styles.infoValue}>{loyaltyPoints}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Date Joined:</Text>
            <Text style={styles.infoValue}>{dateJoined}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Last Login:</Text>
            <Text style={styles.infoValue}>{lastLogin}</Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>SAVE</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.royalBlue,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.royalBlue,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    padding: 20,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicText: {
    marginTop: 5,
    color: Colors.light.royalBlue,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.royalBlue,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.royalBlue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.rearText,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default EditProfileScreen;
