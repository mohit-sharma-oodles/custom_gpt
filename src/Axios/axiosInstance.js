import axios from "axios";
import updateToken from "./utils";

// const domain = "https://chattodata.com";
const domain = "https://customgpt-b.chattodata.com";
// const domain = "https://customgpt-b.oodleslab.com";
export const baseURL = `${domain}`;

export const axios_instance = axios.create({
  baseURL: baseURL,
});

axios_instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log(token, "++++++from headers axiosInstance+++++");
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

      await updateToken();

      return axios_instance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// axios_instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if error status is 401
//     if (error.response && error.response.status === 401) {
//       // Prevent infinite loop by checking if request is already retried

//       // Increment retry count
//       let refreshTokenRetryCount = parseInt(
//         sessionStorage.getItem("refreshTokenRetryCount") || "0"
//       );
//       if (originalRequest.url.includes("refresh/token"))
//         refreshTokenRetryCount += 1;
//       sessionStorage.setItem(
//         "refreshTokenRetryCount",
//         refreshTokenRetryCount.toString()
//       );
//       // console.log(
//       //   "outside try",
//       //   refreshTokenRetryCount > 7,
//       //   refreshTokenRetryCount
//       // );
//       // if (refreshTokenRetryCount > 7) {
//       //   localStorage.removeItem("accessToken");
//       //   localStorage.removeItem("refreshToken");
//       //   localStorage.removeItem("user");
//       //   sessionStorage.removeItem("refreshTokenRetryCount");
//       //   window.location.href = "/";
//       // }
//       try {
//         if (retries > 10) {
//           console.log("greater than 10");
//           return Promise.reject(error);
//         }
//         console.log("try for", refreshTokenRetryCount);

//         const refreshToken = localStorage.getItem("refreshToken");

//         // Check if refreshToken is present
//         if (!refreshToken) {
//           // If no refresh token, just reject the error without redirecting
//           return Promise.reject(error);
//         }

//         // Attempt to refresh the token
//         // const response = await axios.post(`${baseURL}/token/refresh/`, {
//         const response = await axios.get(`${baseURL}/temp/refresh/token/`, {
//           refresh: refreshToken,
//         });

//         // Store the new tokens in localStorage
//         localStorage.setItem("accessToken", response.data.access);
//         localStorage.setItem("refreshToken", response.data.refresh);

//         // Reset the retry count after successful refresh
//         sessionStorage.setItem("refreshTokenRetryCount", "0");

//         // Update the Authorization header and retry the original request
//         originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

//         return axios_instance(originalRequest);
//       } catch (err) {
//         console.log("inside catch", refreshTokenRetryCount);
//         // Handle token refresh errors
//         if (refreshTokenRetryCount > 5) {
//           // Logout the user after exceeding retry limit
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           localStorage.removeItem("user");
//           sessionStorage.removeItem("refreshTokenRetryCount");
//           window.location.href = "/";

//           return Promise.reject(err);
//         }
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// async function getRefreshToken() {
//   const refreshToken = localStorage.getItem("refreshToken");

//   // return await axios_instance.get("/temp/refresh/token/", {
//   return await axios_instance.post("/token/refresh/", {
//     refresh: refreshToken,
//   });
// }
