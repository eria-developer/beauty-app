import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Colors } from "@/constants/Colors";

const branches = [
  {
    name: "CJ's BOMBO ROAD",
    location: "Bombo Rd, Kampala, Uganda",
    coordinates: "0.3304, 32.5828",
  },
  {
    name: "CJ's KIRA  ROAD",
    location: "Kira Rd, Plot 9A, Kampala, Uganda",
    coordinates: "0.3412, 32.5937",
  },
  {
    name: "CJ's LUGOGO",
    location: "Shoprite Logogo, Kampala, Uganda",
    coordinates: "0.3366, 32.6014",
  },
  {
    name: "CJ's NAKAWA",
    location: "Jinja Rd, Kampala, Uganda",
    coordinates: "0.3355, 32.6176",
  },
  {
    name: "CJ's VICTORIA MALL",
    location: "Berkeley Rd, Entebbe, Uganda",
    coordinates: "0.0566, 32.4820",
  },
];

const AboutUsScreen = () => {
  const router = useRouter();
  const handlePress = (name: string, coordinates: string) => {
    router.push({
      pathname: "/(drawer)/(tabs)/(about-us)/map",
      params: { name, coordinates },
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.ourBranchesContainer}>
          <Text style={styles.ourBranchesText}>OUR BRANCHES</Text>
        </View>
        <View>
          <Text style={styles.contentText}>
            Welcome to Cafe Javas, is a full-service, quick-casual restaurant
            specialized in delivering a relaxed and memorable dining experience.
            We're currently in 12 locations; 8 in Kampala, 1 in Entebbe and 3 in
            Nairobi. Whether in Kampala or Entebbe, you're always close to a
            cafe Javas, thanks to our growing network.You're welcome to drop by
            or call to make your order and we'll be more than happy to serve
            you. Each location features a unique ambience with tasteful décor,
            specially designed for your comfort. To make you feel more at home,
            we've carefully selected a unique theme for each location. We have
            over 300 carefully selected, mouthwatering menu items. Whatever your
            taste, it's well catered for. We value you. That's why you'll always
            be served with excellence by each member of our highly skilled team
            members. Eager to serve you, our experienced wait staff greet you at
            the door and lead you to the table of your choice in the well
            thought out seating arrangement. The rich aroma of freshly ground
            coffee is the handiwork of our skilled baristas, adept in latte art.
            This ensures you get a freshly prepared cup of coffee as the beans
            are roasted on site. To ensure you always enjoy a special dining
            experience, we constantly improve our signature world-class
            innovations. We're growing and may soon open a location closer to
            you. We look forward to serving you, You're more than welcome to
            Find us here. Cafe Javas is part of Mandela Group of companies, the
            parent company to Cafe Javas, City Tyres, City Oil, City Lubes, City
            World, Savers, and Mandela Auto Spare
          </Text>
        </View>

        {/* minimum delivery fees and order  */}
        <View style={styles.minimumFeesAndOrderContainer}>
          <View style={styles.minimumFeesContainer}>
            <Text style={styles.minimumText}>MINIMUM DELIVER FEES:</Text>
            <Text style={styles.minimumFee}>UGX 0</Text>
          </View>

          <View style={styles.minimumFeesContainer}>
            <Text style={styles.minimumText}>MINIMUM ORDER FEES:</Text>
            <Text style={styles.minimumFee}>UGX 25000</Text>
          </View>
        </View>

        {/* Branches  */}
        <View>
          {branches.map((item, index) => (
            <TouchableWithoutFeedback
              onPress={() => handlePress(item.name, item.coordinates)}
              key={index}
            >
              <View style={styles.branchCard}>
                <View style={styles.textContainer}>
                  <Text style={styles.infoTitle}>{item.name}</Text>
                  <Text
                    style={styles.infoDescription}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.location}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <EvilIcons
                    name="location"
                    size={24}
                    color={Colors.light.primary}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  ourBranchesContainer: {
    marginVertical: 20,
  },
  ourBranchesText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  container: {
    marginHorizontal: 10,
  },
  contentText: {
    lineHeight: 30,
    fontSize: 16,
  },
  minimumFeesAndOrderContainer: {
    marginVertical: 20,
  },
  minimumFeesContainer: {
    flexDirection: "row",
    gap: 20,
    marginVertical: 10,
  },
  minimumText: {
    fontSize: 18,
  },
  minimumFee: {
    fontSize: 18,
    color: Colors.light.rearText,
  },
  branchCard: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {},
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.light.rearText,
  },
  infoDescription: {
    fontSize: 13,
    color: "#666",
  },
});
