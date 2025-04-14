import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'User not found. Invalid ID format.' });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile. Please try again later.' });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { bio, website, twitter, instagram, facebook } = req.body;
  const profilePic = req.file ? req.file.path : null;
  console.log(profilePic);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'User not found. Invalid ID format.' });
    }

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { profilePic, bio, website, twitter, instagram, facebook },
      { new: true }
    ).select('-password');

    res.status(200).json({ data: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile. Please try again later.' });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { id } = req.params;
  const { file } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'User not found. Invalid ID format.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: file.path },
      { new: true }
    ).select('-password');

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile picture. Please try again later.' });
  }
};
