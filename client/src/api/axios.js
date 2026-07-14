// import axios from "axios";
// import { getDeviceSecret } from "../utils/device";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ================= Request Interceptor =================

// API.interceptors.request.use(
//   (config) => {
//     config.headers["x-device-secret"] = getDeviceSecret();
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ================= Response Interceptor =================

// API.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       originalRequest.url !== "/auth/refresh-token"
//     ) {
//       originalRequest._retry = true;

//       try {
//         // Access Token refresh karo
//         await API.post("/auth/refresh-token");

//         // Original request dobara bhejo
//         return API(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh Token Expired");

//         //  yahan automatic logout add karenge

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;




import axios from "axios";
import { getDeviceSecret } from "../utils/device";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= Request Interceptor =================

API.interceptors.request.use(
  (config) => {
    config.headers["x-device-secret"] = getDeviceSecret();
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= Response Interceptor =================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        // Access Token refresh karo
        await API.post("/auth/refresh-token");

        // Original request dobara bhejo
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Expired");

        //  yahan automatic logout add karenge

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;