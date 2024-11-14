import axios from "axios";
import updateToken from "./utils";

// const domain = "https://749d-125-63-73-50.ngrok-free.app";
const domain = "https://customgpt-b.chattodata.com";
// const domain = "https://chattodata.com";
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
