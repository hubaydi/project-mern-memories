import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

// Async thunks for sign-in and sign-up
export const signIn = createAsyncThunk(
  "users/signIn",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.signIn(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signUp = createAsyncThunk(
  "users/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.signUp(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("profile")) || null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("profile");
      state.user = null;
    },
    setUser: (state, action) => {
      localStorage.setItem("profile", JSON.stringify(action.payload.data));
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify(action.payload.data));
        state.status = "succeeded";
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Sign-in failed";
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify(action.payload.data));
        state.status = "succeeded";
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Sign-up failed";
      });
  },
});

export const { logout, setUser } = usersSlice.actions;

export const selectUser = (state) => state.users.user;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;

export default usersSlice.reducer;
