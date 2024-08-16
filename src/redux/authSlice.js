import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios_instance } from "../Axios/axiosInstance";

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post("/api/login/", credentials);
      localStorage.setItem("accessToken", response?.data?.access);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logging out (if needed)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Remove user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      // const response = await axios_instance.post("/api/logout");
      // return response.data;

      return {};
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for signing up
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post("/api/register/", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting user details
export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios_instance.get("/api/profile/");
      console.log("currentUSer", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating user details
export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async (updatedDetails, { rejectWithValue }) => {
    try {
      const response = await axios_instance.put(
        "/api/profile/",
        updatedDetails
      );
      localStorage.setItem("user", JSON.stringify(response.data)); // Update user in localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const confirmEmailWithToken = createAsyncThunk(
  "auth/confirmEmailWithToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post("/api/confirm-email/", {
        token,
      });

      // Log the full response to inspect its structure
      console.log("Confirm Email Response:", response.data);

      // Assuming the access token is stored under response.data.tokens.access_token
      const accessToken = response?.data?.tokens?.access_token;

      if (accessToken) {
        // Save the token to localStorage
        localStorage.setItem("accessToken", accessToken);
      } else {
        // Handle the case where accessToken is undefined
        throw new Error("Access token is missing from the response.");
      }

      // Fetch user details after confirming the token
      const userDetailsResponse = await axios_instance.get("/api/profile/");
      localStorage.setItem("user", JSON.stringify(userDetailsResponse.data));

      return userDetailsResponse.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  user: null, // this will be the user object
  token: null, // access token
  isAuthenticated: false, // authenticated or not
  status: "idle",
  error: null,
  signupMessage: null,
  time: 600, // default time to enable the email after signup
  timeRemaining: null, // to show timer even after page changes
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth(state) {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.status = "succeeded";
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateCountdown(state, action) {
      state.timeRemaining = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.status = "idle";
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.signupMessage = null;
        state.signupTime = 600;
        state.timeRemaining = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.signupMessage = action.payload.message;
        state.time = action.payload.time ? action.payload.time * 60 : 600;
        state.timeRemaining = action.payload.time
          ? action.payload.time * 60
          : 600;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.timeRemaining = null;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, updateCountdown, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
