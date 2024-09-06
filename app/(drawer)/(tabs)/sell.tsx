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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import NetInfo from "@react-native-community/netinfo";
import { randomUUID } from "expo-crypto";
import { decode } from "base-64";

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

  // useEffect(() => {
  //   console.log("Current user:", user);
  // }, [user]);

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
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImage = async (uri) => {
    console.log("Starting avatar upload process");
    try {
      if (!uri?.startsWith("file://") && Platform.OS !== "web") {
        console.error("Invalid file URI");
        return null;
      }

      // let base64Image;
      // if (Platform.OS === "web") {
      //   const response = await fetch(uri);
      //   const blob = await response.blob();
      //   base64Image = await new Promise((resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.onload = () => resolve(reader.result.split(",")[1]);
      //     reader.onerror = (error) => reject(error);
      //     reader.readAsDataURL(blob);
      //   });
      // } else {
      let base64Image = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // }

      const fileName = `product-${randomUUID()}.jpg`;
      const contentType = "image/jpeg";

      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, decode(base64Image), { contentType });

      if (error) {
        console.error("Supabase storage error:", error);
        throw error;
      }
      console.log("File uploaded successfully, data:", data);

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      return null;
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     console.log("Starting submit process");

  //     const ownerId = user?.id;
  //     console.log("Owner ID:", ownerId);

  //     if (!ownerId) {
  //       console.error("User not logged in");
  //       Alert.alert("Error", "User not logged in");
  //       return;
  //     }

  //     let newItem;

  //     if (type === "salon") {
  //       newItem = {
  //         name,
  //         location,
  //         description: null,
  //         image: image || null,
  //         owner: ownerId,
  //       };
  //     } else if (type === "product") {
  //       newItem = {
  //         name,
  //         description,
  //         price: parseFloat(price),
  //         stock: parseInt(stock),
  //         image: image || null,
  //         seller: ownerId,
  //         created_at: new Date(),
  //         category: category,
  //       };
  //     } else if (type === "service") {
  //       newItem = {
  //         name,
  //         description,
  //         price: parseFloat(price),
  //         image: image || null,
  //         duration: parseInt(duration),
  //         created_at: new Date(),
  //         // category: category,
  //       };
  //     }

  //     console.log("New item to be inserted:", newItem);

  //     const { data, error } = await supabase
  //       .from(
  //         type === "salon"
  //           ? "saloons"
  //           : type === "product"
  //           ? "products"
  //           : "services"
  //       )
  //       .insert([newItem]);

  //     if (error) {
  //       console.error("Supabase insert error:", error);
  //       Alert.alert("Insert Error", `Error inserting data: ${error.message}`);
  //       return;
  //     }

  //     console.log("Supabase insert result:", data);
  //     Alert.alert(
  //       "Success",
  //       `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`
  //     );

  //     // Reset form fields here if needed
  //     setName("");
  //     setDescription("");
  //     setPrice("");
  //     setStock("");
  //     setDuration("");
  //     setCategory("");
  //     setLocation("");
  //     setImage(null);
  //   } catch (error) {
  //     console.error("Unexpected error during submit:", error);
  //     Alert.alert(
  //       "Unexpected Error",
  //       `An unexpected error occurred: ${error.message}`
  //     );
  //   }
  // };

  const handleSubmit = async () => {
    try {
      if (!user?.id) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          throw new Error("Failed to upload image");
        }
      }

      let newItem;

      if (type === "salon") {
        newItem = {
          name,
          location,
          description: null,
          image: imageUrl,
          owner: user.id,
        };
      } else if (type === "product") {
        newItem = {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          image: imageUrl,
          seller: user.id,
          created_at: new Date(),
          category: category,
        };
      } else if (type === "service") {
        newItem = {
          name,
          description,
          price: parseFloat(price),
          image: imageUrl,
          duration: parseInt(duration),
          created_at: new Date(),
        };
      }

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
        throw error;
      }

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
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Alert.alert("Error", `Failed to add ${type}: ${error.message}`);
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
            <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
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

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Alert,
//   Platform,
// } from "react-native";
// import { Colors } from "@/constants/Colors";
// import { MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/providers/AuthProvider";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import { randomUUID } from "expo-crypto";
// import { decode } from "base-64";

// const AddSalonScreen = () => {
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState(null);
//   const { user } = useAuth();

//   const pickImage = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission Denied",
//           "Permission to access camera roll is required!"
//         );
//         return;
//       }

//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       });

//       if (!result.canceled && result.assets && result.assets[0]) {
//         setImage(result.assets[0].uri);
//         console.log("Image picked:", result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error("Error picking image:", error);
//       Alert.alert("Error", "Failed to pick image");
//     }
//   };

//   const uploadImage = async (uri) => {
//     console.log("Starting image upload process");
//     try {
//       if (!uri) {
//         throw new Error("No image URI provided");
//       }

//       let file;
//       if (Platform.OS === "web") {
//         const response = await fetch(uri);
//         file = await response.blob();
//       } else {
//         const fileInfo = await FileSystem.getInfoAsync(uri);
//         file = {
//           uri: fileInfo.uri,
//           type: `image/${uri.split(".").pop()}`,
//           name: `salon-${randomUUID()}.${uri.split(".").pop()}`,
//         };
//       }

//       const fileName =
//         file.name || `salon-${randomUUID()}.${uri.split(".").pop()}`;
//       const contentType = file.type || "image/jpeg";

//       console.log(
//         `Uploading to bucket: products, fileName: ${fileName}, contentType: ${contentType}`
//       );
//       const { data, error } = await supabase.storage
//         .from("products")
//         .upload(fileName, file, { contentType });

//       if (error) {
//         console.error("Supabase storage error:", error);
//         throw error;
//       }
//       console.log("File uploaded successfully, data:", data);

//       const { data: publicUrlData, error: publicUrlError } = supabase.storage
//         .from("products")
//         .getPublicUrl(fileName);

//       if (publicUrlError) {
//         console.error("Error getting public URL:", publicUrlError);
//         throw publicUrlError;
//       }

//       console.log("Public URL:", publicUrlData.publicUrl);
//       return publicUrlData.publicUrl;
//     } catch (error) {
//       console.error("Error in uploadImage:", error);
//       throw error; // Rethrow to handle in the calling function
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!user?.id) {
//         Alert.alert("Error", "User not logged in");
//         return;
//       }

//       let imageUrl = null;
//       if (image) {
//         imageUrl = await uploadImage(image);
//         if (!imageUrl) {
//           throw new Error("Failed to upload image");
//         }
//       }

//       const newSalon = {
//         name,
//         location,
//         image: imageUrl,
//         owner: user.id,
//       };

//       console.log("Inserting new salon:", newSalon);
//       const { data, error } = await supabase.from("saloons").insert([newSalon]);

//       if (error) {
//         throw error;
//       }

//       console.log("Salon added successfully:", data);
//       Alert.alert("Success", "Salon added successfully");

//       // Reset form fields
//       setName("");
//       setLocation("");
//       setImage(null);
//     } catch (error) {
//       console.error("Error in handleSubmit:", error);
//       Alert.alert("Error", `Failed to add salon: ${error.message}`);
//     }
//   };

//   return (
//     <LinearGradient colors={["white", "#DFB7BF"]} style={styles.background}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Add New Salon</Text>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Name</Text>
//             <TextInput
//               style={styles.input}
//               value={name}
//               onChangeText={setName}
//               placeholder="Enter salon name"
//               placeholderTextColor={Colors.light.primary}
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Location</Text>
//             <TextInput
//               style={styles.input}
//               value={location}
//               onChangeText={setLocation}
//               placeholder="Enter salon location"
//               placeholderTextColor={Colors.light.primary}
//             />
//           </View>

//           <View style={styles.formGroup}>
//             <Text style={styles.label}>Image</Text>
//             <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
//               {image ? (
//                 <Image source={{ uri: image }} style={styles.uploadedImage} />
//               ) : (
//                 <View style={styles.uploadPlaceholder}>
//                   <MaterialIcons
//                     name="add-a-photo"
//                     size={24}
//                     color={Colors.light.rearText}
//                   />
//                   <Text style={styles.uploadText}>Upload Image</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//             <Text style={styles.submitButtonText}>Add Salon</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: Colors.light.primary,
//     marginBottom: 20,
//   },
//   formGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: Colors.light.rearText,
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     borderWidth: 1,
//     borderColor: Colors.light.primary,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 16,
//     color: Colors.light.primary,
//   },
//   textArea: {
//     height: 100,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: Colors.light.primary,
//     borderRadius: 8,
//   },
//   picker: {
//     height: 50,
//     width: "100%",
//   },
//   imageUpload: {
//     borderWidth: 1,
//     borderColor: Colors.light.primary,
//     borderRadius: 8,
//     height: 150,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//   },
//   uploadedImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 8,
//   },
//   uploadPlaceholder: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   uploadText: {
//     marginTop: 10,
//     color: Colors.light.primary,
//   },
//   submitButton: {
//     backgroundColor: Colors.light.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: Colors.light.background,
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });

// export default AddSalonScreen;
