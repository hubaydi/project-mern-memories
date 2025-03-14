import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ProfileEditForm = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const validateForm = () => {
    let newErrors = {};

    // Validate website URL
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Invalid URL';
    }

    // Validate Twitter handle (alphanumeric and underscore only)
    if (formData.twitter && !/^[a-zA-Z0-9_]+$/.test(formData.twitter)) {
      newErrors.twitter = 'Invalid Twitter handle';
    }

    // Validate Instagram handle (alphanumeric, underscore, period only)
    if (formData.instagram && !/^[a-zA-Z0-9_.]+$/.test(formData.instagram)) {
      newErrors.instagram = 'Invalid Instagram handle';
    }

    // Validate Facebook handle (alphanumeric and period only)
    if (formData.facebook && !/^[a-zA-Z0-9.]+$/.test(formData.facebook)) {
      newErrors.facebook = 'Invalid Facebook handle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Bio"
        name="bio"
        value={formData?.bio || ''}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Website"
        name="website"
        value={formData?.website || ''}
        onChange={handleChange}
        margin="normal"
        error={!!errors.website}
        helperText={errors.website}
      />
      <TextField
        fullWidth
        label="Twitter"
        name="twitter"
        value={formData?.twitter || ''}
        onChange={handleChange}
        margin="normal"
        error={!!errors.twitter}
        helperText={errors.twitter}
      />
      <TextField
        fullWidth
        label="Instagram"
        name="instagram"
        value={formData?.instagram || ''}
        onChange={handleChange}
        margin="normal"
        error={!!errors.instagram}
        helperText={errors.instagram}
      />
      <TextField
        fullWidth
        label="Facebook"
        name="facebook"
        value={formData?.facebook || ''}
        onChange={handleChange}
        margin="normal"
        error={!!errors.facebook}
        helperText={errors.facebook}
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEditForm;
