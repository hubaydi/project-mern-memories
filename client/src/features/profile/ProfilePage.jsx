import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileEditForm from './ProfileEditForm';
import ProfilePictureUpload from './ProfilePictureUpload';
import { FaTwitter, FaInstagram, FaFacebook, FaGlobe } from 'react-icons/fa';

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  selectProfile,
  resetProfile
} from './profileSlice';

const COVER_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

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

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const profileImg = profile?.profilePic
    ? profile?.profilePic.startsWith('http')
      ? profile?.profilePic
      : 'http://localhost:5000' + profile?.profilePic
    : 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">No profile found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-12 flex flex-col items-center">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
        {/* Cover Image */}
        <div className="h-40 md:h-56 w-full bg-gray-200 relative">
          <img src={COVER_IMAGE} alt="cover" className="object-cover w-full h-full" />
        </div>
        {/* Profile Picture - Overlapping */}
        <div className="absolute left-1/2 top-32 md:top-44 transform -translate-x-1/2">
          <div className="relative">
            <img
              src={profileImg}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
            />
            {/* Floating upload button */}
            <div className="absolute bottom-2 right-2">
              <ProfilePictureUpload onUpload={handlePictureUpload} />
            </div>
          </div>
        </div>
        {/* Profile Details Card */}
        <div className="pt-24 md:pt-32 pb-10 px-6 md:px-12 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            {profile?.name}
            {profile?.verified && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-600 font-semibold">Verified</span>}
          </h1>
          <p className="text-gray-500 mb-2">{profile?.email}</p>
          <div className="flex gap-3 mb-4">
            {profile?.website && (
              <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition" title="Website">
                <FaGlobe size={22} />
              </a>
            )}
            {profile?.twitter && (
              <a href={`https://twitter.com/${profile?.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 transition" title="Twitter">
                <FaTwitter size={22} />
              </a>
            )}
            {profile?.instagram && (
              <a href={`https://instagram.com/${profile?.instagram}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 transition" title="Instagram">
                <FaInstagram size={22} />
              </a>
            )}
            {profile?.facebook && (
              <a href={`https://facebook.com/${profile?.facebook}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition" title="Facebook">
                <FaFacebook size={22} />
              </a>
            )}
          </div>
          <p className="text-gray-700 mb-6 whitespace-pre-line max-w-xl">{profile?.bio}</p>
          {isEditing ? (
            <ProfileEditForm profile={profile} onSave={handleSave} />
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-semibold shadow transition mb-2"
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Snackbar replacement */}
        {snackbarOpen && (
          <div className={`fixed bottom-6 right-6 z-50 min-w-[240px] flex items-center px-4 py-3 rounded shadow-lg transition-all ${snackbarSeverity === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <span className="flex-1">{snackbarMessage}</span>
            <button onClick={handleSnackbarClose} className="ml-4 text-white font-bold">&times;</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
