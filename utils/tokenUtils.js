export const extractUserIdFromToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.user_id || payload.sub; // Assuming the user ID is stored in 'user_id' or 'sub' field
  } catch (error) {
    console.error("Failed to extract user ID from token:", error);
    return null;
  }
};

//   import { getAccessToken, refreshAccessToken, getUserId } from "@/utils/authHelpers";
//   import axios from "axios";
//   import { API_URL } from "@/constants/Colors";
//   import { showToast } from "@/utils/toastConfig";

// ... (other imports and component code)
