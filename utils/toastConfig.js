import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Colors } from "@/constants/Colors";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.light.primary }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "500",
      }}
      text2Style={{
        fontSize: 13,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.light.error || "#FF0000" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "500",
      }}
      text2Style={{
        fontSize: 13,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.light.info || "#007AFF" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "500",
      }}
      text2Style={{
        fontSize: 13,
      }}
    />
  ),
};

export const showToast = (type, title, message) => {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 2500,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 0,
  });
};
