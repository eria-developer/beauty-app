import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";
import { API_URL } from "@/constants/Colors";
import jwtDecode from "jwt-decode";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_DATA_KEY = "user_data";

export const saveUserData = async (userData) => {
  try {
    if (userData.access_token) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, userData.access_token);
    }
    if (userData.refresh_token) {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, userData.refresh_token);
    }
    // Only save non-null and non-undefined values
    const cleanedUserData = Object.fromEntries(
      Object.entries(userData).filter(([_, v]) => v != null)
    );
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(cleanedUserData));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getUserId = async () => {
  try {
    const userData = await getUserData();
    return userData ? userData.id.toString() : null;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Function to get the refresh token
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

// Function to check if the user is logged in
export const isLoggedIn = async () => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

// Function to log out the user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
    router.replace("/(auth)");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
      refresh: refreshToken,
    });

    if (response.data && response.data.access) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      return response.data.access;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    await logoutUser();
    return null;
  }
};

// Function to get an axios instance with authentication headers
export const getAuthenticatedAxiosInstance = async () => {
  const accessToken = await getAccessToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const updateUserData = async (updatedData) => {
  try {
    const token = await getAccessToken();

    // Create a FormData object
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      if (key === "profile_picture" && updatedData[key]) {
        // Check if the profile_picture is a string (URI) or an object
        if (typeof updatedData[key] === "string") {
          // If it's a string (URI), create a file object
          const uriParts = updatedData[key].split(".");
          const fileType = uriParts[uriParts.length - 1];

          formData.append("profile_picture", {
            uri: updatedData[key],
            name: `profile_picture.${fileType}`,
            type: `image/${fileType}`,
          });
        } else {
          // If it's already an object, use it as is
          formData.append("profile_picture", updatedData[key]);
        }
      } else {
        formData.append(key, updatedData[key]);
      }
    });

    const response = await axios.patch(
      `${API_URL}/accounts/profile/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data) {
      await saveUserData(response.data);
      return response.data;
    }
    throw new Error("Failed to update user data");
  } catch (error) {
    console.error("Error updating user data:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
    }
    throw error;
  }
};
