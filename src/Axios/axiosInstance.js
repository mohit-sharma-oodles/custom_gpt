import axios from "axios";

export const axios_instance = axios.create({
  baseURL:
    "https://5cb3-2402-8100-2243-8a7c-e4db-454e-bcb5-561e.ngrok-free.app/", // replace with your API's base URL
});

axios_instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // const token =
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIzNjE4NDQ0LCJpYXQiOjE3MjM2MTc1NDQsImp0aSI6IjY2MzZlNmQ3NGVkZTQyMDE5NWUxNmIwOGQxNjRiNTdhIiwidXNlcl9pZCI6Mzh9.So0f7coRluO5q4XbBp59WE49zDGklyBrkudBFyxlKfo";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
