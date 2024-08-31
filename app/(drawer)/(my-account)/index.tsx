import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { User, Mail, Smartphone } from "react-native-feather";
import { profilePicUrl } from "@/assets/data/data";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileInfo}>
        {/* profile picture  */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profilePicUrl }} style={styles.image} />
        </View>

        {/* User details  */}
        <Text style={styles.name}>ERIA JACKSON</Text>
      </View>
      <View style={styles.emailAndPhone}>
        <View style={styles.infoItem}>
          <Mail stroke="black" width={20} height={20} />
          <Text style={styles.infoText}>eriddeveloper@gmail.com</Text>
        </View>
        <View style={styles.infoItem}>
          <Smartphone stroke="black" width={20} height={20} />
          <Text style={styles.infoText}>705077175</Text>
        </View>
      </View>

      {/* change password section  */}
      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={() => router.push("/(drawer)/(my-account)/change-password")}
      >
        <Text style={styles.changePasswordText}>
          Do you want to <Text style={styles.boldText}>change Password?</Text>
        </Text>
      </TouchableOpacity>

      {/* edit profile and delete account */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(drawer)/(my-account)/edit-profile")}
        >
          <Text style={styles.buttonText}>EDIT PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#d8e2dc",
  },
  menuButton: {
    marginRight: 16,
  },
  menuIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInfo: {
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    borderRadius: 100,
    borderColor: Colors.light.primary,
    borderWidth: 3,
    backgroundColor: "#d8e2dc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  image: { borderRadius: 100, height: 150, width: 150 },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  changePasswordButton: {
    marginTop: 16,
  },
  changePasswordText: {
    fontSize: 16,
    textAlign: "center",
    // color: Colors.light.primary,
  },
  boldText: {
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    // fontWeight: "bold",
  },
  emailAndPhone: {
    paddingHorizontal: 30,
  },
});

export default ProfileScreen;
