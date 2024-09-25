import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { API_URL } from "@/constants/Colors";
import SearchInput from "@/components/SearchInput";
import FloatingCartIcon from "@/components/FloatingCart";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

const toggleFavorite = async (productId) => {
  const favorites = await getFavorites();
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productId);
  }
  await saveFavorites(favorites);
  return favorites;
};

const MenuScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [recentProductsLoading, setRecentProductsLoading] = useState(true);
  const [imageLoadingStatus, setImageLoadingStatus] = useState({});
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
    fetchRecentProducts();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const loadedFavorites = await getFavorites();
    setFavorites(loadedFavorites);
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      setCategories(response.data);
      console.log("Fetched categories:", response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
      setIsLoading(false);
    }
  };

  const fetchRecentProducts = async () => {
    setRecentProductsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/products`, {
        params: {
          ordering: "created_at",
        },
      });
      setRecentProducts(response.data.slice(-9));
    } catch (error) {
      console.error("Error fetching recent products:", error);
    } finally {
      setRecentProductsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchCategories(), fetchRecentProducts(), loadFavorites()])
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error("Error refreshing data:", error);
        setRefreshing(false);
      });
  }, []);

  const handleToggleFavorite = async (productId) => {
    try {
      const updatedFavorites = await toggleFavorite(productId);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const renderCategory = ({ item }) => {
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
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.categoryImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image" size={40} color="#c4c4c4" />
          </View>
        )}
        <Text style={styles.categoryName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderRecentProduct = ({ item }) => {
    const imageUrl = item.image ? `${API_URL}${item.image}` : null;
    const isImageLoading =
      imageLoadingStatus[`product_${item.id}`] !== "loaded";
    const isFavorite = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.recentProductCard}
        onPress={() =>
          navigation.navigate("product-details", { productId: item.id })
        }
      >
        <View style={styles.recentProductImageContainer}>
          {imageUrl ? (
            <>
              <Image
                source={{ uri: imageUrl }}
                style={styles.recentProductImage}
                onLoadStart={() =>
                  setImageLoadingStatus((prev) => ({
                    ...prev,
                    [`product_${item.id}`]: "loading",
                  }))
                }
                onLoad={() =>
                  setImageLoadingStatus((prev) => ({
                    ...prev,
                    [`product_${item.id}`]: "loaded",
                  }))
                }
                onError={() =>
                  setImageLoadingStatus((prev) => ({
                    ...prev,
                    [`product_${item.id}`]: "error",
                  }))
                }
              />
              {isImageLoading && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="small" color="#4169e1" />
                </View>
              )}
            </>
          ) : (
            <View style={styles.recentProductPlaceholder}>
              <MaterialIcons name="image" size={24} color="#c4c4c4" />
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={() => handleToggleFavorite(item.id)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={isFavorite ? "#ff6b6b" : "#4169e1"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.recentProductName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.recentProductPrice}>ugx. {item.price}</Text>
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
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <LinearGradient colors={["#4169e1", "#1e3a8a"]} style={styles.header}>
            <Text style={styles.headerTitle}>Discover</Text>
            <Text style={styles.headerSubtitle}>
              Find amazing products and services
            </Text>
          </LinearGradient>

          <View style={styles.searchInputContainer}>
            <SearchInput
              placeholder="Search Products"
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {categoriesLoading ? (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            ) : (
              <FlashList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id.toString()}
                estimatedItemSize={180}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              />
            )}
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Recently Added</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {recentProductsLoading ? (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            ) : (
              <View style={styles.recentProductsGrid}>
                {recentProducts.map((item) => renderRecentProduct({ item }))}
              </View>
            )}
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
    backgroundColor: "#4169e1",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#ffffff",
    opacity: 0.9,
  },
  searchInputContainer: {
    marginTop: -30,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 36,
    paddingHorizontal: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  seeAllText: {
    fontSize: 16,
    color: "#4169e1",
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoryCard: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 50,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  placeholderImage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  recentProductsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recentProductCard: {
    width: "30%",
    aspectRatio: 0.75,
    marginBottom: 15,
    marginHorizontal: "1.5%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  recentProductImageContainer: {
    width: "100%",
    height: "70%",
  },
  recentProductImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  recentProductPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8f0",
  },
  recentProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    textAlign: "center",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  recentProductPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4169e1",
    textAlign: "center",
    marginTop: 4,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 1,
  },
});

export default MenuScreen;
