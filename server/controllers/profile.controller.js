import mongoose from 'mongoose';
import User from '../models/user.model.js';

import { SUCCESS, FAIL } from '../utils/constants.js';
import appError from '../utils/appError.js';

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('Invalid user ID format.', 400, FAIL);
      return next(error);
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      const error = appError.create('User not found. The user may have been deleted.', 404, FAIL);
      return next(error);
    }

    res.status(200).json({ status: SUCCESS, data: { profile: user } });
  } catch (error) {
    res.status(500).json({ status: FAIL, message: 'Failed to fetch profile. Please try again later.' });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { bio, website, twitter, instagram, facebook } = req.body;
  // const profilePic = req.file ? req.file.path : null;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('User not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { bio, website, twitter, instagram, facebook },
      { new: true }
    ).select('-password');

    res.status(200).json({ status: SUCCESS, data: { profile: updatedProfile } });
  } catch (error) {
    res.status(500).json({ status: FAIL, message: 'Failed to update profile. Please try again later.' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;
  const { file } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = appError.create('User not found. Invalid ID format.', 400, FAIL);
      return next(error);
    }

    if (!file) {
      const error = appError.create('No file uploaded. Please upload a valid image.', 400, FAIL);
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: file.path },
      { new: true }
    ).select('-password');

    res.status(200).json({ status: SUCCESS, data: { profile: updatedUser } });
  } catch (error) {
    res.status(500).json({ status: FAIL, message: 'Failed to upload profile picture. Please try again later.' });
  }
};
