import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import * as api from "../../api";

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (id, { rejectWithValue }) => {
    try {
      const { data: { data } } = await api.fetchProfile(id);
      return data.profile;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const { data: { data } } = await api.updateProfile(id, profileData);
      return data.profile;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data: { data: { profile } } } = await api.uploadProfilePicture(id, formData);
      return profile;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetProfile } = profileSlice.actions;
export const selectProfileState = (state) => state.profile;
export const selectProfile = (state, id) => state.profile.profile?.find((profile) => profile._id === id);

export default profileSlice.reducer;

