import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';

const ProfileView = ({ profile, onEditClick }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={profile.profilePicture}
          sx={{ width: 120, height: 120, mr: 3 }}
        />
        <Box>
          <Typography variant="h4">{profile.name}</Typography>
          <Typography variant="subtitle1">{profile.email}</Typography>
        </Box>
      </Box>
      {profile.bio && (
        <Typography variant="body1" paragraph>
          {profile.bio}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {profile.website && (
          <Button variant="outlined" href={profile.website} target="_blank">
            Website
          </Button>
        )}
        {profile.twitter && (
          <Button variant="outlined" href={`https://twitter.com/${profile.twitter}`} target="_blank">
            Twitter
          </Button>
        )}
        {profile.instagram && (
          <Button variant="outlined" href={`https://instagram.com/${profile.instagram}`} target="_blank">
            Instagram
          </Button>
        )}
        {profile.facebook && (
          <Button variant="outlined" href={`https://facebook.com/${profile.facebook}`} target="_blank">
            Facebook
          </Button>
        )}
      </Box>
      <Button
        variant="contained"
        onClick={onEditClick}
        sx={{ mt: 3 }}
      >
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfileView;
