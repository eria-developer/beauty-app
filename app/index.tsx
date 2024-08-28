import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Button";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/front-view-smiley-woman-holding-hair-products_23-2149635003.jpg?t=st=1724820809~exp=1724824409~hmac=c8957e39013a39fc4e6aaa5161bc45168ae15a7b376d280345db2539a2407321&w=740",
        }}
        style={styles.image}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        style={styles.gradient}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.heroText}>
            <Text style={styles.highlightedText}>Your Beauty Shopping </Text>
            MarketPlace for Everything
          </Text>
          <Text style={styles.subHeroText}>
            Join thousands of salons and beauty enthusiasts transforming their
            experience with our platform. Salons can showcase their best, and
            users can discover, book, and buy with ease!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Let's get started"
            onPress={() => router.push("/(drawer)/notifications")}
          />
        </View>
        <Text style={styles.alreadyHaveAccountText}>
          Already have an account?{" "}
          <Text style={styles.signIn}>
            <Link href={"/(auth)"}>Sign in</Link>
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LandingScreen;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  image: {
    height: height * 0.7,
    width: width,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heroText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: Colors.light.text,
  },
  highlightedText: {
    color: Colors.light.primary,
  },
  subHeroText: {
    color: Colors.light.subText,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alreadyHaveAccountText: {
    textAlign: "center",
    fontSize: 14,
    color: Colors.light.text,
  },
  signIn: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
});
