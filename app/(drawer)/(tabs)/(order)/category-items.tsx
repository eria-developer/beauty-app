// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { supabase } from "@/lib/supabase";

// const CategoryItemsScreen = () => {
//   const [items, setItems] = useState([]);
//   const route = useRoute();
//   const { category } = route.params;

//   useEffect(() => {
//     fetchCategoryItems();
//   }, []);

//   const fetchCategoryItems = async () => {
//     try {
//       // Fetch products
//       const { data: products, error: productsError } = await supabase
//         .from("products")
//         .select("*")
//         .eq("category", "perfumes");

//       if (productsError) throw productsError;

//       // Fetch services
//       const { data: services, error: servicesError } = await supabase
//         .from("services")
//         .select("*")
//         .eq("category", category);

//       if (servicesError) throw servicesError;

//       // Combine and set items
//       setItems([...products, ...services]);
//     } catch (error) {
//       console.error("Error fetching category items:", error);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity style={styles.itemCard}>
//       <Image source={{ uri: item.image }} style={styles.itemImage} />
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemPrice}>${item.price}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{category}</Text>
//       <FlatList
//         data={items}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.listContainer}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   itemCard: {
//     flex: 1,
//     margin: 5,
//     borderRadius: 10,
//     overflow: "hidden",
//     backgroundColor: "#f0f0f0",
//   },
//   itemImage: {
//     width: "100%",
//     height: 150,
//     resizeMode: "cover",
//   },
//   itemInfo: {
//     padding: 10,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   itemPrice: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 5,
//   },
// });

// export default CategoryItemsScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@/constants/Colors";

// const API_URL = "http://192.168.0.181:5000";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { category, categoryId } = route.params;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products?categoryId=${categoryId}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Handle error (e.g., show an alert to the user)
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => {
        /* Navigate to product detail */
      }}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e91e63",
    marginTop: 4,
  },
});

export default CategoryProducts;
