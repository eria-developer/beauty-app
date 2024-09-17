import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingCartIcon from "@/components/FloatingCart";
import axios from "axios";
import { API_URL } from "@/constants/Colors";

const ProductDetailScreen = () => {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const productResponse = await axios.get(
        `${API_URL}/products/products/${productId}/`
      );
      setProduct(productResponse.data);
      const imageUrls = productResponse.data.image
        ? `${API_URL}${productResponse.data.image}`
        : null;
      setImageUrl(imageUrls);
      setSeller(productResponse.data.seller);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    } else if (newQuantity > product.stock) {
      Alert.alert("Quantity Limit", "Cannot exceed available stock.");
    }
  };

  const addToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      const parsedCart = cart ? JSON.parse(cart) : [];

      const existingProductIndex = parsedCart.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingProductIndex !== -1) {
        parsedCart[existingProductIndex].quantity += quantity;
      } else {
        parsedCart.push({
          product: product,
          quantity: quantity,
        });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(parsedCart));
      Alert.alert("Success", "Product added to cart successfully!");
      console.log("Cart updated:", parsedCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      Alert.alert("Error", "Unable to add product to cart.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169e1" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          defaultSource={require("@/assets/images/placeholder.jpg")}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          {seller && (
            <Text style={styles.sellerInfo}>
              Seller: {seller.first_name} {seller.last_name}
            </Text>
          )}
          <Text style={styles.stockInfo}>In Stock: {product.stock}</Text>

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FloatingCartIcon />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1",
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 15,
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  sellerInfo: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  stockInfo: {
    fontSize: 16,
    color: "#4caf50",
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: "#4169e1",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 15,
  },
  addToCartButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
