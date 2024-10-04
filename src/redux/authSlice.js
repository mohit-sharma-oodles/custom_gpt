import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axios_instance } from "../Axios/axiosInstance";

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post("/api/login/", credentials);
      localStorage.setItem("accessToken", response?.data?.access);
      localStorage.setItem("refreshToken", response?.data?.refresh);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // const response = await axios_instance.post("logout");
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
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for confirming email with a token
export const confirmEmailWithToken = createAsyncThunk(
  "auth/confirmEmailWithToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post("/api/confirm-email/", {
        token,
      });
      const accessToken = response?.data?.tokens?.access_token;
      const refreshToken = response?.data?.tokens?.refresh_token;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        throw new Error("Access token is missing from the response.");
      }

      const userDetailsResponse = await axios_instance.get("/api/profile/");
      localStorage.setItem("user", JSON.stringify(userDetailsResponse.data));

      return userDetailsResponse.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for resending the confirmation email
export const resendConfirmationEmail = createAsyncThunk(
  "auth/resendConfirmationEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios_instance.post(
        "/api/resend-verification-link/",
        { email }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  rtoken: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
  signupMessage: null,
  time: 600, // default time to enable the email after signup
  timeRemaining: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth(state) {
      const token = localStorage.getItem("accessToken");
      const rtoken = localStorage.getItem("refreshToken");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.rtoken = rtoken;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
        state.status = "succeeded";
      } else {
        state.token = null;
        state.rtoken = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.rtoken = null;
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
        state.rtoken = action.payload.refresh;
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
        state.rtoken = null;
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
      })
      .addCase(confirmEmailWithToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(confirmEmailWithToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem("accessToken");
        state.rtoken = localStorage.getItem("refreshToken");
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(confirmEmailWithToken.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(resendConfirmationEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resendConfirmationEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resendConfirmationEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { logout, updateCountdown, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
