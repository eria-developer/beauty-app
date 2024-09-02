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
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

const { width } = Dimensions.get("window");

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    console.log("Login pressed");
  };

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
  };

  const handleSignUp = () => {
    router.push("/(auth)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome name="coffee" size={80} color={Colors.light.primary} />
        <Text style={styles.logoText}>CJ's</Text>
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
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account yet? </Text>
        <TouchableOpacity onPress={handleSignUp}>
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
