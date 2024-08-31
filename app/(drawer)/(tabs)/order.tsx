import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import SearchInput from "@/components/SearchInput";

const MenuScreen = () => {
  const [searchInput, setSearchInput] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const containerMargin = 10; 

  return (
    <LinearGradient colors={["#DFB7BF", "white"]} style={styles.background}>
      <View style={styles.container}>
        {/* upper text  container*/}
        <View style={styles.upperTextContainer}>
          <Text style={styles.upperText}>Find Cool products and Services</Text>
          <Text style={styles.upperText}>
            Fit your <Text style={styles.upperTextUnder}>Style</Text>
          </Text>
        </View>

        {/* search input  */}
        <View style={styles.searchInput}>
          <SearchInput
            placeholder="Search Products"
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        {/* promo image  */}
        <View>
          <Image
            source={require("@/assets/images/flash.jpg")}
            style={[styles.image, { width: screenWidth - containerMargin * 2 }]}
            alt="Promo image"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 15,
    flex: 1,
  },
  background: {
    flex: 1,
  },
  upperTextContainer: {},
  upperText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  upperTextUnder: {
    color: Colors.light.primary,
    fontSize: 24,
  },
  searchInput: {
    marginVertical: 20,
  },
  image: {
    height: 100,
    borderRadius: 6,
  },
});
