import axios from "axios";

export const axios_instance = axios.create({
  baseURL: "https://9acb-125-63-73-50.ngrok-free.app", // replace with your API's base URL
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
