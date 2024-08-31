import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Old Password"
          placeholderTextColor={Colors.light.primary}
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          placeholderTextColor={Colors.light.primary}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor={Colors.light.primary}
          value={newPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    paddingVertical: 10,
    fontSize: 16,
  },
  birthdayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  birthdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  birthdayInput: {
    width: width * 0.25,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    color: "#555",
  },
  signUpButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#555",
    fontSize: 14,
  },
  loginLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;
