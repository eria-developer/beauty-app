import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

interface HowItWorksProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const HowItWorksComponent: React.FC<HowItWorksProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <View style={styles.howItWorksCard}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text
          style={styles.infoDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default HowItWorksComponent;

const styles = StyleSheet.create({
  howItWorksCard: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
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
