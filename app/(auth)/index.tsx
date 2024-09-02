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
  AppState,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const { width } = Dimensions.get("window");

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    signUpWithEmail();
    router.push("/(drawer)/(tabs)/home");
  };

  const handleLogin = () => {
    router.push("/(auth)/login");
  };

  // async function signUpWithEmail() {
  //   setLoading(true);
  //   const {
  //     data: { session },
  //     error,
  //   } = await supabase.auth.signUp({
  //     email: email,
  //     password: password,
  //   });

  //   if (error) Alert.alert(error.message);
  //   if (!session)
  //     Alert.alert("Please check your inbox for email verification!");
  //   setLoading(false);
  // }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      Alert.alert(signUpError.message);
      setLoading(false);
      return;
    }

    // Insert user details into the users table
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ username: username, email: email }]);

    if (insertError) {
      Alert.alert(insertError.message);
    } else {
      router.push("/(drawer)/(tabs)/home");
    }

    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>CONTINUE</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}>Login</Text>
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

export default SignUpScreen;
