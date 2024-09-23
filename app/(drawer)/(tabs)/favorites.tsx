import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = width / 2 - 24; // 2 columns with 16px horizontal padding

const FavoriteScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadFavorites = useCallback(async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      const parsedFavorites = favoritesData ? JSON.parse(favoritesData) : [];
      const favoriteProducts = await Promise.all(
        parsedFavorites.map(async (id) => {
          const response = await axios.get(
            `${API_URL}/products/products/${id}`
          );
          return response.data;
        })
      );
      setFavorites(favoriteProducts);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation, loadFavorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (productId) => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      const parsedFavorites = favoritesData ? JSON.parse(favoritesData) : [];
      const updatedFavorites = parsedFavorites.filter((id) => id !== productId);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites((prevFavorites) =>
        prevFavorites.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  }, []);

  const renderFavoriteItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.itemCard}
          onPress={() =>
            navigation.navigate("product-details", { productId: item.id })
          }
        >
          <Image
            source={{ uri: `${API_URL}${item.image}` }}
            style={styles.itemImage}
          />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <Ionicons name="close-circle" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    ),
    [navigation, removeFavorite]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient colors={["#4169E1", "#1E3A8A"]} style={styles.header}>
        <Text style={styles.headerTitle}>Your Favorites</Text>
      </LinearGradient> */}
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#4169E1" />
          <Text style={styles.emptyText}>Your favorites list is empty</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("(drawer)/(tabs)/(order)/")}
          >
            <Text style={styles.exploreButtonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4169E1",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: "#4A5568",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FavoriteScreen;
