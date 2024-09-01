// import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
// import React, { useState } from "react";
// import { Colors } from "@/constants/Colors";
// import { LinearGradient } from "expo-linear-gradient";
// import SearchInput from "@/components/SearchInput";
// import { FlashList } from "@shopify/flash-list";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import SearchInput from "@/components/SearchInput";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingCartIcon from "@/components/FloatingCart";

const MenuScreen = () => {
  const [searchInput, setSearchInput] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const containerMargin = 10;

  // data for top items
  const topData = [
    {
      id: 1,
      name: "Top Saloons",
      image:
        "https://img.freepik.com/free-photo/latino-hair-salon-owner-taking-care-client_23-2150286070.jpg?t=st=1725195028~exp=1725198628~hmac=efa6a62f3fe12796b386ca7f1ccb69b6e2c0e6219b3534e2eb87d87a16583097&w=996",
    },
    {
      id: 2,
      name: "Top Products",
      image:
        "https://img.freepik.com/free-photo/small-plant-near-various-cosmetics-bottles_23-2147787958.jpg?t=st=1725195088~exp=1725198688~hmac=40a40b24ec0a9f4960ebbce68c6ec100ed6b43cc075efb42e807fd2b3482660f&w=996",
    },
    {
      id: 3,
      name: "Top Saloons",
      image:
        "https://img.freepik.com/free-photo/bottle-perfume-with-blue-top-that-says-perfume_1340-37998.jpg?t=st=1725195268~exp=1725198868~hmac=d529fd281df3d82988d0c090abfe6760b3e8466ec4e3f8f76659ba2b979ac923&w=740",
    },
    {
      id: 4,
      name: "Top Saloons",
      image:
        "https://img.freepik.com/free-photo/latino-hair-salon-owner-taking-care-client_23-2150286070.jpg?t=st=1725195028~exp=1725198628~hmac=efa6a62f3fe12796b386ca7f1ccb69b6e2c0e6219b3534e2eb87d87a16583097&w=996",
    },
    {
      id: 5,
      name: "Top Products",
      image:
        "https://img.freepik.com/free-photo/small-plant-near-various-cosmetics-bottles_23-2147787958.jpg?t=st=1725195088~exp=1725198688~hmac=40a40b24ec0a9f4960ebbce68c6ec100ed6b43cc075efb42e807fd2b3482660f&w=996",
    },
    {
      id: 6,
      name: "Top Saloons",
      image:
        "https://img.freepik.com/free-photo/bottle-perfume-with-blue-top-that-says-perfume_1340-37998.jpg?t=st=1725195268~exp=1725198868~hmac=d529fd281df3d82988d0c090abfe6760b3e8466ec4e3f8f76659ba2b979ac923&w=740",
    },
  ];

  //data for featured proucts
  const featuredProductsData = [
    {
      name: "Perfumes",
      image:
        "https://img.freepik.com/free-photo/bottle-perfume-with-purple-orange-background_1340-38051.jpg?ga=GA1.1.476787416.1724867277&semt=ais_hybrid",
    },
    {
      name: "Cosmetics",
      image:
        "https://img.freepik.com/free-photo/creative-display-makeup-products_23-2150063088.jpg?t=st=1725197342~exp=1725200942~hmac=0c92b67a30e5d71ab52b08ffbc1dddfdc074a5d84df08fc0e30bfa3da6928c30&w=826",
    },
    {
      name: "Wigs",
      image:
        "https://img.freepik.com/free-photo/black-woman-touches-her-curly-hair_633478-2354.jpg?t=st=1725197139~exp=1725200739~hmac=7a8bbd08994c54d8a935b0cf6455e7a4aab130937651bd3771e55a6ba936fe90&w=996",
    },
    {
      name: "Pedicure",
      image:
        "https://img.freepik.com/free-photo/pedicure-process-home-salon-pedicure-foot-care-treatment-nail-process-professional-pedicures-master-blue-gloves-make-pedicure_343596-1601.jpg?t=st=1725197472~exp=1725201072~hmac=e60ce816cee17d969b35c0cdef91e19fa6878b911bfac8ceb2dd439c6b478b55&w=996",
    },
  ];

  // data for recommended products and services
  const recommendedData = [
    {
      name: "Hair Treatment",
      image:
        "https://img.freepik.com/free-photo/young-woman-getting-hair-care-treatment_23-2148850132.jpg?t=st=1725196341~exp=1725199941~hmac=08b3d3d4059ef74d947f5df5cf2a7c8b6824859c5826ea95e42399ba1a4b05ab&w=996",
    },
    {
      name: "Nail Art",
      image:
        "https://img.freepik.com/free-photo/close-up-hand-with-nail-art_23-2148217851.jpg?t=st=1725197342~exp=1725200942~hmac=7fdf1b0850f6a79e2ac9e22dcbf9a98d65b687b49718c3b7a8983be457bede5a&w=996",
    },
    {
      name: "Massage Therapy",
      image:
        "https://img.freepik.com/free-photo/massage-therapist-work-with-woman-body-spa-salon_23-2148217853.jpg?t=st=1725197342~exp=1725200942~hmac=0c92b67a30e5d71ab52b08ffbc1dddfdc074a5d84df08fc0e30bfa3da6928c30&w=996",
    },
  ];

  // function to render the top items
  const renderTopData = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  // render featured categories
  const renderFeaturedCategory = ({ item }) => (
    <View style={styles.featuredCategoryCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.featuredCategoryImage}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
        style={styles.featuredCategoryGradient}
      >
        <Text style={styles.featuredCategoryText}>{item.name}</Text>
      </LinearGradient>
    </View>
  );

  // render recomended items
  const renderRecommendedItem = ({ item }) => (
    <View style={styles.recommendedItemCard}>
      <Image source={{ uri: item.image }} style={styles.recommendedItemImage} />
      <Text style={styles.recommendedItemText}>{item.name}</Text>
    </View>
  );

  return (
    // <SafeAreaView style={styles.safeArea}>
    <LinearGradient colors={["#DFB7BF", "white"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>
              Find cool products and services that fit your{" "}
              <Text style={styles.highlightText}>style</Text>
            </Text>
          </View>

          {/* Search input */}
          <View style={styles.searchInput}>
            <SearchInput
              placeholder="Search Products"
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>

          {/* Promo image */}
          <View style={styles.promoContainer}>
            <Image
              source={require("@/assets/images/flash.jpg")}
              style={[
                styles.promoImage,
                { width: screenWidth - containerMargin * 2 },
              ]}
              alt="Promo image"
            />
          </View>

          {/* Top items section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Top Picks</Text>
            <FlashList
              data={topData}
              renderItem={renderTopData}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={6}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topItemsContainer}
            />
          </View>

          {/* Featured categories section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Featured Categories</Text>
            <FlashList
              data={featuredProductsData}
              renderItem={renderFeaturedCategory}
              keyExtractor={(item) => item.name}
              estimatedItemSize={4}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredCategoriesContainer}
            />
          </View>
        </View>
      </ScrollView>
      <FloatingCartIcon />
    </LinearGradient>
    // </SafeAreaView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.text,
  },
  highlightText: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  searchInput: {
    marginBottom: 20,
  },
  promoContainer: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  promoImage: {
    height: 180,
    borderRadius: 12,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 15,
  },
  topItemsContainer: {
    paddingVertical: 10,
  },
  itemContainer: {
    marginRight: 20,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  itemText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  featuredCategoriesContainer: {
    paddingVertical: 10,
  },
  featuredCategoryCard: {
    width: 160,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredCategoryImage: {
    width: "100%",
    height: "100%",
  },
  featuredCategoryGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  featuredCategoryText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
