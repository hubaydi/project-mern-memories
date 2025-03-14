import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography, Box, Avatar, Button, TextField, Grid, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/system';
import ProfileEditForm from './ProfileEditForm';
import ProfilePictureUpload from './ProfilePictureUpload';
import { getProfile, updateProfile, uploadProfilePicture } from '../actions/profile';

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
  const { id } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    dispatch(getProfile(id));
  }, [dispatch, id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (profileData) => {
    try {
      await dispatch(updateProfile(id, profileData));
      setIsEditing(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage(error.message || 'Failed to update profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handlePictureUpload = async (file) => {
    try {
      await dispatch(uploadProfilePicture(id, file));
      setSnackbarMessage('Profile picture updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setSnackbarMessage(error.message || 'Failed to upload profile picture.');
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

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar
          src={profile?.profilePicture}
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
