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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

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

  useEffect(() => {
    console.log("Current user:", user);
  }, [user]);

  const handleImageUpload = async () => {
    try {
      console.log("Starting image upload process");

      if (!user) {
        console.error("User not authenticated");
        Alert.alert("Error", "You must be logged in to upload images.");
        return;
      }

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission result:", permissionResult);

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Picker result:", pickerResult);

      if (pickerResult.canceled) {
        console.log("Image picking cancelled");
        return;
      }

      const uniqueImageName = `${uuid.v4()}.jpg`;
      console.log("Generated unique image name:", uniqueImageName);

      const { data, error } = await supabase.storage
        .from("products")
        .upload(uniqueImageName, {
          uri: pickerResult.assets[0].uri,
          type: "image/jpeg",
          name: uniqueImageName,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        Alert.alert(
          "Upload Error",
          `Error uploading image: ${error.message}\nStatus Code: ${error.statusCode}`
        );
        return;
      }

      console.log("Supabase storage upload result:", data);

      const { data: publicURLData, error: publicURLError } = supabase.storage
        .from("products")
        .getPublicUrl(uniqueImageName);

      if (publicURLError) {
        console.error("Error getting public URL:", publicURLError);
        Alert.alert(
          "URL Error",
          `Error getting public URL: ${publicURLError.message}`
        );
        return;
      }

      console.log("Public URL data:", publicURLData);
      setImage(publicURLData.publicUrl);
      Alert.alert("Success", "Image uploaded successfully");
    } catch (error) {
      console.error("Unexpected error during image upload:", error);
      Alert.alert(
        "Unexpected Error",
        `An unexpected error occurred: ${error.message}`
      );
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Starting submit process");

      const ownerId = user?.id;
      console.log("Owner ID:", ownerId);

      if (!ownerId) {
        console.error("User not logged in");
        Alert.alert("Error", "User not logged in");
        return;
      }

      let newItem;

      if (type === "salon") {
        newItem = {
          name,
          location,
          description: null,
          image: image || null,
          owner: ownerId,
        };
      } else if (type === "product") {
        newItem = {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          image: image || null,
          seller: ownerId,
          created_at: new Date(),
        };
      } else if (type === "service") {
        newItem = {
          name,
          description,
          price: parseFloat(price),
          image: image || null,
          duration: parseInt(duration),
          created_at: new Date(),
        };
      }

      console.log("New item to be inserted:", newItem);

      const { data, error } = await supabase
        .from(
          type === "salon"
            ? "saloons"
            : type === "product"
            ? "products"
            : "services"
        )
        .insert([newItem]);

      if (error) {
        console.error("Supabase insert error:", error);
        Alert.alert("Insert Error", `Error inserting data: ${error.message}`);
        return;
      }

      console.log("Supabase insert result:", data);
      Alert.alert(
        "Success",
        `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
      );

      // Reset form fields here if needed
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setDuration("");
      setCategory("");
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Unexpected error during submit:", error);
      Alert.alert(
        "Unexpected Error",
        `An unexpected error occurred: ${error.message}`
      );
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
