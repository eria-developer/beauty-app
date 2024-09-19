import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import HowItWorksComponent from "@/components/HowItWorksComponent";
import { getAuthenticatedAxiosInstance } from "@/utils/authHelpers";
import { API_URL } from "@/constants/Colors";

interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  loyalty_points: number;
  date_joined: string;
  last_login: string;
}

const RewardsScreen = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const axiosInstance = await getAuthenticatedAxiosInstance();
      const response = await axiosInstance.get(`${API_URL}/accounts/profile/`);
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  }, [fetchUserProfile]);

  const progressPercentage = userProfile
    ? (userProfile.loyalty_points / 1000000) * 100
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome to</Text>
            <Text style={styles.rewardsTitle}>Rewards</Text>
            <Text style={styles.welcomeDescription}>
              Introducing Rewards! Our way to say "Thank you" for using our app.
            </Text>
          </View>

          <View style={styles.pointsCard}>
            <Text style={styles.pointsTitle}>Points Earned</Text>
            <Text style={styles.pointsCount}>
              {userProfile ? userProfile.loyalty_points || "0" : "0"} / 10000
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
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
                  color="#4169e1"
                />
              }
            />

            <HowItWorksComponent
              title="Validity of Points"
              description="Points credited has an expiry of 1 year from the date that is credited."
              icon={
                <MaterialCommunityIcons
                  name="clock-time-eight-outline"
                  size={18}
                  color="#4169e1"
                />
              }
            />

            <HowItWorksComponent
              title="Points Transfer"
              description="Earned reward points cannot be transferred to any third party."
              icon={
                <MaterialCommunityIcons
                  name="account-switch-outline"
                  size={18}
                  color="#4169e1"
                />
              }
            />

            <HowItWorksComponent
              title="Redeem Points"
              description="On CART before Check out, You can enter the points you want to redeem."
              icon={
                <MaterialCommunityIcons
                  name="shopping-outline"
                  size={18}
                  color="#4169e1"
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
                  color="#4169e1"
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "#4169e1",
    // marginBottom: -20,
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
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: "#4169e1",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 16,
    color: "#ffffff",
  },
  rewardsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ffffff",
  },
  welcomeDescription: {
    fontSize: 14,
    color: "#ffffff",
  },
  pointsCard: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 30,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pointsTitle: {
    color: "#4169e1",
    fontSize: 16,
    marginBottom: 8,
  },
  pointsCount: {
    color: "#4169e1",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#4169e150",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4169e1",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4169e1",
  },
  howItWorksTitleContainer: {
    paddingTop: 17,
  },
});

export default RewardsScreen;
