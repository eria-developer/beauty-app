import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  AppState,
  Alert,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { API_URL } from "@/constants/Colors";
import { saveUserData } from "@/utils/authHelpers";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("Attempting login with email:", email);
      const response = await axios.post(`${API_URL}/accounts/login/`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data) {
        await saveUserData(response.data);
        router.push("/(drawer)/(tabs)/home");
      } else {
        Alert.alert("Login failed", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        Alert.alert(
          "Login failed",
          error.response.data.message ||
            `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        Alert.alert(
          "Login failed",
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        Alert.alert(
          "Login failed",
          `An unexpected error occurred: ${error.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${API_URL}/accounts/login/`, {
  //       email,
  //       password,
  //     });

  //     if (response.data) {
  //       await saveUserData(response.data); // Save the tokens
  //       router.push("/(drawer)/(tabs)/home"); // Redirect after login
  //     } else {
  //       Alert.alert("Login failed", "Invalid email or password");
  //     }
  //   } catch (error) {
  //     // Check if the error has a response (status code not in the 2xx range)
  //     if (error.response) {
  //       Alert.alert(
  //         "Login failed",
  //         error.response.data.message || "An error occurred during login"
  //       );
  //     } else {
  //       Alert.alert("Login failed", "An unexpected error occurred");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  async function signInWithEmail() {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/accounts/login/`, {
        email: email,
        password: password,
      });

      console.log("Login response: ", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Login successful!");
        router.push("/(drawer)/(tabs)/home");
      } else {
        Alert.alert("Login failed", "Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error details: ", error);
      Alert.alert("Error", error.response?.data?.message || "Login failed!");
    }

    setLoading(false);
  }

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
  };

  const handleSignUp = () => {
    router.push("/(auth)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="key" size={80} color={Colors.light.primary} />
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size={"small"} color={"#fff"} />
        ) : (
          <Text style={styles.loginButtonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginTop: 10,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.light.primary,
    fontSize: 14,
  },
  loginButton: {
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
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "#555",
    fontSize: 14,
  },
  signUpLink: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;
