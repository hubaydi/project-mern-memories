import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileEditForm from './ProfileEditForm';
import ProfilePictureUpload from './ProfilePictureUpload';

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  selectProfile,
  resetProfile
} from './profileSlice';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { id } = useParams();

  const profile = useSelector(state => state.profile.profile);
  const loading = useSelector((state) => state.profile.loading);
  const error = useSelector((state) => state.profile.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile(id));
    return () => {
      dispatch(resetProfile());
    };
  }, [dispatch, id]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async (profileData) => {
    try {
      await dispatch(updateProfile({ id, profileData }));
      setIsEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSnackbarMessage(err.error || 'Failed to update profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handlePictureUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      await dispatch(uploadProfilePicture({ id, formData }));
      setSnackbarMessage('Profile picture updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setSnackbarMessage(err.error || 'Failed to upload profile picture.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const profileImg = profile?.profilePic
    ? profile?.profilePic.startsWith('http')
      ? profile?.profilePic
      : 'http://localhost:5000' + profile?.profilePic
    : 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded-lg">
      <div className="flex items-center mb-8">
        <img
          src={profileImg}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mr-8 border-4 border-blue-200"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile?.name}</h1>
          <p className="text-gray-600">{profile?.email}</p>
          <ProfilePictureUpload onUpload={handlePictureUpload} />
        </div>
      </div>
      {isEditing ? (
        <ProfileEditForm profile={profile} onSave={handleSave} />
      ) : (
        <div>
          <p className="text-gray-800 mb-4 whitespace-pre-line">{profile?.bio}</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {profile?.website && (
              <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
                Website
              </a>
            )}
            {profile?.twitter && (
              <a href={`https://twitter.com/${profile?.twitter}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
                Twitter
              </a>
            )}
            {profile?.instagram && (
              <a href={`https://instagram.com/${profile?.instagram}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
                Instagram
              </a>
            )}
            {profile?.facebook && (
              <a href={`https://facebook.com/${profile?.facebook}`} target="_blank" rel="noopener noreferrer" className="border border-blue-400 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition">
                Facebook
              </a>
            )}
          </div>
          <button
            onClick={handleEditToggle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-3 font-semibold transition"
          >
            Edit Profile
          </button>
        </div>
      )}
      {/* Snackbar replacement */}
      {snackbarOpen && (
        <div className={`fixed bottom-6 right-6 z-50 min-w-[240px] flex items-center px-4 py-3 rounded shadow-lg transition-all ${snackbarSeverity === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          <span className="flex-1">{snackbarMessage}</span>
          <button onClick={handleSnackbarClose} className="ml-4 text-white font-bold">&times;</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
