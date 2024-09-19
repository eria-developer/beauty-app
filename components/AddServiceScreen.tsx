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
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import { showToast } from "@/utils/toastConfig";
import {
  getAccessToken,
  refreshAccessToken,
  getUserId,
} from "@/utils/authHelpers";

const AddServiceScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("error", "Error", "Failed to fetch categories");
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
      let token = await getAccessToken();

      if (!token) {
        console.log("No token found, attempting to refresh...");
        token = await refreshAccessToken();
      }

      if (!token) {
        throw new Error("Failed to retrieve or refresh authentication token");
      }

      let userId;
      try {
        userId = await getUserId();
      } catch (error) {
        console.error("Error retrieving user ID:", error);
        throw new Error("Failed to retrieve user ID. Please log in again.");
      }

      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("duration", duration);
      formData.append("provider", userId);

      if (image) {
        const imageFile = {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          type: "image/jpeg",
          name: "service_image.jpg",
        };
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        `${API_URL}/services/services/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Added service:", response.data);
      showToast("success", "Success", "Service added successfully");

      // Reset form fields
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
      setCategory("");
      setImage(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      let errorMessage = "Failed to add service";
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter service name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your service"
              placeholderTextColor="#999"
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
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            {isCategoryLoading ? (
              <ActivityIndicator size="small" color="#4169e1" />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a Category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Enter service duration"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.uploadedImage}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons name="add-a-photo" size={24} color="#4169e1" />
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
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Service</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: "#f0f8ff",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#4169e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#4169e1",
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: "#4169e1",
    borderRadius: 8,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
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
    color: "#4169e1",
  },
  submitButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default AddServiceScreen;
