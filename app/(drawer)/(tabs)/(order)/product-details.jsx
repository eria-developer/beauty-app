// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import axios from "axios";
// import { API_URL } from "@/constants/Colors";
// import { MaterialIcons } from "@expo/vector-icons";
// import FloatingCartIcon from "@/components/FloatingCart";

// const ProductDetailScreen = () => {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const route = useRoute();
//   const { productId } = route.params;

//   useEffect(() => {
//     fetchProductDetails();
//   }, [productId]);

//   const fetchProductDetails = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/products/products/${productId}/`
//       );
//       setProduct(response.data);
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = () => {
//     // Implement add to cart functionality here
//     console.log("Add to cart:", product.id);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4169e1" />
//       </View>
//     );
//   }

//   if (!product) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Product not found</Text>
//       </View>
//     );
//   }

//   return (
// <View style={styles.container}>
//   <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <Image
//           source={{ uri: `${API_URL}${product.image}` }}
//           style={styles.productImage}
//           defaultSource={require("@/assets/images/placeholder.jpg")}
//         />
//         <View style={styles.detailsContainer}>
//           <Text style={styles.productName}>{product.name}</Text>
//           <Text style={styles.productPrice}>${product.price}</Text>
//           <Text style={styles.productDescription}>{product.description}</Text>
//           <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
//             <Text style={styles.addToCartButtonText}>Add to Cart</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       <FloatingCartIcon />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f8ff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorText: {
//     fontSize: 18,
//     color: "red",
//   },
//   productImage: {
//     width: "100%",
//     height: 300,
//     resizeMode: "cover",
//   },
//   detailsContainer: {
//     padding: 20,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#4169e1",
//     marginBottom: 10,
//   },
//   productPrice: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#e91e63",
//     marginBottom: 15,
//   },
//   productDescription: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 20,
//   },
//   addToCartButton: {
//     backgroundColor: "#4169e1",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   addToCartButtonText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default ProductDetailScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import FloatingCartIcon from "@/components/FloatingCart";

const ProductDetailScreen = () => {
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
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
      console.log(productResponse.data.seller);
      const imageUrls = productResponse.data.image
        ? `${API_URL}${productResponse.data.image}`
        : null;
      setImageUrl(imageUrls);

      // Fetch seller details
      //   const sellerResponse = await axios.get(
      //     `${API_URL}/users/${productResponse.data.seller}/`
      //   );
      setSeller(productResponse.data.seller);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    // Implement add to cart functionality here
    console.log("Add to cart:", product.id);
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
