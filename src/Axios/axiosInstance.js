import axios from "axios";
// import { jwtDecode } from "jwt-decode";

export const axios_instance = axios.create({
  // baseURL: "http://103.206.101.254:8000", // replace with your API's base URL
  baseURL: "https://8d46-14-102-190-50.ngrok-free.app",
  // headers: {
  //   "ngrok-skip-browser-warning": "true",
  // },
});

// Request interceptor to add the access token to headers
axios_instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log(
      token,
      "++++++++++++++++from headers axiosInstance++++++++++++++++"
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios_instance.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        // Store the new tokens in localStorage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return axios_instance(originalRequest);
      } catch (err) {
        // Handle token refresh errors (e.g., refresh token is invalid/expired)
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
// axios_instance.interceptors.request.use(
//   async (config) => {
//     const accessToken = localStorage.getItem("accessToken");

//     if (accessToken) {
//       const decodedToken = jwtDecode(accessToken);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         // Token is expired, try to refresh it
//         try {
//           const refreshToken = localStorage.getItem("refreshToken");
//           const response = await axios_instance.post("/api/token/refresh/", {
//             refresh: refreshToken,
//           });

//           // Store the new tokens in localStorage
//           localStorage.setItem("accessToken", response.data.access);
//           localStorage.setItem("refreshToken", response.data.refresh);

//           // Update the Authorization header in the config with the new token
//           config.headers.Authorization = `Bearer ${response.data.access}`;
//         } catch (err) {
//           // Handle token refresh errors (e.g., refresh token is invalid/expired)
//           return Promise.reject(err);
//         }
//       } else {
//         // Token is still valid, continue with the original request
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
