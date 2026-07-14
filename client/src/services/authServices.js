import API from "../api/axios";
import { getDeviceSecret } from "../utils/device";

// Register
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", {
    ...userData,
    deviceSecret: getDeviceSecret(),
  });

  return response.data;
};

// Check Auth
export const checkAuth = async () => {
  const response = await API.get("/auth/check-auth", {
    headers: {
      "x-device-secret": getDeviceSecret(),
    },
  });

  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await API.post(
    "/auth/logout",
    {},
    {
      headers: {
        "x-device-secret": getDeviceSecret(),
      },
    }
  );

  return response.data;
};

// Logout All Devices
export const logoutAllDevices = async () => {
  const response = await API.post(
    "/auth/logout-all",
    {},
    {
      headers: {
        "x-device-secret": getDeviceSecret(),
      },
    }
  );

  return response.data;
};

// Refresh Token
export const refreshToken = async () => {
  const response = await API.post(
    "/auth/refresh-token",
    {},
    {
      headers: {
        "x-device-secret": getDeviceSecret(),
      },
    }
  );

  return response.data;
};