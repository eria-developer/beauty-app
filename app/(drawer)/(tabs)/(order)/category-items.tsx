import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { FlashList } from "@shopify/flash-list";
import SearchInput from "@/components/SearchInput";
import FloatingCartIcon from "@/components/FloatingCart";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { category, categoryId } = route.params;

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/products/search/?category=${categoryId}`
      );
      console.log("Category id:", categoryId);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Handle error (e.g., show an alert to the user)
    }
  };

  const renderProduct = ({ item }) => {
    const imageUrl = item.image;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("product-details", { productId: item.id })
        }
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            onError={(e) =>
              console.log("Product image load error:", e.nativeEvent.error)
            }
            defaultSource={require("@/assets/images/placeholder.jpg")}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image" size={40} color="#c4c4c4" />
          </View>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{category}</Text>
          <Text style={styles.headerSubtitle}>
            Explore our {category.toLowerCase()} selection
          </Text>
        </View>

        {/* Search input */}
        <View style={styles.searchInputContainer}>
          <SearchInput
            placeholder={`Search ${category}`}
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        {/* Products section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Products</Text>
          {products.length > 0 ? (
            <FlashList
              data={products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={4}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            />
          ) : (
            <Text style={styles.noProductsText}>
              No products found in this category.
            </Text>
          )}
        </View>
      </ScrollView>
      <FloatingCartIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff", // Light blue background
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#4169e1", // Royal Blue
    paddingTop: 60,
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
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1", // Royal Blue
    marginBottom: 15,
  },
  productsContainer: {
    paddingVertical: 10,
  },
  productCard: {
    width: (Dimensions.get("window").width - 60) / 2,
    marginRight: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1", // Royal Blue
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e91e63", // Pink
  },
  noProductsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CategoryProducts;
