import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/Colors';

// Keys for storing tokens in AsyncStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// Function to save user data and tokens
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, userData.access_token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, userData.refresh_token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Function to get the access token
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Function to get the refresh token
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Function to get user data
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
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
    router.replace('/(auth)');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
      refresh: refreshToken,
    });

    if (response.data && response.data.access) {
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
      return response.data.access;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
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