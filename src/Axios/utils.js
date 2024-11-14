import axios from "axios";
// import { toast } from "sonner";
import { baseURL } from "./axiosInstance";
import { toast } from "react-toastify";

async function updateToken(retries = 3) {
  try {
    // const response = await axios.get(`${baseURL}/temp/refresh/token/`, {
    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: localStorage.getItem("refreshToken"),
    });
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return updateToken(retries - 1);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // localStorage.removeItem("expires_in");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/";
        localStorage.setItem(
          "toastMessage",
          "Session timed out. Please log in again."
        );
      }, 4000);
      throw error;
    }
  }
}

export default updateToken;
