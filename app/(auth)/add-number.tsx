import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const AddNumberScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+256");

  const handleAddNumber = () => {
    console.log("Add number pressed");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <AntDesign name="phone" size={60} color={Colors.light.primary} />
        <Text style={styles.headerText}>Add Your Phone Number</Text>
        <Text style={styles.subHeaderText}>
          We'll send you a verification code to confirm your number
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.phoneInputContainer}>
          <TextInput
            style={styles.countryCodeInput}
            value={countryCode}
            onChangeText={setCountryCode}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.phoneInput}
            placeholder="Your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.addNumberButton}
        onPress={handleAddNumber}
      >
        <Text style={styles.addNumberButtonText}>SEND VERIFICATION CODE</Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 30,
  },
  phoneInputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
  },
  countryCodeInput: {
    flex: 2,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  phoneInput: {
    flex: 8,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  addNumberButton: {
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
  addNumberButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  termsText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 12,
  },
});

export default AddNumberScreen;
