import HowItWorksComponent from "@/components/HowItWorksComponent";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "@/constants/Colors";

const RewardsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to</Text>
          <Text style={styles.rewardsTitle}>Rewards</Text>
          <Text style={styles.welcomeDescription}>
            Introducing Rewards! Our way to say "Thank you" for using our app.
          </Text>
        </View>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Points Earned</Text>
          <Text style={styles.pointsCount}>0 / 10,00,000</Text>
          <View style={styles.progressBar} />
        </View>

        <View>
          <View style={styles.howItWorksTitleContainer}>
            <Text style={styles.sectionTitle}>How it works</Text>
          </View>

          <HowItWorksComponent
            title="Earn Points"
            description="You can Earn Points on every order."
            icon={
              <MaterialCommunityIcons
                name="cash-check"
                size={18}
                color={Colors.light.rearText}
              />
            }
          />

          <HowItWorksComponent
            title="Validity of Points"
            description=" Points credited has an expiry of 1 year from the date that is
              credited."
            icon={
              <MaterialCommunityIcons
                name="clock-time-eight-outline"
                size={18}
                color={Colors.light.rearText}
              />
            }
          />

          <HowItWorksComponent
            title="Points Transfer"
            description=" Earned reward points cannot be transferred to any third party."
            icon={
              <MaterialCommunityIcons
                name="account-switch-outline"
                size={18}
                color={Colors.light.rearText}
              />
            }
          />

          <HowItWorksComponent
            title="Redeem Points"
            description="On CART before Check out, You can enter the points you want to
                redeem."
            icon={
              <MaterialCommunityIcons
                name="shopping-outline"
                size={18}
                color={Colors.light.rearText}
              />
            }
          />

          <HowItWorksComponent
            title="Credits on your Phone Number"
            description="Points credited basis the phone number"
            icon={
              <MaterialCommunityIcons
                name="wallet-outline"
                size={18}
                color={Colors.light.rearText}
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  welcomeCard: {
    backgroundColor: "#ffd700",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  welcomeTitle: {
    fontSize: 16,
  },
  rewardsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 14,
  },
  pointsCard: {
    backgroundColor: Colors.light.rearText,
    paddingHorizontal: 16,
    paddingVertical: 30,
    margin: 16,
    borderRadius: 8,
  },
  pointsTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 8,
  },
  pointsCount: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#ffffff50",
    borderRadius: 2,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.light.rearText,
  },
  infoItem: {
    marginBottom: 16,
  },
  howItWorksTitleContainer: {
    paddingHorizontal: 30,
    paddingTop: 17,
  },
});

export default RewardsScreen;
