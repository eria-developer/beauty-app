import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const API_URL = "http://192.168.0.181:5000";

const AddProductServiceScreen = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const filteredCategories = response.data.filter((cat) =>
        type === "product"
          ? cat.name.includes("Products")
          : cat.name.includes("Services")
      );
      setCategories(filteredCategories);
      setCategory(
        filteredCategories.length > 0 ? filteredCategories[0].id.toString() : ""
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "Permission to access camera roll is required!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsImageUploading(true);
        const uploadedImageUrl = await uploadImage(result.assets[0].uri);
        setImage(uploadedImageUrl);
        setIsImageUploading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick or upload image");
      setIsImageUploading(false);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let newItem = {
        categoryId: parseInt(category),
        name,
        description,
        price: parseFloat(price),
        image,
      };

      if (type === "product") {
        newItem.stock = parseInt(stock);
      } else if (type === "service") {
        newItem.duration = parseInt(duration);
      }

      const endpoint = type === "product" ? "/products" : "/services";
      const response = await axios.post(`${API_URL}${endpoint}`, newItem);

      console.log("Added item:", response.data);
      Alert.alert(
        "Success",
        `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
      );

      // Reset form fields
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setDuration("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert("Error", `Failed to add ${type}: ${error.message}`);
    } finally {
      setIsLoading(false);
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
            {isCategoryLoading ? (
              <ActivityIndicator size="small" color={Colors.light.primary} />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.picker}
                >
                  {categories.map((cat) => (
                    <Picker.Item
                      key={cat.id}
                      label={cat.name}
                      value={cat.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {type === "product" && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                placeholder="Enter stock quantity"
                placeholderTextColor={Colors.light.primary}
                keyboardType="numeric"
              />
            </View>
          )}

          {type === "service" && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Enter service duration"
                placeholderTextColor={Colors.light.primary}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
              {isImageUploading ? (
                <ActivityIndicator size="large" color={Colors.light.primary} />
              ) : image ? (
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

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.light.background} />
            ) : (
              <Text style={styles.submitButtonText}>
                Add {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            )}
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
