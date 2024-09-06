import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

const CategoryItemsScreen = () => {
  const [items, setItems] = useState([]);
  const route = useRoute();
  const { category } = route.params;

  useEffect(() => {
    fetchCategoryItems();
  }, []);

  const fetchCategoryItems = async () => {
    try {
      // Fetch products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("category", "perfumes");

      if (productsError) throw productsError;

      // Fetch services
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("category", category);

      if (servicesError) throw servicesError;

      // Combine and set items
      setItems([...products, ...services]);
    } catch (error) {
      console.error("Error fetching category items:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  itemImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  itemInfo: {
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
});

export default CategoryItemsScreen;
