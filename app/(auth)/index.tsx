import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import Toast from "react-native-toast-message";
import { saveUserData } from "@/utils/authHelpers";
import { showToast } from "@/utils/toastConfig";

const { width } = Dimensions.get("window");

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      showToast("error", "Error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/accounts/register/`, {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2: confirmPassword,
      });

      if (response.data && response.data.data) {
        await saveUserData({
          id: response.data.data.id, // Note: Make sure the API returns an id
          email: response.data.data.email,
          first_name: response.data.data.first_name,
          last_name: response.data.data.last_name,
          access_token: response.data.data.access_token,
          refresh_token: response.data.data.refresh_token,
        });

        showToast(
          "success",
          "Success",
          response.data.message || "Registered successfully!"
        );
        router.replace("/(drawer)/(tabs)/home");
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Registration error details: ", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed!";
      showToast("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
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

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#a9a9a9"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a9a9a9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#a9a9a9"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#4169e1",
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  signUpButton: {
    backgroundColor: "#4169e1",
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
    color: "#4169e1",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
