import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import * as api from "../../api";

const profileAdapter = createEntityAdapter({
  selectId: (profile) => profile._id,
});

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.fetchProfile(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const { data } = await api.updateProfile(id, profileData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "profile/uploadProfilePicture",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.uploadProfilePicture(id, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = profileAdapter.getInitialState({
  loading: false,
  error: null,
});
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      profileAdapter.removeAll(state);
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        profileAdapter.setOne(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        profileAdapter.updateOne(state, {
          id: action.payload._id,
          changes: action.payload,
        });
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
        profileAdapter.updateOne(state, {
          id: action.payload._id,
          changes: action.payload,
        });
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
export const selectProfile = (state, id) => profileAdapter.getSelectors(selectProfileState).selectById(state.profile, id);

export default profileSlice.reducer;

