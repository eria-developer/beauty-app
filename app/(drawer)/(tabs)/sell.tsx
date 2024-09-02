import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

const AddProductServiceScreen = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAuth();

  console.log(user?.id);

  const handleImageUpload = () => {
    console.log("Image upload");
  };

  const handleSubmit = async () => {
    const ownerId = user?.id;

    if (!ownerId) {
      console.error("User not logged in");
      return;
    }

    // Prepare the new item based on the selected type
    let newItem;

    if (type === "salon") {
      newItem = {
        name,
        location,
        description: null,
        image: null,
        owner: ownerId,
      };
    } else if (type === "product") {
      newItem = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image: null,
        seller: ownerId,
        created_at: new Date(),
      };
    } else if (type === "service") {
      newItem = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        created_at: new Date(),
      };
    }

    try {
      const { data, error } = await supabase
        .from(
          type === "salon"
            ? "saloons"
            : type === "product"
            ? "products"
            : "services"
        )
        .insert([newItem]);

      if (error) throw error; // Throw error if any

      console.log(
        `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully:`,
        data
      );
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <LinearGradient colors={["white", "#DFB7BF"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Add New {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Product" value="product" />
                <Picker.Item label="Service" value="service" />
                <Picker.Item label="Salon" value="salon" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={`Enter ${type} name`}
              placeholderTextColor={Colors.light.primary}
            />
          </View>

          {type !== "salon" && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={`Describe your ${type}`}
                placeholderTextColor={Colors.light.primary}
                multiline
                numberOfLines={4}
              />
            </View>
          )}

          {(type === "product" || type === "service") && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="Enter price"
                  placeholderTextColor={Colors.light.primary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={category}
                    onValueChange={setCategory}
                    style={styles.picker}
                  >
                    <Picker.Item label="Perfumes" value="perfumes" />
                    <Picker.Item label="Wigs" value="wigs" />
                    <Picker.Item label="Vaseline" value="vaseline" />
                  </Picker>
                </View>
              </View>
            </>
          )}

          {type === "salon" && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter salon location"
                placeholderTextColor={Colors.light.primary}
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImageUpload}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons
                    name="add-a-photo"
                    size={24}
                    color={Colors.light.rearText}
                  />
                  <Text style={styles.uploadText}>Upload Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.rearText,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.light.primary,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    marginTop: 10,
    color: Colors.light.primary,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddProductServiceScreen;
