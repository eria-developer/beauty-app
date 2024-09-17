import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import { FlashList } from "@shopify/flash-list";
import FloatingCartIcon from "@/components/FloatingCart";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const router = useRouter();

const MenuScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const screenWidth = Dimensions.get("window").width;
  const containerMargin = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      setCategories(response.data);
      console.log("Fetched categories:", response.data); // Log the categories to the console
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategory = ({ item }) => {
    // Check if the image is a relative path and prepend the API_URL
    const imageUrl = item.image ? `${API_URL}${item.image}` : null;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() =>
          navigation.navigate("category-items", {
            category: item.name,
            categoryId: item.id,
          })
        }
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.categoryImage}
              onError={(e) =>
                console.log("Image load error:", e.nativeEvent.error)
              }
              defaultSource={require("@/assets/images/placeholder.jpg")}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="image" size={40} color="#c4c4c4" />
            </View>
          )}
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>
              Find amazing products and services
            </Text>
          </View>

          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <SearchInput
              placeholder="Search Products"
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>

          {/* Categories section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlashList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={150}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            />
          </View>
        </ScrollView>
        <FloatingCartIcon />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4169e1", // Royal Blue for status bar area
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Light blue background
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#4169e1", // Royal Blue
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#ffffff",
    opacity: 0.8,
  },
  searchInputContainer: {
    marginTop: -25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionContainer: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1", // Royal Blue
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingVertical: 10,
  },
  categoryCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  placeholderImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1", // Royal Blue
    textAlign: "center",
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff", // Light blue background
  },
});

export default MenuScreen;
