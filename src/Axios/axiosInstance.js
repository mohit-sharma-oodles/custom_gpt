import axios from "axios";
// import { jwtDecode } from "jwt-decode";

export const axios_instance = axios.create({
  baseURL: "https://customgpt-b.oodleslab.com",
  // baseURL: "https://a5fc-14-102-190-50.ngrok-free.app",
  // headers: {
  //    "ngrok-skip-browser-warning": "true",
  // },
});

// let retries = 0;

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
    console.log(originalRequest);

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

        // originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return axios_instance(originalRequest);
      } catch (err) {
        // Handle token refresh errors (e.g., refresh token is invalid/expired)
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
