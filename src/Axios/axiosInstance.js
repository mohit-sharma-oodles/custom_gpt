import axios from "axios";

// const domain = "https://191b-103-95-83-174.ngrok-free.app";
const domain = "https://customgpt-b.oodleslab.com";
const baseURL = `${domain}/custom/api`;

// Initialize retry count in sessionStorage
if (!sessionStorage.getItem("refreshTokenRetryCount")) {
  sessionStorage.setItem("refreshTokenRetryCount", "0");
}

export const axios_instance = axios.create({
  baseURL: baseURL,
});

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

    // Check if error status is 401
    if (error.response && error.response.status === 401) {
      // Prevent infinite loop by checking if request is already retried
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Increment retry count
        let refreshTokenRetryCount = parseInt(
          sessionStorage.getItem("refreshTokenRetryCount") || "0",
          10
        );
        refreshTokenRetryCount += 1;
        sessionStorage.setItem(
          "refreshTokenRetryCount",
          refreshTokenRetryCount.toString()
        );
        // console.log(
        //   "outside try",
        //   refreshTokenRetryCount > 7,
        //   refreshTokenRetryCount
        // );
        // if (refreshTokenRetryCount > 7) {
        //   localStorage.removeItem("accessToken");
        //   localStorage.removeItem("refreshToken");
        //   localStorage.removeItem("user");
        //   sessionStorage.removeItem("refreshTokenRetryCount");
        //   window.location.href = "/";
        // }
        try {
          const refreshToken = localStorage.getItem("refreshToken");

          // Check if refreshToken is present
          if (!refreshToken) {
            // If no refresh token, just reject the error without redirecting
            return Promise.reject(error);
          }

          // Attempt to refresh the token
          const response = await axios.post(`${baseURL}/token/refresh/`, {
            // const response = await axios.get(`${baseURL}/temp/refresh/token/`, {
            refresh: refreshToken,
          });

          // Store the new tokens in localStorage
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);

          // Reset the retry count after successful refresh
          sessionStorage.setItem("refreshTokenRetryCount", "0");

          // Update the Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          return axios_instance(originalRequest);
        } catch (err) {
          console.log("inside catch", refreshTokenRetryCount);
          // Handle token refresh errors
          if (refreshTokenRetryCount > 5) {
            // Logout the user after exceeding retry limit
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            sessionStorage.removeItem("refreshTokenRetryCount");
            window.location.href = "/";

            return Promise.reject(err);
          }
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);
