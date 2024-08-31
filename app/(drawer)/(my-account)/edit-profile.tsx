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
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const EditProfileScreen = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");


  const handleProfilePicSelect = () => {
    console.log("Select profile pic");
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.profilePicContainer}
        onPress={handleProfilePicSelect}
      >
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.profilePicPlaceholder}>
            <AntDesign name="camerao" size={40} color={Colors.light.primary} />
            <Text style={styles.profilePicText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>SAVE</Text>
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

export default EditProfileScreen;
