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
import { API_URL } from "@/constants/Colors";
import { showToast } from "@/utils/toastConfig";
import {
  getAccessToken,
  refreshAccessToken,
  getUserId,
} from "@/utils/authHelpers";
import { extractUserIdFromToken } from "@/utils/tokenUtils";
// import { getUserId } from "@/utils/authHelpers";
// import { getAccessToken, refreshAccessToken } from "@/utils/authHelpers";

const AddProductServiceScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("perfumes");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {};

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
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Retrieve the authentication token
      let token = await getAccessToken();

      if (!token) {
        console.log("No token found, attempting to refresh...");
        token = await refreshAccessToken();
      }

      if (!token) {
        throw new Error("Failed to retrieve or refresh authentication token");
      }

      // Retrieve the user ID
      let userId;
      try {
        userId = await getUserId();
      } catch (error) {
        console.error("Error retrieving user ID:", error);
        throw new Error("Failed to retrieve user ID. Please log in again.");
      }

      // Log the data before appending to FormData
      console.log("Data being submitted:");
      console.log("Category:", category);
      console.log("Name:", name);
      console.log("Description:", description);
      console.log("Price:", price);
      console.log("Stock:", stock);
      console.log("Seller:", userId);

      if (image) {
        console.log("Image URI:", image.uri);
      } else {
        console.log("No image selected.");
      }

      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("seller", userId);

      if (image) {
        const imageFile = {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          type: "image/jpeg",
          name: "product_image.jpg",
        };
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${API_URL}/products/products/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Added product:", response.data);
      showToast("success", "Success", "Product added successfully");

      // Reset form fields
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      let errorMessage = "Failed to add product";
      if (error.response && error.response.data) {
        errorMessage += `: ${JSON.stringify(error.response.data)}`;
      } else if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      showToast("error", "Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["white", "#DFB7BF"]} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Add New Service</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter service name"
              placeholderTextColor={Colors.light.primary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your service"
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
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a Category" value="" />
                <Picker.Item label="Consultation" value="consultation" />
                <Picker.Item label="Repair" value="repair" />
                <Picker.Item label="Installation" value="installation" />
              </Picker>
            </View>
          </View>

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

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.light.background} />
            ) : (
              <Text style={styles.submitButtonText}>Add Service</Text>
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
  disabledButton: {},
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
