import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";

const { height, width } = Dimensions.get("window");

const HalfScreenBackgroundLayout = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.freeimages.com/images/large-previews/f7e/hair-care-3-1507938.jpg?fmt=webp&h=350",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.imageOverlay} />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>WELCOME TO</Text>
          <Text style={styles.secondOverlayText}>GLOW-MART!!</Text>
        </View>
        <TouchableOpacity style={styles.startOrderButton}>
          <AntDesign name="Safety" size={20} color={"#fff"} />
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>EXPLORE</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>ORDER FIRST FROM YOUR FAVORITES</Text>
        <TouchableOpacity style={styles.branchesButton}>
          <Text style={styles.buttonText}>View All Product Categories and Services</Text>
        </TouchableOpacity>
        <View style={styles.registerAndLoginButtons}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentOrders}>
          <Text style={styles.recentOrderTitle}>My Recent Orders</Text>
        </View>
        <Text style={styles.loginPrompt}>
          Login for an easy, one tap order again for your recent orders
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: height / 3,
    width: width,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    padding: 20,
  },
  overlayText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondOverlayText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  startOrderButton: {
    backgroundColor: "#AD2B08",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextContainer: {
    borderLeftWidth: 2,
    borderLeftColor: "#fff",
    paddingLeft: 10,
    marginLeft: 10,
  },
  branchesButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  registerAndLoginButtons: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  authButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    paddingHorizontal: 20,
    width: Dimensions.get("window").width * 0.42,
  },
  recentOrders: {
    marginTop: 25,
    marginBottom: 15,
  },
  recentOrderTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default HalfScreenBackgroundLayout;
