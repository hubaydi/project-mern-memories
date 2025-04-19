import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography, Box, Avatar, Button, Grid, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/system';
import ProfileEditForm from './ProfileEditForm';
import ProfilePictureUpload from './ProfilePictureUpload';

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  selectProfile,
  resetProfile
} from './profileSlice';

const ProfileContainer = styled(Box)({
  maxWidth: 800,
  margin: '0 auto',
  padding: '2rem',
});

const ProfileHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
});

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
    <ProfileContainer>
      <ProfileHeader>
        <Avatar
          src={profileImg}
          sx={{ width: 120, height: 120, marginRight: '2rem' }}
        />
        <Box>
          <Typography variant="h4">{profile?.name}</Typography>
          <Typography variant="subtitle1">{profile?.email}</Typography>
          <ProfilePictureUpload onUpload={handlePictureUpload} />
        </Box>
      </ProfileHeader>

      {isEditing ? (
        <ProfileEditForm profile={profile} onSave={handleSave} />
      ) : (
        <Box>
          <Typography variant="body1" paragraph>
            {profile?.bio}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {profile?.website && (
              <Button variant="outlined" href={profile?.website} target="_blank">
                Website
              </Button>
            )}
            {profile?.twitter && (
              <Button variant="outlined" href={`https://twitter.com/${profile?.twitter}`} target="_blank">
                Twitter
              </Button>
            )}
            {profile?.instagram && (
              <Button variant="outlined" href={`https://instagram.com/${profile?.instagram}`} target="_blank">
                Instagram
              </Button>
            )}
            {profile?.facebook && (
              <Button variant="outlined" href={`https://facebook.com/${profile?.facebook}`} target="_blank">
                Facebook
              </Button>
            )}
          </Box>
          <Button variant="contained" onClick={handleEditToggle} sx={{ mt: 3 }}>
            Edit Profile
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  );
};

export default ProfilePage;
