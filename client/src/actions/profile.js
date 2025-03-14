import * as api from '../api/index.js';

export const getProfile = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchProfile(id);
    dispatch({ type: 'FETCH_PROFILE', payload: data });
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = (id, profileData) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(id, profileData);
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const uploadProfilePicture = (id, file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.uploadProfilePicture(id, formData);
    dispatch({ type: 'UPDATE_PROFILE_PICTURE', payload: data });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};
